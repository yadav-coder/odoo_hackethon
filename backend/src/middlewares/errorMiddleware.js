const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || res.statusCode;
  if (!statusCode || statusCode === 200) statusCode = 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || "Server error",
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack
  });
};

module.exports = {
  notFound,
  errorHandler
};
