const ErrorResponse = require('../utils/errorResponse');
const Sentry = require("../helpers/sentry")

const errorHandler = (err, req, res, next) => {
  let errors = { ...err };

  errors.message = err.message;
  Sentry.captureException(errors.message);

  // Log to console for developer
  console.log(errors);

  switch (errors.code) {
    case 401: {
      const message = "Invalid authorization.";
      errors = new ErrorResponse(message, 400);
      break;
    }
    case "auth/id-token-expired": {
      const message = "Invalid authorization.";
      errors = new ErrorResponse(message, 400);
      break;
    }
    case "auth/wrong-password": {
      const message = "Invalid combination Email address and Password.";
      errors = new ErrorResponse(message, 400);
      break;
    }
    case "auth/user-not-found": {
      const message = "Invalid combination Email address and Password.";
      errors = new ErrorResponse(message, 400);
      break;
    }
    case "auth/email-already-in-use": {
      const message = "This email already used by another account.";
      errors = new ErrorResponse(message, 400);
      break;
    }
    case "storage/object-not-found": {
      const message = "storage/object-not-found";
      errors = new ErrorResponse(message, 404);
      break;
    }
    case "LIMIT_FILE_SIZE": {
      const message = "sorry this upload file max 2mb";
      errors = new ErrorResponse(message, 400);
      break;
    }
  }

  // ==========================
  // Sequelize 
  // ==========================
  if (errors?.parent?.code)
    switch (errors.parent.code) {
      case "22P02": {
        const message = "Invalid type of data.";
        errors = new ErrorResponse(message, 400);
        break;
      }
      case "42703": {
        const message = "Something went wrong.";
        errors = new ErrorResponse(message, 500);
        break;
      }
    }

  res.status(errors.code || 500).json({
    success: false,
    message: errors.message || 'Something went wrong.',
    data: {}
  });
}

module.exports = errorHandler;