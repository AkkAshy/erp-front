import { api } from "@/shared/api/base/client";
import type { RegisterData } from "./types";

export const sessionApi = {
  login: (data: { username: string; password: string }) =>
    api.post("/users/login/", data),

  register: (data: RegisterData) => api.post("/users/register/", data),

  refresh: () => api.post("/users/token/refresh/"),
};
