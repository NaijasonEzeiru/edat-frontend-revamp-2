import type { NextPageWithLayout } from "../../../_app";
import * as React from "react";
import { AppState } from "../../../../store/store";
import { useSelector, useDispatch } from "react-redux";
import Layout from "../../../../layouts/admin/admin";
import TableViewer from "../../../../components/admin/table";
import { useRouter } from "next/router";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

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

interface OrgDetails {
  name: string;
  org_code: Number;
  billing_address: string;
  contact_number: string;
  created_by: Number;
  email: string;
  pincode: string;
}

const licenseColumnsDef = [
  { column: "org_code", columnHeader: "Org Code", width: "10%" },
  { column: "reg_code", columnHeader: "Reg Code", width: "20%" },
  { column: "parent_reg_code", columnHeader: "Parent Reg Code", width: "20%" },
  {
    column: "status",
    columnHeader: "Status",
    width: "15%",
    columnFormatting: {
      type: "select",
      options: {
        active: "Active",
        not_activated: "Not Activated",
      },
    },
  },
  { column: "user_id", columnHeader: "User Id", width: "10%" },
  { column: "licence_type", columnHeader: "License Type", width: "15%" },

  {
    column: "licence_start_date",
    columnHeader: "License Start Date",
    width: "15%",
    columnFormatting: {
      type: "date",
      format: "MM/DD/YYYY",
    },
  },
  {
    column: "licence_end_date",
    columnHeader: "License End Date",
    width: "15%",
    columnFormatting: {
      type: "date",
      format: "MM/DD/YYYY",
    },
  },
];

const columnsDef = [
  { column: "user_id", columnHeader: "User Id", width: "10%" },
  { column: "user_name", columnHeader: "Username", width: "10%" },
  { column: "email", columnHeader: "Email", width: "15%" },
  { column: "status", columnHeader: "Status", width: "10%" },
  { column: "licence_type", columnHeader: "License Type", width: "15%" },
  {
    column: "licence_start_date",
    columnHeader: "License Start Date",
    width: "15%",
    columnFormatting: {
      type: "date",
      format: "MM/DD/YYYY",
    },
  },
  {
    column: "licence_end_date",
    columnHeader: "License End Date",
    width: "15%",
    columnFormatting: {
      type: "date",
      format: "MM/DD/YYYY",
    },
  },
];

const Page: NextPageWithLayout = () => {
  const router = useRouter();

  const user = useSelector((state: AppState) => state.auth);

  const { orgid } = router.query || {};

  const [OrgDetails, setOrgDetails] = React.useState<OrgDetails>({
    name: "NA",
    org_code: 0,
    billing_address: "NA",
    contact_number: "NA",
    created_by: 0,
    email: "NA",
    pincode: "NA",
  });
  const [licenseRows, setLicenseRows] = React.useState([]);
  const [studentRows, setStudentRows] = React.useState([]);
  const [teacherRows, setTeacherRows] = React.useState([]);
  const [parentRows, setParentRows] = React.useState([]);

  React.useEffect(() => {
    if (orgid !== undefined) {
      fetch(publicRuntimeConfig.backendApi + "/account/get?org_code=" + orgid, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("edat_token"),
        },
      })
        .catch((err) => {
          console.log("Error message");
          console.log(err);
        })
        .then(async (res: any) => {
          if (res.status == 401) {
            // redirect to login
            router.push("/");
          }
          console.log("response");
          const responseData = await res.json();
          console.log(responseData);
          setOrgDetails(responseData["results"].items);
        });
      // fetch license details

      fetch(publicRuntimeConfig.backendApi + "/licence/list/" + orgid, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("edat_token"),
        },
      })
        .catch((err) => {
          console.log("Error message");
          console.log(err);
        })
        .then(async (res: any) => {
          if (res.status == 401) {
            // redirect to login
            router.push("/");
          }
          console.log("response");
          const responseData = await res.json();
          const fLincenses = responseData?.results?.items.filter(
            (item) => item.licence_type !== "parent"
          );
          setLicenseRows(fLincenses);
        });

      // fetch students
      fetch(
        `${publicRuntimeConfig.backendApi}/users/list/${orgid}/${user.user_id}?licence_type=student`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("edat_token"),
          },
        }
      )
        .catch((err) => {
          console.log("Error message");
          console.log(err);
        })
        .then(async (res: any) => {
          if (res.status == 401) {
            // redirect to login
            router.push("/");
          }
          console.log("response");
          const responseData = await res.json();
          console.log(responseData["results"].items);
          setStudentRows(responseData["results"].items);
        });

      // fetch teachers
      fetch(
        `${publicRuntimeConfig.backendApi}/users/list/${orgid}/${user.user_id}?licence_type=teacher`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("edat_token"),
          },
        }
      )
        .catch((err) => {
          console.log("Error message");
          console.log(err);
        })
        .then(async (res: any) => {
          if (res.status == 401) {
            // redirect to login
            router.push("/");
          }
          console.log("response");
          const responseData = await res.json();
          console.log(responseData["results"].items);
          setTeacherRows(responseData["results"].items);
        });
      // fetch parents
      fetch(
        `${publicRuntimeConfig.backendApi}/users/list/${orgid}/${user.user_id}?licence_type=parent`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("edat_token"),
          },
        }
      )
        .catch((err) => {
          console.log("Error message");
          console.log(err);
        })
        .then(async (res: any) => {
          if (res.status == 401) {
            // redirect to login
            router.push("/");
          }
          console.log("response");
          const responseData = await res.json();
          console.log(responseData["results"].items);
          setParentRows(responseData["results"].items);
        });
    }
  }, [orgid]);

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
        <Grid container spacing={4}>
          <Grid item xs={8}>
            <Breadcrumbs aria-label="breadcrumb">
              <Link underline="hover" color="inherit" href="/admin/org">
                Home
              </Link>
              <Link underline="hover" color="inherit" href="/admin/org">
                Organisations
              </Link>
            </Breadcrumbs>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h4" component="h4">
                {"name" in OrgDetails ? OrgDetails.name : "NA"}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <Grid container padding={6} spacing={3} direction="row">
                <Grid item xs={6}>
                  <Typography>Organisation code:</Typography>
                  <Typography>{OrgDetails.org_code.toString()}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <b>Billing Address</b>:{" "}
                  </Typography>
                  <Typography>{OrgDetails.billing_address}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <b>Email</b>:{" "}
                  </Typography>
                  <Typography>{OrgDetails.email}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <b>Pin Code</b>:{" "}
                  </Typography>
                  <Typography>{OrgDetails.pincode}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <b>Contact no</b>:{" "}
                  </Typography>
                  <Typography>{OrgDetails.contact_number}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <b>Created by</b>:{" "}
                  </Typography>
                  <Typography>Super Admin</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <b>License start date</b>:{" "}
                  </Typography>
                  <Typography>09/11/2022</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <b>License end date</b>:{" "}
                  </Typography>
                  <Typography>09/11/2023</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          {/* Recent Orders */}

          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h6" component="h6">
                <b>Students</b>
                <br />
                <br />
              </Typography>
            </Box>
            <Paper sx={{ p: 3, display: "flex", flexDirection: "column" }}>
              <TableViewer columnsDef={columnsDef} rows={studentRows} />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h6" component="h6">
                <b>Teachers</b>
                <br />
                <br />
              </Typography>
            </Box>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <TableViewer columnsDef={columnsDef} rows={teacherRows} />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h6" component="h6">
                <b>Parents</b>
                <br />
                <br />
              </Typography>
            </Box>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <TableViewer columnsDef={columnsDef} rows={parentRows} />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h6" component="h6">
                <b>Licenses</b>
                <br />
                <br />
              </Typography>
            </Box>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <TableViewer columnsDef={licenseColumnsDef} rows={licenseRows} />
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
