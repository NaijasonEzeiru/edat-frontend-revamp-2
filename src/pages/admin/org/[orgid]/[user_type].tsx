import type { NextPageWithLayout } from "../../../_app";
import * as React from "react";
import { AppState } from "../../../../store/store";
import { useSelector, useDispatch } from "react-redux";
import Layout from "../../../../layouts/admin/admin";
import { useRouter } from "next/router";
import ErrorPage from "next/error";

import {
  Toolbar,
  Typography,
  Box,
  Container,
  Grid,
  Paper,
  Link,
  Breadcrumbs,
  Button,
} from "@mui/material";

import TableViewer from "../../../../components/admin/table";

import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

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

interface PathParams {
  licence_type: string;
  singular_name: string;
  name: string;
}

interface PageValues {
  [key: string]: PathParams;
}

const pageValues: PageValues = {
  students: {
    licence_type: "student",
    singular_name: "Student",
    name: "Students",
  },
  teachers: {
    licence_type: "teacher",
    singular_name: "Teacher",
    name: "Teachers",
  },
  parents: {
    licence_type: "parent",
    singular_name: "Parent",
    name: "Parents",
  },
  admins: {
    licence_type: "account admin",
    singular_name: "Org Admin",
    name: "Organisation Admin",
  },
};

interface OrgDetails {
  name: string;
  org_code: Number;
  billing_address: string;
  contact_number: string;
  created_by: Number;
  email: string;
  pincode: string;
}

const Page: NextPageWithLayout = () => {
  const user = useSelector((state: AppState) => state.auth);

  const [studentRows, setStudentRows] = React.useState([]);
  const router = useRouter();
  const { orgid, user_type } = router.query || {};

  const [OrgDetails, setOrgDetails] = React.useState<OrgDetails>({
    name: "NA",
    org_code: 0,
    billing_address: "NA",
    contact_number: "NA",
    created_by: 0,
    email: "NA",
    pincode: "NA",
  });

  const linkToAddUser = "/admin/org/" + orgid + "/addUser";

  React.useEffect(() => {
    if (orgid !== undefined && user_type !== undefined) {
      // fetch org info
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

      fetch(
        `${publicRuntimeConfig.backendApi}/users/list/${orgid}/${user.user_id}?licence_type=${licence_type}`,
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
          const responseData = await res.json();
          console.log(responseData["results"].items);
          setStudentRows(responseData["results"].items);
        });
    }
  }, [orgid, user_type]);

  const { licence_type, singular_name, name }: PathParams =
    typeof user_type == "string" && pageValues.hasOwnProperty(user_type)
      ? pageValues[user_type]
      : {
          licence_type: "student",
          singular_name: "Student",
          name: "Students",
        };

  const orgLink = "/admin/org/" + orgid;

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
              <Link underline="hover" color="inherit" href={orgLink}>
                <Typography color="text.primary">
                  {OrgDetails.hasOwnProperty("name") ? OrgDetails.name : ""}
                </Typography>
              </Link>
            </Breadcrumbs>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h4" component="h4">
                {name}
              </Typography>
              {/* <Button variant="contained" size="medium" href={linkToAddUser}>Add {singular_name}</Button> */}
            </Box>
          </Grid>
          {/* Recent Orders */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <TableViewer
                columnsDef={columnsDef}
                rows={studentRows}
                totalNoOfRows={11}
              />
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
