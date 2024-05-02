import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { AppState } from "../../store/store";

import * as Yup from "yup";
import { Typography, LinearProgress, Box, Grid } from "@mui/material";

import EventBus from "../../utils/eventBus";

import {
  useSubmitQuizMutation,
  useUpdateQuestionMutation,
} from "../../services/studentApi";
import { Button } from "../ui/button";

const QuizForm = ({ questions, lo }) => {
  const user = useSelector((state: AppState) => state.auth);
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(
    Array(questions.length).fill({ question: "", answer: "" })
  );
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [quizSubmit] = useSubmitQuizMutation();
  const [updateQuestion] = useUpdateQuestionMutation();

  const questionWithOptions = questions?.map((q) => {
    if (typeof q.question === "string") {
      const lines = q.question.split("<br>&nbsp;");
      const questionText = q.question_text; //lines[0];
      const options = q.choices; //lines.slice(1).map((line) => line.trim()); // Extract options
      const setCode = q.set_code;
      const questionCode = q.question_code;
      const classId = q.class_id;
      return { questionText, options, setCode, questionCode, classId };
    }
    return { questionText: "Invalid Question", options: [] }; // Handle invalid data
  });

  const totalQuestions = questionWithOptions.length;

  const initialValues = {};

  const renderHTML = (rawHTML: string) =>
    React.createElement("div", {
      dangerouslySetInnerHTML: { __html: rawHTML },
    });

  questionWithOptions.forEach((_, index) => {
    initialValues[`question_${index}`] = "";
  });

  const validationSchema = Yup.object().shape(
    questionWithOptions.reduce((schema, _, index) => {
      schema[`question_${index}`] = Yup.string().required("Required");
      return schema;
    }, {})
  );

  const handleNext = async (values) => {
    console.log(values[`question_${currentQuestion}`]);
    if (currentQuestion < totalQuestions - 1) {
      const answeredQuestion = {
        question: questionWithOptions[currentQuestion].questionText,
        answer: values[`question_${currentQuestion}`],
      };
      const updatedAnswers = [...answers];
      updatedAnswers[currentQuestion] = answeredQuestion;
      setAnswers(updatedAnswers);
      console.log({ answers });
      setCurrentQuestion(currentQuestion + 1);
      // Calculate the updated progress percentage
      const newProgressPercentage =
        ((currentQuestion + 1) / totalQuestions) * 100;
      setProgressPercentage(newProgressPercentage);
    } else if (currentQuestion === totalQuestions - 1) {
      setIsQuizCompleted(true);
      // Calculate the final progress percentage
      const newProgressPercentage =
        (answeredQuestionsCount / totalQuestions) * 100;
      setProgressPercentage(newProgressPercentage);
    }

    let body = {
      class_id: questionWithOptions[currentQuestion].classId,
      student_id: user.user_id,
      question_code: questionWithOptions[currentQuestion].questionCode,
      set_code: questionWithOptions[currentQuestion].setCode,
      status: "answered",
      // is_recommended: true,
      student_answer: values[`question_${currentQuestion}`],
    };
    // quizSubmit({
    //   orgCode: user.org_code,
    //   userId: user.user_id,
    //   request: {
    //     student_id: user.user_id,
    //     class_id: questions?.[0].class_id,
    //     set_code: questions?.[0].set_code,
    //     student_response_data: [question_code],
    //   },
    // });

    await updateQuestion({
      orgCode: user.org_code,
      userId: user.user_id,
      request: body,
    }).unwrap();
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async (values) => {
    const answeredQuestion = {
      question: questionWithOptions[currentQuestion].questionText,
      answer: values[`question_${currentQuestion}`],
    };
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = answeredQuestion;

    let body = {
      class_id: questionWithOptions[currentQuestion].classId,
      student_id: user.user_id,
      set_code: questionWithOptions[currentQuestion].setCode,
    };

    await quizSubmit({
      orgCode: user.org_code,
      userId: user.user_id,
      request: body,
    }).unwrap();

    EventBus.emit("CLASSROOM", "fetchClassRoomData");
    EventBus.emit("ALERT", {
      message: "Quiz successfully updated",
      alertType: "success",
      openStatus: true,
    });

    setAnswers(updatedAnswers);
    setIsQuizCompleted(true);
    // Calculate the final progress percentage
    const newProgressPercentage =
      (answeredQuestionsCount / totalQuestions) * 100;
    setProgressPercentage(newProgressPercentage);
    setTimeout(() => {
      router.replace(
        `/students/classroom/${questionWithOptions[currentQuestion].classId}`
      );
    }, 500);
  };

  const answeredQuestionsCount = answers.filter((a) => a.answer !== "").length;

  useEffect(() => {
    // Calculate and set the initial progress percentage
    const newProgressPercentage =
      ((currentQuestion + 1) / totalQuestions) * 100;
    setProgressPercentage(newProgressPercentage);
  }, [currentQuestion, totalQuestions]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, isSubmitting }) => (
        <Form>
          {!isQuizCompleted && (
            <div style={{ marginTop: "30px" }}>
              <h2 className="text-3xl font-medium text-center mb-10">{lo}</h2>
              <div className="flex justify-between items-center">
                {" "}
                <p className="text-lg font-medium">
                  Question {currentQuestion + 1}
                </p>
                <p className="font-light">
                  {currentQuestion + 1} / {totalQuestions}
                </p>
              </div>
              {/* <Typography variant='caption' sx={{ marginTop: '50px' }}>
                Progress: {currentQuestion + 1} / {totalQuestions} (
                {progressPercentage.toFixed(2)}%)
              </Typography> */}
              <LinearProgress
                variant="determinate"
                value={progressPercentage}
                style={{ marginBlock: "16px" }}
              />
            </div>
          )}
          <br />

          {isQuizCompleted ? (
            <div className="flex flex-col justify-center items-center">
              <p className="text-3xl mb-7 font-medium">
                You completed the quiz!
              </p>
              <div className="flex gap-5">
                {" "}
                <Button
                  variant="outline"
                  disabled={isSubmitting}
                  type="button"
                  onClick={() => setIsQuizCompleted(false)}
                >
                  Go Back to Correct Mistakes
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  Submit
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* <Card variant='outlined'>
                <CardContent> */}
              <Box
                sx={{
                  borderColor: "#11112f",
                  border: "solid 1px",
                  textAlign: "center",
                  // color: "white",
                  py: "30px",
                  px: "40px",
                  my: "15px",
                  borderRadius: "20px",
                }}
              >
                <Typography variant="h5">
                  {renderHTML(
                    questionWithOptions[currentQuestion]?.questionText
                  )}
                </Typography>
              </Box>
              <br />
              <Grid container spacing={2}>
                {questionWithOptions[currentQuestion]?.options?.map(
                  (option, optionIndex) => (
                    <Grid item key={optionIndex} xs={12} md={6}>
                      <div
                        style={{
                          // backgroundColor: '#1212f157',
                          border: "solid 2px #1212f157",
                          borderRadius: 20,
                        }}
                      >
                        <Field
                          style={{
                            margin: 10,
                            opacity: 0,
                            position: "absolute",
                            PointerEvents: "none",
                          }}
                          type="radio"
                          id={`question_${currentQuestion}_option_${optionIndex}`}
                          name={`question_${currentQuestion}`}
                          value={option}
                          disabled={isQuizCompleted} // Disable radio buttons when quiz is completed
                        />
                        <label
                          htmlFor={`question_${currentQuestion}_option_${optionIndex}`}
                          style={{
                            borderRadius: "19px",
                            display: "flex",
                            height: "40px",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              paddingInline: "20px",
                              width: "45px",
                            }}
                          >
                            <p
                              style={{
                                display: "flex",
                                fontWeight: 700,
                              }}
                            >
                              {option.slice(1, 2)}:
                            </p>
                          </div>
                          <p
                            style={{
                              paddingRight: "20px",
                              textAlign: "center",
                              flexGrow: 1,
                            }}
                          >
                            {renderHTML(option.slice(3))}
                          </p>
                        </label>
                      </div>
                    </Grid>
                  )
                )}
              </Grid>
              <ErrorMessage
                name={`question_${currentQuestion}`}
                component="div"
              />
              <br />
              {/* </CardContent>
              </Card> */}
              <div style={{ position: "relative", marginBlock: "10px" }}>
                {currentQuestion > 0 && (
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={isQuizCompleted}
                    className="absolute"
                    type="button"
                  >
                    Previous
                  </Button>
                )}
                <Button
                  onClick={() => handleNext(values)}
                  disabled={
                    !values?.[`question_${currentQuestion}`] || isQuizCompleted
                  }
                  className="absolute right-0"
                  type="button"
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </Form>
      )}
    </Formik>
  );
  // } else {
  //   return <p className="mt-4 text-lg">This task has no question.</p>;
  // }
};

export default QuizForm;
