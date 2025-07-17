import HomePage from "../pages/HomePage";
import SignUpForm from "../components/auth_Features/signUpForm";
import { Route, Routes } from "react-router-dom";
import VerifyEmailNotice from "../components/auth_Features/verifyEmailNotice";
import EmailVerification from "../components/auth_Features/verifyEmail";
import LoginForm from "../components/auth_Features/loginForm";
import ProfilePage from "../pages/ProfilePage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignUpForm />} />
      <Route path="/verify-email" element={<VerifyEmailNotice />} />
      <Route path="/verify" element={<EmailVerification />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/profile" element={<ProfilePage/>}/>
    </Routes>
  );
};

export default AppRoutes;
