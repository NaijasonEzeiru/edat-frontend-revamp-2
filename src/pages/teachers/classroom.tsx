import * as React from "react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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

import { DialogProps } from "@mui/material/Dialog";
import SearchIcon from "@mui/icons-material/Search";

import SupervisedUserCircle from "@mui/icons-material/SupervisedUserCircle";
import Task from "@mui/icons-material/Task";
import RemoveRedEye from "@mui/icons-material/RemoveRedEye";

import EventBus from "../../utils/eventBus";

import { AppState } from "../../store/store";
import ProtectedRoute from "../../components/route/ProtectedRoute";
import ClassRoomForm from "../../components/teacher/ClassRoomForm";
import AddStudentForm from "../../components/teacher/AddStudentForm";
import AddTaskForm from "../../components/teacher/AddTaskForm";

import DefaultLayout from "../../layouts/DefaultLayout";

import {
  useLazyGetClassRoomByTeacherQuery,
  useAddStudentMutation,
  useLazyGetCategoriesByClassIdQuery,
} from "../../services/teacherApi";
import { useCreateClassRoomMutation } from "../../services/classRoomApi";
import {
  useLazyGetStudentListQuery,
  useLazyGetStudentListByClassQuery,
} from "../../services/studentApi";
import {
  useLazyGetSubjectsQuery,
  useLazyGetLevelsQuery,
} from "../../services/contentApi";
import AutoTaskForm from "@/components/teacher/AutoTaskForm";
import { useAppSelector } from "@/store/hooks";

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

const ClassRoom = () => {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [classRoomsData, setClassRoomsData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [openAddStudentDialog, setOpenAddStudentDialog] = useState(false);
  const [openSelectTaskTypeDialog, setOpenSelectTaskTypeDialog] =
    useState(false);
  const [openAutoTaskDialog, setOpenAutoTaskDialog] = useState(false);
  const [openAddClassRoomDialog, setOpenAddClassRoomDialog] = useState(false);
  const [openAddTaskDialog, setOpenAddTaskDialog] = useState(false);

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [classStudents, setClassStudents] = useState([]);
  const [classRooms, { isLoading, isFetching, error, data }] =
    useLazyGetClassRoomByTeacherQuery();
  const [studentList] = useLazyGetStudentListQuery();
  const [subjects] = useLazyGetSubjectsQuery();
  const [levels] = useLazyGetLevelsQuery();
  const [classStudent] = useLazyGetStudentListByClassQuery();
  const [addStudent] = useAddStudentMutation();
  const [addClassRoom] = useCreateClassRoomMutation();

  const [levelList, setLevelList] = useState(null);
  const [subjectList, setSubjectList] = useState([]);

  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState<DialogProps["maxWidth"]>("lg");

  const [categorie] = useLazyGetCategoriesByClassIdQuery();
  const [categories, setCategories] = useState([]);

  const handleAddStudentDialogClose = () => {
    setOpenAddStudentDialog(false);
    setSelectedStudents([]);
  };

  const handleAddTaskDialogClose = () => {
    setOpenAddTaskDialog(false);
    setSelectedStudents([]);
  };

  const handleAddClassRoomDialogClose = () => {
    setOpenAddClassRoomDialog(false);
    setSelectedStudents([]);
  };

  const handleSelectTaskTypeClose = () => {
    setOpenSelectTaskTypeDialog(false);
    setSelectedStudents([]);
  };

  const handleAutoTaskDialogClose = () => {
    setOpenAutoTaskDialog(false);
    setSelectedStudents([]);
  };

  const fetchCategoriesBySubjectId = async (classId) => {
    try {
      const response = await categorie({
        orgCode: user.org_code,
        classId: classId,
        userId: user.user_id,
      }).unwrap();
      setCategories(response);
    } catch (error: any) {
      const status = error.status;
      if (status) {
        if (status >= 200 && status < 300) {
          console.log("Skill added successfully");
        } else {
          console.error("Skill addition failed with status:", status);
        }
      } else {
        console.error("Error adding skill:", error);
        EventBus.emit("ALERT", {
          message: "Error while fetching classroom data",
          alertType: "error",
          openStatus: true,
        });
      }
    } finally {
    }
  };

  const fetchStudentList = async () => {
    try {
      const response = await studentList({
        userId: user.user_id,
        orgCode: user.org_code,
      }).unwrap();

      setSelectedStudents(response);
    } catch (error: any) {
      const status = error.status;
      if (status) {
        if (status >= 200 && status < 300) {
          console.log("Student list fetched successfully");
        } else {
          console.error("Student list fetching failed with status:", status);
        }
      } else {
        console.error("Error fetching student list:", error);
        EventBus.emit("ALERT", {
          message: "Error while fetching student list",
          alertType: "error",
          openStatus: true,
        });
      }
    } finally {
    }
  };

  const fetchSubjectList = async () => {
    try {
      const response = await subjects({
        userId: user.user_id,
        orgCode: user.org_code,
      }).unwrap();

      setSubjectList(response);
    } catch (error: any) {
      const status = error.status;
      if (status) {
        if (status >= 200 && status < 300) {
          console.log("Subject list fetched successfully");
        } else {
          console.error("Subject list fetching failed with status:", status);
        }
      } else {
        console.error("Error fetching subject list:", error);
        EventBus.emit("ALERT", {
          message: "Error while fetching subject data",
          alertType: "error",
          openStatus: true,
        });
      }
    } finally {
    }
  };

  const fetchLevelList = async () => {
    try {
      const response = await levels({
        userId: user.user_id,
        orgCode: user.org_code,
      }).unwrap();

      setLevelList(response);
    } catch (error: any) {
      const status = error.status;
      if (status) {
        if (status >= 200 && status < 300) {
          console.log("Student list fetched successfully");
        } else {
          console.error("Student list fetching failed with status:", status);
        }
      } else {
        console.error("Error fetching student list:", error);
        EventBus.emit("ALERT", {
          message: "Error while fetching level data",
          alertType: "error",
          openStatus: true,
        });
      }
    } finally {
    }
  };

  const fetchStudentListByClassId = async ({ class_id }) => {
    try {
      const response = await classStudent({
        userId: user.user_id,
        orgCode: user.org_code,
        classId: class_id,
      }).unwrap();

      const _classStudent: number[] = response.map((st) => st.student_id);
      setClassStudents(_classStudent);
    } catch (error: any) {
      const status = error.status;
      if (status) {
        if (status >= 200 && status < 300) {
          console.log("Student list fetched successfully");
        } else {
          console.error("Student list fetching failed with status:", status);
        }
      } else {
        console.error("Error fetching student list:", error);
        EventBus.emit("ALERT", {
          message: "Error while fetching classroom student list",
          alertType: "error",
          openStatus: true,
        });
      }
    } finally {
    }
  };

  const fetchClassRoomData = async () => {
    try {
      const response = await classRooms({
        userId: user.user_id,
        orgCode: user.org_code,
      }).unwrap();

      setClassRoomsData(response);
    } catch (error: any) {
      const status = error.status;
      if (status) {
        if (status >= 200 && status < 300) {
          console.log("Skill added successfully");
        } else {
          console.error("Skill addition failed with status:", status);
        }
      } else {
        console.error("Error adding skill:", error);
        EventBus.emit("ALERT", {
          message: "Error while fetching classroom data",
          alertType: "error",
          openStatus: true,
        });
      }
    } finally {
    }
  };

  const handleAddSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      let body = {
        class_id: selectedClassroom.class_id,
        students: values.students,
        org_code: user.org_code,
        user_id: user.user_id,
      };
      const response = await addStudent(body).unwrap();
      EventBus.emit("CLASSROOM", "fetchClassRoomData");
      EventBus.emit("ALERT", {
        message: "Student added successfully",
        alertType: "success",
        openStatus: true,
      });
      setOpenAddStudentDialog(false);
      setSelectedClassroom(null);
      setSelectedStudents([]);
      setClassStudents([]);
    } catch (error: any) {
      const status = error.status;
      if (status) {
        if (status >= 200 && status < 300) {
          if (op === "add") {
            console.log("Student added successfully");
          } else {
            console.log("Student updated successfully");
          }
        } else {
          console.error("Student addition failed with status:", status);
          EventBus.emit("ALERT", {
            message: "Student adding to classroom failed",
            alertType: "error",
            openStatus: true,
          });
        }
      } else {
        console.error("Error adding skill:", error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddClassRoom = async (values: any, setSubmitting: any) => {
    try {
      const response = await addClassRoom(values).unwrap();
      EventBus.emit("CLASSROOM", "fetchClassRoomData");
      EventBus.emit("ALERT", {
        message: "Classroom created successfully",
        alertType: "success",
        openStatus: true,
      });
      setOpenAddClassRoomDialog(false);
      setSelectedStudents([]);
    } catch (error: any) {
      const status = error.status;
      if (status) {
        if (status >= 200 && status < 300) {
          console.log("Classroom creation successfully");
        } else if (
          error?.data?.errors?.message ===
          "Integrity Error, please provide unique classroom name"
        ) {
          EventBus.emit("ALERT", {
            message: "A class with the name already exits",
            alertType: "error",
            openStatus: true,
          });
        } else {
          console.error("Classroom creation failed with status:", error);
          EventBus.emit("ALERT", {
            message: "Classroom creation failed",
            alertType: "error",
            openStatus: true,
          });
        }
      } else {
        console.error("Error adding skill:", error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleOptionsMenuItemClick = (classroom: any, menuItem: any) => {
    if (menuItem === "VIEW_CLASS") {
      setAnchorEl(null);
      setSelectedClassroom(classroom);
      router.replace(`/teachers/classroom/${classroom.class_id}`);
    }

    if (menuItem === "ADD_STUDENT") {
      setAnchorEl(null);
      setOpenAddStudentDialog(true);
      setSelectedClassroom(classroom);
      fetchStudentListByClassId(classroom);
      fetchStudentList();
    }

    if (menuItem === "ADD_CLASSROOM") {
      setAnchorEl(null);
      setOpenAddClassRoomDialog(true);
      //setSelectedClassroom(classroom);
    }

    if (menuItem === "ADD_TASK") {
      setAnchorEl(null);
      setOpenAddTaskDialog(true);
      fetchCategoriesBySubjectId(selectedClassroom.class_id);
      //setSelectedClassroom(classroom);
    }
  };

  const filteredClassrooms = data?.filter((classroom) =>
    classroom.class_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (user.isLoggedIn) {
      fetchClassRoomData();
      fetchStudentList();
      fetchLevelList();
      fetchSubjectList();
    }
    EventBus.on("CLASSROOM", fetchClassRoomData);
    return () => {
      EventBus.off("CLASSROOM", fetchClassRoomData);
    };
  }, [user]);

  return (
    <ProtectedRoute allowedRoles={["teacher"]}>
      <DefaultLayout
        children={
          <>
            {data && data.length > 0 && (
              <Grid container spacing={2}>
                <Grid item xs={12} sx={{ mt: 2, mb: 2 }} md={9}>
                  <TextField
                    label="Search Classroom"
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
                <Grid item xs={12} sx={{ mt: 5, mb: 2 }} md={3}>
                  <Button
                    onClick={() =>
                      handleOptionsMenuItemClick({}, "ADD_CLASSROOM")
                    }
                    variant="outlined"
                  >
                    Add Classroom
                  </Button>
                </Grid>
              </Grid>
            )}
            {data && data.length === 0 ? (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body1" gutterBottom>
                    No classrooms found. You can create a new classroom:
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Button
                    onClick={() =>
                      handleOptionsMenuItemClick({}, "ADD_CLASSROOM")
                    }
                    variant="outlined"
                  >
                    Add Classroom
                  </Button>
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={2}>
                {data &&
                  filteredClassrooms.map((classroom, index) => (
                    <Grid key={classroom.class_id} item xs={12} md={6}>
                      <Card
                        sx={{ background: "#2ca1", borderRadius: "10px" }}
                        className="classroom-card"
                      >
                        <CardHeader
                          sx={{ background: "#18c3", borderRadius: "3px" }}
                          avatar={
                            <Avatar
                              style={{
                                backgroundColor:
                                  avatarColors[index % avatarColors.length],
                              }}
                            >
                              {classroom.class_name.charAt(0).toUpperCase()}
                            </Avatar>
                          }
                          title={
                            classroom.class_name.charAt(0).toUpperCase() +
                            classroom.class_name.slice(1)
                          }
                          subheader={`Subject: ${classroom.subject}`}
                        />
                        <Stack
                          flexDirection="row"
                          gap="4px"
                          justifyContent="space-around"
                          sx={{
                            borderBottom: "1px solid #e1e0e0",
                            // backgroundColor: '#2ca1',
                            paddingInline: "16px",
                          }}
                        >
                          <Button
                            startIcon={<RemoveRedEye />}
                            sx={{ flexDirection: "column" }}
                            onClick={() =>
                              router.push(
                                `/teachers/classroom/${classroom.class_id}?class_name=${classroom.class_name}`
                              )
                            }
                          >
                            View Class
                          </Button>
                          <Button
                            startIcon={<SupervisedUserCircle />}
                            sx={{ flexDirection: "column" }}
                            onClick={() => {
                              setAnchorEl(null);
                              setOpenAddStudentDialog(true);
                              setSelectedClassroom(classroom);
                              fetchStudentListByClassId(classroom);
                              fetchStudentList();
                            }}
                          >
                            Add Student
                          </Button>
                          {!!classroom?.total_students && (
                            <Button
                              startIcon={<Task />}
                              sx={{ flexDirection: "column" }}
                              onClick={() => {
                                setAnchorEl(null);
                                setOpenSelectTaskTypeDialog(true);
                                fetchCategoriesBySubjectId(classroom.class_id);
                                setSelectedClassroom(classroom);
                                // console.log({ classroom });
                              }}
                            >
                              Add Task
                            </Button>
                          )}
                        </Stack>
                        <CardContent>
                          <Typography>
                            Total Students: {`${classroom.total_students}`}
                          </Typography>
                        </CardContent>
                        {/* <Menu
                          className={'test'}
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleOptionsClose}>
                          <MenuItem
                            onClick={() =>
                              handleOptionsMenuItemClick(
                                selectedClassroom,
                                'VIEW_CLASS'
                              )
                            }>
                            <ListItemIcon>
                              <RemoveRedEye fontSize='small' />
                            </ListItemIcon>
                            <ListItemText primary='View Class' />
                          </MenuItem>
                          <MenuItem
                            onClick={() =>
                              handleOptionsMenuItemClick(
                                selectedClassroom,
                                'ADD_STUDENT'
                              )
                            }>
                            <ListItemIcon>
                              <SupervisedUserCircle fontSize='small' />
                            </ListItemIcon>
                            <ListItemText primary='Add Sudent' />
                          </MenuItem>
                          {selectedClassroom?.total_students &&
                          selectedClassroom.total_students > 0 ? (
                            <MenuItem
                              onClick={() =>
                                handleOptionsMenuItemClick(
                                  selectedClassroom,
                                  'ADD_TASK'
                                )
                              }>
                              <ListItemIcon>
                                <Task fontSize='small' />
                              </ListItemIcon>
                              <ListItemText primary='Add Task' />
                            </MenuItem>
                          ) : (
                            <span></span>
                          )}
                        </Menu> */}
                      </Card>
                    </Grid>
                  ))}
              </Grid>
            )}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12}>
                <Dialog
                  open={openAddClassRoomDialog}
                  fullWidth
                  onClose={handleAddClassRoomDialogClose}
                >
                  <DialogTitle>Add Class Room</DialogTitle>
                  <DialogContent>
                    <ClassRoomForm
                      studentList={selectedStudents}
                      subjects={subjectList}
                      levels={levelList}
                      onSave={handleAddClassRoom}
                    />
                  </DialogContent>
                </Dialog>
                <Dialog
                  open={openAddStudentDialog}
                  fullWidth
                  onClose={handleAddStudentDialogClose}
                >
                  <DialogTitle>Add Student</DialogTitle>
                  <DialogContent>
                    <AddStudentForm
                      classStudents={classStudents}
                      handleAddSubmit={handleAddSubmit}
                      selectedClassroom={selectedClassroom}
                      selectedStudents={selectedStudents}
                      handleAddStudentDialogClose={handleAddStudentDialogClose}
                    />
                  </DialogContent>
                </Dialog>
                <Dialog
                  fullWidth={fullWidth}
                  maxWidth={maxWidth}
                  open={openAddTaskDialog}
                  onClose={handleAddTaskDialogClose}
                >
                  <DialogTitle>
                    {/* <Typography variant='h4' textAlign='center'>
                      Add Task
                    </Typography> */}
                  </DialogTitle>
                  <DialogContent>
                    <AddTaskForm
                      categories={categories}
                      selectedClassroom={selectedClassroom}
                      handleAddStudentDialogClose={handleAddTaskDialogClose}
                    />
                  </DialogContent>
                </Dialog>
                <Dialog
                  open={openSelectTaskTypeDialog}
                  fullWidth
                  onClose={handleSelectTaskTypeClose}
                >
                  <DialogTitle>
                    <p className="text-center">Select Task Type</p>
                  </DialogTitle>
                  <DialogContent>
                    <div className="flex gap-4 flex-col">
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setAnchorEl(null);
                          setOpenAutoTaskDialog(true);
                          setOpenSelectTaskTypeDialog(false);
                        }}
                      >
                        Exam Style Questions (summative assesment)
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setAnchorEl(null);
                          setOpenAddTaskDialog(true);
                          setOpenSelectTaskTypeDialog(false);
                        }}
                      >
                        Learning Outcome Quizzes (formative assessment)
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Dialog
                  open={openAutoTaskDialog}
                  fullWidth={fullWidth}
                  maxWidth={maxWidth}
                  scroll="body"
                  onClose={handleAutoTaskDialogClose}
                >
                  {/* <DialogTitle>Add Auto Task</DialogTitle> */}
                  <DialogContent>
                    <AutoTaskForm
                      categories={categories}
                      selectedClassroom={selectedClassroom}
                      handleDialogClose={handleAutoTaskDialogClose}
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

export default ClassRoom;
