import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const fetchProductList = createAsyncThunk(
  "productList/fetchProductList",
  async (pageNumber: string = "1", thunkApi) => {
    try {
      const { data } = await axios.get(`/api/products?pageNumber=${pageNumber}`)
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
  products: [] as ProductInterface[],
  pages: 1,
  page: 1,
  error: "",
  loading: false,
}

const productListSlice = createSlice({
  name: "productList",
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(fetchProductList.pending, (state, action) => ({
      ...initialState,
      loading: true,
    }))

    builder.addCase(fetchProductList.rejected, (state, action) => ({
      ...initialState,
      error: action.payload as string,
    }))

    builder.addCase(fetchProductList.fulfilled, (state, action) => ({
      ...initialState,
      products: action.payload.products,
      pages: action.payload.pages,
      page: action.payload.page,
    }))
  },
})

const { reducer: productListReducer } = productListSlice
export default productListReducer
