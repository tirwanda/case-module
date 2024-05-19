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

export const searchEmployee = (data) =>
  axios.post(`${HOST_URL}/api/v1/employee/search`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const addEmployee = (data) =>
  axios.post(`${HOST_URL}/api/v1/create-employee`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const updateEmployee = (data) =>
  axios.put(`${HOST_URL}/api/v1/employee/${data._id}`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const deleteEmployee = (id) =>
  axios.delete(`${HOST_URL}/api/v1/employee/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
