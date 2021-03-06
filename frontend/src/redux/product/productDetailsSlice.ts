import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const fetchProductDetails = createAsyncThunk(
  "productDetails/fetchProductDetails",
  async (id: string, thunkApi) => {
    try {
      const { data } = await axios.get(`/api/products/${id}`)
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
  name: "productDetails",
  initialState: {
    product: {} as ProductInterface,
    error: "",
    loading: true,
  },

  reducers: {
    resetProductDetails: () => ({
      product: {} as ProductInterface,
      error: "",
      loading: true,
    }),
  },

  extraReducers: (builder) => {
    builder.addCase(fetchProductDetails.pending, (state, action) => ({
      ...state,
      loading: true,
      product: {} as ProductInterface,
    }))

    builder.addCase(fetchProductDetails.rejected, (state, action) => ({
      ...state,
      loading: false,
      error: action.payload as string,
    }))

    builder.addCase(fetchProductDetails.fulfilled, (state, action) => ({
      error: "",
      loading: false,
      product: action.payload,
    }))
  },
})

const { reducer: productDetailReducer } = productDetailSlice
export const { resetProductDetails } = productDetailSlice.actions
export default productDetailReducer
