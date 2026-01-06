import NoteRepository from "../repositories/noteRepository.js";


export async function createNotes(req, res) {
	const { title, content } = req.body;

	try {
		const newNote = await NoteRepository.create(title, content);
		return res.status(201).json(newNote);
	} catch (error) {
		res.status(500).json({ message: "Error saving note" });
	}

}

export async function getNotes(req, res) {
	try {
		const getNote = await NoteRepository.getAll();
		return res.status(200).json(getNote);
	} catch (error) {
		res.status(500).json({ message: "Error fetching note" });
	}
}

export async function getNotesById(req, res) {
	const noteId = Number(req.params.id);

	try {
		const note = await NoteRepository.getById(noteId);
		if (!note) {
			return res.status(404).json({ message: "Note not found" });
		}
		return res.status(200).json(note);
	} catch (error) {
		res.status(500).json({ message: "Error fetching note" });
	}

};

export async function updateNotes(req, res) {
	const userId = Number(req.params.id);
	const { title, content } = req.body;

	try {
		const updated = await NoteRepository.updateById(userId, title, content);
		if (!updated) {
			return res.status(404).json({ message: "Note not found" });
		}
		return res.status(200).json(updated);
	} catch (error) {
		res.status(500).json({ message: "Error updating note" });
	}
};

export async function deleteNotes (req, res) {
	const userId = Number(req.params.id);

	try {
		const deleted = await NoteRepository.deleteById(userId);
		if (!deleted) {
			return res.status(404).json({ error: "Note not found" });
		}
		return res.status(204).send();
	} catch (error) {
		return res.status(500).json({ message: "Error deleting note" });
	}

};

export default {
	createNotes,
	getNotes,
	getNotesById,
	updateNotes,
	deleteNotes,
};