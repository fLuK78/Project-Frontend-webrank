import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages - General
import Competitions from "./pages/Competitions";
import CompetitionDetail from "./pages/CompetitionDetail";
import MyHistory from "./pages/MyHistory";
import Profile from "./pages/Profile";
import Payment from "./pages/Payment";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDetail from "./pages/admin/UserDetail";
import HowTo from "./pages/HowTo";
import Terms from "./pages/Terms";


// Pages - Admin
import AdminDashboard from "./pages/AdminDashboard";
import AdminCompetitions from "./pages/admin/Competitions";
import AdminRegistrations from "./pages/admin/Registrations";
import AdminUsers from "./pages/admin/AdminUsers";


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow bg-gray-50">
            <Routes>
              {/* --- Public & User Routes --- */}
              <Route path="/" element={<Competitions />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/how-to" element={<HowTo />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/competitions/:id" element={<CompetitionDetail />} />

              {/* --- Protected User Routes --- */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/my-history" element={<MyHistory />} />
              <Route path="/payment/:registrationId" element={<Payment />} />

              {/* --- Admin Routes --- */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/competitions" element={<AdminCompetitions />} />
              <Route path="/admin/registrations" element={<AdminRegistrations />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/users/:id" element={<UserDetail />} />



              {/* 404 Case (Optional) */}
              <Route path="*" element={<div className="py-20 text-center font-bold text-slate-400 uppercase tracking-widest">404 - Page Not Found</div>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}