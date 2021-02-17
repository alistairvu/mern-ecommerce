import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { rootState } from ".."

export const fetchOrderDetails = createAsyncThunk(
  "orderDetails/fetchOrderDetails",
  async (id: string, thunkApi) => {
    const {
      currentUser: { userInfo },
    } = thunkApi.getState() as rootState

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.get(
        `http://localhost:6960/api/orders/${id}`,
        config
      )

      console.log(data)
      return data
    } catch (error) {
      console.log(error)
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      return thunkApi.rejectWithValue(message)
    }
  }
)

interface OrderInterface {
  user: {
    _id: string
    name: string
    email: string
  }
  orderItems: {
    name: string
    quantity: number
    image: string
    price: number
    product: string
  }[]
  shippingAddress: {
    address: string
    city: string
    postalCode: string
    country: string
  }
  paymentMethod: string
  paymentStatus?: {
    id: string
    status: string
    update_time: string
    email_address: string
  }
  itemsPrice: number
  taxPrice: number
  shippingPrice: number
  totalPrice: number
  isPaid: boolean
  paidAt?: Date
  isDelivered: boolean
  deliveredAt?: Date
  _id: string
}

const initialState = {
  loading: true,
  error: "",
  order: {} as OrderInterface,
}

const orderDetailsSlice = createSlice({
  name: "orderDetails",
  initialState: initialState,

  reducers: {
    resetOrderDetails: () => initialState,
  },

  extraReducers: (builder) => {
    builder.addCase(fetchOrderDetails.pending, (state, action) => ({
      error: "",
      loading: true,
      order: {} as OrderInterface,
    }))

    builder.addCase(fetchOrderDetails.rejected, (state, action) => ({
      loading: false,
      error: action.payload as string,
      order: {} as OrderInterface,
    }))

    builder.addCase(fetchOrderDetails.fulfilled, (state, action) => ({
      error: "",
      loading: false,
      order: action.payload,
    }))
  },
})

const { reducer: orderDetailsReducer } = orderDetailsSlice
export const { resetOrderDetails } = orderDetailsSlice.actions
export default orderDetailsReducer
