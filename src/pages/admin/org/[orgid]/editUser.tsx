import type { NextPageWithLayout } from "../../../_app";
import * as React from "react";

import Layout from "../../../../layouts/admin/admin";
import { useRouter } from "next/router";

import {
  Toolbar,
  Typography,
  Box,
  Container,
  Grid,
  Paper,
  Link,
  Breadcrumbs,
} from "@mui/material";

import AddUserForm from "../../../../components/admin/forms/AddUser";

const Page: NextPageWithLayout = () => {
  const router = useRouter();
  const { orgid } = router.query;

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
        flexGrow: 1,
        height: "100vh",
        overflow: "auto",
      }}
    >
      <Toolbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={5}>
          <Grid item xs={8}>
            <Breadcrumbs aria-label="breadcrumb">
              <Link underline="hover" color="inherit" href="/admin/org">
                Home
              </Link>
              <Link underline="hover" color="inherit" href="/admin/org">
                Organisations
              </Link>
              <Link underline="hover" color="inherit" href="/org">
                Test Org 1
              </Link>
              <Typography color="text.primary">Add User</Typography>
            </Breadcrumbs>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h4" component="h4">
                Add user
              </Typography>
            </Box>
          </Grid>

          {/* Chart */}
          {/* Recent Orders */}
          <Grid item xs={8}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <AddUserForm />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

Page.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout menu="org">{page}</Layout>;
};

export default Page;
