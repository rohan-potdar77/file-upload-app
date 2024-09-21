import services from "../services/services.js";

const notFoundHandler = (_req, _res, next) => {
  next(services.errorGenerator("Path not found!", 404));
};

const handleServerErrors = (error, _req, res, _next) => {
  console.error("Error handler: ", error.stack);
  return res.status(error.statusCode || 500).json({
    error: error.message || "Internal server error!",
  });
};

export default { notFoundHandler, handleServerErrors };
