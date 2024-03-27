import axios from "axios";
import { HOST_URL } from "./URL";

const getToken = () => localStorage.getItem("ACCESS_TOKEN");

export const addWitness = (data) =>
  axios.post(`${HOST_URL}/api/v1/create-witness`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const getAllWitnesses = () =>
  axios.get(`${HOST_URL}/api/v1/witnesses`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const getWitnessById = (witnessId) =>
  axios.get(`${HOST_URL}/api/v1/witness/${witnessId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const getWitnessByIncidentId = (incidentId) =>
  axios.get(`${HOST_URL}/api/v1/witnesses/${incidentId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const deleteWitnessById = (witnessId) =>
  axios.delete(`${HOST_URL}/api/v1/witness/${witnessId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
