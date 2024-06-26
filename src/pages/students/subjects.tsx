import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { PiSealWarning } from "react-icons/pi";
import { LuBookUp, LuDumbbell } from "react-icons/lu";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "../../store/store";
import { saveRouteState } from "../../utils/routeState";

import { SelectChangeEvent } from "@mui/material/Select";

import ProtectedRoute from "../../components/route/ProtectedRoute";
import DefaultLayout from "../../layouts/DefaultLayout";

import {
  useLazyGetStudentActivityListQuery,
  useLazyGetStudentClassRoomQuery,
  useLazyGetSubjectMetricsQuery,
} from "../../services/studentApi";
import EventBus from "../../utils/eventBus";

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

  const name = useSelector((state: AppState) => state.student.name);
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
    useLazyGetStudentClassRoomQuery();
  const [chartMetrics] = useLazyGetSubjectMetricsQuery();
  const [classRoomsActivity] = useLazyGetStudentActivityListQuery();

  const dispatch = useDispatch();

  console.log({ user });

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedClassroom(event.target.value);
    fetchMetricsData(event.target.value);
  };

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
      userId: user.user_id,
      orgCode: user.org_code,
      classId: classRoom.class_id,
      subjectId: classRoom.subject_id,
      studentId: user.user_id,
    }).unwrap();
    const uniqueRecommendations = filterArrForUniqueValues(r, 3);
    console;
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
    <ProtectedRoute allowedRoles={["student", "admin"]}>
      <DefaultLayout
        children={
          <div className="mt-4 flex flex-col lg:flex-row gap-3">
            <div className="mb-6 md:w-[calc(48vw-128px)]">
              <div>
                <h3 className="text-lg font-semibold">Mathematics</h3>
                <p>More Information about Mathematics on the curriculum.</p>
                <p className="pt-4 font-medium">
                  Here is a breakdown of your performance in Mathematics
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
                    <h4 className="text-lg font-medium">Available Tasks</h4>
                  </span>

                  <ul className="mt-3 flex flex-col gap-1">
                    {filteredActivityContent.map((activity, index) => (
                      <li
                        key={index}
                        className="flex p-3 gap-3 justify-between items-center"
                      >
                        <span className="flex flex-col gap-1">
                          <p>{activity.learning_outcome}</p>
                        </span>
                        <Button
                          onClick={() => {
                            router.push(
                              `/students/quiz/${activity.class_id}/${activity.set_code}`
                            );
                          }}
                          variant="outline"
                          // className="border-2 h-10 my-auto py-2 rounded-sm text-primary px-4 whitespace-nowrap"
                        >
                          Take Test
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="bg-white p-2 rounded-md flex-1 h-fit flex justify-center items-center pt-6">
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
                  // plugins: {
                  //   legend: {
                  //     display: true,
                  //     title: {
                  //       display: true,
                  //       text: "lorem Ipsum",
                  //       color: "blue",
                  //       padding: { bottom: 1 },
                  //     },
                  //   },
                  //   legendDistance: {
                  //     padding: 500,
                  //   },
                  // },
                  // elements: { arc: { borderWidth: 0 } },
                }}
                // plugins={[
                //   {
                //     id: "legendDistance",
                //     beforeInit(chart, args, opts) {
                //       const originalFit = chart.legend.fit;
                //       chart.legend.fit = function fit() {
                //         originalFit.bind(chart.legend)();
                //         this.height += opts.padding || 0;
                //       };
                //     },
                //   },
                // ]}
              />
            </div>
          </div>
        }
      />
    </ProtectedRoute>
  );
};

export default Subjects;
