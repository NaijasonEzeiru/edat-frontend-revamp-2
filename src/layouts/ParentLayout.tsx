import { MouseEvent, useEffect, useState } from "react";
import Image from "next/image";
import { Tooltip, Avatar, MenuItem, Menu } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { useRouter } from "next/router";
import EventBus from "../utils/eventBus";
import SecondaryMenu from "../components/menu/SecondaryMenu";
import AlertMessage from "../components/common/AlertMessage";
import { useLazyGetTeacherProfileQuery } from "../services/teacherApi";
import { useLazyGetStudentProfileQuery } from "../services/studentApi";
import { logout } from "../store/authSlice";
import ChatBot from "@/components/student/ChatBot";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const TeacherLayout = ({ children }) => {
  const router = useRouter();
  const [alerts, setAlerts] = useState<any[]>([]);
  const user = useAppSelector((state) => state.auth);
  const [teacherData, { isLoading, isFetching, error, data }] =
    useLazyGetTeacherProfileQuery();
  const [
    studentData,
    { isLoading: sl, isFetching: ss, error: sr, data: sdata },
  ] = useLazyGetStudentProfileQuery();

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const dispatch = useAppDispatch();

  const settings = ["Logout"];

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (menu) => {
    dispatch(logout());
    localStorage.clear();
    router.push("/");
    EventBus.emit("ALERT", {
      message: menu,
      alertType: "success",
      openStatus: true,
    });
  };

  const fetchProfileData = async () => {
    if (user.role === "teacher") {
      const res = await teacherData({
        userId: user.user_id,
        orgCode: user.org_code,
        role: user.role,
      });
      if (res?.error?.data?.detail === "Not authenticated") {
        handleCloseUserMenu("Log in session expired. Please log in");
        router.push("/");
      }
    } else if (user.role === "student") {
      studentData({
        userId: user.user_id,
        orgCode: user.org_code,
        role: user.role,
      });
    }
  };

  useEffect(() => {
    if (user.isLoggedIn) {
      fetchProfileData();
    }
    const tokenExpiredEventListener = (data) => {
      localStorage.clear();
      router.push("/");
    };

    const alertBoxEventListener = ({ message, alertType, openStatus }: any) => {
      const newAlert = {
        open: openStatus,
        message: message,
        severity: alertType,
      };
      setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
    };

    EventBus.on("TOKEN_EXPIRED", tokenExpiredEventListener);
    EventBus.on("ALERT", alertBoxEventListener);

    return () => {
      EventBus.off("TOKEN_EXPIRED", tokenExpiredEventListener);
      EventBus.off("ALERT", alertBoxEventListener);
    };
  }, []);

  const handleAlertClose = (index) => {
    const updatedAlerts = alerts.map((alert, i) => {
      if (i === index) {
        return { ...alert, open: false };
      }
      return alert;
    });
    setAlerts(updatedAlerts);
  };

  // return (
  //   <div className="min-h-screen">
  //     <AppBar
  //       component="nav"
  //       position="fixed"
  //       sx={{
  //         background: "white",
  //         minHeight: "9vh",
  //         textTransform: "capitalize",
  //         // fontFamily: "'Raleway', sans-serif'"
  //       }}
  //     >
  //       <Toolbar>
  //         <IconButton sx={{ p: 0 }}>
  //           <img
  //             alt="Remy Sharp"
  //             src="/edat_logo.png"
  //             width={"100px"}
  //             height={"40px"}
  //             loading="lazy"
  //           />
  //         </IconButton>
  //         <Divider />
  //         <Box sx={{ flexGrow: 1 }} />
  //         <Box sx={{ flexGrow: 0 }}>
  //           <Tooltip title="Open settings">
  //             <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
  //               <Avatar alt="Remy Sharp" src={"/profile.png"} />
  //             </IconButton>
  //           </Tooltip>
  //           <Menu
  //             sx={{ mt: "45px" }}
  //             id="menu-appbar"
  //             anchorEl={anchorElUser}
  //             anchorOrigin={{
  //               vertical: "top",
  //               horizontal: "right",
  //             }}
  //             keepMounted
  //             transformOrigin={{
  //               vertical: "top",
  //               horizontal: "right",
  //             }}
  //             open={Boolean(anchorElUser)}
  //             onClose={setAnchorElUser(null)}
  //           >
  //             {settings.map((setting) => (
  //               <MenuItem
  //                 key={setting}
  //                 onClick={() => handleCloseUserMenu(setting)}
  //               >
  //                 <Typography textAlign="center">{setting}</Typography>
  //               </MenuItem>
  //             ))}
  //           </Menu>
  //         </Box>
  //       </Toolbar>
  //     </AppBar>
  //     <div className="grid grid-flow-col mt-16">
  //       <div className="w-56 flex flex-col items-center gap-14 bg-[#00327f] py-8 min-h-[calc(100vh-56px)] fixed text-white">
  //         <div className="grid justify-items-center text-lg">
  //           {user.role == "teacher" && (
  //             <Image
  //               alt="profile image"
  //               src={!data?.image_url ? "/profile.png" : data?.image_url}
  //               width="144"
  //               height={144}
  //               className="size-36 rounded-full object-cover border-2 border-white border-solid"
  //             />
  //           )}
  //           {user.role == "student" && (
  //             <Image
  //               alt="profile image"
  //               src={!sdata?.image_url ? "/profile.png" : sdata?.image_url}
  //               width="145"
  //               height={145}
  //               className="size-36 rounded-full object-cover border-2 border-white border-solid"
  //             />
  //           )}
  //           {user?.role == "teacher" && (
  //             <p className="capitalize">{`${data?.first_name} ${data?.last_name}`}</p>
  //           )}

  //           {user?.role == "student" && (
  //             <p className="capitalize">{`${sdata?.first_name} ${sdata?.last_name}`}</p>
  //           )}
  //           {/* <p>{data?.email}</p> */}
  //         </div>
  //         <SecondaryMenu />
  //       </div>
  //       <Grid
  //         item
  //         xs={12}
  //         md={12}
  //         sx={{
  //           // paddingInline: '50px !important',
  //           // paddingBottom: '50px
  //           padding: "50px !important",
  //           ml: "14rem",
  //           minHeight: "calc(100vh - 56px)",
  //           // display: "grid",
  //           // alignItems: "center",
  //         }}
  //       >
  //         <AlertMessage alerts={alerts} onClose={handleAlertClose} />
  //         {children}
  //       </Grid>
  //     </div>
  //   </div>
  // );
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex items-center justify-between py-5 px-3 md:px-20">
        <Image src="/edat_logo.png" width={100} height={40} alt="Edat logo" />{" "}
        <div>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar
                alt="Remy Sharp"
                className="size-20"
                src={`${
                  data?.image_url || sdata?.image_url || "/profile.png"
                } `}
              />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={() => setAnchorElUser(null)}
          >
            {settings.map((setting) => (
              <MenuItem
                key={setting}
                onClick={() => handleCloseUserMenu("Sucessfully Logged out")}
              >
                <p>{setting}</p>
              </MenuItem>
            ))}
          </Menu>
        </div>
      </div>
      <div>
        <div>
          <div className="px-3 md:px-20 bg-[url('/classroom.png')] bg-no-repeat bg-cover py-5 shadow-[inset_0_0_0_2000px_rgba(75,118,111,0.85)]">
            <div className="flex items-center gap-5">
              {user.role == "teacher" && (
                <Image
                  width={150}
                  height={150}
                  alt="Teacher Avatar"
                  src={!data?.image_url ? "/profile.png" : data?.image_url}
                  className="size-36 rounded-full"
                />
              )}
              {user.role == "student" && (
                <Image
                  width={150}
                  height={150}
                  alt="Teacher Avatar"
                  src={!sdata?.image_url ? "/profile.png" : sdata?.image_url}
                  className="size-36 rounded-full"
                />
              )}
              {user.role == "parent" && (
                <Image
                  width={150}
                  height={150}
                  alt="Teacher Avatar"
                  src={!sdata?.image_url ? "/profile.png" : sdata?.image_url}
                  className="size-36 rounded-full"
                />
              )}
              <div className="px-4 text-white gap-2">
                <p className="text-4xl font-semibold">
                  {user?.role == "teacher" && (
                    <p>{`${data?.first_name} ${data?.last_name}`}</p>
                  )}

                  {user?.role == "student" && (
                    <p>{`${sdata?.first_name} ${sdata?.last_name}`}</p>
                  )}
                </p>
                <p>{data?.email}</p>
                <p>{sdata?.email}</p>
              </div>
            </div>
          </div>
          <SecondaryMenu />
          <div className="pt-12 pb-28 px-3 md:px-20 bg-slate-100">
            <AlertMessage alerts={alerts} onClose={handleAlertClose} />
            {children}
          </div>
          {user?.role == "student" && <ChatBot name={sdata?.first_name} />}
        </div>
      </div>
    </div>
  );
};

export default TeacherLayout;
