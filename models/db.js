require("dotenv").config()
const mongoose = require("mongoose")

mongoose.connect(process.env.DB_CONNECT)

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    unique: true,
  },
  hash: {
    type: String,
    require: true,
    unique: true,
  },
})

const UserModel = mongoose.model("user", userSchema)

module.exports = UserModel
