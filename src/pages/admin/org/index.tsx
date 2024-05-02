import type { NextPageWithLayout } from '../../_app';
import NextLink from 'next/link';
import { useEffect, ReactElement, useState } from 'react';
import Layout from '../../../layouts/admin/admin';
import TableViewer from '../../../components/admin/table';
import { useRouter } from 'next/router';

import {
  Toolbar,
  Typography,
  Box,
  Container,
  Grid,
  Paper,
  Link,
  Breadcrumbs,
  Button
} from '@mui/material';

import getConfig from 'next/config';
import { regCodeStatusUrlPattern } from '../../../@fake-db/db/login';
const { publicRuntimeConfig } = getConfig();

const columnsDef = [
  { column: 'org_code', columnHeader: 'Org Code', width: '15%' },
  { column: 'name', columnHeader: 'Org Name', width: '25%' },
  { column: 'pincode', columnHeader: 'Postal Code', width: '10%' },
  { column: 'email', columnHeader: 'Org Email', width: '25%' },
  { column: 'contact_number', columnHeader: 'Contact No', width: '15%' }
];

const rows = [];

const Page: NextPageWithLayout = () => {
  const [orgRows, setOrgRows] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch(publicRuntimeConfig.backendApi + '/account/list', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('edat_token')
      }
    })
      .catch((err) => {
        console.log('Error message');
        console.log(err);
      })
      .then(async (res: any) => {
        if (res.ok) {
          const responseData: any = await res.json();
          setOrgRows(responseData['results'].items);
        } else {
          router.push('/');
        }
      });
  }, []);

  const tableConfig = {
    uniqueIdentifier: 'org_code',
    linksTo: {
      name: {
        link: '/admin/org/:org_code'
      },
      editAction: {
        link: '/admin/org/:org_code/editOrg'
      },
      deleteAction: {
        link: '#'
      }
    }
  };

  return (
    <Box
      component='main'
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto'
      }}>
      <Toolbar />
      <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={5}>
          <Grid item xs={8}>
            <Breadcrumbs aria-label='breadcrumb'>
              <NextLink color='inherit' href='/admin/org'>
                Home
              </NextLink>
              <Typography color='text.primary'>Organisations</Typography>
            </Breadcrumbs>
          </Grid>
          <Grid item xs={12}>
            <Box display='flex' justifyContent='space-between'>
              <Typography variant='h4' component='h4' color='GrayText'>
                Organisations
              </Typography>
              <NextLink href='/admin/org/add'>
                <Button
                  variant='contained'
                  size='medium'
                  style={{ backgroundColor: '#1976d2' }}>
                  Add Organisation
                </Button>
              </NextLink>
            </Box>
          </Grid>

          {/* Chart */}
          {/* Recent Orders */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <TableViewer
                columnsDef={columnsDef}
                rows={orgRows}
                totalNoOfRows={-1}
                tableConfig={tableConfig}
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Page;
