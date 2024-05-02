import {
  Typography,
  TextField,
  Stack,
  TextareaAutosize,
  Skeleton
} from '@mui/material';
import Button from '@mui/material/Button';

import { Box } from '@mui/system';
import styled from '@mui/system/styled';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { useLazyUserProfileUpdateQuery } from '../../services/onBoardApi';

const ProfileComponentContainer = styled('section')(({ theme }) => ({
  backgroundColor: '#fff',
  display: 'flex',
  flexDirection: 'row'
}));

const ProfileLeftComponentContainer = styled('div')(({ theme }) => ({
  padding: '3rem 1rem 1rem 3rem',
  width: '70%',
  display: 'flex',
  flexDirection: 'column'
}));

const ProfileLeftContainer = styled('ul')(({ theme }) => ({
  margin: 0,
  padding: 0,
  border: 0,
  font: 'inherit',
  // fontFamily: "'Raleway', sans-serif",
  verticalAlign: 'baseline',
  textRendering: 'optimizeLegibility'
}));

const ProfileList = styled('ul')(({ theme }) => ({
  fontSize: '1.1rem',
  padding: '1rem',
  margin: '0 1rem',
  cursor: 'pointer',
  borderRadius: '5px'
}));

const ProfileComponentTemplates = (props: any) => {
  const [token, setToken] = useState<any>();
  const [userDetail, setUserDetail] = useState<any>();
  const [userProfileUpdate, { isLoading, isFetching, error, data }] =
    useLazyUserProfileUpdateQuery();

  useEffect(() => {
    // Perform localStorage action
    const item: any = localStorage.getItem('edat_token');
    setUserDetail(jwtDecode(item));
    setToken(item);
  }, []);
  const [isEdit, setIsEdit] = useState(true);
  const onEditCall = () => {
    setIsEdit(false);
  };

  const userObj = {
    current_grade: props.data?.current_grade ?? '',
    dob: props.data?.dob ?? '',
    email: props.data?.email ?? '',
    first_name: props.data?.first_name ?? '',
    gender: props.data?.gender ?? '',
    last_name: props.data?.last_name ?? '',
    licence_type: props.data?.licence_type ?? '',
    previous_grade: props.data?.previous_grade ?? '',
    status: props.data?.status ?? '',
    subjects: props.data?.subjects ?? '',
    tutor_group: props.data?.tutor_group ?? '',
    user_name: props.data?.user_name ?? '',
    about_me: props.data?.about_me ?? '',
    previous_school: props.data?.previous_school ?? '',
    qualification: props.data?.qualification ?? '',
    contact_address: props.data?.contact_address ?? '',
    contact_no: props.data?.contact_no ?? '',
    no_of_children: props.data?.no_of_children ?? '',
    occupation: props.data?.occupation ?? '',
    spouse_contact_no: props.data?.spouse_contact_no ?? '',
    spouse_name: props.data?.spouse_name ?? '',
    spouse_occupation: props.data?.spouse_occupation ?? '',
    spouse_qualification: props.data?.spouse_qualification ?? ''
  };

  const [user, setUser] = useState(userObj);

  const onSaveCall = async () => {
    userProfileUpdate({
      userId: userDetail.user_id,
      orgCode: userDetail.org_code,
      token,
      role: userDetail.is_parent ? 'parent' : userDetail.role,
      apiRoute: 'profile',
      data: user
    });
  };
  useEffect(() => {
    if (data?.code === 200) {
      setUser(data?.items);
      alert(data?.message);
      setIsEdit(true);
    }
  }, [data]);

  return (
    <ProfileComponentContainer>
      <ProfileLeftComponentContainer>
        <>
          <ProfileLeftContainer>
            <Stack spacing={5} direction='row' sx={{ paddingBottom: '20px' }}>
              <TextField
                id='outlined-basic'
                label='User Name'
                variant='outlined'
                disabled={true}
                InputLabelProps={{ shrink: true }}
                value={user?.user_name}
                sx={{ width: '30%' }}
              />
            </Stack>
            <Stack spacing={5} direction='row' sx={{ paddingBottom: '20px' }}>
              <TextField
                id='outlined-basic'
                label='First Name'
                variant='outlined'
                disabled={true}
                InputLabelProps={{ shrink: true }}
                value={user?.first_name}
                sx={{ width: '30%' }}
              />
              <TextField
                id='outlined-basic'
                label='Last Name'
                variant='outlined'
                disabled={true}
                InputLabelProps={{ shrink: true }}
                value={user?.last_name}
                sx={{ width: '30%' }}
              />
            </Stack>
            <Stack spacing={5} direction='row' sx={{ paddingBottom: '20px' }}>
              <TextField
                id='outlined-basic'
                label='Email'
                variant='outlined'
                disabled={true}
                InputLabelProps={{ shrink: true }}
                value={user?.email}
                sx={{ width: '30%' }}
              />
              <TextField
                id='outlined-basic'
                label='Gender'
                variant='outlined'
                disabled={true}
                InputLabelProps={{ shrink: true }}
                value={user?.gender}
                sx={{ width: '30%' }}
              />
            </Stack>
            <Stack spacing={5} direction='row' sx={{ paddingBottom: '20px' }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label='Date of Birth'
                  value={user?.dob}
                  disabled={true}
                  onChange={(newValue: any) => {
                    setUser({
                      ...user,
                      dob: newValue.format('YYYY-MM-DD')
                    });
                  }}
                  renderInput={(params: any) => (
                    <TextField {...params} sx={{ width: '30%' }} />
                  )}
                />
              </LocalizationProvider>
              <TextField
                id='outlined-basic'
                label='Role'
                variant='outlined'
                disabled={true}
                InputLabelProps={{ shrink: true }}
                value={user?.licence_type}
                sx={{ width: '30%' }}
              />
            </Stack>
            {userDetail?.role === 'student' && !userDetail?.is_parent && (
              <Stack spacing={5} direction='row' sx={{ paddingBottom: '20px' }}>
                <TextField
                  id='outlined-basic'
                  label='Current Grade'
                  variant='outlined'
                  disabled={isEdit}
                  value={user?.current_grade}
                  onChange={(e) => {
                    setUser({
                      ...user,
                      current_grade: e.target.value
                    });
                  }}
                  sx={{ width: '30%' }}
                />
                <TextField
                  id='outlined-basic'
                  label='Previous Grade'
                  variant='outlined'
                  disabled={isEdit}
                  value={user?.previous_grade}
                  onChange={(e) => {
                    setUser({
                      ...user,
                      previous_grade: e.target.value
                    });
                  }}
                  sx={{ width: '30%' }}
                />
              </Stack>
            )}
            {userDetail?.role === 'teacher' && (
              <Stack spacing={5} direction='row' sx={{ paddingBottom: '20px' }}>
                <TextField
                  id='outlined-basic'
                  label='Previous School'
                  variant='outlined'
                  disabled={isEdit}
                  value={user?.previous_school}
                  onChange={(e) => {
                    setUser({
                      ...user,
                      previous_school: e.target.value
                    });
                  }}
                  sx={{ width: '30%' }}
                />
                <TextField
                  id='outlined-basic'
                  label='Qualification'
                  variant='outlined'
                  disabled={isEdit}
                  value={user?.qualification}
                  onChange={(e) => {
                    setUser({
                      ...user,
                      qualification: e.target.value
                    });
                  }}
                  sx={{ width: '30%' }}
                />
              </Stack>
            )}
            {userDetail?.role === 'student' &&
              userDetail?.role === 'teacher' && (
                <Stack
                  spacing={5}
                  direction='row'
                  sx={{ paddingBottom: '20px' }}>
                  <TextField
                    id='outlined-basic'
                    label='Subjects'
                    variant='outlined'
                    disabled={isEdit}
                    value={user?.subjects}
                    onChange={(e) => {
                      setUser({
                        ...user,
                        subjects: e.target.value
                      });
                    }}
                    sx={{ width: '30%' }}
                  />
                  <TextField
                    id='outlined-basic'
                    label='Tutor Group'
                    variant='outlined'
                    disabled={isEdit}
                    value={user?.tutor_group}
                    onChange={(e) => {
                      setUser({
                        ...user,
                        tutor_group: e.target.value
                      });
                    }}
                    sx={{ width: '30%' }}
                  />
                </Stack>
              )}
            {userDetail?.role === 'student' && userDetail?.is_parent && (
              <>
                <Stack
                  spacing={5}
                  direction='row'
                  sx={{ paddingBottom: '20px' }}>
                  <TextField
                    id='outlined-basic'
                    label='Contact No'
                    variant='outlined'
                    disabled={isEdit}
                    value={user?.contact_no}
                    onChange={(e) => {
                      setUser({
                        ...user,
                        contact_no: e.target.value
                      });
                    }}
                    sx={{ width: '30%' }}
                  />
                  <TextField
                    id='outlined-basic'
                    label='No of Children'
                    variant='outlined'
                    disabled={isEdit}
                    value={user?.no_of_children}
                    onChange={(e) => {
                      setUser({
                        ...user,
                        no_of_children: e.target.value
                      });
                    }}
                    sx={{ width: '30%' }}
                  />
                </Stack>
                <Stack
                  spacing={5}
                  direction='row'
                  sx={{ paddingBottom: '20px' }}>
                  <TextField
                    id='outlined-basic'
                    label='Occupation'
                    variant='outlined'
                    disabled={isEdit}
                    value={user?.occupation}
                    onChange={(e) => {
                      setUser({
                        ...user,
                        occupation: e.target.value
                      });
                    }}
                    sx={{ width: '30%' }}
                  />
                  <TextField
                    id='outlined-basic'
                    label='Spouse Contact No'
                    variant='outlined'
                    disabled={isEdit}
                    value={user?.spouse_contact_no}
                    onChange={(e) => {
                      setUser({
                        ...user,
                        spouse_contact_no: e.target.value
                      });
                    }}
                    sx={{ width: '30%' }}
                  />
                </Stack>
                <Stack
                  spacing={5}
                  direction='row'
                  sx={{ paddingBottom: '20px' }}>
                  <TextField
                    id='outlined-basic'
                    label='Spouse Name'
                    variant='outlined'
                    disabled={isEdit}
                    value={user?.spouse_name}
                    onChange={(e) => {
                      setUser({
                        ...user,
                        spouse_name: e.target.value
                      });
                    }}
                    sx={{ width: '30%' }}
                  />
                  <TextField
                    id='outlined-basic'
                    label='Spouse Occupation'
                    variant='outlined'
                    disabled={isEdit}
                    value={user?.spouse_occupation}
                    onChange={(e) => {
                      setUser({
                        ...user,
                        spouse_occupation: e.target.value
                      });
                    }}
                    sx={{ width: '30%' }}
                  />
                </Stack>
                <Stack
                  spacing={5}
                  direction='row'
                  sx={{ paddingBottom: '20px' }}>
                  <TextField
                    id='outlined-basic'
                    label='Spouse Qualification'
                    variant='outlined'
                    disabled={isEdit}
                    value={user?.spouse_qualification}
                    onChange={(e) => {
                      setUser({
                        ...user,
                        spouse_qualification: e.target.value
                      });
                    }}
                    sx={{ width: '30%' }}
                  />
                  <TextField
                    id='outlined-basic'
                    label='Spouse Contact No'
                    variant='outlined'
                    disabled={isEdit}
                    value={user?.spouse_contact_no}
                    onChange={(e) => {
                      setUser({
                        ...user,
                        spouse_contact_no: e.target.value
                      });
                    }}
                    sx={{ width: '30%' }}
                  />
                </Stack>
                <Stack
                  spacing={3}
                  direction='column'
                  sx={{ paddingBottom: '10px' }}>
                  <TextField
                    label='Address'
                    placeholder='Address'
                    multiline
                    rows={2}
                    disabled={isEdit}
                    value={user?.contact_address}
                    onChange={(e) => {
                      setUser({
                        ...user,
                        contact_address: e.target.value
                      });
                    }}
                    sx={{ width: '63%' }}
                  />
                </Stack>
              </>
            )}
            <Stack
              spacing={3}
              direction='column'
              sx={{ paddingBottom: '10px' }}>
              <TextField
                label='About'
                placeholder='Write your biography'
                multiline
                rows={2}
                disabled={isEdit}
                value={user?.about_me}
                onChange={(e) => {
                  setUser({
                    ...user,
                    about_me: e.target.value
                  });
                }}
                sx={{ width: '63%' }}
              />
            </Stack>

            <Stack
              spacing={4}
              direction='row'
              sx={{ paddingBottom: '20px', float: 'right' }}>
              <Button
                variant='contained'
                sx={{
                  background: 'rgba(3,30,128,1)',
                  borderRadius: '5px',
                  padding: '10px',
                  width: '95%',
                  color: 'white',
                  //  fontFamily: "Raleway-Medium",
                  border: '1px solid rgba(112,112,112,1)'
                }}
                onClick={isEdit ? onEditCall : onSaveCall}>
                {isFetching || isLoading
                  ? 'Loading'
                  : (!isFetching || !isLoading) && !isEdit
                  ? 'Save'
                  : 'Edit'}
              </Button>
            </Stack>
          </ProfileLeftContainer>
        </>
      </ProfileLeftComponentContainer>
    </ProfileComponentContainer>
  );
};

export default ProfileComponentTemplates;
