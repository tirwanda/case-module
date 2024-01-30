import axios from "axios";
import { HOST_URL } from "./URL";

const getToken = () => localStorage.getItem("ACCESS_TOKEN");

export const getEmployes = () =>
  axios.get(`${HOST_URL}/api/v1/employes`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
