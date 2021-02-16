import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { rootState } from "."

export const fetchOrderList = createAsyncThunk(
  "orderList/getMyOrders",
  async (_, thunkApi) => {
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
        `http://localhost:6960/api/orders/my-orders`,
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

const initialState = {
  loading: true,
  error: "",
  orderList: [] as any[],
}

const orderListSlice = createSlice({
  name: "orderDetails",
  initialState: initialState,

  reducers: {
    resetOrderList: () => initialState,
  },

  extraReducers: (builder) => {
    builder.addCase(fetchOrderList.pending, (state, action) => ({
      error: "",
      loading: true,
      orderList: [] as any[],
    }))

    builder.addCase(fetchOrderList.rejected, (state, action) => ({
      loading: false,
      error: action.payload as string,
      orderList: [] as any[],
    }))

    builder.addCase(fetchOrderList.fulfilled, (state, action) => ({
      error: "",
      loading: false,
      orderList: action.payload,
    }))
  },
})

const { reducer: orderListReducer } = orderListSlice
export const { resetOrderList } = orderListSlice.actions
export default orderListReducer
