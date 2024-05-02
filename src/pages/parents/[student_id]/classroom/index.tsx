import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Button,
  Typography,
  Grid,
  TextField,
  IconButton,
  CardActions,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EventBus from "@/utils/eventBus";
import ProtectedRoute from "@/components/route/ProtectedRoute";
import DefaultLayout from "@/layouts/DefaultLayout";
import { useAppSelector } from "@/store/hooks";
import { useLazyGetStudentsClassRoomQuery } from "@/services/parentApi";

const ClassRoom = () => {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth);
  const { student_id } = router.query;
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [classRoomsData, setClassRoomsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [classRooms, { isLoading, isFetching, error, data }] =
    useLazyGetStudentsClassRoomQuery();

  const fetchClassRoomData = async () => {
    try {
      const response = await classRooms({
        userId: student_id,
        parentId: user.user_id,
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
    }
  };

  const filteredClassrooms = data?.filter((classroom) =>
    classroom.class_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
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
  }, [user]);

  return (
    <ProtectedRoute allowedRoles={["parent"]}>
      <DefaultLayout
        children={
          <>
            {data && data.length > 0 && (
              <Grid container spacing={2}>
                <Grid item xs={12} sx={{ mt: 2, mb: 2 }} sm={6} md={7}>
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
              <Grid container spacing={2}>
                {data &&
                  filteredClassrooms.map((classroom, index) => (
                    <Grid key={classroom.class_id} item xs={12} sm={6} md={4}>
                      <Card
                        sx={{ background: "#2ca1", borderRadius: "10px" }}
                        className="classroom-card"
                      >
                        <CardContent
                          sx={{ background: "#18c3", borderRadius: "4px" }}
                        >
                          <Typography variant="h5" component="div">
                            {classroom.class_name.charAt(0).toUpperCase() +
                              classroom.class_name.slice(1)}
                          </Typography>
                          <Typography variant="body2">
                            Subject - {classroom.subject}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button
                            variant="outlined"
                            onClick={() => {
                              setSelectedClassroom(classroom);
                              router.push(
                                `/parents/${student_id}/classroom/${classroom.class_id}`
                              );
                            }}
                            size="small"
                          >
                            View Class
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
              </Grid>
            )}
          </>
        }
      />
    </ProtectedRoute>
  );
};

export default ClassRoom;
