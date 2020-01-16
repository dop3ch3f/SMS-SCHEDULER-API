const courseModel = require("../Models/Courses");
const moduleModel = require("../Models/Modules");
const Response = require("../../Utilities/response_generator");
const { Application_Responses } = require("../../Utilities/enums");
const Validations = require("../Validations/Courses");

const getAllCourses = async (req, res, next) => {
    try {
        const courses = await courseModel.find().populate('modules');
        return new Response(Application_Responses.SUCCESS, null, null, courses, res).getResponse();
    } catch (error) {
        next(error);
    }
}

const createCourse = async (req, res, next) => {
    try {
        const request_data = req.body;
        const single = !(Array.isArray(request_data));

        if (single) {
            const validation = await Validations.createCourse.validateAsync(request_data);
            if (validation.error != null) {
                return new Response(Application_Responses["BAD-REQUEST"], null, validation.error, null, res).getResponse();
            }
        } else {
            const validation = await Validations.createMultipleCourses.validateAsync(request_data);
            if (validation.error != null) {
                return new Response(Application_Responses["BAD-REQUEST"], null, validation.error, null, res).getResponse();
            }
        }

        const newCourse = await courseModel.create(request_data);
        return new Response(Application_Responses.SUCCESS, "Course(s) Created Successfully", null, newCourse, res).getResponse();
    } catch (error) {
        next(error);
    }
};

const getSingleCourse = async (req, res, next) => {
    try {
        const course_id = req.params.id;
        const single_course = await courseModel.findOne({ _id: course_id }).populate('modules');
        return new Response(Application_Responses.SUCCESS, "Single course", null, single_course, res).getResponse();
    } catch (error) {
        next(error);
    }
}

const deleteCourse = async (req, res, next) => {
    try {
        const course_id = req.params.id;
        await courseModel.deleteOne({ _id: course_id });
        return new Response(Application_Responses.SUCCESS, "Deleted successfully", null, null, res).getResponse();
    } catch (error) {
        next(error);
    }
}

const createModuleForCourse = async (req, res, next) => {
    try {
        const course_id = req.params.id;
        const request_data = req.body;
        const single = !(Array.isArray(request_data));
        const courseDoc = await courseModel.findById(course_id);
        let lastModuleIndex = courseDoc.modules.length;

        if (single) {
            const validation = await Validations.createModuleForCourse.validateAsync(request_data);
            if (validation.error != null) {
                return new Response(Application_Responses["BAD-REQUEST"], null, validation.error, null, res).getResponse();
            } else {
                request_data.order = lastModuleIndex + 1;
                const moduleDoc = await moduleModel.create(request_data);
                courseDoc.modules.push(moduleDoc._id);
            }
        } else {
            const validation = await Validations.createMultipleModulesForCourse.validateAsync(request_data);
            if (validation.error != null) {
                return new Response(Application_Responses["BAD-REQUEST"], null, validation.error, null, res).getResponse();
            } else {
                const parsedModules = request_data.map((data) => {
                    lastModuleIndex += 1;
                    data.order = lastModuleIndex;
                    return data;
                });
                const moduleDoc = await moduleModel.create(parsedModules);
                courseDoc.modules = moduleDoc.map(module => module._id);
            }
        }

        await courseDoc.save();
        return new Response(Application_Responses.SUCCESS, "Module registered", null, courseDoc, res).getResponse();
    } catch (error) {
        next(error);
    }
}


module.exports = {
    getAllCourses,
    getSingleCourse,
    createCourse,
    deleteCourse,
    createModuleForCourse
};