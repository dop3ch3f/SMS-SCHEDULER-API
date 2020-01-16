const satelize = require("satelize");
const moment = require('moment');
const moment_timezone = require('moment-timezone');
const RepositoryResponse = require("./repository_response");
const uuidv1 = require('uuid/v1');
// File to contain all utility methods global to the application

class UtilitiesRepository {
    getTimezoneFromReqIP(req) {
        try {
            const ip = req.header["x-forwarded-for"] || req.connection.remoteAddress;
            satelize.satelize({ ip }, function (err, payload) {
                if (err) {
                    return new RepositoryResponse('util', false, 'Error getting timezone', null, err, null);
                }
                return new RepositoryResponse('util', true, 'Timezone success', payload.timezone, null, null);
            })
        } catch (error) {
            console.log(error);
            return new RepositoryResponse('util', false, 'Error getting timezone', null, error, null);
        }

    }

    convertTimeZoneToDefaultTimeZone(time, timezone) {
        try {
            const [hour, minute] = time.split(":");
            let currentDate = moment();
            currentDate.hour(hour);
            currentDate.minute(minute);
            const requestTimezone = moment_timezone.tz(currentDate, timezone);
            const defaultTimezone = requestTimezone.clone().tz("Africa/Lagos");
            return new RepositoryResponse('util', true, "Success", defaultTimezone.format(), null, null);
        } catch (error) {
            console.log(error);
            return new RepositoryResponse('util', false, 'Error getting timezone', null, error, null);
        }

    }

    getTimein24Hours(time) {
        try {
            const result = moment(time).format("H:mm");
            return new RepositoryResponse('util', true, "Success", result, null, null);
        } catch (error) {
            console.log(error);
            return new RepositoryResponse('util', false, "Error occurred", null, error, null);
        }
    }

    convert24HrsToCronExpression(time) {
        try {
            const [hour, minute] = time.split(":");
            return new RepositoryResponse('util', true, "success", `${minute} ${hour} * * *`, null, null);
            // return new RepositoryResponse('util', true, "success", "1 * * * * *", null, null);
        } catch (error) {
            console.log(error);
            return new RepositoryResponse('util', false, "Error occurred", null, error, null);
        }
    }

    generateUniqueID() {
        return new RepositoryResponse('util', true, 'success', uuidv1(), null, null);
    }
}

module.exports = UtilitiesRepository;