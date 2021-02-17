import path from "path"
import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db"
import productRoutes from "./routes/productRoutes"
import userRoutes from "./routes/userRoutes"
import orderRoutes from "./routes/orderRoutes"
import uploadRoutes from "./routes/uploadRoutes"

dotenv.config()

connectDB()

const app = express()
const PORT = process.env.PORT || 6960

app.use(express.json())
app.use(cors())

app.use("/uploads", express.static(path.join(path.resolve(), "/uploads")))

app.get("/api", (req, res) => {
  res.send("API is running...")
})

app.use("/api/products", productRoutes)
app.use("/api/users", userRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/upload", uploadRoutes)

app.get("/api/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID)
})

app.listen(PORT, () =>
  console.log(`Experience the magic at http://localhost:${PORT}`)
)
