import { useEffect, useState } from "react";
import { getAccessToken, refreshTokens } from "@/shared/api/auth/tokenService";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // защита от утечек памяти при анмаунте

    const checkAuth = async () => {
      try {
        const token = getAccessToken();

        if (token) {
          if (isMounted) setIsAuthenticated(true);
        } else {
          // Если нет accessToken, пробуем обновить его
          const newToken = await refreshTokens();

          if (isMounted) {
            setIsAuthenticated(!!newToken);
          }
        }
      } catch (error) {
        console.error("Ошибка при проверке авторизации:", error);
        if (isMounted) setIsAuthenticated(false);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  return { isAuthenticated, isLoading };
};
