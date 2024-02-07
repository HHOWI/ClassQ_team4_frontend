import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getBlockUser } from "../api/blockuser";

const asyncBlockUsers = createAsyncThunk(
  "blockUserSlice/asyncBlockUsers",
  async (code) => {
    const result = await getBlockUser(code);
    return result.data;
  }
);

const blockUserSlice = createSlice({
  name: "blockUserSlice",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(asyncBlockUsers.fulfilled, (state, action) => {
      return [...action.payload];
    });
  },
});

export default blockUserSlice;
export { asyncBlockUsers };
