import * as React from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import * as Yup from "yup";

import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Stack,
  Typography,
  Grid,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Avatar,
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";

import { styled } from "@mui/material/styles";

import EventBus from "../../utils/eventBus";

import { AppState, AppDispatch } from "../../store/store";
import ProtectedRoute from "../../components/route/ProtectedRoute";

import DefaultLayout from "../../layouts/DefaultLayout";
import EditSkillSetForm from "../../components/teacher/EditSkillSetForm";
import SkillSetActionMenu from "../../components/teacher/SkillSetActionMenu";

import {
  useLazyGetSkillSetQuery,
  useDeleteSkillMutation,
} from "../../services/teacherApi";
import {
  useLazyGetSubjectsQuery,
  useLazyGetLevelsQuery,
} from "../../services/contentApi";

const Row = styled(Stack)({
  paddingBottom: "50px",
});

const AddStudentSchema = Yup.object().shape({
  selectedSkillSet: Yup.array().min(1, "Select at least one student"),
});

const avatarColors = [
  "#F44336",
  "#E91E63",
  "#9C27B0",
  "#673AB7",
  "#3F51B5",
  "#2196F3",
  "#00BCD4",
  "#009688",
];

const Skills = () => {
  const router = useRouter();
  const user = useSelector((state: AppState) => state.auth);

  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [openAddSkillSetDialog, setOpenAddSkillSetDialog] = useState(false);
  const [openEditSkillSetDialog, setOpenEditSkillSetDialog] = useState(false);
  const [selectedSkillSet, setSelectedSkillSet] = useState([]);
  const [subjectetList, subjecetResponse] = useLazyGetSubjectsQuery();
  const [subject, setSubject] = useState([]);
  const [levels, setLevels] = useState([]);
  const [level] = useLazyGetLevelsQuery();
  const [skillSet, { isLoading, isFetching, error, data }] =
    useLazyGetSkillSetQuery();
  const [deleteSkill] = useDeleteSkillMutation();

  const dispatch = useDispatch();

  const menus = ["add skillset", "view"];

  const handleOptionsClick = (event: any, skillset: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedSkillSet(skillset);
  };

  const handleAddSkillSetClick = (event: any) => {
    setOpenAddSkillSetDialog(true);
  };

  const handleOptionsClose = () => {
    setAnchorEl(null);
  };

  const handleAddSkillSetDialogClose = () => {
    setOpenAddSkillSetDialog(false);
    setSelectedSkillSet([]);
  };

  const handleEditSkillSetDialogClose = () => {
    setOpenEditSkillSetDialog(false);
    setSelectedSkillSet([]);
  };

  const deleteSkillSet = async () => {
    try {
      let body = {
        subject_id: selectedSkillSet.subject_id,
        experience: selectedSkillSet.experience,
        level_id: selectedSkillSet.level_id,
        org_code: user.org_code,
        teacher_id: user.user_id,
      };
      const response = await deleteSkill(body).unwrap();

      EventBus.emit("SKILLSET", "fetchSkillSet");
      EventBus.emit("ALERT", {
        message: "Skillset Deleted successfully",
        alertType: "success",
        openStatus: true,
      });
    } catch (error: any) {
      const status = error.status;
      if (status) {
        if (status >= 200 && status < 300) {
          console.log("Skill fetched successfully");
        } else {
          console.error("Skill fetched failed with status:", status);
          EventBus.emit("ALERT", {
            message: "Skillset deletion failed",
            alertType: "error",
            openStatus: true,
          });
        }
      } else {
        console.error("Error fetching skill:", error);
      }
    } finally {
      //setSubmitting(false);
    }
  };

  const handleOptionsMenuItemClick = (skillset: any, menuItem: any) => {
    if (menuItem === "ADD_SKILLSET") {
      console.log("test");
      setAnchorEl(null);
      setOpenAddSkillSetDialog(true);
    }

    if (menuItem === "EDIT_SKILLSET") {
      setAnchorEl(null);
      setOpenEditSkillSetDialog(true);
      setSelectedSkillSet(skillset);
    }

    if (menuItem === "DELETE_SKILLSET") {
      setAnchorEl(null);
      setSelectedSkillSet(skillset);
      deleteSkillSet();
    }
  };

  const filteredSkillSet = data?.filter((skillset) =>
    skillset.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchSubjectList = async () => {
    try {
      const response = await subjectetList({
        userId: user.user_id,
        orgCode: user.org_code,
      }).unwrap();

      setSubject(response);
    } catch (error: any) {
      const status = error.status;
      if (status) {
        if (status >= 200 && status < 300) {
          console.log("Skill fetched successfully");
        } else {
          console.error("Skill fetched failed with status:", status);
          EventBus.emit("ALERT", {
            message: "Skillset fetching is failed",
            alertType: "error",
            openStatus: true,
          });
        }
      } else {
        console.error("Error fetching skill:", error);
      }
    } finally {
      //setSubmitting(false);
    }
  };

  const fetchLevelList = async () => {
    try {
      const response = await level({
        userId: user.user_id,
        orgCode: user.org_code,
      }).unwrap();

      setLevels(response);
    } catch (error: any) {
      const status = error.status;
      if (status) {
        if (status >= 200 && status < 300) {
          console.log("Levels fetched successfully");
        } else {
          console.error("Levels fetched failed with status:", status);
          EventBus.emit("ALERT", {
            message: "Levels fetching is failed",
            alertType: "error",
            openStatus: true,
          });
        }
      } else {
        console.error("Levels fetching skill:", error);
      }
    } finally {
      //setSubmitting(false);
    }
  };

  const fetchSkillSetListener = ({ message, alertType, openStatus }: any) => {
    skillSet({
      userId: user.user_id,
      orgCode: user.org_code,
    });
  };

  useEffect(() => {
    if (user.isLoggedIn) {
      skillSet({
        userId: user.user_id,
        orgCode: user.org_code,
      });
      fetchSubjectList();
      fetchLevelList();
    }

    EventBus.on("SKILLSET", fetchSkillSetListener);

    return () => {
      EventBus.off("SKILLSET", fetchSkillSetListener);
    };
  }, [subjectetList, levels, skillSet, user]);

  return (
    <ProtectedRoute allowedRoles={["teacher"]}>
      <DefaultLayout
        children={
          <>
            {data && data.length > 0 && (
              <Grid container spacing={2}>
                <Grid item xs={12} sx={{ mt: 2, mb: 2 }} sm={6} md={7}>
                  <TextField
                    label="Search skillset"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    InputProps={{
                      startAdornment: (
                        <IconButton>
                          <SearchIcon />
                        </IconButton>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sx={{ mt: 5, mb: 2 }} sm={6} md={4}>
                  <Button
                    onClick={(event) =>
                      handleOptionsMenuItemClick({}, "ADD_SKILLSET")
                    }
                    variant="outlined"
                  >
                    Add Skill
                  </Button>
                </Grid>
              </Grid>
            )}
            {data && data.length === 0 ? (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={12}>
                  <Typography variant="body1" gutterBottom>
                    No Skillset found. You can create a new skillset:
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Button
                    onClick={(event) =>
                      handleOptionsMenuItemClick({}, "ADD_SKILLSET")
                    }
                    variant="outlined"
                  >
                    Add Skill
                  </Button>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Dialog
                    open={openAddSkillSetDialog}
                    fullWidth
                    onClose={handleAddSkillSetDialogClose}
                  >
                    <DialogTitle>Add Skill</DialogTitle>
                    <DialogContent>
                      <EditSkillSetForm
                        subject={subject}
                        levels={levels}
                        initialData={{}}
                        op={"add"}
                      />
                    </DialogContent>
                  </Dialog>
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={2}>
                {data &&
                  filteredSkillSet.map((skillset, index) => (
                    <Grid
                      key={`${index}-${skillset.id}`}
                      item
                      xs={12}
                      sm={6}
                      md={4}
                    >
                      <Card
                        sx={{ background: "#2ca1", borderRadius: "10px" }}
                        className="skillset-card"
                      >
                        <CardHeader
                          avatar={
                            <Avatar
                              sx={{ width: 50, height: 50, marginLeft: "0px" }}
                              style={{
                                backgroundColor:
                                  avatarColors[index % avatarColors.length],
                              }}
                            >
                              {skillset.subject.charAt(0)}
                            </Avatar>
                          }
                          title={skillset.subject}
                          subheader={`Level ${skillset.level} | Exp ${skillset.experience}`}
                          action={
                            <IconButton
                              key={index}
                              onClick={(event) =>
                                handleOptionsClick(event, skillset)
                              }
                            >
                              <MoreVertIcon />
                            </IconButton>
                          }
                        />
                        <CardContent></CardContent>
                        <SkillSetActionMenu
                          handleOptionsMenuItemClick={
                            handleOptionsMenuItemClick
                          }
                          handleOptionsClose={handleOptionsClose}
                          skillset={selectedSkillSet}
                          anchorEl={anchorEl}
                        />
                      </Card>
                    </Grid>
                  ))}
              </Grid>
            )}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12}>
                <Dialog
                  open={openAddSkillSetDialog}
                  fullWidth
                  onClose={handleAddSkillSetDialogClose}
                >
                  <DialogTitle>Add Skill</DialogTitle>
                  <DialogContent>
                    <EditSkillSetForm
                      subject={subject}
                      levels={levels}
                      initialData={{}}
                      op={"add"}
                      closeForm={handleAddSkillSetDialogClose}
                    />
                  </DialogContent>
                </Dialog>
                <Dialog
                  open={openEditSkillSetDialog}
                  fullWidth
                  onClose={handleEditSkillSetDialogClose}
                >
                  <DialogTitle>Edit Skill</DialogTitle>
                  <DialogContent>
                    <EditSkillSetForm
                      subject={subject}
                      levels={levels}
                      initialData={selectedSkillSet}
                      op={"edit"}
                      closeForm={handleEditSkillSetDialogClose}
                    />
                  </DialogContent>
                </Dialog>
              </Grid>
            </Grid>
          </>
        }
      />
    </ProtectedRoute>
  );
};

export default Skills;
