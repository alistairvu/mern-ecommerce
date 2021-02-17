import express from "express"
import {
  deleteProduct,
  getAllProducts,
  getProductById,
} from "../controllers/productController"
import { protect, admin } from "../middleware/authMiddleware"

const router = express.Router()
router.route("/").get(getAllProducts)
router.route("/:id").get(getProductById).delete(protect, admin, deleteProduct)

export default router
