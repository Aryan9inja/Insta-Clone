import HomePage from "../pages/HomePage";
import SignUpForm from "../components/auth_Features/signUpForm";
import { Route, Routes } from "react-router-dom";
import VerifyEmailNotice from "../components/auth_Features/verifyEmailNotice";
import EmailVerification from "../components/auth_Features/verifyEmail";
import LoginForm from "../components/auth_Features/loginForm";
import ProfilePage from "../pages/ProfilePage";
import ProtectedRoute from "../components/auth_Features/protectedRoute";
import UpdateProfileImgPage from "../pages/UpdateProfileImgPage";

const publicRoutes = [
  { path: "/signup", element: <SignUpForm /> },
  { path: "/login", element: <LoginForm /> },
  { path: "/verify-email", element: <VerifyEmailNotice /> },
  { path: "/verify", element: <EmailVerification /> },
];

const protectedRoutes = [
  { path: "/profile", element: <ProfilePage /> },
  { path: "/updateProfile", element: <UpdateProfileImgPage /> },
  { path: "/", element: <HomePage /> },
];

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      {publicRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}

      {/* Protected Routes */}
      {protectedRoutes.map(({ path, element }) => (
        <Route
          key={path}
          path={path}
          element={<ProtectedRoute children={element} />}
        />
      ))}
    </Routes>
  );
};

export default AppRoutes;
