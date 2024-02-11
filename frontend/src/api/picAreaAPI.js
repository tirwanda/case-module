import axios from "axios";
import { HOST_URL } from "./URL";

const getToken = () => localStorage.getItem("ACCESS_TOKEN");

export const addPICArea = (data) => {
  return axios.post(`${HOST_URL}/api/v1/create-pic-area`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

export const getAllPICArea = () =>
  axios.get(`${HOST_URL}/api/v1/pic-areas`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const getEmployesNotInPICArea = () => {
  return axios.get(`${HOST_URL}/api/v1/pic-area/employe-not-in-pic-area`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

export const updatePICArea = (data) =>
  axios.put(`${HOST_URL}/api/v1/pic-area/${data._id}`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const deletePICArea = (id) =>
  axios.delete(`${HOST_URL}/api/v1/pic-area/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
