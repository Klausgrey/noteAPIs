import knex from 'knex';

const db = knex({
	client: 'sqlite3',
	connection: {
		filename: './dev.sqlite3' // This creates a file in your project folder
	},
	useNullAsDefault: true
});

// This function creates the table if it doesn't exist
export const initDb = async () => {
	const hasTable = await db.schema.hasTable('notes');
	if (!hasTable) {
		await db.schema.createTable('notes', (table) => {
			table.increments('id').primary(); // Auto-incrementing ID
			table.string('title').notNullable();
			table.text('content');
			table.timestamp('createdAt').defaultTo(db.fn.now());
		});
		console.log("Database & Notes table created!");
	}
};

export default db;