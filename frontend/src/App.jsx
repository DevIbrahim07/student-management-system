import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Students from "@/pages/Students";
import Subjects from "@/pages/Subjects";
import Marks from "@/pages/Marks";
import Attendance from "@/pages/Attendance";
import Analytics from "@/pages/Analytics";
import Unauthorized from "@/pages/Unauthorized";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useAuthStore } from "@/store/authStore";
import AppLayout from "@/components/layout/AppLayout";

const HomeRedirect = () => {
  const token = useAuthStore((state) => state.token);
  return <Navigate to={token ? "/dashboard" : "/login"} replace />;
};

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            element={
              <ProtectedRoute allowedRoles={["admin", "teacher", "student"]}>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/students"
              element={
                <ProtectedRoute allowedRoles={["admin", "teacher"]}>
                  <Students />
                </ProtectedRoute>
              }
            />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/marks" element={<Marks />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute allowedRoles={["admin", "teacher"]}>
                  <Analytics />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
