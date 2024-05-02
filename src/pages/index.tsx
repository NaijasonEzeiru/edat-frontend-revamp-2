import Link from "next/link";
import { LoginForm } from "@/components/Auth_Form";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { selectAuthState } from "@/store/authSlice";
import { loadRouteState } from "@/utils/routeState";
import { useEffect, useState } from "react";
import AuthLayout from "@/layouts/AuthLayout";

export default function AuthenticationPage() {
  const authState = useSelector(selectAuthState);
  const [showLogin, setShowLogin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const item = localStorage.getItem("edat_token");
    setShowLogin(!item);
    const routeState = loadRouteState("routeState");
    if (authState.isLoggedIn && routeState) {
      router.replace(routeState);
    } else {
      if (authState.role === "super admin" && item) {
        router.replace("/admin/org");
      } else if (authState.role === "account admin" && item) {
        router.replace(`/admin/org/${authState.org_code}`);
      } else if (authState.role === "student" && item) {
        router.replace("/students/profile");
      } else if (authState.role === "parent" && item) {
        router.replace("/parents/profile");
      } else if (authState.role === "teacher" && item) {
        router.replace("/teachers/profile");
      } else {
        localStorage.clear();
        setShowLogin(!item);
      }
    }
  }, [authState]);

  return (
    <>
      {showLogin ? (
        <AuthLayout>
          <div className="flex scroll-m-0 gap-3 flex-col justify-center">
            <div className="flex flex-col text-center">
              <h1 className="text-3xl font-semibold">LOGIN</h1>
              <p className="text-sm text-muted-foreground italic mb-7">
                Let's get started
              </p>
            </div>
            <LoginForm />
            <p className="text-center text-sm text-muted-foreground">
              Do you have a keycode?
              <Link
                href="/register"
                className="underline underline-offset-4 hover:text-primary pl-1"
              >
                Activate Keycode
              </Link>
            </p>
          </div>
        </AuthLayout>
      ) : (
        <></>
      )}
    </>
  );
}
