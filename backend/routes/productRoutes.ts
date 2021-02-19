import express from "express"
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  createProductReview,
} from "../controllers/productController"
import { protect, admin } from "../middleware/authMiddleware"

const router = express.Router()
router.route("/").get(getAllProducts).post(protect, admin, createProduct)
router
  .route("/:id")
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct)
router.route("/:id/reviews").post(protect, createProductReview)

export default router
