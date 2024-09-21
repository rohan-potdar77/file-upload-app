import express from "express";
import controllerUser from "../controllers/controller.user.js";

const publicRoutes = express.Router();

publicRoutes.post("/login", controllerUser.login);

publicRoutes.post("/register", controllerUser.register);

export default publicRoutes;
