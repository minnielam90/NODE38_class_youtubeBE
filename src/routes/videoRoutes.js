import express from "express";
import {
  createVideo,
  deleteVideo,
  getVideo,
  updateVideo,
} from "../controllers/videoControllers.js";
import { khoaApi } from "../config/jwt.js";
import jwt from "jsonwebtoken";
import sequelize from "../models/connect.js";
import initModels from "../models/init-models.js";

const conn = initModels(sequelize);

const videoRoutes = express.Router();

const checkToken = (token) => {
  return jwt.verify(token, "NODE38", (err, decodedToken) => {
    if (err) {
      return {
        statusCode: 401,
        message: "Invalid token",
      };
    } else {
      return {
        statusCode: 200,
        data: decodedToken,
      };
    }
  });
};

const verifyToken = async (req, res, next) => {
  // B1: check token có trong request => lấy từ header
  let { token } = req.headers;
  if (!token) {
    res.status(401).send("Token is invalid");
    return;
  }
  // verify token có đúng format
  let isValidToken = checkToken(token);
  if (isValidToken.statusCode == 401) {
    res.status(401).send(isValidToken.message);
    return;
  }
  // check user có trong db hay không
  let { user_id } = isValidToken.data;
  let data = await conn.users.findOne({
    where: {
      user_id: user_id,
    },
  });
  if (!data) {
    res.status(401).send("Invalid token");
    return;
  }
  next(); //bypass => phải có để req vào được controller, nếu ko thì ko pass được
};

// videoRoutes.get("/get-video/:page/:size", khoaApi, getVideo); // define API get-video có method là GET
// videoRoutes.get("/get-video/:page/:size", getVideo);
videoRoutes.get("/get-video/:page/:size", verifyToken, getVideo); // define API get-video có method là GET

videoRoutes.post("/create-video", verifyToken, createVideo);
videoRoutes.delete("/delete-video/:videoId", verifyToken, deleteVideo);
videoRoutes.put("/update-video/:videoId", verifyToken, updateVideo);

export default videoRoutes;
