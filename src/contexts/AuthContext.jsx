import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");
      
      if (token && savedUser) {
        try {
          // ตรวจสอบว่าข้อมูลใน localStorage ไม่เน่า
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        } catch (e) {
          // ถ้า Parse ไม่ผ่าน ให้ล้างทิ้งทั้งหมด
          localStorage.clear();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      
      // ดึงข้อมูลจาก Backend (ตรวจสอบโครงสร้าง res.data ให้ตรงกับ Backend ของคุณ)
      const { token, user: userData } = res.data;
      
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      }
    } catch (err) {
      // ✅ สำคัญมาก: ต้อง throw err เพื่อให้ try-catch ในหน้า Login.jsx ทำงาน
      // และแสดง Message สีแดงๆ ที่เราทำไว้ได้
      throw err; 
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    // แนะนำ: ให้ยิง api ไปลบ session ที่ backend ด้วยถ้ามี
  };

  const register = async (formData) => {
    try {
      const res = await api.post("/auth/register", formData);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const updateUser = (newUserData) => {
    setUser((prev) => {
      const updatedData = { ...prev, ...newUserData };
      localStorage.setItem("user", JSON.stringify(updatedData));
      return updatedData;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading, updateUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};