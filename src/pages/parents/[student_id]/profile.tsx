import Image from "next/image";
import { useRouter } from "next/router";
import ProtectedRoute from "@/components/route/ProtectedRoute";
import DefaultLayout from "@/layouts/DefaultLayout";
import { useAppSelector } from "@/store/hooks";
import { useGetStudentProfileQuery } from "@/services/parentApi";

const StudentProfile = () => {
  const user = useAppSelector((state) => state.auth);
  const router = useRouter();
  const { student_id } = router.query;

  const { data } = useGetStudentProfileQuery({
    orgCode: user.org_code,
    parentId: user.user_id,
    studentId: student_id,
  });

  return (
    <ProtectedRoute allowedRoles={["parent"]}>
      <DefaultLayout
        children={
          <>
            <div>
              <div className="flex gap-4 md:gap-16 flex-col md:flex-row">
                <div className="w-fit mx-auto md:w-72 h-full relative">
                  <Image
                    alt={`photo of ${data?.first_name}`}
                    src={data?.image_url || "/profile.png"}
                    width={200}
                    height={200}
                    className="object-cover rounded-md w-72 h-60 m-auto"
                  />
                </div>
                <div className="bg-white p-4 rounded-lg grow">
                  <h4 className="text-3xl font-medium mb-4">
                    Profile Information
                  </h4>
                  <div className="grid gap-2 md:grid-cols-2 pt-3">
                    <span className="w-fit">
                      <p className="font-semibold">Name:</p>
                      <p className="">
                        {data?.first_name} {data?.last_name}
                      </p>
                    </span>
                    <span className="w-fit">
                      <p className="font-semibold">Email:</p>
                      <p className="">{data?.email}</p>
                    </span>
                    <span className="w-fit">
                      <p className="font-semibold">Gender:</p>
                      <p className="">{data?.gender}</p>
                    </span>
                    <span className="w-fit">
                      <p className="font-semibold">Date of Birth:</p>
                      <p className="">{data?.dob}</p>
                    </span>
                  </div>
                  {!!data?.about_me && (
                    <span className="w-fit mt-2">
                      <p className="font-semibold">About Me:</p>
                      <p className="">{data.about_me}</p>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </>
        }
      />
    </ProtectedRoute>
  );
};

export default StudentProfile;
