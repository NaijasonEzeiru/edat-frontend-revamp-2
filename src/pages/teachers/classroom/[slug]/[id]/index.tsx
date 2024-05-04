import { useRouter } from "next/router";
import { getColor } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import ProtectedRoute from "@/components/route/ProtectedRoute";
import DefaultLayout from "@/layouts/DefaultLayout";
import { useEffect } from "react";
import { useLazyGetStudentPerfQuery } from "@/services/teacherApi";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

const StudentDetails = () => {
  const router = useRouter();
  const { first_name, last_name, id, slug } = router.query as {
    first_name: string;
    last_name: string;
    id: string;
    slug: string;
  };
  const user = useAppSelector((state) => state.auth);
  const [aStudentsPerformance, { data: aData }] = useLazyGetStudentPerfQuery(
    {}
  );

  useEffect(() => {
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
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/teachers/classroom">Classroom</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={`/teachers/classroom/${slug}`}>Students</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <p className="font-medium">
                    {first_name} {last_name}
                  </p>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-center text-3xl mb-10">
              {first_name?.charAt(0)?.toUpperCase() +
                first_name?.slice(1) +
                " " +
                last_name?.charAt(0)?.toUpperCase() +
                last_name?.slice(1)}
              's Result
            </h1>
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
          </>
        }
      />
    </ProtectedRoute>
  );
};

export default StudentDetails;
