import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Breadcrumbs } from "@mui/material";
import EventBus from "@/utils/eventBus";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import ProtectedRoute from "@/components/route/ProtectedRoute";
import DefaultLayout from "@/layouts/DefaultLayout";
import { useAppSelector } from "@/store/hooks";
import { useLazyGetStudentQuizScoreQuery } from "@/services/parentApi";

const QuizPage = () => {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth);

  const { class_id, setcode, student_id } = router.query;

  const [quizScore, setQuizScore] = useState({});

  const [quizScoreApi] = useLazyGetStudentQuizScoreQuery();

  const fetchQuizScoreBySetCode = async () => {
    try {
      const response = await quizScoreApi({
        orgCode: user.org_code,
        userId: student_id,
        parentId: user.user_id,
        request: {
          student_id: student_id,
          class_id: class_id,
          set_code: setcode,
        },
      }).unwrap();
      console.log(response);
      setQuizScore(response);
    } catch (error) {
      EventBus.emit("ALERT", {
        message: "Error while fetching quiz score",
        alertType: "error",
        openStatus: true,
      });
    }
  };

  useEffect(() => {
    if (user.isLoggedIn) {
      fetchQuizScoreBySetCode();
    }
  }, [user]);

  return (
    <ProtectedRoute allowedRoles={["parent"]}>
      <DefaultLayout>
        <>
          <div>
            <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" href="/students/classroom">
                Class Room
              </Link>
              <Typography>Quiz </Typography>
              <Typography color="text.primary">Score </Typography>
            </Breadcrumbs>
            <Card
              sx={{
                width: "100%",
                marginTop: 4,
                display: "flex",
                alignItems: "center",
              }}
            >
              <CardContent>
                <Typography variant="h6">
                  Your child scored{" "}
                  {Math.round(
                    (quizScore.student_score / quizScore.total_score) * 100
                  )}
                  % in this Quiz
                </Typography>
              </CardContent>
            </Card>
          </div>
        </>
      </DefaultLayout>
    </ProtectedRoute>
  );
};

export default QuizPage;
