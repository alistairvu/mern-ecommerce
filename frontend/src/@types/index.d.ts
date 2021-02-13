interface ProductInterface {
  _id?: string
  name: string
  image: string
  description: string
  brand: string
  category: string
  price: number
  countInStock: number
  rating: number
  numReviews: number
}

interface UserInterface {
  _id?: string
  name: string
  email: string
  password: string
  isAdmin?: boolean
}
