import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (
    {
      name,
      email,
      password,
    }: { name: string; email: string; password: string },
    thunkApi
  ) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      }

      const { data } = await axios.post(
        "http://localhost:6960/api/users",
        { name, email, password },
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

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (
    { email, password }: { email: string; password: string },
    thunkApi
  ) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      }

      const { data } = await axios.post(
        "http://localhost:6960/api/users/login",
        { email, password },
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

const blankUser = {
  _id: "",
  name: "",
  email: "",
  isAdmin: false,
  token: "",
}

const initialState = {
  loading: false,
  error: "",
  userInfo: blankUser,
}

const userAuthSlice = createSlice({
  name: "user",
  initialState: initialState,

  reducers: {
    userLogout: () => initialState,
  },

  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state, action) => ({
      error: "",
      userInfo: blankUser,
      loading: true,
    }))

    builder.addCase(loginUser.rejected, (state, action) => ({
      loading: false,
      userInfo: blankUser,
      error: action.payload as string,
    }))

    builder.addCase(loginUser.fulfilled, (state, action) => ({
      loading: false,
      userInfo: action.payload,
      error: "",
    }))

    builder.addCase(registerUser.pending, (state, action) => ({
      error: "",
      userInfo: blankUser,
      loading: true,
    }))

    builder.addCase(registerUser.rejected, (state, action) => ({
      loading: false,
      userInfo: blankUser,
      error: action.payload as string,
    }))

    builder.addCase(registerUser.fulfilled, (state, action) => ({
      loading: false,
      userInfo: action.payload,
      error: "",
    }))
  },
})

const { actions, reducer: userAuthReducer } = userAuthSlice
export const { userLogout } = actions
export default userAuthReducer
