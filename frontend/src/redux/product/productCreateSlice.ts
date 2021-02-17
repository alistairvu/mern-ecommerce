import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { rootState } from "../index"

export const createProduct = createAsyncThunk(
  "productCreate/createProduct",
  async (_, thunkApi) => {
    const {
      currentUser: { userInfo: user },
    } = thunkApi.getState() as rootState

    try {
      console.log(user.token)

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }

      const { data } = await axios.post(`/api/products`, null, config)

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
  product: {} as any,
}

const productCreateSlice = createSlice({
  name: "productCreate",
  initialState,

  reducers: {
    productCreateReset: () => initialState,
  },

  extraReducers: (builder) => {
    builder.addCase(createProduct.pending, (state, action) => ({
      loading: true,
      error: "",
      success: false,
      product: {} as any,
    }))

    builder.addCase(createProduct.fulfilled, (state, action) => ({
      loading: false,
      error: "",
      success: true,
      product: action.payload,
    }))

    builder.addCase(createProduct.rejected, (state, action) => ({
      loading: false,
      success: false,
      error: action.payload as string,
      product: {} as any,
    }))
  },
})

const { reducer: productCreate } = productCreateSlice
export const { productCreateReset } = productCreateSlice.actions
export default productCreate
