import api from "@/services/api";

export const fetchMarks = async (params = {}) => {
  const response = await api.get("/marks", { params });
  return response.data;
};

export const addMark = async (payload) => {
  const response = await api.post("/marks", payload);
  return response.data;
};

export const getStudentMarks = async (studentId = "", page = 1, limit = 5) => {
  const params = {
    page,
    limit,
  };
  if (studentId && studentId !== "") {
    params.studentId = studentId;
  }
  const response = await api.get("/marks", { params });
  return response.data;
};

export const getStudentAverage = async (studentId) => {
  const response = await api.get(`/marks/average/${studentId}`);
  return response.data;
};
