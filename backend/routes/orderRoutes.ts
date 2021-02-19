import express from "express"
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
} from "../controllers/orderController"
import { protect, admin } from "../middleware/authMiddleware"

const router = express.Router()
router.route("/").post(protect, addOrderItems).get(protect, admin, getOrders)
router.route("/my-orders").get(protect, getMyOrders)
router.route("/:id").get(protect, getOrderById)
router.route("/:id/pay").put(protect, updateOrderToPaid)
router.route("/:id/delivered").put(protect, updateOrderToDelivered)

export default router
