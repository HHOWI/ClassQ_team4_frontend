import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/qiri/",
});

export const postBlockUser = async (DTO) => {
  return await instance.post("blockUsers", DTO);
};

export const getBlockUser = async (id) => {
  return await instance.get(`blockUsers/${id}`);
};

export const deleteBlock = async (DTO) => {
  await instance.put("blockUsers/delete", DTO);
};
