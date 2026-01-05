const notes = [];
let noteId = 1;


export const createNotes = (req, res) => {
	const { title, content } = req.body;

	const newNote = {
		id: noteId++,
		title,
		content,
		createdAt: new Date().toISOString(),
	};

	notes.push(newNote);

	res.status(201).json(newNote);
};

export const getNotes = (req, res) => {
	res.json(notes);
};

export const getNotesById = (req, res) => {
	const userId = Number(req.params.id);
	const note = notes.find((n) => n.id === userId);
	if (!note) return res.status(404).json({ error: "Note not found" });

	res.json(note);
};

export const updateNotes = (req, res) => {
	const userId = Number(req.params.id);
	const note = notes.find((n) => n.id === userId);
	if (!note) return res.status(404).json({ error: "Note not found" });
	const { title, content } = req.body;

	if (title) note.title = title;
	if (content) note.content = content;

	res.json(note);
};

export const deleteNotes = (req, res) => {
	const userId = Number(req.params.id);
	const index = notes.findIndex((n) => n.id === userId);

	if (index === -1) {
		return res.status(404).json({ error: "Note not found" });
	}

	notes.splice(index, 1);
	res.status(204).send();
};
