import axios from "axios";

const api = axios.create({
  baseURL: "/", // same domain
  withCredentials: true, // 🔥 allows cookies
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
