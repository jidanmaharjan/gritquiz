import axios from "axios";
import { baseUrl } from "./baseUrl";

export const userLogin = async ({ email }) => {
  const options = {
    method: "POST",
    url: "/v1/auth/login",
    params: {},
    headers: {},
    data: {
      email,
    },
  };
  const response = await axios.request(options);
  return response.data;
};

export const verifyOtp = async ({ email, otp }) => {
  const options = {
    method: "POST",
    url: "/v1/auth/verifyotp",
    params: {},
    headers: {},
    data: {
      email,
      otp,
    },
  };
  const response = await axios.request(options);
  return response.data;
};

export const getProfile = async () => {
  const token =
    localStorage.getItem("accessT") ||
    sessionStorage.getItem("accessT") ||
    null;
  // if (token === null) {
  //   return null;
  // }
  const options = {
    method: "GET",
    url: "/v1/auth/profile",
    params: {},
    headers: { Authorization: "Bearer " + token },
    data: {},
  };
  const response = await axios.request(options);
  return response.data;
};

export const renewToken = async () => {
  const token =
    localStorage.getItem("refreshT") ||
    sessionStorage.getItem("refreshT") ||
    null;
  if (token === null) {
    return null;
  }
  const options = {
    method: "POST",
    url: "/v1/auth/renew",
    params: {},
    headers: {},
    data: {
      token,
    },
  };
  const response = await axios.request(options);
  return response.data;
};
