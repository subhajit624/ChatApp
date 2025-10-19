import express from "express";
import protectedRoute from "../middlewares/protectedRoute.js";
import { sendMessage, getAllMessages } from "../controllers/messageControllers.js";

const router = express.Router();

router.get("/:id",protectedRoute,getAllMessages); 
router.post("/send/:id", protectedRoute,sendMessage); 

export default router;