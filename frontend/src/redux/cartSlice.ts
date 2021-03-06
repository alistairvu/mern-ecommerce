import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

interface AddressInterface {
  address: string
  city: string
  postalCode: string
  country: string
}

export const addItemToCart = createAsyncThunk(
  "cart/addItem",
  async ({ id, quantity }: { id: string; quantity: number }, thunkApi) => {
    const { data } = await axios.get(`/api/products/${id}`)

    return {
      product: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
      countInStock: data.countInStock,
      quantity: quantity,
    }
  }
)

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [] as any[],
    loading: false,
    shippingAddress: {} as AddressInterface,
    paymentMethod: "",
  },

  reducers: {
    removeItemFromCart: (state, action) => {
      return {
        ...state,
        cartItems: state.cartItems.filter((x) => x.product !== action.payload),
      }
    },

    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload
    },

    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload
    },

    resetCart: (state) => ({ ...state, cartItems: [] as any[] }),
  },

  extraReducers: (builder) => {
    builder.addCase(addItemToCart.pending, (state) => {
      state.loading = true
    })

    builder.addCase(addItemToCart.fulfilled, (state: any, action: any) => {
      const item = action.payload
      const existItem = state.cartItems.find(
        (x: any) => x.product === item.product
      )

      if (existItem) {
        return {
          ...state,
          loading: false,
          cartItems: state.cartItems.map((x: any) =>
            x.product === existItem.product ? item : x
          ),
        }
      } else {
        state.cartItems.push(item)
        state.loading = false
      }
    })
  },
})

const { reducer: cartReducer } = cartSlice
export const {
  removeItemFromCart,
  saveShippingAddress,
  savePaymentMethod,
  resetCart,
} = cartSlice.actions
export default cartReducer
