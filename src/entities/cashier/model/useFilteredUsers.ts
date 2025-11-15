import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { usersApi } from "../api/usersApi";
import type { Employees, User } from "../api/types";

export const useFilteredUsers = (filters: {
  id: number | string;
  name?: string;
  is_active?: boolean;
}): UseQueryResult<{ data: Employees }, Error> => {
  return useQuery({
    queryKey: ["users", filters],
    queryFn: () => usersApi.filterUsers(filters.id, filters.name, filters.is_active),
    staleTime: 5 * 60 * 1000,
  });
};

export const useUser = (filters: {
  id: number | string;
}): UseQueryResult<{ data: User }, Error> => {
  return useQuery({
    queryKey: ["users", filters],
    queryFn: () => usersApi.filterUsers(filters.id),
    staleTime: 5 * 60 * 1000,
  });
};
