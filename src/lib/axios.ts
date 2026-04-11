import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  withCredentials: true, // Crucial for Better Auth sessions/cookies across domains
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Basic global error logging - can be extended to handle 401 redirects if needed
    console.error("API Error Response:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
