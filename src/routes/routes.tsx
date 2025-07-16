import HomePage from "../components/testing/homePage";
import SignUpForm from "../components/auth_Features/signUpForm";
import { Route, Routes } from "react-router-dom";
import VerifyEmailNotice from "../components/auth_Features/verifyEmailNotice";
import EmailVerification from "../components/auth_Features/verifyEmail";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignUpForm />} />
      <Route path="/verify-email" element={<VerifyEmailNotice />} />
      <Route path="/verify" element={<EmailVerification />} />
    </Routes>
  );
};

export default AppRoutes;
