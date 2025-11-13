import { Routes, Route } from "react-router-dom";

import HomePage from "../pages/HomePage";
import RegisterPage from "../pages/Auth/RegisterPage";
import LoginPage from "../pages/Auth/LoginPage";
import ProjectsPage from "../pages/Dashboard/ProjectsPage";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import IssuesPage from "../pages/Dashboard/IssuesPage";
import ProjectDetailsPage from "../pages/Dashboard/ProjectDetailsPage";
import IssueDetailsPage from "../pages/Dashboard/IssueDetailsPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailsPage />} />
        <Route path="/issues" element={<IssuesPage />} />
        <Route path="/issues/:id" element={<IssueDetailsPage />} />
        <Route path="/members" element={<ProjectsPage />} />

        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
