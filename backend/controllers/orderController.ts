import { Request } from "express"
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
    name: req.user._id,
  })
  const createdOrder = await order.save()
  res.status(201).json(createdOrder)
})
