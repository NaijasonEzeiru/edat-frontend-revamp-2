// pages/quiz/[slug].js
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  Breadcrumbs,
  Typography,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import ProtectedRoute from "@/components/route/ProtectedRoute";
import DefaultLayout from "@/layouts/DefaultLayout";
import EventBus from "@/utils/eventBus";
import { useAppSelector } from "@/store/hooks";
import { useLazyGetStudentActivityListsQuery } from "@/services/parentApi";

const ClassRoom = () => {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth);
  const [filter, setFilter] = useState("all");
  const [classRoomsActivityData, setClassRoomsActivityData] = useState([]);
  const [classRoomsActivity] = useLazyGetStudentActivityListsQuery();
  const { class_id, student_id } = router.query;

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filterOptions = ["all", "completed", "inprogress", "not_started"];

  const filteredActivityContent = classRoomsActivityData.filter((content) => {
    if (filter === "completed") {
      return content.status === "completed";
    } else if (filter === "inprogress") {
      return content.status === "inprogress";
    } else if (filter === "not_started") {
      return content.status === "not_started";
    }
    return true; // Show all if 'all' filter is selected
  });

  const fetchClassRoomActivity = async () => {
    try {
      const response = await classRoomsActivity({
        userId: student_id,
        parentId: user.user_id,
        classId: class_id,
        orgCode: user.org_code,
      }).unwrap();

      setClassRoomsActivityData(response);
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

  useEffect(() => {
    if (user.isLoggedIn) {
      fetchClassRoomActivity();
    }
  }, [user]);

  return (
    <ProtectedRoute allowedRoles={["parent"]}>
      <DefaultLayout>
        <div className="">
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="/students/classroom">
              Class Room
            </Link>
            <Typography color="text.primary">Quiz</Typography>
          </Breadcrumbs>

          <div className="mt-2">
            <FormControl
              variant="outlined"
              className="filter-select"
              style={{ width: "100%" }}
            >
              <InputLabel htmlFor="filter-select">Filter by:</InputLabel>
              <Select
                id="filter-select"
                value={filter}
                onChange={handleFilterChange}
                label="Filter by"
              >
                {filterOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option === "all"
                      ? "All"
                      : option.charAt(0).toUpperCase() + option.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="">
            <div className="flex gap-4 flex-col mt-8">
              {filteredActivityContent.map((activity, index) => (
                <div
                  key={index}
                  className="flex p-3 justify-between bg-secondary rounded-md flex-col md:flex-row gap-2 shadow-md"
                >
                  <span className="flex flex-col gap-1">
                    <h5 className="text-xl text-primary font-semibold text-center md:text-left">
                      {activity.subject}
                    </h5>
                    <span className="flex gap-1 flex-col md:flex-row">
                      <p className="text-muted-foreground">Category:</p>{" "}
                      <p>{activity.category}</p>
                    </span>
                    <span className="flex gap-1 flex-col md:flex-row">
                      <p className="text-muted-foreground">Topic:</p>{" "}
                      <p>{activity.topic}</p>
                    </span>
                    <span className="flex gap-1 flex-col md:flex-row">
                      <p className="text-muted-foreground whitespace-nowrap">
                        Learning Outcome:
                      </p>{" "}
                      <p>{activity.learning_outcome}</p>
                    </span>
                  </span>
                  {activity?.status && activity.status !== "answered" ? (
                    <button
                      disabled
                      className="border-2 h-10 my-auto p-2 px-3 rounded-sm text-muted-foreground whitespace-nowrap"
                    >
                      Undone
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        router.push(
                          `/parents/${student_id}/classroom/${activity?.class_id}/${activity.set_code}/score`
                        );
                      }}
                      className="border-2 border-border h-10 my-auto mx-auto py-2 px-3 rounded-sm text-primary whitespace-nowrap"
                    >
                      View Score
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DefaultLayout>
    </ProtectedRoute>
  );
};

export default ClassRoom;
