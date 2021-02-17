import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { rootState } from "../index"

export const payOrder = createAsyncThunk(
  "orderPay/pay",
  async (
    { orderId, paymentResult }: { orderId: string; paymentResult: any },
    thunkApi
  ) => {
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

      const { data } = await axios.put(
        `/api/orders/${orderId}/pay`,
        paymentResult,
        config
      )

      console.log(data)
      thunkApi.dispatch({
        type: "orderDetails/fetchOrderDetails/success",
        payload: data,
      })
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

const orderPaySlice = createSlice({
  name: "orderPay",
  initialState: {
    loading: false,
    success: false,
    error: "",
  },

  reducers: {
    payOrderReset: () => ({
      loading: false,
      success: false,
      error: "",
    }),
  },

  extraReducers: (builder) => {
    builder.addCase(payOrder.pending, (state, action) => ({
      error: "",
      loading: true,
      success: false,
    }))

    builder.addCase(payOrder.rejected, (state, action) => ({
      loading: false,
      error: action.payload as string,
      success: false,
    }))

    builder.addCase(payOrder.fulfilled, (state, action) => ({
      error: "",
      loading: false,
      success: true,
    }))
  },
})

const { actions, reducer: orderPayReducer } = orderPaySlice
export const { payOrderReset } = actions
export default orderPayReducer
