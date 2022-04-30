import konektor from "./model.js"
import { DataTypes } from "sequelize"

const User = konektor.define("user", {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING
})

export default User