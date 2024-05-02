import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import QuizForm from "../../../../../components/student/QuizForm";
import { AppState } from "../../../../../store/store";
import ProtectedRoute from "../../../../../components/route/ProtectedRoute";
import DefaultLayout from "../../../../../layouts/DefaultLayout";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useLazyTakeTestQuery } from "../../../../../services/studentApi";
import { Breadcrumbs, CardActions } from "@mui/material";
import Link from "next/link";
import EventBus from "../../../../../utils/eventBus";
import Theory from "@/components/student/Theory";
import { Button } from "@/components/ui/button";

const QuizPage = () => {
  const router = useRouter();
  const user = useSelector((state: AppState) => state.auth);

  const { classid, setcode, lo } = router.query;

  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [quiz, setQuiz] = useState([]);

  const [quizs] = useLazyTakeTestQuery();

  const handleQuizSubmit = (submittedAnswers) => {
    setQuizSubmitted(true);
    setAnswers(submittedAnswers);
  };

  const fetchQuizBySetCode = async () => {
    try {
      const response = await quizs({
        orgCode: user.org_code,
        userId: user.user_id,
        data: {
          student_id: user.user_id,
          class_id: parseInt(classid),
          set_code: setcode,
        },
      }).unwrap();
      console.log({ response });
      setQuiz(response);
      if (!response?.length) {
        console.log("here");
        const response = await quizs({
          orgCode: user.org_code,
          userId: user.user_id,
          data: {
            student_id: user.user_id,
            class_id: parseInt(classid),
            set_code: setcode,
          },
        }).unwrap();

        setQuiz(response);
      }
    } catch (error) {
      console.error("Error fetching quiz:", error);
      EventBus.emit("ALERT", {
        message: "Error while fetching quiz",
        alertType: "error",
        openStatus: true,
      });
    }
  };

  useEffect(() => {
    if (user.isLoggedIn && classid && setcode) {
      fetchQuizBySetCode();
    }
  }, []);

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      {/* <DefaultLayout> */}
      <div className="min-h-screen bg-slate-100 flex items-center py-5 px-3 md:px-20">
        {/* {!quizStarted && (
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="/students/classroom">
              Class Room
            </Link>
            <Link color="inherit" href={`/students/classroom/${classid}`}>
              Tasks
            </Link>
            <Typography color="text.primary">Quiz</Typography>
          </Breadcrumbs>
        )} */}
        {!quizStarted ? (
          <div className="w-full">
            <p>
              Welcome! This is the quiz on "{lo}" click on the "Start Quiz"
              button to proceed or click on "Go Back" to exit the page
            </p>
            <div className="w-full mt-4 flex flex-col shadow-md bg-background px-3 py-6 rounded-lg space-y-2">
              <p className="text-2xl font-medium">Quiz</p>
              <p>Total Questions: {quiz ? quiz.length : 0}</p>
              <div className="flex items-center">
                <Button onClick={() => setQuizStarted(true)}>Start Quiz</Button>
                <Link
                  color="inherit"
                  href={`/students/classroom/${classid}`}
                  className="border px-3 py-1.5 rounded-md border-solid border-primary ml-4"
                >
                  Go Back
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full">
            {!quizSubmitted ? (
              <div className="w-full">
                {quiz?.[0]?.question_type === "exam" ? (
                  <Theory
                    questions={quiz}
                    // onSubmit={handleQuizSubmit}
                    lo={lo}
                  />
                ) : (
                  <QuizForm
                    questions={quiz}
                    // onSubmit={handleQuizSubmit}
                    lo={lo}
                  />
                )}
              </div>
            ) : (
              <div>
                <Card
                  sx={{
                    width: "60%",
                    marginTop: 4,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" component="div">
                      Quiz submitted successfully!
                    </Typography>
                    {/* {answers.map((answer, index) => (
                                                    <Typography variant="h6" key={index}>
                                                        Question: {answer.question} Answer: {answer.answer}
                                                    </Typography>
                                                ))} */}
                    <CardActions>
                      <Link
                        color="inherit"
                        href="/students/classroom"
                        className="px-3 py-2 rounded border border-solid border-primary"
                      >
                        Go to Class Room
                      </Link>
                    </CardActions>
                  </CardContent>
                  <br />
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
      {/* </DefaultLayout> */}
    </ProtectedRoute>
  );
};

export default QuizPage;
