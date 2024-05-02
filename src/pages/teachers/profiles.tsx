import * as React from 'react';

import { useSelector, useDispatch } from 'react-redux';

import FormControl, { useFormControl } from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';

import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { styled } from '@mui/material/styles';

import { selectAuthState, setAuthState } from '../../store/authSlice';

import { AppState, AppDispatch } from '../../store/store';

import jwtDecode from 'jwt-decode';
import { useEffect, useState } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

import ProtectedRoute from '../../components/route/ProtectedRoute';
import DefaultLayout from '../../layouts/DefaultLayout';

import { useLazyGetTeacherProfileQuery } from '../../services/teacherApi';

const Row = styled(Stack)({
  paddingBottom: '50px'
});

const Profile = () => {
  const user = useSelector((state: AppState) => state.auth);
  const [enableEdit, setEnableEdit] = React.useState(true);

  const dispatch = useDispatch();

  const [token, setToken] = useState<string | null>(null);
  const [getTeacherProfile, { isLoading, isFetching, error, data }] =
    useLazyGetTeacherProfileQuery();

  const handleEditBtnClick = () => {
    setEnableEdit(!enableEdit);
  };

  useEffect(() => {
    if (user.isLoggedIn) {
      getTeacherProfile({
        userId: user.user_id,
        orgCode: user.org_code,
        role: user.role
      });
    }
  }, [getTeacherProfile, user]);

  return (
    <ProtectedRoute allowedRoles={['teacher']}>
      <DefaultLayout
        children={
          <>
            <Grid container spacing={2}>
              <Grid item md={8}>
                {isLoading && (
                  <Stack direction='row'>
                    <Box sx={{ width: '100%' }}>
                      <LinearProgress />
                    </Box>
                  </Stack>
                )}

                {error && <Alert severity='error'>{error.message}</Alert>}

                {data && (
                  <FormControl
                    defaultValue=''
                    required
                    sx={{
                      paddingTop: '20px',
                      minWidth: '60%'
                    }}>
                    <Row
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={{ xs: 1, sm: 8, md: 8 }}>
                      <TextField
                        fullWidth
                        disabled={enableEdit}
                        id='standard-disabled'
                        label='First Name'
                        variant='standard'
                        value={data.first_name}
                      />
                      <TextField
                        fullWidth
                        disabled={enableEdit}
                        id='standard-disabled'
                        label='Last Name'
                        variant='standard'
                        value={data.last_name}
                      />
                    </Row>
                    <Row
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={{ xs: 1, sm: 8, md: 8 }}>
                      <TextField
                        fullWidth
                        disabled={enableEdit}
                        id='standard-disabled'
                        label='Email Address'
                        variant='standard'
                        value={data.email}
                      />
                      <TextField
                        fullWidth
                        disabled={enableEdit}
                        id='standard-disabled'
                        label='Gender'
                        variant='standard'
                        value={data.gender}
                      />
                    </Row>
                    <Row
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={{ xs: 1, sm: 8, md: 8 }}>
                      <TextField
                        fullWidth
                        disabled={enableEdit}
                        id='standard-disabled'
                        label='Date of Birth'
                        variant='standard'
                        value={data.dob}
                      />
                      <TextField
                        fullWidth
                        disabled={enableEdit}
                        id='standard-disabled'
                        label='Role'
                        variant='standard'
                        value={data.role}
                      />
                    </Row>
                    <Row
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={{ xs: 1, sm: 8, md: 8 }}>
                      <TextField
                        fullWidth
                        disabled={enableEdit}
                        id='standard-disabled'
                        label='Current Grade'
                        variant='standard'
                        value={data.qualification}
                      />
                      <TextField
                        fullWidth
                        disabled={enableEdit}
                        id='standard-disabled'
                        label='Previous Grade'
                        variant='standard'
                      />
                    </Row>
                    <Row
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={{ xs: 1, sm: 8, md: 8 }}>
                      <TextField
                        fullWidth
                        multiline
                        disabled={enableEdit}
                        id='standard-disabled'
                        label='About'
                        variant='standard'
                        value={data.about_me}
                      />
                    </Row>
                    <Row
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={{ xs: 2, sm: 2, md: 2 }}>
                      <Button variant='outlined' onClick={handleEditBtnClick}>
                        Edit Profile
                      </Button>
                    </Row>
                  </FormControl>
                )}
              </Grid>
            </Grid>
          </>
        }
      />
    </ProtectedRoute>
  );
};

export default Profile;
