import NoteRepository from "../repositories/noteRepository.js";

export const createNotes = async (req, res) => {
	const { title, content } = req.body;

	const newNote = await NoteRepository.create(title, content);
	return res.status(201).json(newNote);
};

export async function getNotes(req, res) {
	const page = Math.max(1, parseInt(req.query.page, 10) || 1)
	const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));

	const results = await NoteRepository.getAll(page, limit);
	return res.status(200).json(results);
}

export async function getNotesById(req, res) {
	const noteId = Number(req.params.id);

	const note = await NoteRepository.getById(noteId);
	if (!note) {
		return res.status(404).json({ message: "Note not found" });
	}
	return res.status(200).json(note);
}

export async function updateNotes(req, res) {
	const noteId = Number(req.params.id);
	const { title, content } = req.body;

	const updated = await NoteRepository.updateById(noteId, title, content);
	if (!updated) {
		return res.status(404).json({ message: "Note not found" });
	}
	return res.status(200).json(updated);
}

export async function deleteNotes(req, res) {
	const noteId = Number(req.params.id);

	const deleted = await NoteRepository.deleteById(noteId);
	if (!deleted) {
		return res.status(404).json({ error: "Note not found" });
	}
	return res.status(204).send();
}

export default {
	createNotes,
	getNotes,
	getNotesById,
	updateNotes,
	deleteNotes,
};
