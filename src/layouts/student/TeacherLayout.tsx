import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image';
import {
  Grid,
  Box,
  Typography,
  Button,
  Stack,
  AppBar,
  Tooltip,
  Badge,
  Toolbar,
  Avatar,
  MenuItem,
  Menu,
  Divider
} from '@mui/material';

import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';

import { useRouter } from 'next/router';

import { AppState } from '../../store/store';
import EventBus from '../../utils/eventBus';

import SecondaryMenu from '../../components/menu/SecondaryMenu';
import AlertMessage from '../../components/common/AlertMessage';
import {
  useLazyGetTeacherProfileQuery,
  useLazyUserProfileUpdateQuery
} from '../../services/teacherApi';

const TeacherLayout = ({ children }) => {
  const router = useRouter();
  const [alerts, setAlerts] = useState([]);
  const user = useSelector((state: AppState) => state.auth);
  const [teacherData, { isLoading, isFetching, error, data }] =
    useLazyGetTeacherProfileQuery();
  const navItems = ['Home', 'About', 'Contact'];

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const settings = ['Logout'];

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (menu) => {
    if (menu === 'Logout') {
      EventBus.emit('ALERT', {
        message: 'Successfully logout',
        alertType: 'success',
        openStatus: true
      });
      localStorage.clear();
      // window.location.reload();
      router.push('/');
    }
    setAnchorElUser(null);
  };

  const fetchProfileData = () => {
    teacherData({
      userId: user.user_id,
      orgCode: user.org_code,
      role: user.role
    });
  };

  useEffect(() => {
    if (user.isLoggedIn) {
      fetchProfileData();
    }
    const tokenExpiredEventListener = (data) => {
      // window.location.reload();
      router.push('/');
    };

    const alertBoxEventListener = ({ message, alertType, openStatus }: any) => {
      const newAlert = {
        open: openStatus,
        message: message,
        severity: alertType
      };
      setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
    };

    EventBus.on('TOKEN_EXPIRED', tokenExpiredEventListener);
    EventBus.on('ALERT', alertBoxEventListener);

    return () => {
      EventBus.off('TOKEN_EXPIRED', tokenExpiredEventListener);
      EventBus.off('ALERT', alertBoxEventListener);
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

  const styles = {
    paperContainer: {
      backgroundImage: `url(${'/full.png'})`,
      width: '100%',
      top: '0',
      left: '0',
      height: '100%'
    }
  };

  return (
    <Box>
      <AppBar
        position='static'
        component='nav'
        position='static'
        sx={{
          background: '#11005a',
          minHeight: '9vh',
          textTransform: 'capitalize'
          // fontFamily: "'Raleway', sans-serif'"
        }}>
        <Toolbar>
          <IconButton sx={{ p: 0 }}>
            <img
              alt='Remy Sharp'
              src='/edat_logo.png'
              width={'100px'}
              height={'40px'}
              loading='lazy'
            />
          </IconButton>
          <Divider />
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title='Open settings'>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt='Remy Sharp' src={'/profile.png'} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id='menu-appbar'
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}>
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={() => handleCloseUserMenu(setting)}>
                  <Typography textAlign='center'>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box component='main'>
        <Grid container spacing={1}>
          <Grid
            item
            xs={12}
            md={12}
            sx={{
              backgroundColor: '#7CC5B9',
              minHeight: '200px'
            }}
            style={styles.paperContainer}>
            <Stack
              spacing={1}
              direction='row'
              alignItems='center'
              sx={{
                marginTop: '35px',
                marginLeft: '30px'
              }}>
              <Box>
                <Image
                  src={'/profile.png'}
                  alt='profile'
                  width={100}
                  height={100}
                />
              </Box>
              <Box style={{ padding: '20px' }}>
                <Typography
                  variant='h4'
                  // fontFamily={"'Raleway', sans-serif;"}
                  style={{ color: 'white', fontWeight: 'bold' }}>
                  {`${data?.first_name} ${data?.last_name}`}
                </Typography>
                <Typography
                  variant='body1'
                  // fontFamily={"'Raleway', sans-serif;"}
                  style={{ color: 'white' }}>
                  {data?.email}
                </Typography>
              </Box>
            </Stack>
          </Grid>
          <Grid
            item
            xs={12}
            md={12}
            sx={{
              paddingTop: '0px !important'
            }}>
            <SecondaryMenu />
          </Grid>
          <Grid
            item
            xs={12}
            md={12}
            sx={{
              paddingLeft: '50px !important'
            }}>
            <AlertMessage alerts={alerts} onClose={handleAlertClose} />
            {children}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default TeacherLayout;
