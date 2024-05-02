import type { NextPageWithLayout } from "../../../_app";
import * as React from "react";

import Layout from "../../../../layouts/admin/admin";
import TableViewer from "../../../../components/admin/table";
import { useRouter } from "next/router";
import Iframe from "react-iframe";
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

const Page: NextPageWithLayout = () => {
  const router = useRouter();

  const { orgid } = router.query || {};

  const [OrgDetails, setOrgDetails] = React.useState<OrgDetails>({
    name: "",
    org_code: 0,
    billing_address: "NA",
    contact_number: "NA",
    created_by: 0,
    email: "NA",
    pincode: "NA",
  });

  const orgLink = "/admin/org/" + orgid;

  React.useEffect(() => {
    if (orgid !== undefined) {
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
                Report
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Iframe
              width="100%"
              height="800"
              url="https://datastudio.google.com/embed/reporting/a97c9635-da59-45c2-9019-3bcda3c0ab5b/page/qgR"
            />
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
