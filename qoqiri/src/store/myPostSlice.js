import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getMyPostsNotMatched } from "../api/post";

const asyncMyPostNotMatched = createAsyncThunk(
  "myPostSlice/asyncMyPostNotMatched",
  async (id) => {
    const result = await getMyPostsNotMatched(id);
    return result.data;
  }
);

const myPostSlice = createSlice({
  name: "myPostSlice",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(asyncMyPostNotMatched.fulfilled, (state, action) => {
      return [...action.payload];
    });
  },
});

export default myPostSlice;
export { asyncMyPostNotMatched };
