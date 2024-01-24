import express from "express";
import storage from "../controllers/uploadControllers.js";
import {
  uploadMultipleAvatar,
  uploadSingleAvatar,
} from "../controllers/userControllers.js";
import { checkToken, khoaApi } from "../config/jwt.js";
import uploadCloud from "../config/cloudinary.config.js";

const userRoutes = express.Router();

// userRoutes.post(
//   "/upload-avatar",
//   khoaApi,
//   storage.single("file"),
//   uploadSingleAvatar
// );

userRoutes.post(
  "/upload-avatar",
  uploadCloud.single("file"),
  uploadSingleAvatar
);

// userRoutes.post(
//   "/upload-multiple-avatar",
//   storage.array("files"),
//   uploadMultipleAvatar
// );

userRoutes.post(
  "/upload-multiple-avatar",
  uploadCloud.array("files"),
  uploadMultipleAvatar
);

export default userRoutes;
