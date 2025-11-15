import { useMutation } from "@tanstack/react-query";
import { sessionApi } from "@/entities/session/api/sessionApi";
import { setAccessToken } from "@/shared/api/auth/tokenService";

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const res = await sessionApi.login(data);
      setAccessToken(res.data.access);

      localStorage.setItem("refreshToken", res.data.refresh);
    },
  });
};
