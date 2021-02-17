import { Request } from "express"
import asyncHandler from "express-async-handler"
import Product from "../models/productModel"
import { UserSchema } from "../models/userModel"

interface UserRequest extends Request {
  user: UserSchema
}

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({})
  // res.status(401).json({ message: "Access denied" })
  res.json(products)
})

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    res.json(product)
  } else {
    res.status(404).json({ message: "No products found" })
  }
})

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private - admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    await product.remove()
    res.json({ message: "Product deleted" })
  } else {
    res.status(404).json({ message: "No products found" })
  }
})

// @desc    Create product
// @route   POST /api/products
// @access  Private - admin
export const createProduct = asyncHandler(async (req: UserRequest, res) => {
  const product = new Product({
    name: "Sample name",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "Sample brand",
    category: "Sample category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample description",
  })

  const createProduct = await product.save()

  res.status(201).json(createProduct)
})

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private - admin
export const updateProduct = asyncHandler(async (req: UserRequest, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
  } = req.body
  const product: any = await Product.findById(req.params.id)

  if (product) {
    product.name = name
    product.price = price
    product.description = description
    product.image = image
    product.brand = brand
    product.category = category
    product.countInStock = countInStock

    const updatedProduct = await product.save()
    res.json(updatedProduct)
  } else {
    res.status(404).json({ message: "Product not found" })
  }
})
