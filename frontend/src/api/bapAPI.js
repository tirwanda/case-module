import axios from "axios";
import { HOST_URL } from "./URL";

const getToken = () => localStorage.getItem("ACCESS_TOKEN");

export const addBap = (data) =>
  axios.post(`${HOST_URL}/api/v1/create-bap`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const getAllBap = () =>
  axios.get(`${HOST_URL}/api/v1/baps`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const getBapById = (bapId) =>
  axios.get(`${HOST_URL}/api/v1/bap/${bapId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const getBapByIncidentId = (incidentId) =>
  axios.get(`${HOST_URL}/api/v1/bap/incident/${incidentId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const updateBap = (bapId, data) =>
  axios.put(`${HOST_URL}/api/v1/bap/${bapId}`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const deleteBapById = (bapId) =>
  axios.delete(`${HOST_URL}/api/v1/bap/${bapId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
