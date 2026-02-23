import api from "@/services/api";

export const fetchStudents = async (params = {}) => {
  const response = await api.get("/students", { params });
  return response.data;
};

export const createStudent = async (payload) => {
  const response = await api.post("/students", payload);
  return response.data;
};

export const updateStudent = async (id, payload) => {
  const response = await api.put(`/students/${id}`, payload);
  return response.data;
};

export const deleteStudent = async (id) => {
  const response = await api.delete(`/students/${id}`);
  return response.data;
};
