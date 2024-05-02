import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Link from "next/link";

import { Card, CardContent, Typography, Grid, Avatar } from "@mui/material";

import { AppState } from "../../store/store";
import ProtectedRoute from "../../components/route/ProtectedRoute";
import DefaultLayout from "../../layouts/DefaultLayout";
import AssignmentIcon from "@mui/icons-material/Assignment";

import { saveRouteState } from "../../utils/routeState";

const Quiz = () => {
  const router = useRouter();

  const user = useSelector((state: AppState) => state.auth);
  const quizzes = useSelector((state: AppState) => state.quiz);

  const subjectsWithTotalQuestions = quizzes.map((quiz) => ({
    subject: quiz.subject,
    totalQuestions: quiz.questions.length,
  }));

  useEffect(() => {
    saveRouteState("routeState", router.asPath);

    if (user.isLoggedIn) {
    }
    // EventBus.on('CLASSROOM', fetchClassRoomData);
    // return () => {
    //     EventBus.off('CLASSROOM', fetchClassRoomData);
    // };
  }, [user, router.asPath]);

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <DefaultLayout
        children={
          <>
            <Typography variant="h5">Available Quizzes</Typography>
            <br />
            <Grid container spacing={2}>
              {subjectsWithTotalQuestions.map(
                (subjectWithTotalQuestions, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Link href={`/students/quiz/${index}`}>
                      <Card variant="outlined">
                        <CardContent
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <Avatar>
                            <AssignmentIcon />
                          </Avatar>
                          <div style={{ marginLeft: "10px" }}>
                            <Typography variant="h6">
                              {subjectWithTotalQuestions.subject}
                            </Typography>
                            <Typography variant="body2">
                              {subjectWithTotalQuestions.totalQuestions}
                              questions
                            </Typography>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </Grid>
                )
              )}
            </Grid>
          </>
        }
      />
    </ProtectedRoute>
  );
};

export default Quiz;
