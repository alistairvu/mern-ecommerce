import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const fetchProductDetail = createAsyncThunk(
  "productDetail/fetchProductDetail",
  async (id: string, thunkApi) => {
    try {
      const { data } = await axios.get(
        `http://localhost:6960/api/products/${id}`
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

const productDetailSlice = createSlice({
  name: "productDetail",
  initialState: {
    product: {} as ProductInterface,
    error: "",
    loading: true,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(fetchProductDetail.pending, (state, action) => ({
      ...state,
      loading: true,
      product: {} as ProductInterface,
    }))

    builder.addCase(fetchProductDetail.rejected, (state, action) => ({
      ...state,
      loading: false,
      error: action.payload as string,
    }))

    builder.addCase(fetchProductDetail.fulfilled, (state, action) => ({
      error: "",
      loading: false,
      product: action.payload,
    }))
  },
})

const { reducer: productDetailReducer } = productDetailSlice
export default productDetailReducer
