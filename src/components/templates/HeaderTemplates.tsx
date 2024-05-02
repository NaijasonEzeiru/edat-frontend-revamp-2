import { Avatar, Skeleton, Stack } from '@mui/material';
import styled from '@mui/system/styled';
import Image from 'next/image';
import { useState } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import {
  CssBaseline,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Badge,
  Box,
  Link
} from '@mui/material';
import { useRouter } from 'next/router';

const HeaderContainer = styled('header')(({ theme }) => ({
  backgroundColor: '#00215A',
  color: '#fff',
  display: 'flex',
  alignItems: 'baseline',
  padding: '1.5rem 2rem'
}));

const HeaderLeftContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center'
}));

const HeaderSectionContainer = styled('section')(({ theme }) => ({
  display: 'flex',
  alignItems: 'baseline',
  padding: '2rem',
  position: 'relative',
  backgroundColor: '#7CC5B9',
  height: '30vh'
}));

const HeaderProfileInfoContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center'
}));

const HeaderTemplates = (props: any) => {
  const router = useRouter();
  const handleCloseUserMenu = (menu) => {
    if (menu === 'Logout') {
      localStorage.clear();
      // window.location.reload();
      router.push('/');
    }
  };

  const fullName =
    props.data?.first_name && props.data?.last_name
      ? `${props.data?.first_name} ${props.data?.last_name}`
      : '';
  return (
    <>
      <HeaderContainer>
        <HeaderLeftContainer>
          <Typography variant='h5'>Profile</Typography>
          <IconButton color='inherit'>
            <Badge badgeContent={4} color='secondary'>
              <NotificationsIcon />
            </Badge>
          </IconButton>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Link
            underline='none'
            color='inherit'
            href='/'
            onClick={() => handleCloseUserMenu('Logout')}>
            Logout
          </Link>
        </HeaderLeftContainer>
      </HeaderContainer>
      <HeaderSectionContainer>
        {props.isLoading && (
          <Stack spacing={3} direction='row' alignItems='center'>
            <Skeleton variant='circular'>
              <Avatar
                variant='circular'
                sx={{ width: '100px', height: '100px' }}
              />
            </Skeleton>
            <Stack spacing={1} direction='column'>
              <Skeleton
                variant='rectangular'
                width={210}
                height={20}
                animation='wave'
              />
              <Skeleton
                variant='rectangular'
                width={210}
                height={20}
                animation='wave'
              />
            </Stack>
          </Stack>
        )}
        {!props.isLoading && (
          <Stack spacing={1} direction='row'>
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
                {fullName}
              </Typography>
              <Typography
                variant='body1'
                // fontFamily={"'Raleway', sans-serif;"}
                style={{ color: 'white' }}>
                {props.data?.email}
              </Typography>
            </Box>
          </Stack>
        )}
      </HeaderSectionContainer>
    </>
  );
};

export default HeaderTemplates;
