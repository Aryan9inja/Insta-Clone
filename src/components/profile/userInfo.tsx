import CustomButton from "../ui/button";
import { useAppDispatch } from "../../hooks/useRedux";
import { logoutThunk } from "../../store/thunks/users.thunks";
import { getProfileImgUrl } from "../../services/users.services";
import { useNavigate } from "react-router-dom";

interface UserInfoProps {
  profile_Img?: string;
  username?: string;
  name?: string;
}

export default function UserInfo({
  profile_Img,
  username,
  name,
}: UserInfoProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logoutThunk());
    navigate("/login");
  };

  return (
    <div className="pt-2 px-4 md:px-8 min-h-[25vh] flex items-center gap-10">
      {/* Profile picture */}
      <div className="w-30 h-30 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-light-primary dark:border-dark-primary">
        <img
          src={getProfileImgUrl(profile_Img!)}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>

      {/* User info */}
      <div className="flex flex-col justify-center items-start flex-1">
        <h2 className="text-xl md:text-2xl font-semibold text-light-primary dark:text-dark-primary">
          {username}
        </h2>
        <p className="text-sm md:text-base text-light-text dark:text-dark-text mt-1">
          {name}
        </p>

        <div className="mt-4">
          <CustomButton label="Logout" onClick={handleLogout} />
        </div>
      </div>
    </div>
  );
}
