import { useRouter } from "next/router";
import { getColor } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import ProtectedRoute from "@/components/route/ProtectedRoute";
import DefaultLayout from "@/layouts/DefaultLayout";
import { useEffect } from "react";
import {
  useLazyGetAllStudentsPerfQuery,
  useLazyGetStudentPerfQuery,
} from "@/services/teacherApi";

const StudentDetails = () => {
  const router = useRouter();
  const { first_name, last_name, id } = router.query as {
    first_name: string;
    last_name: string;
    id: string;
  };
  const user = useAppSelector((state) => state.auth);
  const [allStudentsPerformance, { data }] = useLazyGetAllStudentsPerfQuery({});
  const [aStudentsPerformance, { data: aData }] = useLazyGetStudentPerfQuery(
    {}
  );

  useEffect(() => {
    allStudentsPerformance({
      teacherId: user.user_id,
      orgCode: user.org_code,
      userId: id,
    });
    aStudentsPerformance({
      teacherId: user.user_id,
      orgCode: user.org_code,
      userId: id,
    });
  }, [user]);

  return (
    <ProtectedRoute allowedRoles={["teacher"]}>
      <DefaultLayout
        children={
          <>
            <h1 className="text-center text-3xl mb-10">
              {first_name?.charAt(0)?.toUpperCase() +
                first_name?.slice(1) +
                " " +
                last_name?.charAt(0)?.toUpperCase() +
                last_name?.slice(1)}
              's Result
            </h1>
            <div className="">
              <div className="flex justify-end">
                {!!data &&
                  Array.from(new Set(data?.map((item) => item.fullname))).map(
                    (std, i) => (
                      <p
                        className="w-20 h-8 justify-center font-medium truncate"
                        // style={{ backgroundColor: getColor(val) }}
                        key={i}
                      >
                        {std}
                      </p>
                    )
                  )}
              </div>
              {data &&
                data?.map((val, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center gap-3"
                  >
                    <p className="max-w-[573] truncate">
                      {val.learning_outcome.slice(1, -1)}
                    </p>
                    <div className="flex">
                      {!!data &&
                        Array.from(
                          new Set(data.map((item) => item.fullname))
                        ).map((std, index) => {
                          for (let j = 0; j < data.length; j++) {
                            if (
                              data[j].learning_outcome ==
                                val.learning_outcome &&
                              data[j].fullname == std
                            ) {
                              return (
                                <p
                                  className="w-20 h-8 flex items-center justify-center"
                                  style={{
                                    backgroundColor: getColor(
                                      data[j].student_score
                                    ),
                                  }}
                                  key={j + std}
                                >
                                  {`${data[j].student_score}%`}
                                </p>
                              );
                            }
                          }
                          return (
                            <p
                              className="w-20 h-8 flex items-center justify-center"
                              style={{ backgroundColor: getColor(val) }}
                              key={std}
                            >
                              NIL
                            </p>
                          );
                        })}
                    </div>
                  </div>
                ))}
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
            </div>
          </>
        }
      />
    </ProtectedRoute>
  );
};

export default StudentDetails;
