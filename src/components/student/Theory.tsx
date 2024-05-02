import { useSubmitQuizMutation } from "@/services/studentApi";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/router";
import { createElement, useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";

function Theory({ questions, lo }) {
  const user = useAppSelector((state) => state.auth);
  const [answers, setAnswers] = useState([]);
  const router = useRouter();
  const { toast } = useToast();
  const [quizSubmit, { data, isLoading, isError }] = useSubmitQuizMutation();
  const renderHTML = (rawHTML: string) =>
    createElement("div", {
      dangerouslySetInnerHTML: { __html: rawHTML.replaceAll("<br>", "") },
    });

  const handleInput = (e) => {
    setAnswers({ ...answers, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = Object.keys(answers).map((e) => {
      return { question_code: e, answer: answers[e] };
    });
    try {
      const res = await quizSubmit({
        orgCode: user.org_code,
        userId: user.user_id,
        request: {
          student_id: user.user_id,
          class_id: questions?.[0].class_id,
          set_code: questions?.[0].set_code,
          student_response_data: v,
        },
      }).unwrap();
      console.log({ res });
      if (res) {
        toast({
          description: res,
        });
        router.replace("/students/classroom");
      }
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Something went wrong",
      });
    }
  };

  useEffect(() => {
    if (data) {
      console.log({ submitted: data });
      toast({
        description: "Task summitted successfully",
      });
    }
    if (isError) {
      toast({
        variant: "destructive",
        description: "Unable to submit! Something went wrong",
      });
    }
  }, [data, isError]);

  return (
    <div className="my-8 w-full">
      <h2 className="text-3xl font-medium text-center mb-10">
        {/* Basic Mathematics Test (10 Minutes) */}
        {lo}
      </h2>
      <p className="font-medium">
        Instructions: Answer all questions. Show all Workings for full marks
      </p>
      <form className="flex gap-10 mt-8 flex-col" onSubmit={handleSubmit}>
        {questions.map((value, index) => (
          <div key={index} className="space-y-2">
            <h5 className="px-3 py-2 rounded bg-primary text-white w-fit">
              Question {index + 1}
            </h5>
            <p>{renderHTML(value?.question)}</p>
            <label className="mt-7 block">
              <p>Answer:</p>
              <textarea
                name={value.question_code}
                className="w-full rounded-md p-2 h-36 border border-solid border-primary"
                placeholder="Input your answer (show your workings)"
                required
                onChange={handleInput}
              ></textarea>
            </label>
          </div>
        ))}
        <Button disabled={isLoading} className="w-40 mx-auto">
          {isLoading && (
            <span className="mr-2 h-4 w-4 animate-spin">
              <FaSpinner />
            </span>
          )}
          Submit
        </Button>
      </form>
    </div>
  );
}

export default Theory;
