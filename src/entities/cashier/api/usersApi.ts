import { api } from "@/shared/api/base/client";

export const usersApi = {
  // get all
  filterUsers: (id?: number | string, name?: string, is_active?: boolean) =>
    api.get(`/users/users/${id}`, { params: { name, is_active } }),

  // get profile
  profileInfo: () => api.get("/users/profile/"),

  toggleActiveUser: (data: { is_active: boolean; id: number }) =>
    api.patch(`/users/users/${data.id}/`, { is_active: data.is_active }),

  createUser: (data: {
    username: string;
    password: string;
    first_name: string;
    last_name?: string;
    phone: string;
    role: string;
    store?: number;  // Опционально - по умолчанию магазин создателя
    email?: string;
    sex?: string | null;
  }) => api.post("/users/users/", data),

  // update profile
  updateProfile: (data: {
    first_name: string;
    last_name: string;
    employee: { phone: string; sex: string };
  }) => api.patch("/users/profile-update/", data),

  // update user
  updateUser: (data: {
    id: number | string;
    username: string;
    password: string;
    email?: string;
    full_name?: string;
    first_name?: string;
    last_name?: string;
    phone: string;
    sex: string;
  }) => api.patch(`/users/users/${data.id}/`, data),
};
