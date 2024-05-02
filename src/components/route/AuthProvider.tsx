import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../store/store";
import { loadAuthState } from "../../store/authSlice";

interface ProtectedRouteProps {
  children: any;
}

const AuthProvider: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isLoggedIn = useSelector((state: AppState) => state.auth.isLoggedIn);
  const userRole = useSelector((state: AppState) => state.auth.role);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadAuthState());
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthProvider;
