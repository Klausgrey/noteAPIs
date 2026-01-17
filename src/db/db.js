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
	// Create users table
	const hasUsersTable = await db.schema.hasTable('users');
	if (!hasUsersTable) {
		await db.schema.createTable('users', (table) => {
			table.increments('id').primary();
			table.string('username').notNullable().unique();
			table.string('password').notNullable();
			table.timestamp('createdAt').defaultTo(db.fn.now());
		});
		console.log("Users table created!");
	}

	// Create notes table
	const hasNotesTable = await db.schema.hasTable('notes');
	if (!hasNotesTable) {
		await db.schema.createTable('notes', (table) => {
			table.increments('id').primary(); // Auto-incrementing ID
			table.string('title').notNullable();
			table.text('content');
			table.timestamp('createdAt').defaultTo(db.fn.now());
		});
		console.log("Notes table created!");
	}
};

export default db;