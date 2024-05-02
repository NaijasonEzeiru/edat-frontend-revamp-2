import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SideNavBar from "../../components/admin/sidenavbar";
import { useRouter } from "next/router";
import {
  MainListItems,
  SecondaryListItems,
  OrgListItems,
} from "../../components/admin/listItems";

import {
  CssBaseline,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Badge,
  Box,
  Link,
} from "@mui/material";

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

interface APIResponse {
  results: Array<Object>;
}

interface Props {
  children?: React.ReactNode;
  menu?: string;
}

interface UserInfo {
  userId: number;
  orgId: number;
  role: string;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const mdTheme = createTheme({
  palette: {
    primary: {
      main: "#003280",
    },
    secondary: {
      main: "#0131E6",
    },
  },
});

export default function Layout({ children, ...pagePros }: Props) {
  const router = useRouter();

  const { orgid } = router.query || {};

  const [open, setOpen] = React.useState(true);

  const [userInfo, setUserInfo] = React.useState<UserInfo>({
    userId: 0,
    orgId: 0,
    role: "",
  });

  React.useEffect(
    function () {
      let jsonString: string | null = window.localStorage.getItem("userInfo");
      if (jsonString) {
        setUserInfo(JSON.parse(jsonString));
      }

      console.log("----- inside use effect -----");
      console.log(userInfo);
    },
    [orgid]
  );
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleCloseUserMenu = (menu) => {
    if (menu === "Logout") {
      localStorage.clear();
      // window.location.reload();
      router.push("/");
    }
  };

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Dashboard
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Link
              underline="none"
              color="inherit"
              href="/"
              onClick={() => handleCloseUserMenu("Logout")}
            >
              Logout
            </Link>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {pagePros.menu !== undefined && pagePros.menu == "org" ? (
              <OrgListItems orgid={orgid} userInfo={userInfo} />
            ) : (
              <MainListItems />
            )}
            <Divider sx={{ my: 1 }} />
            {/* <SecondaryListItems /> */}
          </List>
        </Drawer>
        {children}
      </Box>
    </ThemeProvider>
  );
}
