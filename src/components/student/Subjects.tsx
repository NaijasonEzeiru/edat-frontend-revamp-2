import * as React from "react";
import { styled } from "@mui/material/styles";
import { amber, green, red } from "@mui/material/colors";
import AddCircle from "@mui/icons-material/AddCircle";
import {
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Divider,
} from "@mui/material";
import { LuBookUp, LuDumbbell } from "react-icons/lu";
import { Dangerous } from "@mui/icons-material";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  registerables,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ...registerables
);

const componentStyle = {
  border: "1px solid #80808069",
  borderRadius: "10px",
  backgroundColor: "white",
  paddingTop: "10px",
};

const marginHeader = {
  marginLeft: "16px",
};

const Subjects = () => {
  return (
    <Grid container spacing={2} sx={{ marginTop: "15px" }}>
      <Grid item xs={8} sx={{ paddingRight: "20px" }}>
        <Typography variant="h5" gutterBottom style={marginHeader}>
          Mathematics
        </Typography>

        <Typography variant="subtitle1" gutterBottom style={marginHeader}>
          Below is a summary of your ward's perfomance in Mathematics
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: green[700] }} variant="circular">
                  <LuDumbbell />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Strengths"
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      Laws of indices
                    </Typography>
                    {/* {" — Wish I could come, but I'm out of town this…"} */}
                  </React.Fragment>
                }
              />
            </ListItem>
          </Grid>
          <Grid item xs={6}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: red[700] }} variant="circular">
                  {/* <PiSealWarning /> */}
                  <Dangerous />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Areas of Improvement"
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      Change subject of the formula
                    </Typography>
                    {
                      " — Study further - https://www.math-only-math.com/change-the-subject-of-a-formula.html"
                    }
                  </React.Fragment>
                }
              />
            </ListItem>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={4} style={componentStyle}>
        <Typography variant="h5" gutterBottom>
          Notification
        </Typography>
        <Divider />
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
            </ListItemAvatar>
            <ListItemText
              primary="Brunch this weekend?"
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: "inline" }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    Ali Connors
                  </Typography>
                  {" — I'll be in your neighborhood doing errands this…"}
                </React.Fragment>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
            </ListItemAvatar>
            <ListItemText
              primary="Summer BBQ"
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: "inline" }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    to Scott, Alex, Jennifer
                  </Typography>
                  {" — Wish I could come, but I'm out of town this…"}
                </React.Fragment>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
            </ListItemAvatar>
            <ListItemText
              primary="Oui Oui"
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: "inline" }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    Sandra Adams
                  </Typography>
                  {" — Do you have Paris recommendations? Have you ever…"}
                </React.Fragment>
              }
            />
          </ListItem>
        </List>
      </Grid>
    </Grid>
  );
};

export default Subjects;
