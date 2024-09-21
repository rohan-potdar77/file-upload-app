import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

import File from "../models/model.file.js";
import services from "../services/services.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "../uploads");

const ensureUploadsDirExists = () => {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
};

const generateSixDigitCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const createFileRecord = async (originalName, code, uploadPath, userId) => {
  try {
    await File.create({ originalName, code, uploadPath, userId });
  } catch (error) {
    throw new Error("Error saving file record to database!");
  }
};

const handleFileUpload = async (req, res, next) => {
  ensureUploadsDirExists();

  const fileId = uuidv4();
  const originalName = req.headers["x-original-filename"];
  const userId = req.user.userId;
  const extension = path.extname(originalName);
  const uploadPath = path.join(uploadsDir, `${fileId}${extension}`);
  const writeStream = fs.createWriteStream(uploadPath);

  req.pipe(writeStream);

  writeStream.on("finish", async () => {
    try {
      const code = generateSixDigitCode();
      await createFileRecord(originalName, code, uploadPath, userId);
      return res.status(201).json("File uploaded successfully");
    } catch (error) {
      next(services.errorGenerator(error.message, 500));
    }
  });

  writeStream.on("error", (error) => {
    next(services.errorGenerator(error.message, 500));
  });
};

const handleFileDelete = async (req, res, next) => {
  const { id } = req.params;

  try {
    const fileRecord = await File.findById(id);

    if (!fileRecord) {
      return next(services.errorGenerator("Record not found!", 404));
    }

    fs.unlink(fileRecord.uploadPath, async (error) => {
      if (error) {
        return next(
          services.errorGenerator("Error deleting file from server", 500)
        );
      }

      await File.deleteOne({ _id: id });
      return res.status(200).json("File deleted successfully");
    });
  } catch (error) {
    return next(services.errorGenerator(error.message, 500));
  }
};

const getFileList = async (req, res, next) => {
  try {
    const fileList = await File.find({ userId: req.user.userId });
    return res.status(200).json(fileList);
  } catch (error) {
    return next(services.errorGenerator(error.message, 500));
  }
};

const handleFileDownload = async (req, res, next) => {
  const { id } = req.params;
  const { code } = req.query;

  try {
    const fileRecord = await File.findById(id);

    if (!fileRecord) {
      return next(services.errorGenerator("Record not found!", 404));
    }

    if (fileRecord.code !== Number(code)) {
      return next(services.errorGenerator("Invalid code!", 403));
    }

    res.download(fileRecord.uploadPath, fileRecord.originalName, (error) => {
      if (error) {
        return next(services.errorGenerator("Error downloading the file", 500));
      }
    });
  } catch (error) {
    return next(services.errorGenerator(error.message, 500));
  }
};

export default {
  handleFileUpload,
  handleFileDelete,
  getFileList,
  handleFileDownload,
};
