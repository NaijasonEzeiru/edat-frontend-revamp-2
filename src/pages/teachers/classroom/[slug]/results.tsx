import { getColor } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import ProtectedRoute from "@/components/route/ProtectedRoute";
import DefaultLayout from "@/layouts/DefaultLayout";
import { useEffect } from "react";
import { useLazyGetAllStudentsPerfQuery } from "@/services/teacherApi";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { useRouter } from "next/router";

const StudentDetails = () => {
  const user = useAppSelector((state) => state.auth);
  const [allStudentsPerformance, { data }] = useLazyGetAllStudentsPerfQuery({});
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    allStudentsPerformance({
      teacherId: user.user_id,
      orgCode: user.org_code,
      userId: 13,
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
                  <p className="font-medium">Results</p>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-center text-3xl">Results</h1>
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
                            data[j].learning_outcome == val.learning_outcome &&
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
          </>
        }
      />
    </ProtectedRoute>
  );
};

export default StudentDetails;
