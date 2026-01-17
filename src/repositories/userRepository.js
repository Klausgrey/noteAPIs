import db from "../db/db.js";
import bcrypt from "bcrypt";

const UserRepository = {
	/**
	 * Create a new user with hashed password
	 */
	async create(username, password) {
		// Hash the password before storing
		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		const [id] = await db("users").insert({
			username,
			password: hashedPassword,
		});

		return { id, username };
	},

	/**
	 * Find a user by username
	 */
	async findByUsername(username) {
		const user = await db("users").where({ username }).first();
		return user || null;
	},

	/**
	 * Find a user by ID
	 */
	async findById(id) {
		const user = await db("users").where({ id }).first();
		if (!user) return null;

		// Don't return password in user object
		const { password, ...userWithoutPassword } = user;
		return userWithoutPassword;
	},

	/**
	 * Verify password against hashed password
	 */
	async verifyPassword(plainPassword, hashedPassword) {
		return await bcrypt.compare(plainPassword, hashedPassword);
	},
};

export default UserRepository;
