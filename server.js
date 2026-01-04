import express from "express";

const app = express();
const PORT = 3000;
app.use(express.json()); // makes express understand JSON

// Variables
const notes = [];
let noteId = 1;

//  Work on the middleware => "Middleware should validate only what the route truly requires."
const validatesCreatedNotes = (req, res, next) => {
	const { title, content } = req.body || {};

	if (!title || !content) {
		return res.status(400).json({ error: "Title and content are required" });
	}
	next();
};

app.post("/notes", validatesCreatedNotes, (req, res) => {
	const { title, content } = req.body;

	const newNote = {
		id: noteId++,
		title,
		content,
		createdAt: new Date().toISOString(),
	};

	notes.push(newNote);

	res.status(201).json(newNote);

	// res.json({
	// 	title: "My first note",
	// 	content: "Learning how APIs work",
	// });
});

app.get("/notes", (req, res) => {
	res.json(notes);
});

app.get("/notes/:id", (req, res) => {
	const userId = Number(req.params.id);
	const note = notes.find((n) => n.id === userId);
	if (!note) return res.status(404).json({ error: "Note not found" });

	res.json(note);
});

const validatesUpdatedNotes = (req, res, next) => {
	const { title, content } = req.body || {};

	if (!title && !content) {
		return res.status(400).json({ error: "Title or content are required" });
	}
	next();
};

app.patch("/notes/:id", validatesUpdatedNotes, (req, res) => {
	const userId = Number(req.params.id);
	const note = notes.find((n) => n.id === userId);
	if (!note) return res.status(404).json({ error: "Note not found" });
	const { title, content } = req.body;

	if (title) note.title = title;
	if (content) note.content = content;

	res.json(note);
});

app.delete("/notes/:id", (req, res) => {
	const userId = Number(req.params.id);
	const index = notes.findIndex((n) => n.id === userId);

	if (index === -1) {
		return res.status(404).json({ error: "Note not found" });
	}

	notes.splice(index, 1);
	res.status(204).send();
});

app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});


