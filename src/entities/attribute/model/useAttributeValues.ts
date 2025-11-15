import { useQuery } from "@tanstack/react-query";
import { attributeApi } from "../api/attributeApi";

export const useAttributeValues = (params?: {
  attribute_type?: number;
  offset?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["attributeValues", params],
    queryFn: () => attributeApi.getAllValues(params),
    staleTime: 5 * 60 * 1000,
    enabled: !!params?.attribute_type,
  });
};
