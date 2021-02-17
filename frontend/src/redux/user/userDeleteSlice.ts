import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { rootState } from "../index"

export const deleteUser = createAsyncThunk(
  "userDelete/deleteUser",
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

      const { data } = await axios.delete(`/api/users/${id}`, config)

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

const userDeleteSlice = createSlice({
  name: "userDelete",
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(deleteUser.pending, (state, action) => ({
      loading: true,
      error: "",
      success: false,
    }))

    builder.addCase(deleteUser.fulfilled, (state, action) => ({
      loading: false,
      error: "",
      success: true,
    }))

    builder.addCase(deleteUser.rejected, (state, action) => ({
      loading: false,
      success: false,
      error: action.payload as string,
    }))
  },
})

const { reducer: userDeleteReducer } = userDeleteSlice
export default userDeleteReducer
