const { Application_Responses } = require('./enums');

// class to manage all responses from the application

class ResponseGenerator {
    constructor(response_type, response_message,response_error, response_data, express_response ) {
        this.case = response_type;
        this.message = response_message;
        this.error = response_error;
        this.data = response_data;
        this.res = express_response;
    }
  getResponse()  {
     let code = null;
     let status = null;
     // change this to false to prevent error reporting
     let error_reporting = true;
     if (this.case == null) {
       throw 'Error: Case cannot be null. Refer to enums for supported application enums';
     }

     if(error_reporting === false) {
         this.error = null;
     }

     switch (this.case) {
         case Application_Responses["SERVER-ERROR"]:
             code = 500;
             status = false;
             if (this.message != null) {
                 this.message = 'An error occurred';
             }
             break;
         case Application_Responses["BAD-REQUEST"]:
             code = 400;
             status = false;
             if (this.message != null) {
                this.message = 'An invalid request was made';
             }
             break;
         case Application_Responses.UNAUTHENTICATED:
             code = 401;
             status = false;
             if (this.message != null) {
                 this.message = 'An unauthenticated request was made';
             }
             break;
         case Application_Responses.UNPROCESSABLE:
             code = 422;
             status = false;
             if (this.message != null) {
                 this.message = 'An unprocessable request was made';
             }
             break;
         case Application_Responses.SUCCESS:
             code = 200;
             status = true;
             if (this.message != null) {
                 this.message = 'Request successful';
             }
             break;
         case Application_Responses["NOT-FOUND"]:
             code = 404;
             status = false;
             if (this.message != null) {
                 this.message = 'Requested resource not found';
             }
             break;
         case Application_Responses.UNAUTHORIZED:
             code = 403;
             status = false;
             if (this.message != null) {
                 this.message = 'An unauthorized request was made';
             }
             break;
         default:
             code = 500;
             status = false;
             this.message = 'server error';
             break;
     }

     return this.res.status(code).json({
         status,
         message: this.message,
         data: this.data,
         error: this.error
     });

  }
}

module.exports = ResponseGenerator;
