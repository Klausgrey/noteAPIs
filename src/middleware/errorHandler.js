export const errorHandler = (err, req, res, next) => {
	console.error("Error log:", err.stack)

	const statusCode = err.statusCode || 500;

	res.status(statusCode).json({
		status: "error",
		message: err.message || "An unexpected error occurred"

	});
};

export default errorHandler;