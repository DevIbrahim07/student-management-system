import api from "@/services/api";

export const fetchSubjects = async (params = {}) => {
  const response = await api.get("/subjects", { params });
  return response.data;
};
