import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { rootState } from ".."

export const createReview = createAsyncThunk(
  "reviewCreate/createReview",
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

const reviewCreateSlice = createSlice({
  name: "reviewCreate",
  initialState,

  reducers: {
    reviewCreateReset: () => initialState,
  },

  extraReducers: (builder) => {
    builder.addCase(createReview.pending, (state, action) => ({
      loading: true,
      error: "",
      success: false,
    }))

    builder.addCase(createReview.fulfilled, (state, action) => ({
      loading: false,
      error: "",
      success: true,
    }))

    builder.addCase(createReview.rejected, (state, action) => ({
      loading: false,
      success: false,
      error: action.payload as string,
    }))
  },
})

const { reducer: reviewCreateReducer } = reviewCreateSlice
export const { reviewCreateReset } = reviewCreateSlice.actions
export default reviewCreateReducer
