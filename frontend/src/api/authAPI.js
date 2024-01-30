import axios from "axios";

const configHeaders = {
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
};

export const userSignIn = (userData) =>
  axios.post(`${process.env.REACT_APP_HOST_URL}/api/v1/signin`, userData, configHeaders);
