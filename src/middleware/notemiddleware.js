export const validatesCreatedNotes = (req, res, next) => {
	const { title, content } = req.body || {};

	if (!title || !content) {
		return res.status(400).json({ error: "Title and content are required" });
	}
	next();
};

export const validatesUpdatedNotes = (req, res, next) => {
	const { title, content } = req.body || {};

	if (!title && !content) {
		return res.status(400).json({ error: "Title or content are required" });
	}
	next();
};
