import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db"
import productRoutes from "./routes/productRoutes"
import userRoutes from "./routes/userRoutes"
import orderRoutes from "./routes/orderRoutes"

dotenv.config()

connectDB()

const app = express()
const PORT = process.env.PORT || 6960

app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
  res.send("API is running...")
})

app.use("/api/products", productRoutes)
app.use("/api/users", userRoutes)
app.use("/api/orders", orderRoutes)

app.listen(PORT, () =>
  console.log(`Experience the magic at http://localhost:${PORT}`)
)
