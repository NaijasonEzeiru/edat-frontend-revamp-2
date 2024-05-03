import { getColor } from "@/lib/utils";
import ProtectedRoute from "@/components/route/ProtectedRoute";
import DefaultLayout from "../../layouts/DefaultLayout";
import {
  useLazyGetAllStudentsPerformanceQuery,
  useLazyGetAStudentsPerformanceQuery,
  useLazyGetExamaninersFeedbackQuery,
} from "@/services/studentApi";
import { useAppSelector } from "@/store/hooks";
import { useEffect } from "react";

const results = () => {
  const user = useAppSelector((state) => state.auth);
  const [allStudentsPerformance, { data }] =
    useLazyGetAllStudentsPerformanceQuery({});
  const [aStudentsPerformance, { data: aData }] =
    useLazyGetAStudentsPerformanceQuery({});
  const [getExaminersFeedback, { data: examinersFeedback }] =
    useLazyGetExamaninersFeedbackQuery();

  useEffect(() => {
    allStudentsPerformance({ userId: user.user_id, orgCode: user.org_code });
    aStudentsPerformance({ userId: user.user_id, orgCode: user.org_code });
    getExaminersFeedback({ userId: user.user_id, orgCode: user.org_code });
  }, [user]);

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <DefaultLayout
        children={
          <>
            <h1 className="text-center text-3xl mb-10">Your Results</h1>
            <div className="flex gap-2 mt-6">
              <p className="font-semibold">Candidate's Name:</p>
              <p>{aData?.[0]?.fullname}</p>
            </div>
            <div className="flex gap-2  mb-12">
              <p className="font-semibold">Overall Mark</p>
              <p>
                {/* {aData?.[0]?.get_student_performance_json?.reduce(
                    (accumulator, currentValue) =>
                      accumulator + currentValue.score_percent,
                    0
                  ) / aData?.[0]?.get_student_performance_json?.[0]?.length} */}
                0%
              </p>
            </div>
            <h5 className="font-semibold">Learning Outcome Performance:</h5>
            <div className="space-y-3">
              {aData?.map((value, index) => {
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <p>
                      {value.learning_outcome.slice(1, -1)} (
                      {value.student_score}/{value.max_score})
                    </p>
                    <div className="flex gap-2 w-40 justify-start">
                      <div className="h-8 w-20 relative bg-slate-300 rounded-sm">
                        <div
                          className={`absolute left-0 top-0 h-8 rounded-sm`}
                          style={{
                            width: `${value.score_percent}%`,
                            backgroundColor: getColor(value.score_percent),
                          }}
                        ></div>
                      </div>
                      <p>({value.score_percent}%)</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <h4 className="mt-8 text-xl font-semibold mb-2">
              Examiner Feedback:
            </h4>
            <p>{examinersFeedback?.recommendation}</p>
            <p className="mt-2">
              <span className="font-semibold pr-2">Overall:</span>
              {examinersFeedback?.summary}
            </p>
          </>
        }
      />
    </ProtectedRoute>
  );
};

export default results;
