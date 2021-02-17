import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { rootState } from ".."

export const deleteProduct = createAsyncThunk(
  "productDelete/deleteProduct",
  async (id: string, thunkApi) => {
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

      const { data } = await axios.delete(`/api/products/${id}`, config)

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
  error: "",
}

const productDeleteSlice = createSlice({
  name: "productDelete",
  initialState,

  reducers: {
    productDeleteReset: () => initialState,
  },

  extraReducers: (builder) => {
    builder.addCase(deleteProduct.pending, (state, action) => ({
      loading: true,
      error: "",
      success: false,
    }))

    builder.addCase(deleteProduct.fulfilled, (state, action) => ({
      loading: false,
      error: "",
      success: true,
    }))

    builder.addCase(deleteProduct.rejected, (state, action) => ({
      loading: false,
      success: false,
      error: action.payload as string,
    }))
  },
})

const { reducer: produceDeleteReducer } = productDeleteSlice
export const { productDeleteReset } = productDeleteSlice.actions
export default produceDeleteReducer
