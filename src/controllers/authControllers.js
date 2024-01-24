import sequelize from "../models/connect.js";
import initModels from "../models/init-models.js";
import bcrypt from "bcrypt"; // thư viện mã hóa password
import { createToken } from "../config/jwt.js";

const conn = initModels(sequelize);

const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    // check email có tồn tại trong DB hay ko
    let data = await conn.users.findOne({
      where: {
        email: email,
      },
    });
    console.log(data);
    if (data) {
      // nếu tìm thấy user trong DB
      // trường hợp 1: nếu có trong DB -> tạo token
      // thư viện để tạo token -> jsonwebtoken
      // thư viện để mã hóa passoword -> bcrypt
      // npm i jsonwebtoken bcrypt
      // -----------------------

      // check password
      // nếu password đúng -> tạo token
      // ngược lại -> lỗi
      // compare password -> compareSync có 2 params
      // param 1: password nhận từ request (chưa mã hóa)
      // param 2: password đã mã hóa
      // return là true hoặc false
      console.log(data);
      let checkPassword = bcrypt.compareSync(password, data.pass_word);
      if (checkPassword) {
        let payload = {
          user_id: data.user_id,
        };
        // param 1: truyền payload (data mà mình muốn đưa vào token) -> JSON
        // params 2: secret key: khóa để tạo token, muốn giải mã thì phải có secret key thì
        // mới giải mã token
        // param 3: thời gian "sống" token: 5 phút -> 5m, 5 năm -> 5y
        let token = createToken(payload);
        res.status(200).send(token);
      } else {
        res.status(400).send("Password incorrect!");
      }
    } else {
      res.status(404).send("login fail");
    }
    // trường hợp 2: nếu ko có trong DB -> báo lỗi
    // res.send({email, password})
  } catch (error) {
    res.send(`Error: ${error}`);
  }
};

const signUp = async (req, res) => {
  try {
    let { username, email, password, role } = req.body;
    // kiểm tra user đã tồn tại trong DB
    let data = await conn.users.findOne({
      where: {
        email: email,
      },
    });

    // trường hợp 1: nếu có -> báo lỗi user đã tồn tại
    if (data) {
      res.status(400).send("User is existed!");
    } else {
      // mã hóa password trước khi create user
      // hashSync cos 2 params
      // param 1: password nhận từ request
      // param 2: số lần mã hóa password
      // lưu ý: 1 khi mà đã mã hóa password -> ko thể giải mã
      // phải dùng function có sẵn của bcrypt để compare
      let encodePassword = bcrypt.hashSync(password, 10);
      let newUser = {
        full_name: username,
        email,
        pass_word: encodePassword,
        role,
      };

      await conn.users.create(newUser);
      res.status(201).send("User is created");
    }

    // trường hợp 2: nếu chưa có -> tạo user

    // res.status(201).send("Sign up successfull");
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
  }
};

const loginFacebook = async (req, res) => {
  let { id, name, email } = req.body; // lấy face_app_id, name, email từ FE

  let newData = {
    full_name: name,
    email,
    face_app_id: id,
  };
  // tìm user dựa trên face_app_id lấy từ FE
  let checkUser = await conn.users.findOne({
    where: {
      face_app_id: id,
    },
  });

  // nếu user ko tồn tại -> create user -> tạo token -> trả về FE
  if (!checkUser) {
    await conn.users.create(newData);
    checkUser = await conn.users.findOne({
      where: {
        face_app_id: id,
      },
    });
  }
  // nếu user tồn tại -> tạo token -> trả về FE
  let token = createToken({ checkEmail: checkUser, pass_word: "" });
  res.send(token);
};

export { login, signUp, loginFacebook };
