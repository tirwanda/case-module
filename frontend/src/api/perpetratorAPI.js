import axios from "axios";
import { HOST_URL } from "./URL";

const getToken = () => localStorage.getItem("ACCESS_TOKEN");

export const addPerpetrator = (data) =>
  axios.post(`${HOST_URL}/api/v1/create-perpetrator`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const getAllPerpetrators = () =>
  axios.get(`${HOST_URL}/api/v1/perpetrators`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const getPerpetratorById = (perpetratorId) =>
  axios.get(`${HOST_URL}/api/v1/perpetrator/${perpetratorId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const getPerpetratorsByIncidentId = (incidentId) =>
  axios.get(`${HOST_URL}/api/v1/perpetrators/${incidentId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const deletePerpetratorById = (perpetratorId) =>
  axios.delete(`${HOST_URL}/api/v1/perpetrator/${perpetratorId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
