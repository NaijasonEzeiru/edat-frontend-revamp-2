import type { NextPageWithLayout } from "../../../_app";
import * as React from "react";
import PrintIcon from "@mui/icons-material/Print";
import "jspdf-autotable";
import jsPDF from "jspdf";
import { CSVLink } from "react-csv";
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
  Popover,
} from "@mui/material";

import TableViewer from "../../../../components/admin/table";

import getConfig from "next/config";
import { GetApp } from "@mui/icons-material";

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
interface IPdf extends jsPDF {
  autoTable({
    theme,
    columns: [{ field, title, dataKey }],
    body,
    startY,
    startX,
  }: {
    startY: number;
    startX: number;
    theme: "striped" | "grid" | "plain";
    columns: { field: string; title: string; dataKey: string }[];
    body: string[];
  });
}

const columnsDef = [
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

const Page: NextPageWithLayout = () => {
  const [licenseRows, setLicenseRows] = React.useState([]);
  const [openExportMenu, setOpenExportMenu] = React.useState("none");
  const router = useRouter();
  const { orgid } = router.query || {};

  const linkToAddLicenses = "/admin/org/" + orgid + "/addLicenses";

  const [OrgDetails, setOrgDetails] = React.useState<OrgDetails>({
    name: "NA",
    org_code: 0,
    billing_address: "NA",
    contact_number: "NA",
    created_by: 0,
    email: "NA",
    pincode: "NA",
  });

  const downloadPdf = () => {
    const doc = new jsPDF("portrait", "pt", "A4") as IPdf;
    doc.text("Licenses", 38, 40);
    doc.autoTable({
      startY: 55,
      startX: 35,
      theme: "striped",
      columns: columnsDef.map((col) => ({
        field: col.column,
        title: col.columnHeader,
        dataKey: col.column,
      })),
      body: licenseRows,
    });
    doc.save(`${OrgDetails?.name}_licenses.pdf`);
  };

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
          if (!res.ok) {
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
          console.log("response");
          if (!res.ok) {
            // redirect to login
            router.push("/");
          }
          const responseData = await res.json();
          const fLincenses = responseData?.results?.items.filter(
            (item) => item.licence_type !== "parent"
          );
          setLicenseRows(fLincenses);
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
              <Typography variant="h4" component="h4" color="black">
                Licenses
              </Typography>
              <div
                style={{
                  position: "relative",
                  paddingInline: "27px",
                }}
              >
                <Button
                  endIcon={<GetApp />}
                  onClick={() =>
                    setOpenExportMenu(
                      openExportMenu == "none" ? "grid" : "none"
                    )
                  }
                  variant="contained"
                  size="medium"
                  style={{ backgroundColor: "#1976d2" }}
                >
                  Export Table
                </Button>
                <span
                  style={{
                    display: openExportMenu,
                    position: "absolute",
                    paddingInline: "15px",
                    background: "white",
                    left: "33px",
                    top: "36px",
                  }}
                >
                  <Button
                    startIcon={<PrintIcon />}
                    variant="text"
                    size="medium"
                  >
                    <CSVLink
                      data={licenseRows}
                      filename={`${OrgDetails?.name}_license_table`}
                    >
                      Export as CSV
                    </CSVLink>
                  </Button>
                  <Button
                    startIcon={<PrintIcon />}
                    onClick={() => downloadPdf()}
                    variant="text"
                    size="medium"
                  >
                    Export as PDF
                  </Button>
                </span>
              </div>
              <Button
                variant="contained"
                style={{ backgroundColor: "#1976d2" }}
                size="medium"
                onClick={() => router.push(linkToAddLicenses)}
              >
                Add License Pool
              </Button>
            </Box>
          </Grid>
          {/* Recent Orders */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <TableViewer
                columnsDef={columnsDef}
                rows={licenseRows}
                // totalNoOfRows={11}
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
