import type { NextPage } from 'next';
import NextLink from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Button from '@mui/material/Button';
import Box from '@mui/system/Box';
import styled from '@mui/system/styled';
import {
  FormControl,
  FormControlLabel,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Stack,
  TextField,
  Typography,
  Checkbox,
  FormLabel,
  RadioGroup,
  Radio,
  Grid
} from '@mui/material';
import React, { useEffect } from 'react';
// import NextLink from "next/link"
import Link from '@mui/material/Link';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import {
  useLazyGetEmailStatusQuery,
  useLazyGetRegCodeStatusQuery,
  useLazyGetUserNameStatusQuery,
  useSignUpMutation
} from '../../services/onBoardApi';

const LogoContainer = styled('div')(({ theme }) => ({
  marginTop: '10%',
  marginBottom: '2%'
}));

const SignUpContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  minHeight: '100%',
  minWidth: '100%',
  background: 'url(/Group_4_b.png)',
  flexDirection: 'column',
  textAlign: 'center'
}));

interface State {
  registerCode: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  password: string;
  cPassword: string;
  isParent: boolean;
}

const SignUp: NextPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [values, setValues] = React.useState<State>({
    registerCode: '',
    userName: '',
    email: '',
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    password: '',
    cPassword: '',
    isParent: false
  });

  const [dateValue, setDateValue] = React.useState<Dayjs | null>(null);
  const [isRegisterCodeSuccess, setIsRegisterCodeSuccess] =
    React.useState(false);
  const [isShowParentCheckBox, setIsShowParentCheckBox] = React.useState(false);
  const [getUserNameStatus, userNameStatusResponse] =
    useLazyGetUserNameStatusQuery();
  const [getEmailStatus, emailStatusResponse] = useLazyGetEmailStatusQuery();
  const [getRegCodeStatus, regCodeStatusResponse] =
    useLazyGetRegCodeStatusQuery();
  const [signUp, { isSuccess, isLoading, isError, data, error }] =
    useSignUpMutation();
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isParentRegistered, setIsParentRegistered] = React.useState(false);
  const [userNameErrorMessage, setUserNameErrorMessage] = React.useState('');
  const [firstNameErrorMessage, setFirstNameErrorMessage] = React.useState('');
  const [lastNameErrorMessage, setLastNameErrorMessage] = React.useState('');
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [dobErrorMessage, setDobErrorMessage] = React.useState('');
  const [genderErrorMessage, setGenderErrorMessage] = React.useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [signUpErrorMessage, setSignUpErrorMessage] = React.useState('');

  const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleconfirmChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      let request = {
        ...values
      };
      if (request.password !== event.target.value) {
        setPasswordErrorMessage('Password not Match!.');
      } else {
        setValues({ ...values, [prop]: event.target.value });
        setPasswordErrorMessage('');
      }
    };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const onCheckRegCodeStatus = () => {
    if (values.registerCode === '') {
      setErrorMessage('Please enter register code!.');
    } else {
      getRegCodeStatus({ code: values.registerCode });
    }
  };

  const onSignUpCall = () => {
    let request = {
      ...values,
      isParent: isParentRegistered
    };
    // console.log(request);
    if (!request.userName) {
      setUserNameErrorMessage('Please enter username!.');
      return;
    } else {
      setUserNameErrorMessage('');
    }

    if (!request.firstName) {
      setFirstNameErrorMessage('Please enter first name!.');
      return;
    } else {
      setFirstNameErrorMessage('');
    }

    if (!request.lastName) {
      setLastNameErrorMessage('Please enter last name!.');
      return;
    } else {
      setLastNameErrorMessage('');
    }

    if (!request.email) {
      setEmailErrorMessage('Please enter email address!.');
      return;
    } else {
      setEmailErrorMessage('');
    }
    if (!request.gender) {
      setGenderErrorMessage('Please select Gender!.');
      return;
    } else {
      setGenderErrorMessage('');
    }

    if (!request.password || !request.cPassword) {
      setPasswordErrorMessage('Please enter password!.');
      return;
    } else {
      setPasswordErrorMessage('');
    }

    if (
      emailErrorMessage ||
      userNameErrorMessage ||
      dobErrorMessage ||
      passwordErrorMessage
    ) {
      return;
    }

    let body = {
      user_name: values.userName,
      password: values.password,
      email: values.email,
      first_name: values.firstName,
      last_name: values.lastName,
      dob: values.dob,
      gender: values.gender,
      reg_code: values.registerCode,
      is_parent: values.isParent ? '1' : '0'
    };
    signUp(body);
  };

  useEffect(() => {
    // console.log(regCodeStatusResponse);
    if (regCodeStatusResponse.data) {
      const results = regCodeStatusResponse.data.results;
      setIsRegisterCodeSuccess(
        results.items.status === 'not_activated' ||
          results.items.status === 'active'
      );
      setIsShowParentCheckBox(results.items.licence_type === 'student');
      setIsParentRegistered(
        results.items.parent === 'not registered' &&
          results.items.user === 'registered'
      );
      //@ts-expect-error
    } else if (regCodeStatusResponse.error?.data?.errors?.code) {
      //@ts-expect-error
      setErrorMessage(regCodeStatusResponse.error?.data?.errors?.message);
    }
  }, [regCodeStatusResponse]);

  useEffect(() => {
    if (values.userName) {
      // console.log(values.userName);
      getUserNameStatus({ username: values.userName });
    }
  }, [values.userName, getUserNameStatus]);

  useEffect(() => {
    if (isSuccess) {
      router.replace('/');
    } else if (isError) {
      //@ts-ignore
      setSignUpErrorMessage(error?.data?.errors?.message);
    }
  }, [isSuccess, data, error, setSignUpErrorMessage, isError, router]);

  useEffect(() => {
    if (values.email) {
      // console.log(values.email);
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(values.email)) {
        getEmailStatus({ email: values.email });
      } else {
        setEmailErrorMessage('Please enter valid email id!.');
      }
    }
    const currentDate = new Date();
    // Deduct 5 years from the current date
    currentDate.setFullYear(currentDate.getFullYear() - 5);
    let dob = new Date(values.dob);
    if (!dob) {
      setDobErrorMessage('Please enter Date of Birth!.');
    } else if (currentDate < dob) {
      setDobErrorMessage('You must be up to 5 years old');
    } else {
      setDobErrorMessage('');
    }
  }, [values.email, getEmailStatus, values.dob]);

  useEffect(() => {
    if (!userNameStatusResponse.isError) {
      // console.log(userNameStatusResponse);
      setUserNameErrorMessage(userNameStatusResponse.data?.results?.message);
      //@ts-ignore
    } else if (userNameStatusResponse.error?.data?.errors?.code) {
      setUserNameErrorMessage(
        //@ts-ignore
        userNameStatusResponse.error?.data?.errors?.message
      );
      //@ts-ignore
      // console.log(userNameStatusResponse.error?.data?.errors?.message);
    }
  }, [userNameStatusResponse]);

  useEffect(() => {
    if (!emailStatusResponse.isError) {
      // console.log(emailStatusResponse);
      setEmailErrorMessage(emailStatusResponse.data?.results?.message);
      //@ts-ignore
    } else if (emailStatusResponse.error?.data?.errors?.code) {
      //@ts-ignore
      setEmailErrorMessage(emailStatusResponse.error?.data?.errors?.message);
      //@ts-ignore
      // console.log(emailStatusResponse.error?.data?.errors?.message);
    }
  }, [emailStatusResponse]);

  useEffect(() => {
    if (data && data.code === 200) {
      router.replace('/');
    }
  }, [data, router]);
  const handleKeypress = (e: any) => {
    if (e.charCode === 13) {
      onSignUpCall();
    }
  };

  return (
    <Grid container spacing={1} sx={{ minHeight: '100vh' }}>
      <Grid container xs={6}>
        <SignUpContainer>
          <Stack
            spacing={2}
            sx={{ marginTop: 0, marginLeft: 0, color: 'white' }}>
            <Typography variant='h3' fontFamily={'Raleway-Medium'}>
              Sign Up
            </Typography>
            <Typography
              variant='subtitle1'
              // fontFamily={"Raleway-Medium"}
              noWrap={true}>
              {`Please enter your details to sign up and be \n part of our great community.`}
            </Typography>
          </Stack>
          <Box sx={{ marginTop: 12, color: 'white' }}>
            <Typography variant='subtitle1'>
              {'Already have an account?'}
            </Typography>
          </Box>
          <Box sx={{ marginTop: 12 }}>
            <Button
              sx={{
                borderRadius: '10px',
                padding: '10px',
                width: '30%',
                color: 'white',
                // fontFamily: "Raleway-Bold",
                fontSize: '25px',
                border: '1px solid rgba(255,255,255,1)'
              }}
              onClick={() => {
                router.push('/');
              }}>
              Sign In
            </Button>
          </Box>
          <Box sx={{ marginTop: 15, color: 'white' }}>
            <Typography variant='subtitle1' fontFamily={'Raleway-Medium'}>
              {'© EDAT, All Rights Reserved'}
            </Typography>
          </Box>
        </SignUpContainer>
      </Grid>
      <Grid
        container
        xs={6}
        sx={{ px: { xs: 4, md: 10 }, backgroundColor: 'rgba(255,255,255,1)' }}
        display='flex'
        flexDirection='column'>
        <LogoContainer>
          <Image
            src={'/edat_logo_b@2x.png'}
            alt='e-dat'
            width={100}
            height={30}
          />
        </LogoContainer>
        {!isRegisterCodeSuccess && (
          <Box
            sx={{
              margin: 'auto 0',
              color: 'rgba(112,112,112)'
            }}>
            {/* <Typography variant='h3' fontFamily={'Raleway-Medium'}>
              Sign Up
            </Typography> */}
            <FormControl
              sx={{ ml: 1, width: '100%', borderBottom: '1px solid white' }}
              variant='standard'>
              <InputLabel htmlFor='standard-adornment-password'>
                <Typography
                  fontFamily={'Raleway'}
                  color='green'
                  fontSize={'16px'}>
                  Enter Registration Code
                </Typography>
              </InputLabel>
              <Input
                id='standard-adornment-password'
                type={'text'}
                value={values.registerCode}
                onChange={(event) =>
                  setValues({
                    ...values,
                    registerCode: event.target.value
                  })
                }
                onBlur={(event) =>
                  setValues({
                    ...values,
                    registerCode: event.target.value
                  })
                }
                sx={{ padding: '2px', borderBlockColor: 'green' }}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      sx={{ paddingBottom: 2 }}>
                      <Image
                        src={'/EMAIL_ICON@2x.png'}
                        alt='lock'
                        width={20}
                        height={18}
                      />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            {errorMessage && (
              <Stack direction='row' spacing={1}>
                <Typography
                  variant='subtitle1'
                  color={'orange'}
                  // fontFamily={"Raleway-Medium"}
                >
                  {errorMessage}
                </Typography>
              </Stack>
            )}
            <Box mt={2} flex='1' justifyContent={'right'} textAlign={'right'}>
              <Button
                variant='contained'
                sx={{
                  background: 'rgb(0 49 230)',
                  borderRadius: '30px',
                  padding: '10px',
                  width: '20%',
                  color: 'black',
                  fontFamily: 'Raleway-Medium',
                  border: '1px solid rgba(112,112,112,1)'
                }}
                onClick={() => onCheckRegCodeStatus()}>
                {regCodeStatusResponse.isLoading && 'Loading'}
                {!regCodeStatusResponse.isLoading && 'Next'}
              </Button>
            </Box>
            {/* <Stack sx={{ marginTop: 12 }} flexDirection='row'>
              <Typography variant='subtitle1' fontFamily={'Raleway-Medium'}>
                {'Already have an account?'}
              </Typography>
              <NextLink href={'/'}>Sign In</NextLink>
            </Stack>
            <Box sx={{ marginTop: 15 }}>
              <Typography variant='subtitle1' fontFamily={'Raleway-Medium'}>
                {'© EDAT, All Rights Reserved'}
              </Typography>
            </Box> */}
          </Box>
        )}

        {isRegisterCodeSuccess && (
          <Box
            sx={{
              color: 'white'
            }}>
            <>
              <FormControl
                sx={{ ml: 1, width: '100%', borderBottom: '1px solid white' }}
                variant='standard'>
                {isShowParentCheckBox && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isParentRegistered}
                        disabled={isParentRegistered}
                        onChange={(event) => {
                          setValues({
                            ...values,
                            isParent: event.target.checked
                          });
                        }}
                      />
                    }
                    label='Is Parent?'
                    sx={{ marginLeft: '8px', color: 'rgba(112,112,112,1)' }}
                  />
                )}

                <TextField
                  id='outlined-basic'
                  label='User Name'
                  variant='outlined'
                  sx={{ margin: '10px' }}
                  onChange={handleChange('userName')}
                />

                {userNameErrorMessage && (
                  <Stack
                    direction='row'
                    spacing={1}
                    sx={{ marginLeft: '10px' }}>
                    <Typography
                      variant='subtitle1'
                      color={'orange'}
                      fontFamily={'Raleway-Medium'}>
                      {userNameErrorMessage}
                    </Typography>
                  </Stack>
                )}

                <TextField
                  id='outlined-basic'
                  label='First Name'
                  variant='outlined'
                  sx={{ margin: '10px' }}
                  onChange={handleChange('firstName')}
                />

                {firstNameErrorMessage && (
                  <Stack
                    direction='row'
                    spacing={1}
                    sx={{ marginLeft: '10px' }}>
                    <Typography
                      variant='subtitle1'
                      color={'orange'}
                      fontFamily={'Raleway-Medium'}>
                      {firstNameErrorMessage}
                    </Typography>
                  </Stack>
                )}
                <TextField
                  id='outlined-basic'
                  label='Last Name'
                  variant='outlined'
                  sx={{ margin: '10px' }}
                  onChange={handleChange('lastName')}
                />
                {lastNameErrorMessage && (
                  <Stack
                    direction='row'
                    spacing={1}
                    sx={{ marginLeft: '10px' }}>
                    <Typography
                      variant='subtitle1'
                      color={'orange'}
                      fontFamily={'Raleway-Medium'}>
                      {lastNameErrorMessage}
                    </Typography>
                  </Stack>
                )}
                <TextField
                  id='outlined-basic'
                  label='Email Address'
                  variant='outlined'
                  sx={{ margin: '10px' }}
                  onBlur={() => {
                    if (
                      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                        values.email
                      )
                    ) {
                      getEmailStatus({ email: values.email });
                    } else {
                      setEmailErrorMessage('Please enter valid email id!.');
                    }
                  }}
                  onChange={handleChange('email')}
                />
                {emailErrorMessage && (
                  <Stack
                    direction='row'
                    spacing={1}
                    sx={{ marginLeft: '10px' }}>
                    <Typography
                      variant='subtitle1'
                      color={'orange'}
                      fontFamily={'Raleway-Medium'}>
                      {emailErrorMessage}
                    </Typography>
                  </Stack>
                )}

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label='Date of Birth'
                    value={dateValue}
                    onChange={(newValue: any) => {
                      setDateValue(newValue);
                      setValues({
                        ...values,
                        dob: newValue.format('YYYY-MM-DD')
                      });
                    }}
                    renderInput={(params: any) => (
                      <TextField {...params} sx={{ margin: '10px' }} />
                    )}
                  />
                </LocalizationProvider>
                {dobErrorMessage && (
                  <Stack
                    direction='row'
                    spacing={1}
                    sx={{ marginLeft: '10px' }}>
                    <Typography
                      variant='subtitle1'
                      color={'orange'}
                      fontFamily={'Raleway-Medium'}>
                      {dobErrorMessage}
                    </Typography>
                  </Stack>
                )}
                <FormLabel
                  id='demo-row-radio-buttons-group-label'
                  sx={{ marginLeft: '18px', color: 'rgba(112,112,112,1)' }}>
                  Gender
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby='demo-row-radio-buttons-group-label'
                  name='row-radio-buttons-group'
                  sx={{ marginLeft: '18px', color: 'rgba(112,112,112,1)' }}>
                  <FormControlLabel
                    value='Male'
                    control={<Radio onChange={handleChange('gender')} />}
                    label='Male'
                  />
                  <FormControlLabel
                    value='Female'
                    control={<Radio onChange={handleChange('gender')} />}
                    label='Female'
                  />
                </RadioGroup>
                {genderErrorMessage && (
                  <Stack
                    direction='row'
                    spacing={1}
                    sx={{ marginLeft: '10px' }}>
                    <Typography
                      variant='subtitle1'
                      color={'orange'}
                      fontFamily={'Raleway-Medium'}>
                      {genderErrorMessage}
                    </Typography>
                  </Stack>
                )}
                <TextField
                  type={'password'}
                  id='outlined-basic'
                  label='Password'
                  variant='outlined'
                  sx={{ margin: '10px' }}
                  onChange={handleChange('password')}
                />
                <TextField
                  type={'password'}
                  id='outlined-basic'
                  label='Confirm Password'
                  variant='outlined'
                  sx={{ margin: '10px' }}
                  // onChange={handleChange("cPassword")}
                  onChange={handleconfirmChange('cPassword')}
                  onKeyPress={handleKeypress}
                />
                {passwordErrorMessage && (
                  <Stack
                    direction='row'
                    spacing={1}
                    sx={{ marginLeft: '10px' }}>
                    <Typography
                      variant='subtitle1'
                      color={'orange'}
                      fontFamily={'Raleway-Medium'}>
                      {passwordErrorMessage}
                    </Typography>
                  </Stack>
                )}

                {signUpErrorMessage && (
                  <Stack
                    direction='row'
                    spacing={1}
                    sx={{ marginLeft: '10px' }}>
                    <Typography
                      variant='subtitle1'
                      color={'orange'}
                      fontFamily={'Raleway-Medium'}>
                      {signUpErrorMessage}
                    </Typography>
                  </Stack>
                )}
              </FormControl>
            </>
            <Box mt={2} mr={14} justifyContent={'center'} textAlign={'center'}>
              <Button
                variant='contained'
                sx={{
                  background: 'rgba(3,30,128,1)',
                  borderRadius: '5px',
                  padding: '10px',
                  width: '95%',
                  color: 'white',
                  fontFamily: 'Raleway-Medium',
                  border: '1px solid rgba(112,112,112,1)'
                }}
                onClick={onSignUpCall}>
                {isLoading && 'Loading'}
                {!isLoading && 'Sign Up'}
              </Button>
            </Box>
          </Box>
        )}
      </Grid>
    </Grid>
  );
};

// export const getServerSideProps = wrapper.getServerSideProps(
//   (store) =>
//     async ({ params }) => {
//       // we can set the initial state from here
//       await store.dispatch(setAuthState(false));

//       console.log("State on server", store.getState());

//       return {
//         props: {
//           authState: false,
//         },
//       };
//     }
// );

export default SignUp;
