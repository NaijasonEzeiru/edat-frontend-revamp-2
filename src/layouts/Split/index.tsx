import { Box, Grid } from "@mui/material";
import React from "react";

/**
 * Split grid layout divided into separate vertically scrollable parts
 * @param props children components to display
 */
const Split = (props: {
  children: React.ReactNode[];
  customHeight?: string;
}) => {
  const components = props.children;
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        height: props.customHeight ?? "calc(100vh)",
      }}
    >
      <Grid
        data-testid="grid-container"
        container
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        {components.map((component: React.ReactNode, i: number) => {
          const bgColor = i % 2 === 0 ? 'white' : 'grey';
          return (
            <Grid
              item
              xs={6}
              sx={{
                flexGrow: 1,
                overflow: "auto",
                width: "50%",
                minHeight: "100%",
                padding: "1% 3%",
              }}
              style={{ backgroundColor: bgColor }}
              key={i}
            >
              {component}
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default Split;
