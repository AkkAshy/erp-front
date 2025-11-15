import { api } from "@/shared/api/base/client";
import type { OpenShiftRequest, CloseShiftRequest } from "./shiftTypes";

export const shiftApi = {
  // Открыть новую смену
  openShift: (data: OpenShiftRequest) =>
    api.post("/sales/shifts/open/", data),

  // Закрыть смену
  closeShift: (shiftId: number, data: CloseShiftRequest) =>
    api.post(`/sales/shifts/${shiftId}/close/`, data),

  // Получить текущую открытую смену
  getCurrentShift: () => api.get("/sales/shifts/current/"),

  // Получить список всех смен
  getAllShifts: (params?: {
    cashier?: number;
    store?: number;
    status?: "open" | "closed";
    ordering?: string;
    offset?: number;
    limit?: number;
  }) => api.get("/sales/shifts/", { params }),

  // Получить детали смены
  getShift: (shiftId: number) => api.get(`/sales/shifts/${shiftId}/`),

  // Обновить статистику продаж
  updateShiftStats: (shiftId: number) =>
    api.post(`/sales/shifts/${shiftId}/update_stats/`),
};
