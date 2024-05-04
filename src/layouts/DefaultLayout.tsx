import { MouseEvent, ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SecondaryMenu from "../components/menu/SecondaryMenu";
import { logout } from "../store/authSlice";
import ChatBot from "@/components/student/ChatBot";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  useLazyGetUserQuery,
  useUserProfilePictureUpdateMutation,
} from "@/services/onBoardApi";
import { useToast } from "@/components/ui/use-toast";
import { jwtDecode } from "jwt-decode";
import { Button } from "@/components/ui/button";
import eventBus from "@/utils/eventBus";
import { Camera, LoaderCircle } from "lucide-react";

const TeacherLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [showLogOut, setShowLogout] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const user = useAppSelector((state) => state.auth);
  const [getUser, { isLoading, data, error }] = useLazyGetUserQuery();

  const dispatch = useAppDispatch();

  const handleCloseUserMenu = () => {
    dispatch(logout());
    localStorage.clear();
    router.push("/");
    toast({
      variant: "default",
      description: "Succesfully logged out",
    });
  };

  const [updateProfileImage, { isLoading: imgUpdateLoading }] =
    useUserProfilePictureUpdateMutation();

  const updateProfilePicture = async (value: File | null) => {
    const formData = new FormData();
    if (value) {
      formData.append("image", value);
    }
    updateProfileImage({
      userId: data.user_id,
      orgCode: data.org_code,
      role: user.role,
      data: formData,
    });
  };

  useEffect(() => {
    const item = localStorage.getItem("edat_token");
    if (!item) {
      router.replace("/");
    } else {
      setToken(item);
    }
    const tokenExpiredEventListener = () => {
      localStorage.clear();
      router.replace("/");
    };

    const alertBoxEventListener = ({ message, alertType, openStatus }: any) => {
      const newAlert = {
        open: openStatus,
        message: message,
        severity: alertType,
      };
      setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
    };

    eventBus.on("TOKEN_EXPIRED", tokenExpiredEventListener);
    eventBus.on("ALERT", alertBoxEventListener);

    return () => {
      eventBus.off("TOKEN_EXPIRED", tokenExpiredEventListener);
      eventBus.off("ALERT", alertBoxEventListener);
    };
  }, []);

  const handleAlertClose = (index: number) => {
    const updatedAlerts = alerts.map((alert, i) => {
      if (i === index) {
        return { ...alert, open: false };
      }
      return alert;
    });
    setAlerts(updatedAlerts);
  };

  useEffect(() => {
    if (token) {
      const userDetail = jwtDecode<{
        user_id: number;
        org_code: number;
        is_parent: boolean;
        role: string;
      }>(token);
      getUser({
        userId: userDetail.user_id,
        orgCode: userDetail.org_code,
        role: userDetail.is_parent ? "parent" : userDetail.role,
        apiRoute: "profile",
      });
    }
  }, [token]);

  return (
    <div className="overflow-x-hidden">
      <header className="h-11 md:h-16 flex justify-between items-center px-2.5 md:px-6 bg-white">
        <span className="relative block">
          <Image
            alt="Remy Sharp"
            src="/edat_logo.png"
            width={100}
            height={40}
            className="h-7 w-20 md:h-10 md:w-24"
          />
        </span>
        <span className="text-2xl md:text-4xl flex gap-3 items-center justify-between">
          <span className="relative">
            <button
              className="relative block hover:opacity-70"
              onClick={() => setShowLogout(!showLogOut)}
            >
              <Image
                width={30}
                height={30}
                alt="Avatar"
                src={
                  data?.image_url == "https://example.com/image.jpg"
                    ? "/profile.png"
                    : data?.image_url || "/profile.png"
                }
                className="size-8 md:size-11 rounded-full"
              />
            </button>
            {!!showLogOut && (
              <Button
                variant="outline"
                className="absolute top-7 -right-7 md:top-12 md:-right-5"
                onClick={() => handleCloseUserMenu()}
              >
                Log Out
              </Button>
            )}
          </span>
          <button
            tabIndex={0}
            aria-expanded={showNav}
            aria-controls="navigation"
            aria-label="Show navigation menu"
            className={
              "group border-[1px] border-black py-3 px-2 relative bg-transparent shadow-md md:hidden rounded-lg"
            }
            onClick={() => setShowNav(!showNav)}
          >
            <span
              className={`relative h-[2px] block w-5 bg-black before:absolute before:top-[-6px] before:left-0 before:h-[2px] before:w-full before:bg-black before:content-[""] before:transition-transform after:absolute after:top-[6px] after:left-0 after:h-[2px] after:w-full after:bg-black after:content-[""] after:transition-transform  ${
                showNav &&
                "duration-1000 before:-rotate-45 after:rotate-45 before:-translate-x-[5px] before:translate-y-[1px] before:transition-transform after:-translate-x-[5px] after:-translate-y-[1px] after:scale-x-75 before:scale-x-75 after:transition-transform"
              }`}
            ></span>
          </button>
        </span>
      </header>
      <div className="grid grid-flow-col">
        <aside
          className={`md:w-72 flex flex-col items-center gap-7 bg-[#00327f] py-8 h-[calc(100vh-44px)] md:h-[calc(100vh-64px)] text-white overflow-y-auto transition-all custom-scrollbar ${
            showNav ? "w-screen" : "w-0"
          }`}
        >
          <div className="justify-items-center text-lg hidden md:grid">
            {imgUpdateLoading ? (
              <span className="size-36 flex items-center justify-center">
                <LoaderCircle className="size-20 animate-spin" />
              </span>
            ) : (
              <span className="relative">
                <Image
                  width={150}
                  height={150}
                  alt="Avatar"
                  src={
                    data?.image_url == "https://example.com/image.jpg"
                      ? "/profile.png"
                      : data?.image_url || "/profile.png"
                  }
                  className="size-36 rounded-full"
                />
                <label
                  className="absolute rounded-full size-8 bg-[#17B3A6] flex items-center justify-center right-2 bottom-1 hover:scale-105 cursor-pointer"
                  tabIndex={0}
                >
                  <Camera className="size-4" />
                  <input
                    accept="image/*"
                    // id="profile-image-upload"
                    type="file"
                    // style={{ display: "none" }}
                    className="w-0 h-0"
                    onChange={(event) =>
                      updateProfilePicture(
                        event.target.files ? event.target.files[0] : null
                      )
                    }
                  />
                </label>
              </span>
            )}
            <p className="capitalize text-2xl font-semibold">
              {`${data?.first_name} ${data?.last_name}`}
            </p>
            <p className="font-light">{data?.email}</p>
          </div>
          <hr className="h-[1px] w-11/12 mx-2.5 hidden md:block grdLine" />
          <SecondaryMenu />
        </aside>
        <main
          className={`px-2.5 py-6 md:px-6 md:py-14 overflow-y-auto h-[calc(100vh-44px)] md:h-[calc(100vh-64px)] md:w-[calc(100vw-18rem)] custom-scrollbar ${
            !showNav && "w-screen"
          }`}
        >
          {children}
          {user?.role == "student" && (
            <div className={`md:block ${showNav && "hidden"}`}>
              <ChatBot name={data?.first_name} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TeacherLayout;
