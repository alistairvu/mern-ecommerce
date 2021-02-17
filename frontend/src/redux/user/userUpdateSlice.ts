import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { rootState } from "../index"
import { mergeUserDetails } from "./userDetailsSlice"

export const updateUser = createAsyncThunk(
  "userUpdate/updateUser",
  async (
    userInfo: { _id: string; name: string; email: string; isAdmin: boolean },
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

      const { data } = await axios.put(
        `/api/users/${userInfo._id}`,
        userInfo,
        config
      )

      thunkApi.dispatch(mergeUserDetails(userInfo))
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

const userUpdateSlice = createSlice({
  name: "userDelete",
  initialState,

  reducers: {
    resetUserUpdate: () => initialState,
  },

  extraReducers: (builder) => {
    builder.addCase(updateUser.pending, (state, action) => ({
      loading: true,
      error: "",
      success: false,
    }))

    builder.addCase(updateUser.fulfilled, (state, action) => ({
      loading: false,
      error: "",
      success: true,
    }))

    builder.addCase(updateUser.rejected, (state, action) => ({
      loading: false,
      success: false,
      error: action.payload as string,
    }))
  },
})

const { reducer: userUpdateReducer } = userUpdateSlice
export const { resetUserUpdate } = userUpdateSlice.actions
export default userUpdateReducer
