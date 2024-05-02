import type { NextPageWithLayout } from "../../../_app";
import * as React from "react";
import NextLink from "next/link";
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

interface OrgDetails {
  name: string;
  org_code: Number;
  billing_address: string;
  contact_number: string;
  created_by: Number;
  email: string;
  pincode: string;
}

const columnsDef = [
  { column: "order_name", columnHeader: "Order Name", width: "15%" },
  { column: "org_code", columnHeader: "Org Code", width: "10%" },
  { column: "payment_mode", columnHeader: "Payment Mode", width: "15%" },
  { column: "valid_days", columnHeader: "Valid Days", width: "15%" },
  { column: "total_licence", columnHeader: "Total License", width: "10%" },
  { column: "cost", columnHeader: "Cost", width: "15%" },
  {
    column: "created_at",
    columnHeader: "Created At",
    width: "10",
    columnFormatting: {
      type: "date",
      format: "MM/DD/YYYY",
    },
  },
  {
    column: "updated_at",
    columnHeader: "Updated At",
    width: "10%",
    columnFormatting: {
      type: "date",
      format: "MM/DD/YYYY",
    },
  },
];

const Page: NextPageWithLayout = () => {
  const [orderRows, setOrderRows] = React.useState([]);
  const router = useRouter();
  const { orgid } = router.query || {};

  const linkToCreateOrder = "/admin/org/" + orgid + "/createOrder";

  const [OrgDetails, setOrgDetails] = React.useState<OrgDetails>({
    name: "NA",
    org_code: 0,
    billing_address: "NA",
    contact_number: "NA",
    created_by: 0,
    email: "NA",
    pincode: "NA",
  });

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

      // fetch license details

      fetch(publicRuntimeConfig.backendApi + "/licence/orders/list/" + orgid, {
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
          console.log("response");
          if (res.status == 401) {
            // redirect to login
            router.push("/");
          }
          const responseData = await res.json();
          console.log(responseData);
          setOrderRows(responseData["results"].items);
        });
    }
  }, [orgid]);

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
              <NextLink underline="hover" color="inherit" href="/admin/org">
                Home
              </NextLink>
              <NextLink underline="hover" color="inherit" href="/admin/org">
                Organisations
              </NextLink>
              <NextLink underline="hover" color="inherit" href={orgLink}>
                <Typography color="text.primary">
                  {OrgDetails.hasOwnProperty("name") ? OrgDetails.name : ""}
                </Typography>
              </NextLink>
            </Breadcrumbs>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h4" component="h4">
                Orders
              </Typography>
              <NextLink href={linkToCreateOrder}>
                <Button
                  variant="contained"
                  size="medium"
                  style={{ backgroundColor: "#1976d2" }}
                >
                  Create Order
                </Button>
              </NextLink>
            </Box>
          </Grid>
          {/* Recent Orders */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <TableViewer
                columnsDef={columnsDef}
                rows={orderRows}
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
