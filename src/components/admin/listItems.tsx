import {
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import NextLink from "next/link";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import GradingIcon from "@mui/icons-material/Grading";
import GroupsIcon from "@mui/icons-material/Groups";
import GroupIcon from "@mui/icons-material/Group";

export function MainListItems(props: any) {
  return (
    <div>
      <NextLink href="/admin/org">
        <ListItem button>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
      </NextLink>
      <NextLink href="/admin/org">
        <ListItem button>
          <ListItemIcon>
            <BusinessIcon />
          </ListItemIcon>
          <ListItemText primary="Organisations" />
        </ListItem>
      </NextLink>
      <ListItem button>
        <ListItemIcon>
          <AppRegistrationIcon />
        </ListItemIcon>
        <ListItemText primary="Batch Jobs" />
      </ListItem>
    </div>
  );
}

export function OrgListItems(props: any) {
  const orgid = props.orgid;
  const orgLink = "/admin/org/" + orgid;
  const teachersLink = "/admin/org/" + orgid + "/teachers";
  const studentsLink = "/admin/org/" + orgid + "/students";
  const parentsLink = "/admin/org/" + orgid + "/parents";
  const licensesLink = "/admin/org/" + orgid + "/licenses";
  const ordersLink = "/admin/org/" + orgid + "/orders";
  // const reportsLink = '/admin/org/' + orgid + '/reports';
  const adminsLink = "/admin/org/" + orgid + "/admins";

  return (
    <div>
      {props.userInfo.role == "super admin" ? (
        <NextLink href="/admin/org">
          <ListItem button>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
        </NextLink>
      ) : (
        ""
      )}
      <NextLink href={orgLink}>
        <ListItem button>
          <ListItemIcon>
            <BusinessIcon />
          </ListItemIcon>
          <ListItemText primary="Subscription Details" />
        </ListItem>
      </NextLink>
      <NextLink href={adminsLink}>
        <ListItem button>
          <ListItemIcon>
            <GroupIcon />
          </ListItemIcon>
          <ListItemText primary="Admins" />
        </ListItem>
      </NextLink>
      <NextLink href={teachersLink}>
        <ListItem button>
          <ListItemIcon>
            <GroupIcon />
          </ListItemIcon>
          <ListItemText primary="Teachers" />
        </ListItem>
      </NextLink>
      <NextLink href={studentsLink}>
        <ListItem button>
          <ListItemIcon>
            <GroupsIcon />
          </ListItemIcon>
          <ListItemText primary="Students" />
        </ListItem>
      </NextLink>
      <NextLink href={parentsLink}>
        <ListItem button>
          <ListItemIcon>
            <GroupsIcon />
          </ListItemIcon>
          <ListItemText primary="Parents" />
        </ListItem>
      </NextLink>
      <NextLink href={ordersLink}>
        <ListItem button>
          <ListItemIcon>
            <GradingIcon />
          </ListItemIcon>
          <ListItemText primary="Orders" />
        </ListItem>
      </NextLink>
      <NextLink href={licensesLink}>
        <ListItem button>
          <ListItemIcon>
            <CardMembershipIcon />
          </ListItemIcon>
          <ListItemText primary="Licenses" />
        </ListItem>
      </NextLink>
      {/* <ListItem button>
        <ListItemIcon>
          <AdminPanelSettingsIcon />
        </ListItemIcon>
        <ListItemText primary='Roles' />
      </ListItem> */}
      {/* <ListItem button component='a' href={reportsLink}>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary='Reports' />
      </ListItem> */}
    </div>
  );
}

export function SecondaryListItems(props: any) {
  return (
    <div>
      <ListSubheader inset>Saved reports</ListSubheader>
      <ListItem button>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Current month" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Last quarter" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Year-end sale" />
      </ListItem>
    </div>
  );
}
