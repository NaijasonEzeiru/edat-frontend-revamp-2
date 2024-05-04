import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { PiSealWarning } from "react-icons/pi";
import { SelectChangeEvent } from "@mui/material/Select";
import { LuBookUp, LuDumbbell } from "react-icons/lu";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "@/store/store";
import { saveRouteState } from "@/utils/routeState";
import ProtectedRoute from "@/components/route/ProtectedRoute";
import DefaultLayout from "@/layouts/DefaultLayout";
import EventBus from "@/utils/eventBus";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  registerables,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import { Button } from "@/components/ui/button";
import {
  useLazyGetStudentActivityListsQuery,
  useLazyGetStudentsClassRoomQuery,
  useLazyGetSubjectsMetricsQuery,
} from "@/services/parentApi";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ...registerables
);

const Subjects = () => {
  const router = useRouter();
  const user = useSelector((state: AppState) => state.auth);
  const [selectedClassroom, setSelectedClassroom] = useState({});
  const [classRoomsActivityData, setClassRoomsActivityData] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [recommendationItems, setRecommendationItems] = useState<string[]>([]);
  const [improvementItems, setImprovementItems] = useState<string[]>([]);
  const [strengthItems, setStrengthItems] = useState<string[]>([]);
  const [classRooms, { isLoading, isFetching, error, data }] =
    useLazyGetStudentsClassRoomQuery();
  const [chartMetrics] = useLazyGetSubjectsMetricsQuery();
  const [classRoomsActivity] = useLazyGetStudentActivityListsQuery();
  const { student_id } = router.query;
  const filterArrForUniqueValues = (arr: any, i: number) => {
    return [
      ...new Set(
        Object.values(arr.items)
          .map((values) => values[i].split(","))
          .flat(2)
      ),
    ];
  };

  const filteredActivityContent = classRoomsActivityData.filter(
    (content) =>
      content.status === "not_started" || content.status === "inprogress"
  );

  const fetchMetricsData = async (classRoom) => {
    const r = await chartMetrics({
      userId: student_id,
      parentId: user.user_id,
      orgCode: user.org_code,
      classId: classRoom.class_id,
      subjectId: classRoom.subject_id,
      studentId: student_id,
    }).unwrap();
    const uniqueRecommendations = filterArrForUniqueValues(r, 3);
    const uniqueImprovements = filterArrForUniqueValues(r, 4);
    const uniqueStrengths = filterArrForUniqueValues(r, 5);
    setRecommendationItems(uniqueRecommendations);
    setImprovementItems(uniqueImprovements);
    setStrengthItems(uniqueStrengths);

    const dataset = {
      labels: Object.keys(r.items),
      datasets: [
        {
          label: "National Avg.",
          data: Object.values(r.items).map((values) => values[0]),
          // backgroundColor: "rgba(75,192,192,0.2)",
          backgroundColor: "transparent",
          borderColor: "rgba(75,192,192,1)",
          borderWidth: 2,
          pointBackgroundColor: "rgba(75,192,192,1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgba(75,192,192,1)",
        },
        {
          label: "School Avg.",
          data: Object.values(r.items).map((values) => values[1]),
          // backgroundColor: "rgba(255,99,132,0.2)",
          backgroundColor: "transparent",
          borderColor: "rgba(255,99,132,1)",
          borderWidth: 2,
          pointBackgroundColor: "rgba(255,99,132,1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgba(255,99,132,1)",
        },
        {
          label: "Your Score",
          data: Object.values(r.items).map((values) => values[2]),
          // backgroundColor: "rgba(255,206,86,0.2)",
          backgroundColor: "transparent",
          borderColor: "rgba(255,206,86,1)",
          borderWidth: 2,
          pointBackgroundColor: "rgba(255,206,86,1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgba(255,206,86,1)",
        },
      ],
    };

    setChartData(dataset);
  };

  const fetchClassRoomData = async () => {
    try {
      const response = await classRooms({
        userId: student_id,
        parentId: user.user_id,
        orgCode: user.org_code,
      }).unwrap();
      setSelectedClassroom(response[0]);
      if (response?.[0]) {
        try {
          const res = await classRoomsActivity({
            userId: student_id,
            parentId: user.user_id,
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
  //  const fetchClassRoomData = async () => {
  //   try {
  //     const response = await classRooms({
  //       userId: user.user_id,
  //       orgCode: user.org_code
  //     }).unwrap();

  //     setClassRoomsData(response);
  //   } catch (error: any) {
  //     const status = error.status;
  //     if (status) {
  //       if (status >= 200 && status < 300) {
  //         console.log('Skill added successfully');
  //       } else {
  //         console.error('Skill addition failed with status:', status);
  //       }
  //     } else {
  //       console.error('Error adding skill:', error);
  //       EventBus.emit('ALERT', {
  //         message: 'Error while fetching classroom data',
  //         alertType: 'error',
  //         openStatus: true
  //       });
  //     }
  //   } finally {
  //   }
  // };

  useEffect(() => {
    saveRouteState("routeState", router.asPath);
    if (user.isLoggedIn) {
      fetchClassRoomData();
      // fetchClassRoomActivity();
    }
  }, []);

  return (
    <ProtectedRoute allowedRoles={["parent"]}>
      <DefaultLayout
        children={
          <div className="mt-4 flex flex-col lg:flex-row gap-3">
            <div className="mb-6 md:w-[calc(48vw-128px)]">
              <div>
                <h3 className="text-lg font-semibold">Mathematics</h3>
                <p className="pt-4 font-medium">
                  Here is a breakdown of your child's performance in Mathematics
                </p>
              </div>
              <div className="flex flex-wrap flex-col  mt-5 gap-6">
                <div className="min-w-96">
                  <span className="flex gap-3 items-center">
                    <span className="text-2xl rounded-full bg-green-500 size-12 flex items-center justify-center text-white">
                      <LuDumbbell />
                    </span>
                    <h4 className="text-lg font-medium">Strengths</h4>
                  </span>
                  <ul className="list-disc list-inside ml-5 mt-3 flex flex-col gap-1">
                    {strengthItems.map((value, index) => (
                      <li className={`${!value && "hidden"}`} key={index}>
                        {value}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="min-w-96">
                  <span className="flex gap-3 items-center">
                    <span className="text-2xl rounded-full bg-red-500 size-12 flex items-center justify-center text-white">
                      <PiSealWarning />
                    </span>
                    <h4 className="text-lg font-medium">
                      Areas of Improvement
                    </h4>
                  </span>
                  <ul className="list-disc list-inside ml-5 mt-3 flex flex-col gap-1">
                    {improvementItems.map((value, index) => (
                      <li className={`${!value && "hidden"}`} key={index}>
                        {value}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="min-w-96">
                  <span className="flex gap-3 items-center">
                    <span className="text-2xl rounded-full bg-orange-500 size-12 flex items-center justify-center text-white">
                      <LuBookUp />
                    </span>
                    <h4 className="text-lg font-medium">Undone Tasks</h4>
                  </span>

                  <ul className="mt-3 flex flex-col list-disc">
                    {filteredActivityContent.map((activity, index) => (
                      <li
                        key={index}
                        className="flex p-3 justify-between items-center"
                      >
                        <p>{activity.learning_outcome}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="md:row-span-5 md:col-span-7 bg-white p-2 rounded-md flex-1 h-fit flex items-center justify-center">
              <Radar
                data={chartData}
                options={{
                  // @ts-expect-error
                  scale: {
                    ticks: {
                      beginAtZero: true,
                      max: 100,
                      min: 0,
                      stepSize: 25,
                    },
                  },
                  responsive: true,
                  maintainAspectRatio: true,
                }}
              />
            </div>
          </div>
        }
      />
    </ProtectedRoute>
  );
};

export default Subjects;
