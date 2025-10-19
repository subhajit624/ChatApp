import express from "express";
import { getAllUser, login, logout, register } from "../controllers/userControllers.js";
import protectedRoute from "../middlewares/protectedRoute.js";

const router = express.Router();

router.post("/register",register);
router.post("/login",login);
router.post("/logout",logout);
router.get("/",protectedRoute ,getAllUser);
        

export default router;