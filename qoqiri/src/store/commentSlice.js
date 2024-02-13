import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  postComment,
  putComment,
  delComment,
  getComments,
} from "../api/comment";

// redux-toolkit : createSlice 사용
// 비동기처리 : createAsyncThunk
// 댓글을 통해 CRUD 처리

// 댓글 조회 비동기 액션 생성
const viewComments = createAsyncThunk(
  "commentSlice/viewComments",
  async (id) => {
    const result = await getComments(id);
    return result.data;
  }
);

// 댓글 추가 비동기 액션 생성
const addComment = createAsyncThunk("commentSlice/addComment", async (data) => {
  const result = await postComment(data);
  return result.data;
});

// 댓글 수정 비동기 액션 생성
const updateComment = createAsyncThunk(
  "commentSlice/updateComment",
  async (data) => {
    const result = await putComment(data);
    return result.data;
  }
);

// 댓글 삭제 비동기 액션 생성
const deleteComment = createAsyncThunk(
  "commentSlice/deleteComment",
  async (data) => {
    const result = await delComment(data);
    return result.data;
  }
);

// 기존 리듀서라고 생각하면 됨!
// initialState로 초기값 설정, reducers는 기존 액션 함수 정의하는 곳이라 생각!
// extraReducers도 마찬가지! 다만 차이점은 extraReducers에 비동기 관련 정의를 해야 응답 받음
const commentSlice = createSlice({
  name: "commentSlice",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    // 만약 비동기 로딩이나 실패와 관련된 것도 추가하고 싶다면 -> pending, rejected 추가!

    // 댓글 조회 액션 성공시 상태 업데이트
    builder.addCase(viewComments.fulfilled, (state, action) => {
      return action.payload;
    });

    // 댓글 추가 액션 성공시 상태 업데이트
    builder.addCase(addComment.fulfilled, (state, action) => {
      if (action.payload.commentsParentSeq === null) {
        // 댓글 : 배열 시작 부분에 추가
        state.unshift(action.payload);
      } else {
        // 대댓글 : 해당 부모 댓글의 답글로 추가
        const index = state.findIndex(
          (comment) => comment.commentsSEQ === action.payload.commentsParentSeq
        );
        state[index].replies?.push(action.payload);
      }
    });

    // 댓글 수정 액션 성공시 상태 업데이트
    builder.addCase(updateComment.fulfilled, (state, action) => {
      return state;
    });

    // 댓글 삭제 액션 성공시 상태 업데이트
    builder.addCase(deleteComment.fulfilled, (state, action) => {
      return state;
    });

    // 댓글 삭제 액션 성공시 상태 업데이트
    // builder.addCase(deleteComment.fulfilled, (state, action) => {
    //   if (action.payload.commentsParentSeq === null) {
    //     // 댓글 : 해당 댓글을 배열에서 삭제
    //     return state.filter(
    //       (item) => item.commentsSEQ !== action.payload.commentsSEQ
    //     );
    //   } else {
    //     // 대댓글 : 해당 부모 댓글의 답글에서 해당 댓글 삭제
    //     const index = state.findIndex(
    //       (comment) => comment.commentsSEQ === action.payload.commentsParentSeq
    //     );
    //     const replyIndex = state[index].replies.findIndex(
    //       (item) => item.commentsSEQ === action.payload.commentsSEQ
    //     );
    //     state[index].replies.splice(replyIndex, 1);
    //   }
    // });
  },
});

// 생성한 slice와 액션 생성자 export
export default commentSlice;
export { viewComments, addComment, updateComment, deleteComment };
