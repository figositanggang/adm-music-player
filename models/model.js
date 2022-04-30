import { Sequelize } from "sequelize";

const konek = new Sequelize("angelo_della_morte", "root", "", {
    host: "localhost",
    dialect: "mysql"
})

export default konek;