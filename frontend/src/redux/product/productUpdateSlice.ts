import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { rootState } from "../index"

export const updateProduct = createAsyncThunk(
  "productUpdate/updateProduct",
  async (updateData: any, thunkApi) => {
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

      const { data } = await axios.put(
        `/api/products/${updateData.id}`,
        updateData,
        config
      )

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
  loading: true,
  success: false,
  error: "",
  product: {} as any,
}

const productUpdateSlice = createSlice({
  name: "productUpdate",
  initialState,

  reducers: {
    productUpdateReset: () => initialState,
  },

  extraReducers: (builder) => {
    builder.addCase(updateProduct.pending, (state, action) => ({
      loading: true,
      error: "",
      success: false,
      product: {} as any,
    }))

    builder.addCase(updateProduct.fulfilled, (state, action) => ({
      loading: false,
      error: "",
      success: true,
      product: action.payload,
    }))

    builder.addCase(updateProduct.rejected, (state, action) => ({
      loading: false,
      success: false,
      error: action.payload as string,
      product: {} as any,
    }))
  },
})

const { reducer: productUpdateReducer } = productUpdateSlice
export const { productUpdateReset } = productUpdateSlice.actions
export default productUpdateReducer
