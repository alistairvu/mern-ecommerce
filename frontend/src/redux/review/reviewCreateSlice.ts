import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { rootState } from ".."

export const createReview = createAsyncThunk(
  "reviewCreate/createReview",
  async (
    { id, review }: { id: string; review: { rating: number; comment: string } },
    thunkApi
  ) => {
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

      const { data } = await axios.post(
        `/api/products/${id}/reviews`,
        review,
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
    builder.addCase(createReview.pending, () => ({
      ...initialState,
      loading: true,
    }))

    builder.addCase(createReview.fulfilled, () => ({
      ...initialState,
      success: true,
    }))

    builder.addCase(createReview.rejected, (_, action) => ({
      ...initialState,
      error: action.payload as string,
    }))
  },
})

const { reducer: reviewCreateReducer } = reviewCreateSlice
export const { reviewCreateReset } = reviewCreateSlice.actions
export default reviewCreateReducer
