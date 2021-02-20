import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const fetchResults = createAsyncThunk(
  "productSearch/fetchResults",
  async (
    { keyword = "", pageNumber = "" }: { keyword: string; pageNumber: string },
    thunkApi
  ) => {
    try {
      const { data } = await axios.get(
        `/api/products?keyword=${keyword}&pageNumber=${pageNumber}`
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

const initialState = {
  products: [] as ProductInterface[],
  pages: 1,
  page: 1,
  error: "",
  loading: false,
}

const productSearchSlice = createSlice({
  name: "productSearch",
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(fetchResults.pending, (state, action) => ({
      ...initialState,
      loading: true,
    }))

    builder.addCase(fetchResults.rejected, (state, action) => ({
      ...initialState,
      error: action.payload as string,
    }))

    builder.addCase(fetchResults.fulfilled, (state, action) => ({
      ...initialState,
      products: action.payload.products,
      pages: action.payload.pages,
      page: action.payload.page,
    }))
  },
})

const { reducer: productSearchReducer } = productSearchSlice
export default productSearchReducer
