// pages/quiz/[slug].js
import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import ProtectedRoute from "@/components/route/ProtectedRoute";
import DefaultLayout from "@/layouts/DefaultLayout";
import EventBus from "@/utils/eventBus";
import { useLazyGetClassRoomByIdQuery } from "@/services/teacherApi";
import { IconButton, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useAppSelector } from "@/store/hooks";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const avatarColors = [
  "#F44336",
  "#9C27B0",
  "#673AB7",
  "#E91E63",
  "#3F51B5",
  "#2196F3",
  "#00BCD4",
  "#009688",
];

type StudentData =
  | [
      {
        student_id: number;
        subject: string;
        first_name: string;
        last_name: string;
      }
    ]
  | [];

const ClassRoom = () => {
  const router = useRouter();
  const { slug, class_name } = router.query;
  const user = useAppSelector((state) => state.auth);
  const [classRoomsData, setClassRoomsData] = useState<StudentData>([]);
  const [classRooms] = useLazyGetClassRoomByIdQuery();
  const [searchTerm, setSearchTerm] = useState("");

  const fetchClassRoomDetails = async () => {
    try {
      const response = await classRooms({
        userId: user.user_id,
        orgCode: user.org_code,
        classId: slug,
      }).unwrap();

      setClassRoomsData(response);
    } catch (error: any) {
      const status = error.status;
      if (status) {
        if (status >= 200 && status < 300) {
          console.log("Student list fetched successfully");
        } else {
          console.error("Student list fetching failed with status:", status);
        }
      } else {
        console.error("Error fetching student list:", error);
        EventBus.emit("ALERT", {
          message: "Error while fetching student list",
          alertType: "error",
          openStatus: true,
        });
      }
    } finally {
    }
  };

  const filteredClassrooms = classRoomsData?.filter((classroom) =>
    classroom.first_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (user.isLoggedIn && slug !== undefined) {
      fetchClassRoomDetails();
    }
    // EventBus.on('CLASSROOM', fetchClassRoomData);
    // return () => {
    //     EventBus.off('CLASSROOM', fetchClassRoomData);
    // };
  }, [user, slug]);

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
                  <p className="font-medium">Students</p>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            {classRoomsData && classRoomsData.length > 0 && (
              <div>
                <TextField
                  label="Search Student"
                  value={searchTerm}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setSearchTerm(e.target.value)
                  }
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <IconButton>
                        <SearchIcon />
                      </IconButton>
                    ),
                  }}
                />
              </div>
            )}
            <div className="flex flex-wrap gap-12 mt-5">
              {classRoomsData &&
                filteredClassrooms.map((student, index) => (
                  <Link
                    key={student.student_id}
                    href={`/teachers/classroom/${slug}/${student.student_id}?first_name=${student.first_name}&last_name=${student.last_name}`}
                    className="flex gap-3 items-center hover:scale-105"
                  >
                    <span
                      className="text-white flex items-center justify-center size-12 rounded-full text-2xl"
                      style={{ backgroundColor: avatarColors[index] }}
                    >
                      {student.first_name.charAt(0)}
                      {student.last_name.charAt(0)}
                    </span>
                    <span className="flex flex-col">
                      <p className="text-lg font-medium">
                        {student.first_name.charAt(0).toUpperCase() +
                          student.first_name.slice(1) +
                          " " +
                          student.last_name.charAt(0).toUpperCase() +
                          student.last_name.slice(1)}
                      </p>
                      <p>{class_name}</p>
                    </span>
                  </Link>
                ))}
            </div>
            <span className="flex items-center justify-between mt-8">
              <Link
                href={`/teachers/classroom/${slug}/results`}
                className="text-primary block whitespace-nowrap"
              >
                View All Scores
              </Link>
              <span className="flex gap-1 w-full justify-end">
                <p> Total Students:</p>
                <p>{classRoomsData.length}</p>
              </span>
            </span>
          </>
        }
      />
    </ProtectedRoute>
  );
};

export default ClassRoom;
