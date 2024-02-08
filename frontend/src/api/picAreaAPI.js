import axios from "axios";
import { HOST_URL } from "./URL";

const getToken = () => localStorage.getItem("ACCESS_TOKEN");

export const getAllPICArea = () =>
  axios.get(`${HOST_URL}/api/v1/pic-areas`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
