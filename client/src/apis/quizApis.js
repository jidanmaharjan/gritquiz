import axios from "axios";
import { baseUrl } from "./baseUrl";

export const getQuiz = async ({ limit, category }) => {
  // const token =
  //   localStorage.getItem("accessT") ||
  //   sessionStorage.getItem("accessT") ||
  //   null;
  const options = {
    method: "GET",
    url: `/v1/quizes/random?limit=${limit}`,
    params: {},
    // headers: { Authorization: "Bearer " + token },
    data: {},
  };
  const response = await axios.request(options);
  return response.data.data;
};

export const addQuiz = async ({ newQuizData }) => {
  const token =
    localStorage.getItem("accessT") ||
    sessionStorage.getItem("accessT") ||
    null;
  const options = {
    method: "POST",
    url: `/v1/quizes/new`,
    params: {},
    // headers: { Authorization: "Bearer " + token },
    data: newQuizData,
  };
  const response = await axios.request(options);
  return response.data.data;
};

export const getAllQuizes = async () => {
  const token =
    localStorage.getItem("accessT") ||
    sessionStorage.getItem("accessT") ||
    null;
  const options = {
    method: "GET",
    url: `/v1/quizes/all`,
    params: {},
    // headers: { Authorization: "Bearer " + token },
    data: {},
  };
  const response = await axios.request(options);
  return response.data.data;
};

export const deleteOneQuiz = async ({ id }) => {
  const token =
    localStorage.getItem("accessT") ||
    sessionStorage.getItem("accessT") ||
    null;
  const options = {
    method: "DELETE",
    url: `/v1/quizes/delete/${id}`,
    params: {},
    // headers: { Authorization: "Bearer " + token },
    data: {},
  };
  const response = await axios.request(options);
  return response.data.data;
};
