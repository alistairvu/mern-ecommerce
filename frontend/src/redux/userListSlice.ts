import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { rootState } from "."

export const fetchUserList = createAsyncThunk(
  "userList/fetchUserList",
  async (_, thunkApi) => {
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
        `http://localhost:6960/api/users/`,
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
  error: "",
  users: [] as any[],
}

const userListSlice = createSlice({
  name: "userList",
  initialState,

  reducers: {
    resetUserList: () => initialState,
  },

  extraReducers: (builder) => {
    builder.addCase(fetchUserList.pending, (state, action) => ({
      loading: true,
      error: "",
      users: [] as any[],
    }))

    builder.addCase(fetchUserList.fulfilled, (state, action) => ({
      loading: false,
      users: action.payload,
      error: "",
    }))

    builder.addCase(fetchUserList.rejected, (state, action) => ({
      loading: false,
      users: [] as any[],
      error: action.payload as string,
    }))
  },
})

const { reducer: userListReducer } = userListSlice
export const { resetUserList } = userListSlice.actions
export default userListReducer
