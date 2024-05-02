import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Card,
  Typography,
  Grid,
  TextField,
  IconButton,
  CardActions,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EventBus from "../../../utils/eventBus";
import { saveRouteState } from "../../../utils/routeState";
import { AppState } from "../../../store/store";
import ProtectedRoute from "../../../components/route/ProtectedRoute";
import DefaultLayout from "../../../layouts/DefaultLayout";
import { useLazyGetStudentClassRoomQuery } from "../../../services/studentApi";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ClassRoom = () => {
  const router = useRouter();
  const user = useSelector((state: AppState) => state.auth);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  // const [data, setData] = useState([])
  const [classRoomsData, setClassRoomsData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [openAddClassRoomDialog, setOpenAddClassRoomDialog] = useState(false);

  const [selectedStudents, setSelectedStudents] = useState([]);
  // const [classRooms, { isLoading, isFetching, error, data }] = useLazyGetClassRoomByTeacherQuery();
  const [classRooms, { isLoading, isFetching, error, data }] =
    useLazyGetStudentClassRoomQuery();

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

  const filteredClassrooms = data?.filter((classroom) =>
    classroom.class_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    saveRouteState("routeState", router.asPath);

    if (user.isLoggedIn) {
      fetchClassRoomData();
      //fetchStudentList()
      //fetchLevelList()
      //fetchSubjectList()
    }
    EventBus.on("CLASSROOM", fetchClassRoomData);
    return () => {
      EventBus.off("CLASSROOM", fetchClassRoomData);
    };
  }, [user, router.asPath]);

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <DefaultLayout
        children={
          <>
            {data && data.length > 0 && (
              <Grid container spacing={2}>
                <Grid item xs={12} sx={{ mt: 2, mb: 2 }} sm={12} md={12}>
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
                {/* <Grid item xs={12} sx={{ mt: 5, mb: 2 }} sm={6} md={4}>
                                <Button onClick={() => handleOptionsMenuItemClick({}, 'ADD_CLASSROOM')} variant='outlined'>Choose Classroom</Button>
                            </Grid> */}
              </Grid>
            )}
            {data && data.length === 0 ? (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={12}>
                  <Typography variant="body1" gutterBottom>
                    No classroom found.
                  </Typography>
                </Grid>
              </Grid>
            ) : (
              <>
                {data &&
                  filteredClassrooms.map((classroom, index) => (
                    <div
                      key={classroom.class_id}
                      className="shadow-md px-2 md:px-3 py-4 flex justify-between items-center md:py-7 mb-5 bg-secondary rounded-md"
                    >
                      <span>
                        <p className="text-xl font-semibold">
                          {classroom.class_name.charAt(0).toUpperCase() +
                            classroom.class_name.slice(1)}
                        </p>
                        <p className="">
                          <span className="font-semibold"> Subject </span>-{" "}
                          {classroom.subject}
                        </p>
                      </span>
                      <Link
                        href={`/students/classroom/${classroom.class_id}`}
                        className="hover:text-primary hover:bg-border border px-2.5 py-1.5 rounded border-primary/30"
                      >
                        View Class
                      </Link>
                    </div>
                  ))}
              </>
            )}
          </>
        }
      />
    </ProtectedRoute>
  );
};

export default ClassRoom;
