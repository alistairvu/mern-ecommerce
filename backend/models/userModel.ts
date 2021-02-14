import mongoose, { Schema } from "mongoose"
import bcrypt from "bcryptjs"

export interface UserSchema extends mongoose.Document {
  name: string
  email: string
  password: string
  isAdmin?: boolean
  matchPassword: (arg0: any) => any
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

userSchema.pre("save", async function (this: UserSchema, next: any) {
  if (!this.isModified("password")) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.matchPassword = async function (
  this: UserSchema,
  enteredPassword: string
) {
  return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model<UserSchema>("User", userSchema)

export default User
