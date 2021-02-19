import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { rootState } from "../index"

export const deliverOrder = createAsyncThunk(
  "orderDelivered/deliver",
  async (orderId: string, thunkApi) => {
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
        `/api/orders/${orderId}/delivered`,
        null,
        config
      )

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

const orderDeliveredSlice = createSlice({
  name: "orderDelivered",
  initialState: {
    loading: false,
    success: false,
    error: "",
  },

  reducers: {
    deliverOrderReset: () => ({
      loading: false,
      success: false,
      error: "",
    }),
  },

  extraReducers: (builder) => {
    builder.addCase(deliverOrder.pending, (state, action) => ({
      error: "",
      loading: true,
      success: false,
    }))

    builder.addCase(deliverOrder.rejected, (state, action) => ({
      loading: false,
      error: action.payload as string,
      success: false,
    }))

    builder.addCase(deliverOrder.fulfilled, (state, action) => ({
      error: "",
      loading: false,
      success: true,
    }))
  },
})

const { actions, reducer: orderDeliveredReducer } = orderDeliveredSlice
export const { deliverOrderReset } = actions
export default orderDeliveredReducer
