import express, { Router } from "express";
import * as noteController from "../controllers/noteControllers.js";
import {
	validatesCreatedNotes,
	validatesUpdatedNotes,
} from "../middleware/notemiddleware.js";

const router = express.Router();

router.post("/", validatesCreatedNotes, noteController.createNotes);
router.get("/", noteController.getNotes);
router.get("/:id", noteController.getNotesById);
router.patch("/:id", validatesUpdatedNotes, noteController.updateNotes);
router.delete("/:id", noteController.deleteNotes);

export default router;
