import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { AppState } from "../../../../../store/store";
import ProtectedRoute from "../../../../../components/route/ProtectedRoute";
import DefaultLayout from "../../../../../layouts/DefaultLayout";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useLazyGetQuizScoreQuery } from "../../../../../services/studentApi";
import { Breadcrumbs } from "@mui/material";
import EventBus from "../../../../../utils/eventBus";

import Link from "next/link";

const QuizPage = () => {
  const router = useRouter();
  const user = useSelector((state: AppState) => state.auth);

  const { classid, setcode } = router.query;

  const [quizScore, setQuizScore] = useState({});

  const [quizScoreApi] = useLazyGetQuizScoreQuery();

  const fetchQuizScoreBySetCode = async () => {
    try {
      const response = await quizScoreApi({
        orgCode: user.org_code,
        userId: user.user_id,
        request: {
          student_id: user.user_id,
          class_id: classid,
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
    if (user.isLoggedIn && classid && setcode) {
      fetchQuizScoreBySetCode();
    }
  }, [user, classid, setcode, router.asPath]);

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <DefaultLayout>
        <>
          <div>
            <Breadcrumbs aria-label="breadcrumb">
              <Link href="/students/classroom">Class Room</Link>
              <Link href={`/students/classroom/${classid}`}>Quiz </Link>
              <Typography color="text.primary">Score </Typography>
            </Breadcrumbs>
            <div className="w-full mt-4 flex flex-col shadow-md bg-background px-3 py-6 rounded-lg space-y-2">
              <p className="">
                You scored{" "}
                {Math.round(
                  (quizScore.student_score / quizScore.total_score) * 100
                )}
                % in this Quiz
              </p>
            </div>
          </div>
        </>
      </DefaultLayout>
    </ProtectedRoute>
  );
};

export default QuizPage;
