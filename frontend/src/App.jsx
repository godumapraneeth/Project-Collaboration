import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import VerifyLogin from "./pages/Auth/VerifyLogin";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";
import ProfilePage from "./pages/ProfilePage";
import Layout from "./Layout";
import ProjectRoom from "./pages/ProjectRoom";
import ProtectedRoute from "./routes/ProtectedRoute"; 
import AcceptInvitePage from "./pages/AcceptInvite";
export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify/:token" element={<VerifyLogin />} />
      <Route path="/invite/accept" element={<AcceptInvitePage />} /> 

      {/* Protected routes (with Navbar/Layout) */}
      <Route element={<Layout />}>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/editor/:roomId" element={<Editor />} />
          <Route path="/project/:roomId" element={<ProjectRoom />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
