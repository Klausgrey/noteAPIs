import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
	console.warn("Warning: JWT_SECRET is not set in environment variables");
}

/**
 * Middleware to authenticate requests using JWT tokens
 * Expects token in Authorization header as "Bearer <token>"
 */
export const authenticateToken = (req, res, next) => {
	// Get token from Authorization header
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1]; // Format: "Bearer <token>"

	if (!token) {
		return res.status(401).json({ error: "Access token required" });
	}

	if (!JWT_SECRET) {
		return res.status(500).json({ error: "Server configuration error" });
	}

	try {
		// Verify and decode the token
		const decoded = jwt.verify(token, JWT_SECRET);
		// Attach user info to request object for use in controllers
		req.user = decoded;
		next();
	} catch (error) {
		if (error.name === "TokenExpiredError") {
			return res.status(401).json({ error: "Token has expired" });
		}
		if (error.name === "JsonWebTokenError") {
			return res.status(403).json({ error: "Invalid token" });
		}
		return res.status(500).json({ error: "Token verification failed" });
	}
};

/**
 * Helper function to generate a JWT token (typically used in login controller)
 */
export const generateToken = (payload, expiresIn = "1h") => {
	if (!JWT_SECRET) {
		throw new Error("JWT_SECRET is not configured");
	}
	return jwt.sign(payload, JWT_SECRET, { expiresIn });
};
