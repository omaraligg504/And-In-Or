const AppError = require("./appError");

module.exports=fn=>{
    return(req,res,next)=>{
        fn(req,res,next).catch(err => {
            // Check if it's a database error
            if (err.name === 'error') {
                // Handle database errors
                let errorMessage;
                switch (err.code) {
                    case '23505':
                        errorMessage = 'This record already exists.';
                        break;
                    case '23503':
                        errorMessage = 'Foreign key violation. Referenced record does not exist.';
                        break;
                        case '22P02':
                        errorMessage = 'Invalid input syntax. Please check the data type of your input.';
                        break;
                    case '23502':
                        errorMessage = 'A required field cannot is missing.';
                        break;
                    case '23514':
                        errorMessage = 'Data does not meet specified conditions.';
                        break;
                    case '42P01':
                        errorMessage = 'The referenced table does not exist.';
                        break;
                    case '42P10':
                        errorMessage = 'An object with this name already exists.';
                        break;
                    case '42703':
                        errorMessage = 'The referenced field does not exist.';
                        break;
                    case '42702':
                        errorMessage = 'The field reference is ambiguous.';
                        break;
                    case '42701':
                        errorMessage = 'Two or more columns have the same name.';
                        break;
                    default:
                        errorMessage = 'An error occurred while processing your request.';
                        break;
                }
                next(new AppError(errorMessage,400))
            } else {
                // Forward other errors to the default error handler
                next(err);
            }
        });;
    }
}