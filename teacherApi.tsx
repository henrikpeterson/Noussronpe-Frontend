import axios from "axios";

const API_BASE_URL = 'http://192.168.1.76:8000';

const teacherApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

teacherApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("teacher_access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default teacherApi;