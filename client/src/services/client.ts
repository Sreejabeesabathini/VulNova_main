// services/client.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8000/api", // ✅ Use direct backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
