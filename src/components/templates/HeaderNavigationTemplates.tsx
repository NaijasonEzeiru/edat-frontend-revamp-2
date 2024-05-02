import { Tab, Tabs, Typography } from "@mui/material";
import { Box } from "@mui/system";
import styled from "@mui/system/styled";
import Image from "next/image";
import { useState } from "react";
import { boolean } from "yup";
import ProfileComponentLoader from "../common/ProfileComponentLoader";
import Subjects from "../student/Subjects";
import TabPanel from "../common/TabPanel";
import ProfileComponentTemplates from "./ProfileComponentTemplates";

const TabWrapper = {
  textTransform: "capitalize",
  fontSize: "10px",
  padding: "1rem",
  minWidth: "auto",
  minHeight: "auto",
  margin: "1rem 1rem",
  cursor: "pointer",
  borderRadius: "5px",
  border: 0,
  color: "white !important",
  backgroundColor: "#7CC5B9",
};

interface propsFormat {
  isFetching: boolean;
  isLoading: boolean;
  data: object;
}

const HeaderNavigationTemplates = (props: propsFormat) => {
  const [tabValue, settabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    settabValue(newValue);
  };

  return (
    <>
      <Box
        sx={{
          borderBottom: 1,
          background: "rgb(229, 229, 229)",
          border: "none",
        }}
      >
        <Tabs
          TabIndicatorProps={{ sx: { height: 0 } }}
          value={tabValue}
          onChange={handleTabChange}
          aria-label="basic tabs example"
        >
          <Tab
            label="Profile"
            sx={tabValue === 0 ? TabWrapper : { textTransform: "capitalize" }}
            id={"profileTab"}
          />
          <Tab
            label="Subjects"
            sx={tabValue === 1 ? TabWrapper : { textTransform: "capitalize" }}
            id="subjectTab"
          />
          <Tab
            label="Class"
            sx={tabValue === 2 ? TabWrapper : { textTransform: "capitalize" }}
            id="classTab"
          />
          <Tab
            label="Activities"
            sx={tabValue === 3 ? TabWrapper : { textTransform: "capitalize" }}
            id="activitiesTab"
          />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        {(props.isFetching || props.isLoading) && <ProfileComponentLoader />}
        {(!props.isFetching || !props.isLoading) && props.data && (
          <ProfileComponentTemplates data={props.data} />
        )}
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <Subjects />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <label>Class Coming Soon</label>
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <label>Activities Coming Soon</label>
      </TabPanel>
    </>
  );
};

export default HeaderNavigationTemplates;
