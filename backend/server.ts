import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db"
import productRoutes from "./routes/productRoutes"

dotenv.config()

connectDB()

const app = express()
const PORT = process.env.PORT || 6960

app.use(cors())

app.get("/", (req, res) => {
  res.send("API is running...")
})

app.use("/api/products", productRoutes)

app.listen(PORT, () =>
  console.log(`Experience the magic at http://localhost:${PORT}`)
)
