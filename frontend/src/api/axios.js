
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the logged-in user's token to every API request.
API.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem("recipehub_user");

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const token = user.token || user.accessToken;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Could not read saved login details:", error);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
