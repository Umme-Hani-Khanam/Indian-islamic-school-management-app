import axios from 'axios';

const API_BASE = 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

const authHeaders = (token: string) => ({ headers: { Authorization: `Bearer ${token}` } });

export const login = async (identifier: string, password: string) => {
  const response = await api.post('/auth/login', { identifier, password });
  return response.data;
};

export const fetchClasses = async (token: string) => {
  const response = await api.get('/classes', authHeaders(token));
  return response.data;
};

export const fetchClassStudents = async (classId: string, token: string) => {
  const response = await api.get(`/classes/${classId}/students`, authHeaders(token));
  return response.data;
};

export const fetchStudentProfile = async (studentId: string, token: string) => {
  const response = await api.get(`/students/profile/${studentId}`, authHeaders(token));
  return response.data;
};

export default api;
