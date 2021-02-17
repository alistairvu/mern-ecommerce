import jwt from "jsonwebtoken"
import asyncHandler from "express-async-handler"
import User from "../models/userModel"

interface TokenData {
  id: string
  iat: number
  exp: number
}

export const protect = asyncHandler(async (req: any, res: any, next: any) => {
  let token: string

  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer ")
  ) {
    res.status(401).json({ message: "Not authorised, no token" })
    return
  }

  console.log("token found")

  try {
    token = req.headers.authorization.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as TokenData
    console.log(decoded.id)
    req.user = await User.findById(decoded.id).select("-password")
    next()
  } catch (error) {
    console.error(error)
    res.status(401).json({ message: "Not authorised, token failed" })
  }
})

export const admin = (req: any, res: any, next: any) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(401).json({ message: "Not authorised as admin" })
  }
}
