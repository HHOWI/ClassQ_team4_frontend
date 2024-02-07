import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/qiri/",
});

// 백단 서버에 요청

// 게시물 추가
export const addPostAPI = async (data) => {
  //서버 주소와 클라이언트 주소는 다름
  return await instance.post("post", data);
};

// 게시물 수정
export const editPostAPI = async (data) => {
  try {
    const response = await instance.put("/post", data);
    console.log(response.config.data); // 확인용 로그
    return response;
  } catch (error) {
    console.error("updatePostAPI 에러 : ", error);
    throw error;
  }
};

// delete 방식 게시물 삭제
export const deletePost = async (postSEQ) => {
  return await instance.put("post/" + postSEQ);
};

// MatchingcategoryInfo 테이블로 저장하는 API
export const addMatchingAPI = async (data) => {
  return await instance.post("matchingCategoryInfo", data);
};

// MatchingcategoryInfo 불러오는 API
export const getMatchCate = async (id) => {
  return await instance.get("matchingCategoryInfo/" + id);
};

// MatchingcategoryInfo 삭제 API
export const deleteMatchingAPI = async (id) => {
  return await instance.delete(`/matchingCategoryInfo/deleteAll/${id}`);
};

// 첨부파일 경로와 postSEQ를 postAttachments 테이블로 저장하는 API
export const addAttachmentsAPI = async (formData) => {
  console.log(formData);
  const response = await instance.post("postAttachments", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// 게시물 하나에 대한 전체 postAttachments 조회
export const getAttachments = async (id) => {
  return await instance.get("postAttachments/" + id);
};

// postAttachments 전체조회
export const getAttachmentsAll = async () => {
  return await instance.get("postAttachments");
};
// 첨부 파일 삭제 API
export const deleteAttachmentsAPI = async (id) => {
  return await instance.delete(`/postAttachments/deleteAll/${id}`);
};

// 서버에 첨부한 첨부 파일 불러오기
export const getSelectAttach = async (id) => {
  return await instance.get(`/postAttachments/${id}`);
};

export const getSelectPlace = async (id) => {
  return await instance.get(`public/place/${id}`);
};

export const getSelectPlaceType = async (id) => {
  return await instance.get(`/placeType/${id}`);
};

export const getBoards = async () => {
  return await instance.get("public/board");
};

export const getPostList = async (page, board) => {
  let url = `public/post?page=${page}`;
  return await instance.get(url);
};

export const getPost = async (id) => {
  return await instance.get("public/post/" + id);
};

export const getPlace = async () => {
  return await instance.get("public/place");
};

export const getPlaceType = async () => {
  return await instance.get("public/placeType");
};

export const getComments = async (id) => {
  return await instance.get("public/post/" + id + "/comments");
};

export const getCommentCount = async (id) => {
  return await instance.get("public/post/" + id + "/comment");
};

export const getSearch = async (keyword) => {
  return await instance.get("public/post/search/" + keyword);
};

export const addPostLikeAPI = async (data) => {
  return await instance.post("postLike", data);
};

// 모든 게시글 가져오기
export const getPosts = async (
  page,
  userId,
  categoryTypeSEQ,
  placeSEQ,
  placeTypeSEQ
) => {
  return await instance.get("/public/post", {
    params: {
      page: page,
      userId: userId,
      categoryTypeSEQ: categoryTypeSEQ,
      placeSEQ: placeSEQ,
      placeTypeSEQ: placeTypeSEQ,
    },
  });
};

// 게시글 검색
export const getSearchResults = async (keyword) => {
  return await instance.get("/public/post?keyword=" + keyword);
};

// 모든 매칭카테고리 인포 가져오기
export const getMatchCategoryInfo = async () => {
  return await instance.get("/matchingCategoryInfo");
};

// 내가 쓴 매칭글 불러오기
export const getMyPosts = async (userId) => {
  return await instance.get(`post/get/${userId}`);
};

// 내가 쓴 매칭글 중 매칭중인 글만 불러오기
export const getMyPostsNotMatched = async (userId) => {
  return await instance.get(`post_not_matched/${userId}`);
};

// 매칭글 매칭완료 처리
export const matchedPost = async (postSEQ) => {
  try {
    return await instance.put("matched_post/" + postSEQ);
  } catch (error) {}
};

// 첨부 파일 불러오는 API
export const getAttach = async (id) => {
  return await instance.get("postAttachments/" + id);
};
export const deleteMatchingCategoryAPI = async (id) => {
  try {
    const response = await instance.delete(`/matchingCategoryInfo` + id);
    console.log("매칭 카테고리 정보 삭제 성공:", response.data);
  } catch (error) {
    console.error("매칭 카테고리 정보 삭제 중 오류 발생:", error);
    throw error;
  }
};

// 첨부 파일 삭제
export const deleteFileAPI = async (files) => {
  return await instance.post("deleteFiles", files);
};
