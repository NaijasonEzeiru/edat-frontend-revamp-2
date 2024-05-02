import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import {
  Breadcrumbs,
  Typography,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";

import QuizForm from "../../../components/student/QuizForm";
import { AppState } from "../../../store/store";
import ProtectedRoute from "../../../components/route/ProtectedRoute";
import DefaultLayout from "../../../layouts/DefaultLayout";
import EventBus from "../../../utils/eventBus";
import { setQuizState } from "../../../store/quizSlice";
import { useLazyGetStudentActivityListQuery } from "../../../services/studentApi";

const ClassRoom = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector((state: AppState) => state.auth);
  const quizzes = useSelector((state: AppState) => state.quiz);
  const [filter, setFilter] = useState("all");
  const [classRoomsActivityData, setClassRoomsActivityData] = useState([]);
  const [classRoomsActivity] = useLazyGetStudentActivityListQuery();
  const { slug } = router.query;

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
        userId: user.user_id,
        classId: slug,
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
    if (user.isLoggedIn && slug) {
      fetchClassRoomActivity();
    }
  }, [slug, user, router.asPath]);

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <DefaultLayout>
        <div className="classroom-container">
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="/students/classroom">
              Class Room
            </Link>
            <Typography color="text.primary">Quiz</Typography>
          </Breadcrumbs>

          <br />

          <div className="filter-container">
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

          <div className="activity-list">
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
                    <Link
                      href={`/students/quiz/${activity.class_id}/${activity.set_code}?lo=${activity.learning_outcome}`}
                      className="bg-primary text-white h-10 my-auto p-2 rounded text-primary whitespace-nowrap md:w-24 flex items-center justify-center w-full mt-2 md:mt-auto hover:opacity-85"
                    >
                      Take Test
                    </Link>
                  ) : (
                    <Link
                      href={`/students/quiz/${activity.class_id}/${activity.set_code}/score`}
                      className="border h-10 my-auto py-2 rounded text-primary whitespace-nowrap border-primary border-solid md:w-24 flex items-center justify-center w-full mt-2 md:mt-auto hover:bg-border"
                    >
                      View Score
                    </Link>
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
