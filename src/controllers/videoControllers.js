import sequelize from "../models/connect.js";
import initModels from "../models/init-models.js";
import { Sequelize } from "sequelize";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const Op = Sequelize.Op;
const conn = initModels(sequelize);

const getVideo = async (req, res) => {
  let { page, size } = req.params;
  let { videoName } = req.query;
  // console.log(videoName);
  let num_page = Number(page);
  let num_size = Number(size);
  let index = (num_page - 1) * num_size;

  try {
    //   let data = await conn.video.findAll({
    //     include: ["video_likes", "video_comments"],
    //   });
    //   res.send(data);
    // } catch (error) {
    //   res.send(`BE error: ${error}`);

    // let data = await conn.video.findAll({
    //   limit: num_size, // giới hạn số lượng data cần lấy
    //   offset: index, // lấy data bắt đầu từ vị trí thứ index
    // });

    if (!videoName) {
      videoName = "";
    }

    // let data = await conn.video.findAll({
    //   where: {
    //     video_name: {
    //       [Op.like]: `%${videoName}%`,
    //     },
    //   },
    //   limit: num_size,
    //   offset: index,
    // });

    // let data = await conn.video_like.findAll({
    //     include: ["video"]
    // })

    // prisma
    // skip <==> offset
    // take <===> limit
    // findMany (prisma) <===> findAll (sequelize)
    let data = await prisma.video.findMany({
      // where: {
      //   video_name: {
      //     contains: videoName,
      //   },
      // },
      // skip: index,
      // take: num_size,
    });

    res.send(data);
  } catch (error) {
    res.send(`BE error: ${error}`);
  }
};

const createVideo = async (req, res) => {
  try {
    let { video_name, thumnail, description, user_id, type_id } = req.body;
    let newData = {
      video_name,
      thumbnail: thumnail,
      description,
      user_id,
      type_id,
    };
    // await conn.video.create(newData);

    // prisma
    await prisma.video.create({
      data: newData,
    });

    res.send("Create video successful");
  } catch (error) {
    res.send(`BE error: ${error}`);
  }
};

// const deleteVideo = async (req, res) => {
//   try {
//     let { videoId } = req.params;
//     await conn.video.destroy({
//       // bắt buộc phải có where
//       where: {
//         video_id: videoId,
//       },
//     });
//     res.send("Delete video successful");
//   } catch (error) {
//     res.send(`BE error: ${error}`);
//   }
// };

const deleteVideo = async (req, res) => {
  try {
    let { videoId } = req.params;
    // await conn.video.destroy({
    //     where: {
    //         video_id: videoId,
    //     }
    // });
    let { video_name, thumnail, desc, user_id, type_id } = req.body;
    let updateData = {
      video_name,
      thumnail,
      description: desc,
      user_id,
      type_id,
    };
    // await conn.video.update(updateData, {
    //     where: {
    //         video_id: videoId
    //     }
    // });

    // prisma
    await prisma.video.update({
      where: {
        video_id: +videoId, // ép kiểu string => number
      },
      data: updateData,
    });
    res.send("Update video successfull!");
  } catch (error) {
    res.send(`BE error: ${error}`);
  }
};

const updateVideo = async (req, res) => {
  try {
    let { videoId } = req.params;
    let { video_name, thumnail, description, user_id, type_id } = req.body;
    let updateData = {
      video_name,
      thumnail,
      description,
      user_id,
      type_id,
    };
    await conn.video.update(updateData, {
      where: {
        video_id: videoId,
      },
    });
    res.send("Update video successful");
  } catch (error) {
    res.send(`BE error: ${error}`);
  }
};

export { getVideo, createVideo, deleteVideo, updateVideo };
