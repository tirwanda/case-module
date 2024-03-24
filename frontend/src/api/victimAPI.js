import axios from "axios";
import { HOST_URL } from "./URL";

const getToken = () => localStorage.getItem("ACCESS_TOKEN");

export const addVictim = (data) =>
  axios.post(`${HOST_URL}/api/v1/create-victim`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const getAllVictims = () =>
  axios.get(`${HOST_URL}/api/v1/victims`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const getVictimById = (victimId) =>
  axios.get(`${HOST_URL}/api/v1/victim/${victimId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const getVictimByIncidentId = (incidentId) =>
  axios.get(`${HOST_URL}/api/v1/victims/${incidentId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const deleteVictimById = (victimId) =>
  axios.delete(`${HOST_URL}/api/v1/victim/${victimId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
