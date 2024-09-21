import express from "express";

import authenticate from "../middleware/authenticate.js";
import fileController from "../controllers/controller.file.js";

const privateRoutes = express.Router();

privateRoutes.use(authenticate.validateUser);

privateRoutes.post("/file", fileController.handleFileUpload);

privateRoutes.get("/file/:id", fileController.handleFileDownload);

privateRoutes.get("/file", fileController.getFileList);

privateRoutes.delete("/file/:id", fileController.handleFileDelete);

export default privateRoutes;
