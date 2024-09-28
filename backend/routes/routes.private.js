import express from "express";

import authenticate from "../middleware/authenticate.js";
import file from "../controllers/controller.file.js";

const privateRoutes = express.Router();

privateRoutes.use(authenticate.validateUser);

privateRoutes.post("/file", file.handleFileUpload);

privateRoutes.get("/file/:id", file.handleFileDownload);

privateRoutes.get("/file", file.getFileList);

privateRoutes.delete("/file/:id", file.handleFileDelete);

export default privateRoutes;
