import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { AppState, AppDispatch } from "../../store/store";
import { saveRouteState } from "../../utils/routeState";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import ProtectedRoute from "../../components/route/ProtectedRoute";
import DefaultLayout from "../../layouts/DefaultLayout";
import EventBus from "../../utils/eventBus";
import {
  useLazyGetStudentClassRoomQuery,
  useLazyGetRecommendationsQuery,
  useLazyGetStudentActivityListQuery,
} from "../../services/studentApi";
import Link from "next/link";

const Recommendation = () => {
  const router = useRouter();
  const user = useSelector((state: AppState) => state.auth);
  const [selectedClassroom, setSelectedClassroom] = useState({});
  const [classRoomsActivityData, setClassRoomsActivityData] = useState([]);
  const [recommendedItems, setRecommendedItems] = useState<string[]>([]);
  const [classRooms, { isLoading, isFetching, error, data }] =
    useLazyGetStudentClassRoomQuery();
  const [chartMetrics] = useLazyGetRecommendationsQuery();
  const [classRoomsActivity] = useLazyGetStudentActivityListQuery();

  const filterArrForUniqueValues = (arr: any, i: number) => {
    return [
      ...new Set(
        Object.values(arr.items)
          .map((values) => values[i].split(","))
          .flat(2)
      ),
    ];
  };

  const fetchMetricsData = async (classRoom) => {
    const r = await chartMetrics({
      userId: user.user_id,
      orgCode: user.org_code,
      classId: classRoom.class_id,
      subjectId: classRoom.subject_id,
      studentId: user.user_id,
    }).unwrap();
    console.log({ r });
    // const uniqueRecommendations = filterArrForUniqueValues(r, 3);
    // const uniqueImprovements = filterArrForUniqueValues(r, 4);
    // const uniqueStrengths = filterArrForUniqueValues(r, 5);
    // setRecommendedItems(uniqueRecommendations);
  };

  const fetchClassRoomData = async () => {
    try {
      const response = await classRooms({
        userId: user.user_id,
        orgCode: user.org_code,
      }).unwrap();

      setSelectedClassroom(response[0]);
      if (response?.[0]) {
        try {
          const res = await classRoomsActivity({
            userId: user.user_id,
            classId: response[0].class_id,
            orgCode: user.org_code,
          }).unwrap();

          setClassRoomsActivityData(res);
        } catch (error: any) {
          const status = error.status;
          if (status) {
            if (status >= 200 && status < 300) {
              console.log("Skill added successfully");
            } else {
              console.error("Skill addition failed with status:", status);
            }
          } else {
            console.error("Error adding skill:", error);
            EventBus.emit("ALERT", {
              message: "Error while fetching classroom data",
              alertType: "error",
              openStatus: true,
            });
          }
        }
      }

      await fetchMetricsData(response[0]);
    } catch (error: any) {
      const status = error.status;
      if (status) {
        if (status >= 200 && status < 300) {
          console.log("Skill added successfully");
        } else {
          console.error("Skill addition failed with status:", status);
        }
      } else {
        console.error("Error adding skill:", error);
        // EventBus.emit("ALERT", {
        //   message: 'Error while fetching classroom data',
        //   alertType: 'error',
        //   openStatus: true
        // });
      }
    } finally {
    }
  };

  useEffect(() => {
    saveRouteState("routeState", router.asPath);
    if (user.isLoggedIn) {
      fetchClassRoomData();
    }
  }, [user, router.asPath]);

  const filteredActivityContent = classRoomsActivityData.filter(
    (content) =>
      content.status === "not_started" || content.status === "inprogress"
  );

  return (
    <ProtectedRoute allowedRoles={["student", "admin"]}>
      <DefaultLayout
        children={
          <div className="grid gap-5 md:grid-flow-col justify-items-end">
            <div className="w-full h-9 md:col-span-7">
              <h2 className="text-2xl font-medium mb-2">
                Study Recommenation(s):
              </h2>
              {recommendedItems.length ? (
                <ul>
                  {recommendedItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>No recommendation</p>
              )}
            </div>
            {!!filteredActivityContent?.length && (
              <div className="hidden w-full col-span-3 border border-solid border-border rounded-sm md:flex flex-col justify-center items-start bg-background md:max-w-[30rem] pb-3">
                <h6 className="p-3 border-b border-solid w-full border-[#0000001f]">
                  Notifications
                </h6>
                <ul className="list-disc list-inside ml-5 mt-3 flex flex-col gap-1">
                  {filteredActivityContent.map((activity, index) => (
                    <div key={index}>
                      <h5 className="text-lg font-medium">
                        Outstanding {activity.subject} task
                      </h5>
                      <Link
                        className="lowercase text-primary hover:underline"
                        href={`/students/quiz/${activity.class_id}/${activity.set_code}`}
                      >
                        on {activity.learning_outcome}
                      </Link>
                    </div>
                  ))}
                </ul>
              </div>
            )}
          </div>
        }
      />
    </ProtectedRoute>
  );
};

export default Recommendation;
