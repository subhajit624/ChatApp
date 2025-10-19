import express from "express";
import protectedRoute from "../middlewares/protectedRoute.js";
import { loginUserData } from "../controllers/logInUserData.js";

const router = express.Router();

router.get("/me",protectedRoute,loginUserData);  //this route is for getting the current user's data

export default router;