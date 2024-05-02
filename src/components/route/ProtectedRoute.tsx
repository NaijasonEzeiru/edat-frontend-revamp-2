import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { AppState } from "../../store/store";

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: any;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  children,
}) => {
  const isLoggedIn = useSelector((state: AppState) => state.auth.isLoggedIn);
  const userRole = useSelector((state: AppState) => state.auth.role);

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && !isLoggedIn) {
      // User is not logged in, redirect to login page
      router.push("/");
    } else if (isLoggedIn && !allowedRoles.includes(userRole)) {
      // User is logged in but doesn't have the required role, redirect to an access-denied page
      router.push("/access-denied");
    }
  }, [isLoggedIn, userRole]);

  if (!isLoggedIn || !allowedRoles.includes(userRole)) {
    // Return null when redirecting, so the protected content is not rendered on the server
    return null;
  }

  // User is logged in and has the required role, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
