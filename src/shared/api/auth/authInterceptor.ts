import axios from "axios";
import { getAccessToken, setAccessToken } from "./tokenService";
import { API_BASE_URL } from "../base/config";

let isRefreshing = false;
let queue: (() => void)[] = [];

export const attachAuthInterceptor = (api: ReturnType<typeof axios.create>) => {
  api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve) => {
            queue.push(() => resolve(api(originalRequest)));
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const { data } = await axios.post(
            `${API_BASE_URL}/api/stores/refresh-token/`,
            { refresh: localStorage.getItem("refreshToken") }
          );

          setAccessToken(data.access);
          if (data.refresh) {
            localStorage.setItem("refreshToken", data.refresh); // обязательно при ротации
          }
          queue.forEach((cb) => cb());
          queue = [];
          return api(originalRequest);
        } catch (err) {
          setAccessToken("");
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};
