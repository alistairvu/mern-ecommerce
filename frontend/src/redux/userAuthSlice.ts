import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const userRegister = createAsyncThunk(
  "user/userRegister",
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

export const userLogin = createAsyncThunk(
  "user/userLogin",
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
  user: blankUser,
}

const userAuthSlice = createSlice({
  name: "user",
  initialState: initialState,

  reducers: {
    userLogout: () => initialState,
  },

  extraReducers: (builder) => {
    builder.addCase(userLogin.pending, (state, action) => ({
      error: "",
      user: blankUser,
      loading: true,
    }))

    builder.addCase(userLogin.rejected, (state, action) => ({
      loading: false,
      user: blankUser,
      error: action.payload as string,
    }))

    builder.addCase(userLogin.fulfilled, (state, action) => ({
      loading: false,
      user: action.payload,
      error: "",
    }))

    builder.addCase(userRegister.pending, (state, action) => ({
      error: "",
      user: blankUser,
      loading: true,
    }))

    builder.addCase(userRegister.rejected, (state, action) => ({
      loading: false,
      user: blankUser,
      error: action.payload as string,
    }))

    builder.addCase(userRegister.fulfilled, (state, action) => ({
      loading: false,
      user: action.payload,
      error: "",
    }))
  },
})

const { actions, reducer: userAuthReducer } = userAuthSlice
export const { userLogout } = actions
export default userAuthReducer
