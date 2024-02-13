import axios from "axios";

const token = localStorage.getItem("token");

const instance = axios.create({
  baseURL: "http://localhost:8080/qiri/",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const postComment = async (data) => {
  return await instance.post("post/comments", data);
};

export const putComment = async (data) => {
  return await instance.put("post/comments", data);
};

export const delComment = async (data) => {
  return await instance.put("post/comments/delete", data);
};

export const getComment = async (userId) => {
  return await instance.get(`comments/get/${userId}`);
};

export const getComments = async (id) => {
  return await instance.get("public/post/" + id + "/comments");
};

export const getCommentCount = async (id) => {
  return await instance.get("public/post/" + id + "/comment");
};
