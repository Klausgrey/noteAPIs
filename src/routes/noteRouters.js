import express, { Router } from "express";
import {
	createNotes,
	getNotes,
	getNotesById,
	updateNotes,
	deleteNotes,
} from "../controllers/noteControllers.js";
import {
	validatesCreatedNotes,
	validatesUpdatedNotes,
} from "../middleware/notemiddleware.js";

const router = express.Router();

router.post("/", validatesCreatedNotes, createNotes);
router.get("/", getNotes);
router.get("/:id", getNotesById);
router.patch("/:id", validatesUpdatedNotes, updateNotes);
router.delete("/:id", deleteNotes);

export default router;
