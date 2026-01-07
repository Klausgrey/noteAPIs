import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("POST /notes", () => {
	it("returns 400 if title is missing", async () => {
		const res = await request(app)
			.post("/notes")
			.send({ content: "hello" });

		expect(res.status).toBe(400);
	});

	it("creates a note with valid input", async () => {
		const res = await request(app)
			.post("/notes")
			.send({ title: "test", content: "hello" });

		expect(res.status).toBe(201);
		expect(res.body).toHaveProperty("id");
		expect(res.body.title).toBe("test");
	});
});
