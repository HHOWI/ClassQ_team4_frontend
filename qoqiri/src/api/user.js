import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/qiri/userInfo/",
});

export const login = async (data) => {
  return await instance.post("signin", data);
};

export const getUser = async (userId) => {
  const response = await instance.get(`${userId}`);
  return response;
};

export const signUp = async (data) => {
  return await instance.post("signup", data);
};

export const findIdByEmail = async (data) => {
  return await instance.get("findIdByEmail", data);
};

export const editProfile = async (data) => {
  return await instance.put("editProfile", data);
};

export const uploadProfileImg = async (data) => {
  return await instance.post("uploadProfilePicture", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const userCategoryInfoRegister = async (data) => {
  return await instance.post("userCategoryInfo", data);
};

// 좋아요 버튼
export const userLike = async (data) => {
  return await instance.post("userlike", data);
};
