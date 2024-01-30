import axios from "axios";

const getToken = () => localStorage.getItem("ACCESS_TOKEN");

export const getEmployes = () =>
  axios.get(`${process.env.REACT_APP_HOST_URL}/api/v1/employes`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
