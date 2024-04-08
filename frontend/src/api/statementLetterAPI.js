import axios from "axios";
import { HOST_URL } from "./URL";

const getToken = () => localStorage.getItem("ACCESS_TOKEN");

export const addStatementLetter = (data) =>
  axios.post(`${HOST_URL}/api/v1/create-statement-letter`, data, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const getAllStatementLetter = () =>
  axios.get(`${HOST_URL}/api/v1/statement-letters`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const getStatementLetterById = (statementLetterId) =>
  axios.get(`${HOST_URL}/api/v1/statement-letter/${statementLetterId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const getStatementLettersByIncidentId = (incidentId) =>
  axios.get(`${HOST_URL}/api/v1/statement-letter-incident/${incidentId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const updateStatementLetter = (statementLetterId, data) =>
  axios.put(`${HOST_URL}/api/v1/statement-letter/${statementLetterId}`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const deleteStatementLetterById = (statementLetterId) =>
  axios.delete(`${HOST_URL}/api/v1/statement-letter/${statementLetterId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
