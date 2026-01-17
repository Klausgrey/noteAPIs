// Set JWT_SECRET for tests BEFORE any imports
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret-key-for-testing-only";

import { describe, it, expect, beforeEach, beforeAll } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import db from "../src/db/db.js";
import { initDb } from "../src/db/db.js";

describe("Authentication", () => {
	// Initialize database before all tests
	beforeAll(async () => {
		await initDb();
	});

	// Clean up database before each test
	beforeEach(async () => {
		// Delete all users and notes before each test
		try {
			await db("users").del();
			await db("notes").del();
		} catch (error) {
			// Tables might not exist yet, ignore errors
		}
	});

	describe("POST /auth/register", () => {
		it("should register a new user successfully", async () => {
			const res = await request(app).post("/auth/register").send({
				username: "testuser",
				password: "password123",
			});

			expect(res.status).toBe(201);
			expect(res.body).toHaveProperty("token");
			expect(res.body).toHaveProperty("user");
			expect(res.body.user.username).toBe("testuser");
			expect(res.body.user).toHaveProperty("id");
			expect(res.body.message).toBe("User created successfully");
		});

		it("should return 400 if username is missing", async () => {
			const res = await request(app).post("/auth/register").send({
				password: "password123",
			});

			expect(res.status).toBe(400);
			expect(res.body.error).toBe("Username and password are required");
		});

		it("should return 400 if password is missing", async () => {
			const res = await request(app).post("/auth/register").send({
				username: "testuser",
			});

			expect(res.status).toBe(400);
			expect(res.body.error).toBe("Username and password are required");
		});

		it("should return 400 if password is too short", async () => {
			const res = await request(app).post("/auth/register").send({
				username: "testuser",
				password: "12345",
			});

			expect(res.status).toBe(400);
			expect(res.body.error).toBe("Password must be at least 6 characters long");
		});

		it("should return 409 if username already exists", async () => {
			// First registration
			await request(app).post("/auth/register").send({
				username: "testuser",
				password: "password123",
			});

			// Try to register again with same username
			const res = await request(app).post("/auth/register").send({
				username: "testuser",
				password: "password456",
			});

			expect(res.status).toBe(409);
			expect(res.body.error).toBe("Username already exists");
		});
	});

	describe("POST /auth/login", () => {
		beforeEach(async () => {
			// Create a user before login tests
			await request(app).post("/auth/register").send({
				username: "testuser",
				password: "password123",
			});
		});

		it("should login successfully with correct credentials", async () => {
			const res = await request(app).post("/auth/login").send({
				username: "testuser",
				password: "password123",
			});

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty("token");
			expect(res.body).toHaveProperty("user");
			expect(res.body.user.username).toBe("testuser");
			expect(res.body.message).toBe("Login successful");
		});

		it("should return 400 if username is missing", async () => {
			const res = await request(app).post("/auth/login").send({
				password: "password123",
			});

			expect(res.status).toBe(400);
			expect(res.body.error).toBe("Username and password are required");
		});

		it("should return 400 if password is missing", async () => {
			const res = await request(app).post("/auth/login").send({
				username: "testuser",
			});

			expect(res.status).toBe(400);
			expect(res.body.error).toBe("Username and password are required");
		});

		it("should return 401 with incorrect username", async () => {
			const res = await request(app).post("/auth/login").send({
				username: "wronguser",
				password: "password123",
			});

			expect(res.status).toBe(401);
			expect(res.body.error).toBe("Invalid username or password");
		});

		it("should return 401 with incorrect password", async () => {
			const res = await request(app).post("/auth/login").send({
				username: "testuser",
				password: "wrongpassword",
			});

			expect(res.status).toBe(401);
			expect(res.body.error).toBe("Invalid username or password");
		});
	});

	describe("Protected routes with authentication", () => {
		let authToken;
		let testUser;

		beforeEach(async () => {
			// Register and get token for authenticated requests
			const registerRes = await request(app).post("/auth/register").send({
				username: "testuser",
				password: "password123",
			});

			authToken = registerRes.body.token;
			testUser = registerRes.body.user;
		});

		it("should allow access to protected routes with valid token", async () => {
			const res = await request(app)
				.post("/notes")
				.set("Authorization", `Bearer ${authToken}`)
				.send({
					title: "Test Note",
					content: "This is a test note",
				});

			expect(res.status).toBe(201);
			expect(res.body).toHaveProperty("id");
			expect(res.body.title).toBe("Test Note");
		});

		it("should return 401 when accessing protected routes without token", async () => {
			const res = await request(app).post("/notes").send({
				title: "Test Note",
				content: "This is a test note",
			});

			expect(res.status).toBe(401);
			expect(res.body.error).toBe("Access token required");
		});

		it("should return 403 when accessing protected routes with invalid token", async () => {
			const res = await request(app)
				.post("/notes")
				.set("Authorization", "Bearer invalid_token_here")
				.send({
					title: "Test Note",
					content: "This is a test note",
				});

			expect(res.status).toBe(403);
			expect(res.body.error).toBe("Invalid token");
		});

		it("should return 401 when token is missing Bearer prefix", async () => {
			const res = await request(app)
				.post("/notes")
				.set("Authorization", authToken) // Missing "Bearer " prefix
				.send({
					title: "Test Note",
					content: "This is a test note",
				});

			expect(res.status).toBe(401);
			expect(res.body.error).toBe("Access token required");
		});
	});
});
