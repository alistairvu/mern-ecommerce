import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const fetchProductList = createAsyncThunk(
  "productList/fetchProductList",
  async (_, thunkApi) => {
    try {
      const { data } = await axios.get("http://localhost:6960/api/products")
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

const productListSlice = createSlice({
  name: "productList",
  initialState: {
    products: [] as ProductInterface[],
    error: "",
    loading: true,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(fetchProductList.pending, (state, action) => ({
      ...state,
      loading: true,
      products: [],
    }))

    builder.addCase(fetchProductList.rejected, (state, action) => ({
      ...state,
      loading: false,
      error: action.payload as string,
    }))

    builder.addCase(fetchProductList.fulfilled, (state, action) => ({
      error: "",
      loading: false,
      products: action.payload,
    }))
  },
})

const { reducer: productListReducer } = productListSlice
export default productListReducer
