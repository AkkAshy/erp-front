import { api } from "../base/client";

// let accessToken = "";

// export const setAccessToken = (token: string) => {
//   accessToken = token;
// };

// export const getAccessToken = () => accessToken;

// ===============================

export const setAccessToken = (token: string) => {
  localStorage.setItem("accessToken", token);
};

export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

// ===============================

export const setRefreshToken = (token: string) => {
  localStorage.setItem("refreshToken", token);
};

export const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};

export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

export const refreshTokens = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const res = await api.post("/api/stores/refresh-token/", {
      refreshToken,
    });
    const data = await res.data;

    if (!data.ok) {
      clearTokens();
      return null;
    }

    setAccessToken(data.accessToken);
    if (data.refreshToken) setRefreshToken(data.refreshToken);
    return data.accessToken;
  } catch {
    clearTokens();
    return null;
  }
};
