import UserRepository from "../repositories/userRepository.js";
import { generateToken } from "../middleware/authMiddleware.js";

/**
 * Register a new user
 * POST /auth/register
 */
export const register = async (req, res) => {
	const { username, password } = req.body;

	// Validate input
	if (!username || !password) {
		return res.status(400).json({ error: "Username and password are required" });
	}

	if (password.length < 6) {
		return res.status(400).json({ error: "Password must be at least 6 characters long" });
	}

	try {
		// Check if user already exists
		const existingUser = await UserRepository.findByUsername(username);
		if (existingUser) {
			return res.status(409).json({ error: "Username already exists" });
		}

		// Create new user
		const user = await UserRepository.create(username, password);

		// Generate JWT token
		const token = generateToken({ userId: user.id, username: user.username });

		return res.status(201).json({
			message: "User created successfully",
			user: { id: user.id, username: user.username },
			token,
		});
	} catch (error) {
		console.error("Registration error:", error);
		return res.status(500).json({ error: "Failed to register user" });
	}
};

/**
 * Login user
 * POST /auth/login
 */
export const login = async (req, res) => {
	const { username, password } = req.body;

	// Validate input
	if (!username || !password) {
		return res.status(400).json({ error: "Username and password are required" });
	}

	try {
		// Find user by username
		const user = await UserRepository.findByUsername(username);
		if (!user) {
			return res.status(401).json({ error: "Invalid username or password" });
		}

		// Verify password
		const isPasswordValid = await UserRepository.verifyPassword(password, user.password);
		if (!isPasswordValid) {
			return res.status(401).json({ error: "Invalid username or password" });
		}

		// Generate JWT token
		const token = generateToken({ userId: user.id, username: user.username });

		return res.status(200).json({
			message: "Login successful",
			user: { id: user.id, username: user.username },
			token,
		});
	} catch (error) {
		console.error("Login error:", error);
		return res.status(500).json({ error: "Failed to login" });
	}
};
