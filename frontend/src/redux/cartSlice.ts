import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

export const addItemToCart = createAsyncThunk(
  "cart/addItem",
  async ({ id, quantity }: { id: string; quantity: number }, thunkApi) => {
    const { data } = await axios.get(`http://localhost:6960/api/products/${id}`)

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
  },

  reducers: {
    removeItemFromCart: (state, action) => {
      return {
        ...state,
        cartItems: state.cartItems.filter((x) => x.product !== action.payload),
      }
    },
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
export const { removeItemFromCart } = cartSlice.actions
export default cartReducer
