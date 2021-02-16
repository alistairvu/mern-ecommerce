import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { rootState } from "."

export const getUserDetails = createAsyncThunk(
  "userDetails/getUserDetails",
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

      const { data } = await axios.get(
        `http://localhost:6960/api/users/${id}`,
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

export const updateUserDetails = createAsyncThunk(
  "userDetails/updateUserDetails",
  async (user: any, thunkApi) => {
    const {
      currentUser: { userInfo },
    } = thunkApi.getState() as rootState

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      const { data } = await axios.put(
        `http://localhost:6960/api/users/profile`,
        user,
        config
      )

      thunkApi.dispatch({
        type: "user/userLogin/fulfilled",
        payload: data,
      })

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

const blankUser = {
  _id: "",
  name: "",
  email: "",
  token: "",
}

const initialState = {
  loading: false,
  success: false,
  error: "",
  user: blankUser,
}

const userDetailsSlice = createSlice({
  name: "userDetails",
  initialState: initialState,

  reducers: {
    resetUserDetails: () => initialState,
  },

  extraReducers: (builder) => {
    builder.addCase(getUserDetails.pending, (state, action) => ({
      success: false,
      error: "",
      user: blankUser,
      loading: true,
    }))

    builder.addCase(getUserDetails.fulfilled, (state, action) => {
      return { success: false, loading: false, user: action.payload, error: "" }
    })

    builder.addCase(getUserDetails.rejected, (state, action) => ({
      success: false,
      loading: false,
      user: blankUser,
      error: action.payload as string,
    }))

    builder.addCase(updateUserDetails.pending, (state, action) => ({
      success: false,
      error: "",
      user: state.user,
      loading: true,
    }))

    builder.addCase(updateUserDetails.rejected, (state, action) => ({
      success: false,
      loading: false,
      user: state.user,
      error: action.payload as string,
    }))

    builder.addCase(updateUserDetails.fulfilled, (state, action) => ({
      success: true,
      loading: false,
      user: action.payload,
      error: "",
    }))
  },
})

const { reducer: userDetailsReducer } = userDetailsSlice
export const { resetUserDetails } = userDetailsSlice.actions
export default userDetailsReducer
