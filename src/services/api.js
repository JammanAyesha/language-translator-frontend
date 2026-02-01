import axios from "axios";

// Create Axios instance
const API = axios.create({
  baseURL: "https://language-translation-backend-z7xf.onrender.com/api/",
  headers: {
    "Content-Type": "application/json", // ensures backend parses JSON correctly
  },
});

// Request interceptor to add JWT automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access"); // make sure this matches where you store it

    // Don't attach token to login or register requests
    if (token && !config.url.includes("login") && !config.url.includes("register")) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: response interceptor to handle common errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Example: automatically log 401 errors
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized request – token may have expired.");
    }

    // Example: handle 503 errors
    if (error.response && error.response.status === 503) {
      console.warn("Translation service is unavailable.");
    }

    return Promise.reject(error);
  }
);

export default API;
