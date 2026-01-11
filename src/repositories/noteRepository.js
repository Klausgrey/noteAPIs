import db from "../db/db.js";

const NoteRepository = {
	// Get all notes from the database
	async getAll(page = 1, limit = 10) {
		const offset = (page - 1) * limit;
		// ill be implementing search/filter functionality
		const notes = await db('notes')
			.select('*')
			.orderBy('createdAt', 'desc')
			.limit(limit)
			.offset(offset);

		const [{ count }] = await db("notes").count('* as count');
		const total = Number(count);
		const totalPages = Math.ceil(total / limit)

		return {
			notes,
			pagination: {
				page,
				limit,
				total,
				totalPages,
				hasNextPage: page < totalPages,
				hasPrevPage: page > 1,
			},
		};
	},

	// Insert a new note and return the result
	async create(title, content) {
		const [id] = await db("notes").insert({ title, content });
		return { id, title, content, createdAt: new Date().toISOString() };
	},

	async getById(id) {
		const row = await db("notes").where({ id }).first();
		if (!row) return null;

		return {
			id: row.id,
			title: row.title,
			content: row.content,
			createdAt: row.createdAt,
		};
	},

	async updateById(id, in_title, in_content) {
		const row = await db("notes").where({ id }).first();
		if (!row) return null;

		const updates = {};

		if (in_title !== undefined) updates.title = in_title;
		if (in_content !== undefined) updates.content = in_content;

		// This checks for updates
		if (Object.keys(updates).length === 0)
			return {
				id: row.id,
				title: row.title,
				content: row.content,
				createdAt: row.createdAt,
			};

		await db("notes").where({ id }).update(updates);
		const updated = await db("notes").where({ id }).first();

		return {
			id: updated.id,
			title: updated.title,
			content: updated.content,
			createdAt: updated.createdAt,
		};
	},

	async deleteById(id) {
		const deletedCount = await db("notes").where({ id }).del(); // this returns 1 or 0
		return deletedCount > 0; // if deletedNotes === 1, returns true, otherwise false
	}
};

export default NoteRepository;

// The grown up way of writting the await function
// async create(title, content) {
// 	const [row] = await db("notes")
// 		.insert({ title, content })
// 		.returning(["id", "created_at"]);

// 	return {
// 		id: row.id,
// 		title,
// 		content,
// 		createdAt: row.created_at ?? new Date().toISOString(),
// 	};
// }
