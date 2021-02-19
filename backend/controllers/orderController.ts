import { Request } from "express"
import mongoose from "mongoose"
import asyncHandler from "express-async-handler"
import Order from "../models/orderModel"
import { UserSchema } from "../models/userModel"

interface UserRequest extends Request {
  user: UserSchema
}

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = asyncHandler(async (req: UserRequest, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: "Invalid request" })
    return
  }

  const order = new Order({
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    user: req.user._id,
  })
  const createdOrder = await order.save()
  res.status(201).json(createdOrder)
})

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req: UserRequest, res) => {
  const { id } = req.params
  const order = await Order.findById(id).populate("user", "name email")
  const rawOrder = await Order.findById(id)

  if (order) {
    if (
      rawOrder.user.toString() === req.user._id.toString() ||
      req.user.isAdmin
    ) {
      res.json(order)
    } else {
      res.status(400).json({ message: "You cannot view this order." })
    }
  } else {
    res.status(404).json({ message: "Order not found" })
  }
})

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = asyncHandler(async (req: UserRequest, res) => {
  const { id } = req.params
  const order = await Order.findById(id)

  if (order) {
    order.isPaid = true
    order.paidAt = new Date()
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    }

    const updatedOrder = await order.save()

    res.json(updatedOrder)
  } else {
    res.status(404).json({ message: "Order not found" })
  }
})

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/delivered
// @access  Private
export const updateOrderToDelivered = asyncHandler(
  async (req: UserRequest, res) => {
    const { id } = req.params
    const order = await Order.findById(id)

    if (order) {
      order.isDelivered = true
      order.deliveredAt = new Date()
      const updatedOrder = await order.save()
      res.json(updatedOrder)
    } else {
      res.status(404).json({ message: "Order not found" })
    }
  }
)

// @desc    Get logged in user's orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = asyncHandler(async (req: UserRequest, res) => {
  console.log(req.user)
  const orders = await Order.find({ user: req.user._id })
  res.json(orders)
})

// @desc    Get logged in user's orders
// @route   GET /api/orders/
// @access  Private - Admin
export const getOrders = asyncHandler(async (req: UserRequest, res) => {
  const orders = await Order.find({}).populate("user", "name email")
  res.json(orders)
})
