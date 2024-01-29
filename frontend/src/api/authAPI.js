import axios from "axios";
import jwtDecode from "jwt-decode";

const configHeaders = {
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
};

export const userSignIn = (userData) =>
  axios.post(
    `https://us-central1-case-module.cloudfunctions.net/server/api/v1/signin`,
    userData,
    configHeaders
  );
