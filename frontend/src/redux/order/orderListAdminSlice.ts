import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { rootState } from "../index"

export const fetchAdminOrderList = createAsyncThunk(
  "orderListAdmin/getOrders",
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

      const { data } = await axios.get(`/api/orders`, config)

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

const orderListAdminSlice = createSlice({
  name: "orderListAdmin",
  initialState: initialState,

  reducers: {
    resetOrderListAdmin: () => initialState,
  },

  extraReducers: (builder) => {
    builder.addCase(fetchAdminOrderList.pending, (state, action) => ({
      error: "",
      loading: true,
      orderList: [] as any[],
    }))

    builder.addCase(fetchAdminOrderList.rejected, (state, action) => ({
      loading: false,
      error: action.payload as string,
      orderList: [] as any[],
    }))

    builder.addCase(fetchAdminOrderList.fulfilled, (state, action) => ({
      error: "",
      loading: false,
      orderList: action.payload,
    }))
  },
})

const { reducer: orderListAdminReducer } = orderListAdminSlice
export const { resetOrderListAdmin } = orderListAdminSlice.actions
export default orderListAdminReducer
