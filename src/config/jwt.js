import jwt from "jsonwebtoken";
import sequelize from "../models/connect.js";
import initModels from "../models/init-models.js";
const conn = initModels(sequelize);

const createToken = (data) => {
  return jwt.sign(data, "NODE38", { expiresIn: "1y" });
};

// prisma dễ hơn sequelize
// code ngắn hơn, support code first và db first
// sequelize-auto ....
// yarn prisma db pull
// yarn prisma generate -> connect trực tiếp tới db
// prisma dùng chuỗi kết nối tới db
// sequelize, import object sequelize(chuỗi kết nối) và init-model

const checkToken = (token) => {
  // zxczxczxczxczxczxasdasdwfqwfqwfqwf => {user_id: 7}, iat: ....., exp:......
  return jwt.verify(token, "NODE38", (err, decoded) => {
    if (err) {
      // nếu giải mã thất bại -> sẽ có error message
      return {
        statusCode: 401, // 401 - unauthorized
        message: "Invalid token",
      };
    }
    // giải mã thành công
    return {
      statusCode: 200,
      data: decoded,
    };
  });
};

const khoaApi = async (req, res, next) => {
  // nếu thỏa yêu cầu của middleware thì bypass
  let { token } = req.headers;
  // kiểm trả có token trên header
  if (token) {
    let verifyToken = checkToken(token);
    if (verifyToken.statusCode == 401) {
      res.status(401).send("Invalid token");
      return;
    }
    // nếu muốn check role
    let { user_id } = verifyToken.data;

    // check user_id có tồn tại trong DB hay không ?
    let checkUser = await conn.users.findOne({
      where: {
        user_id: user_id,
      },
    });
    if (!checkUser) {
      res.status(401).send("Invalid token");
      return;
    }
    // handle logic ở đây
    next(); // bypass
  } else {
    res.status(401).send("Unauthorized");
    return;
  }
};

export { createToken, checkToken, khoaApi };
