import api from "./axios";

// สำหรับสมัครสมาชิก (Register)
export const register = (userData) => api.post("/auth/register", userData);

// สำหรับล็อกอิน (Login)
export const login = (credentials) => api.post("/auth/login", credentials);

export const deleteUser = (id) => api.delete(`/users/${id}`);

// ฟังก์ชันดึงรายชื่อ User ทั้งหมดมาโชว์ในตาราง Admin
export const getAllUsers = () => api.get("/users");