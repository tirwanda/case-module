import axios from "axios";
import { HOST_URL } from "./URL";

const getToken = () => localStorage.getItem("ACCESS_TOKEN");

export const addCallingLetter = (data) =>
  axios.post(`${HOST_URL}/api/v1/create-calling-letter`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const getAllCallingLetters = () =>
  axios.get(`${HOST_URL}/api/v1/calling-letters`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const getCallingLetterById = (callingLetterId) =>
  axios.get(`${HOST_URL}/api/v1/calling-letter/${callingLetterId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const getCallingLetterByIncidentId = (incidentId) =>
  axios.get(`${HOST_URL}/api/v1/calling-letter/incident/${incidentId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const updateCallingLetter = (callingLetterId, data) =>
  axios.put(`${HOST_URL}/api/v1/calling-letter/${callingLetterId}`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const deleteCallingLetterById = (callingLetterId) =>
  axios.delete(`${HOST_URL}/api/v1/calling-letter/${callingLetterId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
