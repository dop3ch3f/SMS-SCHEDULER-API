const userModel = require("../Models/Users");
const subscriptionModel = require("../Models/Subscription");
const courseModel = require("../Models/Courses");
const Response = require("../../Utilities/response_generator");
const { Application_Responses } = require('../../Utilities/enums');
const Validations = require("../Validations/User");
const Agenda = require('agenda');
const { mongoDBUrl } = require("../../Utilities/constants");
const agenda = new Agenda({ db: { address: mongoDBUrl } });

const UtilitiesRepository = require("../../Repositories/utilities_repository");
const TwilioRepository = require("../../Repositories/twilio_repository");

const util = new UtilitiesRepository();

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userModel.find().populate(['subscriptions']);
    return new Response(Application_Responses.SUCCESS, null, null, users, res).getResponse();
  } catch (error) {
    next(error);
  }

};

const createUser = async (req, res, next) => {
  try {
    const request_data = req.body;
    // check for multiple or single creation
    const single = !(Array.isArray(request_data));

    if (single) {
      const validation = await Validations.createUser.validateAsync(request_data);
      if (validation.error != null) {
        return new Response(Application_Responses["BAD-REQUEST"], null, validation.error, null, res).getResponse();
      }
    } else {
      console.log('called');
      const validation = await Validations.createMultipleUsers.validateAsync(request_data);
      if (validation.error != null) {
        return new Response(Application_Responses["BAD-REQUEST"], null, validation.error, null, res).getResponse();
      }
    }

    const newUser = await userModel.create(request_data);
    return new Response(Application_Responses.SUCCESS, "User(s) created successfully", null, newUser, res).getResponse();

  } catch (error) {
    next(error);
  }
}

const getSingleUser = async (req, res, next) => {
  try {
    const user_id = req.params.id;
    const single_user = await userModel.findOne({ _id: user_id }).populate('subscriptions');
    return new Response(Application_Responses.SUCCESS, "Single user", null, single_user, res).getResponse();
  } catch (error) {
    next(error);
  }
}

const deleteUser = async (req, res, next) => {
  try {
    const user_id = req.params.id;
    await userModel.deleteOne({ _id: user_id });
    return new Response(Application_Responses.SUCCESS, "Deleted successfully", null, null, res).getResponse();
  } catch (error) {
    next(error);
  }
}

const createSubscriptionForUser = async (req, res, next) => {
  try {
    const user_id = req.params.id;
    const data = req.body;

    const validation = await Validations.createSubscriptionForUser.validateAsync(data);
    if (validation.error != null) {
      return new Response(Application_Responses["BAD-REQUEST"], null, validation.error, null, res).getResponse();
    }
    // Find or create if not exists
    const queries = await Promise.all([subscriptionModel.findOne({ courseID: data.courseID, userID: user_id }), userModel.findById(user_id)]);
    let subscriptiondoc = queries[0];
    const userdoc = queries[1];
    if (subscriptiondoc == null) {
      const response = await setupSubscriptionJob(userdoc, req);
      if (response != false) {
        subscriptiondoc = await subscriptionModel.create({ ...data, jobID: response });
        userdoc.subscriptions.push(subscriptiondoc._id);
      } else {
        throw "unable to set subscription";
      }
    }
    await userdoc.save();
    return new Response(Application_Responses.SUCCESS, "Subscription registered", null, userdoc, res).getResponse();
  } catch (error) {
    next(error);
  }
}

agenda.define('send courses', async (job) => {
  const { user, course, time } = job.attrs.data;

  console.log(course);
  // send the first course out to the user phone number here
  await new TwilioRepository(user.phone, `${course.modules[0].title}\n\n ${course.modules[0].body}`).sendMessage();
  // edit the course to loose the sent out module
  course.modules = course.modules.filter((_, index) => index !== 0);
  // delete the current job
  await agenda.cancel({ _id: job.attrs._id })
  if (course.modules.length >= 1) {
    // create another job to send only the left over courses and repeat
    const newjob = await agenda.create('send courses', { user, course, time });
    newjob.repeatEvery(time);
    await newjob.save();
  }
  await agenda.start()
})

const setupSubscriptionJob = async (user, req) => {
  try {
    const jobId = util.generateUniqueID().data;
    let timezone = null, ip_response = null, timezone_response = null, hrs_response = null;
    const courseDoc = await courseModel.findOne({ _id: req.body.courseID }).populate('modules');
    console.log("course is" + JSON.stringify(courseDoc.toObject()));
    if (req.body.timezone != null) {
      timezone = req.body.timezone;
    } else {
      ip_response = util.getTimezoneFromReqIP(req);
      if (ip_response.status === true) {
        timezone = ip_response.data;
      } else {
        timezone = "Africa/Lagos";
      }
    }
    timezone_response = util.convertTimeZoneToDefaultTimeZone(req.body.time, timezone);
    if (timezone_response.status === true) {
      hrs_response = util.getTimein24Hours(timezone_response.data);
      const job = await agenda.create('send courses', { user, course: courseDoc.toObject(), time: util.convert24HrsToCronExpression(hrs_response.data).data });
      job.repeatEvery(util.convert24HrsToCronExpression(hrs_response.data).data);
      await job.save();
      await agenda.start();
      return jobId;
    } else {
      return false;
    }

  } catch (error) {
    console.log(error);
    return false;
  }

}

module.exports = {
  getAllUsers,
  createUser,
  getSingleUser,
  deleteUser,
  createSubscriptionForUser
};
