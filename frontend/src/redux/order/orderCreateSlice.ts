import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { rootState } from ".."

export interface OrderInterface {
  _id?: string
  orderItems: any[]
  shippingAddress: any
  paymentMethod: string
  itemsPrice: number
  taxPrice: number
  shippingPrice: number
  totalPrice: number
}

export const createOrder = createAsyncThunk(
  "order/create",
  async (order: OrderInterface, thunkApi) => {
    const {
      currentUser: { userInfo: user },
    } = thunkApi.getState() as rootState

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }

      const { data } = await axios.post(`/api/orders`, order, config)

      return data
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      return thunkApi.rejectWithValue(message)
    }
  }
)

const initialState = {
  loading: false,
  success: false,
  order: {} as OrderInterface,
  error: "",
}

const orderCreateSlice = createSlice({
  name: "order",
  initialState,

  reducers: {
    resetOrder: () => initialState,
  },

  extraReducers: (builder) => {
    builder.addCase(createOrder.pending, (state, action) => ({
      success: false,
      loading: true,
      error: "",
      order: {} as OrderInterface,
    }))

    builder.addCase(createOrder.fulfilled, (state, action) => ({
      success: true,
      loading: false,
      order: action.payload,
      error: "",
    }))

    builder.addCase(createOrder.rejected, (state, action) => ({
      success: false,
      loading: false,
      order: {} as OrderInterface,
      error: action.payload as string,
    }))
  },
})

const { reducer: orderCreateReducer } = orderCreateSlice
export const { resetOrder } = orderCreateSlice.actions
export default orderCreateReducer
