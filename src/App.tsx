import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/routes";
import { useAppDispatch, useAppSelector } from "./hooks/useRedux";
import { useEffect } from "react";
import { getUserThunk } from "./store/users.thunks";
import SplashScreen from "./components/ui/splashScreen";

function App() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.users.isLoading);

  useEffect(() => {
    dispatch(getUserThunk());
  },[dispatch]);

  if (isLoading) return <SplashScreen />;

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
