import { Sequelize } from "sequelize";
import dbConfig from "../config/db.config.js";

let { dbHost, dbPort, dbUser, dbPass, dbDialect, dbName } = dbConfig;

const sequelize = new Sequelize(dbName, dbUser, dbPass, {
  host: dbHost,
  port: dbPort,
  dialect: dbDialect,
});

// try{
//     await sequelize.authenticate(); // xác minh là đã connect tới database thành công hay chưa
//     console.log("Kết nối thành công");
// } catch (error) {
//     console.log("Kết nối thất bại!");
// }

export default sequelize;
