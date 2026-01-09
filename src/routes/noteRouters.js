import express from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
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

router.post("/", validatesCreatedNotes, asyncHandler(createNotes));
router.get("/", asyncHandler(getNotes));
router.get("/:id", asyncHandler(getNotesById));
router.patch("/:id", validatesUpdatedNotes, asyncHandler(updateNotes));
router.delete("/:id", asyncHandler(deleteNotes));

export default router;
