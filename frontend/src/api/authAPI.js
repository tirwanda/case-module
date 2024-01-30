import axios from "axios";
import { HOST_URL } from "./URL";

const configHeaders = {
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
};

export const userSignIn = (userData) =>
  axios.post(`${HOST_URL}/api/v1/signin`, userData, configHeaders);
