import axios from "axios";
import { attachAuthInterceptor } from "../auth/authInterceptor";
import { API_BASE_URL } from "./config";

export const api = axios.create({
  baseURL: API_BASE_URL,
  // withCredentials: true, // для отправки refreshToken
});

attachAuthInterceptor(api);
