import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

import serverConfigurations from "./middleware/error.js";
import privateRoutes from "./routes/routes.private.js";
import publicRoutes from "./routes/routes.public.js";
import services from "./services/services.js";

dotenv.config();
const app = express();

mongoose
  .connect(process.env.DATABASE)
  .then(
    () => console.info("Database connected!"),
    () => console.info("Database not connected!")
  )
  .catch((error) => console.error(error));

app.use(cors(services.corsOptions()));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/public", publicRoutes);
app.use("/api/private", privateRoutes);

app.use(serverConfigurations.notFoundHandler);
app.use(serverConfigurations.handleServerErrors);

app.listen(process.env.PORT, () =>
  console.info(`Server is running on port: ${process.env.PORT}`)
);
