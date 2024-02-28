import axios from "axios";
import { HOST_URL } from "./URL";

const getToken = () => localStorage.getItem("ACCESS_TOKEN");

export const addIncident = (data) =>
  axios.post(`${HOST_URL}/api/v1/create-incident`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const getIncidents = () =>
  axios.get(`${HOST_URL}/api/v1/incidents`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const getIncident = (id) =>
  axios.get(`${HOST_URL}/api/v1/incident/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const updateIncident = (id, data) =>
  axios.put(`${HOST_URL}/api/v1/incident/${id}`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
