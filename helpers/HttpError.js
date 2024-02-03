const errorMessagelist = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  409: "Conflict",
};

const HttpError = (status, message) => {
  const errorMessage =
    message || errorMessagelist[status] || "Internal Server Error";
  const error = new Error(errorMessage);
  error.status = status;
  return error;
};

module.exports = HttpError;
