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

export const findUsersNotInInvestigators = (incidentId) =>
  axios.get(`${HOST_URL}/api/v1/user/not-investigator/${incidentId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const searchOptionsIncident = (data) =>
  axios.post(`${HOST_URL}/api/v1/incident/search`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const addInvestigator = (incidentId, userId) =>
  axios.put(
    `${HOST_URL}/api/v1/incident/add-investigator/${incidentId}/${userId}`,
    {},
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

export const deleteInvestigator = (incidentId, userId) =>
  axios.put(
    `${HOST_URL}/api/v1/incident/delete-investigator/${incidentId}/${userId}`,
    {},
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

export const updateIncident = (id, data) =>
  axios.put(`${HOST_URL}/api/v1/incident/${id}`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const updateIncidentByKaru = (id, data) =>
  axios.put(`${HOST_URL}/api/v1/incident/update-by-karu/${id}`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const deleteIncidentPicture = (incidentId, pictureId) =>
  axios.delete(`${HOST_URL}/api/v1/incident-picture/${incidentId}/${pictureId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

export const deleteEvidence = (incidentId, evidenceId) =>
  axios.delete(`${HOST_URL}/api/v1/evidence/${incidentId}/${evidenceId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
