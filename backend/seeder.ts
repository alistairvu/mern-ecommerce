import mongoose from "mongoose"
import colors from "colors"
import dotenv from "dotenv"
import users from "./data/users"
import products from "./data/products"
import User from "./models/userModel"
import Product from "./models/productModel"
import Order from "./models/orderModel"
import connectDB from "./config/db"

dotenv.config()

connectDB()

const importData = async () => {
  try {
    await Order.deleteMany()
    await Product.deleteMany()
    await User.deleteMany()

    const createdUsers = await User.insertMany(users)

    const adminUser = createdUsers[0]._id

    const sampleProducts = products.map((product) => ({
      ...product,
      user: adminUser,
    }))

    await Product.insertMany(sampleProducts)

    console.log("Data Imported!")
    process.exit()
  } catch (error) {
    console.error(error)
  }
}

const destroyData = async () => {
  try {
    await Order.deleteMany()
    await Product.deleteMany()
    await User.deleteMany()
    console.log("Data Destroyed!")
    process.exit()
  } catch (error) {
    console.error(error)
  }
}

if (process.argv[2] === "-d") {
  destroyData()
} else {
  importData()
}
