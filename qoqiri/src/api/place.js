import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/qiri",
});

export const getPlace = async () => {
  return await instance.get("public/place");
};

export const getPlaceType = async () => {
  return await instance.get("public/placeType");
};

export const getSelectPlace = async (id) => {
  return await instance.get(`public/place/${id}`);
};

export const getSelectPlaceType = async (id) => {
  return await instance.get(`/placeType/${id}`);
};
