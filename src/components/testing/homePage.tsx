import { useNavigate } from "react-router-dom";
import CustomButton from "../ui/button";
import { useAppDispatch } from "../../hooks/useRedux";
import { logoutThunk } from "../../store/users.thunks";

const HomePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate("/signup");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-background dark:bg-dark-background transition-colors duration-300">
      <div className="bg-light-card dark:bg-dark-card p-8 rounded-xl shadow-md text-center">
        <h1 className="text-xl font-semibold text-light-text dark:text-dark-text mb-6">
          Welcome! You're logged in 🎉
        </h1>

        <CustomButton label="Logout" onClick={handleLogout} type="button" />
      </div>
    </div>
  );
};

export default HomePage;
