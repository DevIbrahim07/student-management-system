import api from "@/services/api";

export const fetchAttendance = async (params = {}) => {
  const response = await api.get("/attendance", { params });
  return response.data;
};

export const markAttendance = async (payload) => {
  const response = await api.post("/attendance", payload);
  return response.data;
};

export const getStudentAttendance = async (studentId, page = 1, limit = 5) => {
  const response = await api.get(`/attendance/student/${studentId}`, {
    params: { page, limit },
  });
  return response.data;
};

export const getAttendanceByDate = async (date) => {
  const response = await api.get(`/attendance/date/${date}`);
  return response.data;
};

export const getAttendanceSummary = async (studentId) => {
  const response = await api.get(`/attendance/summary/${studentId}`);
  return response.data;
};
