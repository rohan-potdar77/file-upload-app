import express from "express";
import user from "../controllers/controller.user.js";

const publicRoutes = express.Router();

publicRoutes.post("/login", user.login);

publicRoutes.post("/register", user.register);

export default publicRoutes;
