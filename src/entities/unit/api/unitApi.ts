import { api } from "@/shared/api/base/client";

export const unitApi = {
  // get all
  getAll: () => api.get("/inventory/units/"),
};
