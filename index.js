// express, mysql2, sequelize, sequelize-auto, nodemon, cors
// npm i express mysql2 sequelize sequelize-auto nodemon cors
import express from "express";
import rootRoutes from "./src/routes/rootRoutes.js";
import cors from "cors";

const app = express();
const port = 8082;

app.use(express.json()); //middleware để parse body string thành body json
app.use(express.static(".")); //middleware để xác định nơi lưu file
app.use(
  cors({
    credentials: true,
  })
); // cho tất cả các request (FE) từ bên ngoài vào để tương tác vs BE
app.use(rootRoutes);

app.get("/", (req, res) => {
  res.send("Hello node38 youtube");
});

app.listen(port, () => {
  console.log(`BE starting with port ${port}`);
});

// npm install cloudinary multer multer-storage-cloudinary
// cloudinary -> thư viện giúp mình tương tác với cloudinary server
// multer -> thư viện giúp mình lấy được file từ local
// multer-storage-cloudinary -> thư viện trung gian giúp mình upload file từ local lên cloudinary
// npm i prisma @prisma/client
//  prisma -> ORM
// prisma/client -> lib giúp mình tương tác vs DB thông qua prisma

// B1: init prisma
// npx prisma init - yarn prisma init

// B2: pull model từ mysql
// npx prisma db pull - yarn prisma db pull

// B3: tạo prisma client để tương tác với sql
// npx prisma generate - yarn prisma generate

// B4: copy code từ terminal và sử dụng
