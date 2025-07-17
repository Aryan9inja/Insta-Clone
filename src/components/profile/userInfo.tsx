import CustomButton from "../ui/button";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux"; 
import { logoutThunk } from "../../store/users.thunks"; 
import { getProfileImgUrl } from "../../services/users.services";
import { useNavigate } from "react-router-dom";

export default function UserInfo() {
  const navigate=useNavigate()
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.users);

  const handleLogout = () => {
    dispatch(logoutThunk());
    navigate("/login")
  };

  return (
    <div className="pt-6 md:ml-60 px-4 md:px-8 min-h-[40vh] flex items-center justify-between gap-10">
      {/* Profile picture */}
      <div className="w-30 h-30 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-light-primary dark:border-dark-primary">
        <img
          src={getProfileImgUrl(user?.profile_Img!)}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>

      {/* User info */}
      <div className="flex flex-col justify-center items-start flex-1">
        <h2 className="text-xl md:text-2xl font-semibold text-light-primary dark:text-dark-primary">
          {user?.username}
        </h2>
        <p className="text-sm md:text-base text-light-text dark:text-dark-text mt-1">
          {user?.name}
        </p>

        <div className="mt-4">
          <CustomButton label="Logout" onClick={handleLogout} />
        </div>
      </div>
    </div>
  );
}
