import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import error from "./middleware/error.js";
import privateRoutes from "./routes/routes.private.js";
import publicRoutes from "./routes/routes.public.js";
import services from "./services/services.js";

dotenv.config();
const app = express();
services.connectToDatabase();

app.use(cors(services.corsOptions()));
app.use(express.json());

app.use("/api/public", publicRoutes);
app.use("/api/private", privateRoutes);

app.use(error.notFoundHandler);
app.use(error.handleServerErrors);

app.listen(process.env.PORT, () =>
  console.info(`Server is running on port: ${process.env.PORT}`)
);
