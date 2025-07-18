import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/useRedux";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAppSelector((state) => state.users);

  if (isLoading) return <div>Loading...</div>;

  return user ? <>{children}</> : <Navigate to={"/login"} />;
};

export default ProtectedRoute;
