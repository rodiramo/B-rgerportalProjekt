import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import HomePage from "../pages/HomePage";
import LoginPage from "../features/auth/LoginPage";
import RegisterPage from "../features/auth/RegisterPage";
import IdRenewalForm from "../features/idRenewal/IdRenewalForm";
import CitizenApplicationsPage from "../features/idRenewal/CitizenApplicationsPage";
import ClerkReviewPage from "../features/review/ClerkReviewPage";
import Protected from "../components/Protected";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      {
        path: "/apply/id-renewal",
        element: (
          <Protected roles={["citizen"]}>
            <IdRenewalForm />
          </Protected>
        ),
      },
      {
        path: "/applications",
        element: (
          <Protected roles={["citizen"]}>
            <CitizenApplicationsPage />
          </Protected>
        ),
      },
      {
        path: "/review",
        element: (
          <Protected roles={["clerk", "admin"]}>
            <ClerkReviewPage />
          </Protected>
        ),
      },
      { path: "*", element: <Navigate to="/" /> },
    ],
  },
]);
