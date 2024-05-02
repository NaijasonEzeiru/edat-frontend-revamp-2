import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaChevronDown, FaSearch } from "react-icons/fa";
import { AppState } from "../../store/store";
import {
  useLazyGetTopicByCategoryQuery,
  useLazyGetSetCodeByTopicQuery,
  useAddTaskMutation,
  // useLazyGetSetCodeByObjCodeQuery,
  useLazyGlobalSearchQuery,
  useLazySetCodeSearchQuery,
} from "../../services/teacherApi";
import EventBus from "../../utils/eventBus";
import { Button } from "../ui/button";

type LearningOutcome = {
  subject_id: number;
  obj_code: string;
  board_id: string;
  category_id: string;
  topic_id: string;
  objective_id: string;
  level_id: number;
  created_by: number;
  updated_by: number;
  syllabus_id: number;
  board_name: string;
  subject: string;
  category: string;
  topic: string;
  learning_outcome: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}[];

type CategoriesType = {
  category: string;
  category_id: string;
  subject_id: number;
}[];

type TopicsType = {
  // category: string;
  // category_id: string;
  // subject_id: number;
  topic: string;
  topic_id: string;
}[];

type SelectedClassroomType = {
  org_code: string;
  class_name: string;
  subject: string;
  class_id: number;
  teacher_id: number;
};

const AddTaskForm = ({
  categories,
  selectedClassroom,
  handleAddStudentDialogClose,
}: {
  categories: CategoriesType;
  selectedClassroom: SelectedClassroomType;
  handleAddStudentDialogClose: any;
}) => {
  const user = useSelector((state: AppState) => state.auth);
  const [categoriesList, setCategoriesList] = useState("");
  const [topicOptions, setTopicOptions] = useState<TopicsType>([]);
  const [categorySuggestions, setCategorySuggestions] =
    useState<CategoriesType>([]);
  const [topicsList, setTopicsList] = useState("");
  const [showTopics, setShowTopics] = useState(false);
  const [objCode, setObjCode] = useState([]);
  const [showObjcodes, setShowObjCodes] = useState(false);
  const [details, setDetails] = useState<LearningOutcome>([]);
  const [selectedDetail, setSelectedDetail] = useState<
    (typeof details)[0] | undefined
  >(undefined);
  const [fileName, setFileName] = useState<string | undefined>(undefined);
  const [base64File, setBase64File] = useState<string | ArrayBuffer | null>("");
  const [learningOutcomeValue, setLearningOutcomeValue] = useState("");
  const [study_materials, setStudy_materials] = useState<FileList | null>(null);
  const [recommendation, setRecommendation] = useState("");
  const [description, setDescription] = useState("");
  // const [setCodeOptions, setSetCodeOptions] = useState<{ set_code: string }[]>(
  //   []
  // );
  const [selectedSetCode, setSelectedSetCode] = useState("");
  const [showSetCodes, setShowSetCodes] = useState(false);

  const [topics] = useLazyGetTopicByCategoryQuery();
  const [setCodes] = useLazyGetSetCodeByTopicQuery();
  // const [setCodes] = useLazyGetSetCodeByObjCodeQuery();
  const [addTask] = useAddTaskMutation();
  const [globalSearch, { data, isLoading, error }] = useLazyGlobalSearchQuery();
  const [
    setCodeSearch,
    { data: setcodeData, isLoading: setCodeLoading, error: setCodeError },
  ] = useLazySetCodeSearchQuery();

  const handleCategoryInputChange = (value: string) => {
    setCategoriesList(value);
    if (value.length > 0) {
      const filteredSuggestions = categories.filter((suggestion) =>
        suggestion.category.toLowerCase().includes(value.toLowerCase())
      );
      setCategorySuggestions(
        //@ts-expect-error
        filteredSuggestions.length > 0
          ? filteredSuggestions
          : [{ category: "No matches found" }]
      );
    } else {
      setCategorySuggestions([]);
    }
  };

  const handleTopicInputChange = (value: string) => {
    setTopicsList(value);
    setShowTopics(true);
    if (value.length > 0) {
      const filteredSuggestions = topicOptions.filter((suggestion) =>
        suggestion.topic.toLowerCase().includes(value.toLowerCase())
      );
      setTopicOptions(
        //@ts-expect-error
        filteredSuggestions.length > 0
          ? filteredSuggestions
          : [{ topic: "No matches found" }]
      );
    } else {
      setTopicOptions([]);
    }
  };

  // const handleSearchAllChange = async (value) => {
  //   setLearningOutcomeValue(value);
  //   if (value.length > 0) {
  //     //@ts-expect-error
  //     setDetails([{ learning_outcome: 'searching...' }]);
  //     const res = await fetch(
  //       `${publicRuntimeConfig.backendApi}/content/objectsearch?text_filter=${value}`
  //     );
  //     const response = await res.json();
  //     if (res.ok) {
  //       if (response.length > 0) {
  //         setDetails(response);
  //       } else {
  //         //@ts-expect-error
  //         setDetails([{ learning_outcome: 'No matches found' }]);
  //       }
  //     } else {
  //       alert('Something went wrong');
  //     }
  //   } else {
  //     setDetails([]);
  //     setSelectedDetail(undefined);
  //   }
  // };

  const handleSearchSuggestionClick = async (detail: (typeof details)[0]) => {
    setSelectedDetail(detail);
    setLearningOutcomeValue(detail.learning_outcome);
    setDetails([]);
    setCategoriesList(detail.category);
    setTopicsList(detail.topic);
    setCodeSearch({ objCode: detail.obj_code });
  };

  const handleCategorySuggestionClick = async (category: CategoriesType[0]) => {
    setCategoriesList(category.category);
    setCategorySuggestions([]);
    setTopicOptions([]);
    setTopicsList("");
    try {
      const response = await topics({
        orgCode: selectedClassroom.org_code,
        classId: selectedClassroom.class_id,
        userId: user.user_id,
        categoryId: category.category_id,
      }).unwrap();
      setTopicOptions(response);
    } catch (error: any) {
      const status = error.status;
      if (status === 401) {
        // EventBus.dispatch('logout');
      }
    }
  };
  // const handleObjSuggestionClick = async (value: string) => {
  //   setSelectedSetCode(value);
  //   setShowSetCodes(false);
  //   try {
  //     const response = await setCodes({
  //       objCode: selectedClassroom.org_code,
  //       classId: selectedClassroom.class_id,
  //       userId: user.user_id,
  //       categoryId: category.category_id
  //     }).unwrap();
  //     setTopicOptions(response);
  //   } catch (error: any) {
  //     const status = error.status;
  //     if (status === 401) {
  //       // EventBus.dispatch('logout');
  //     }
  //   }
  // };

  const handleTopicSuggestionClick = async (topic: TopicsType[0]) => {
    setTopicsList(topic.topic);
    setShowTopics(false);
    try {
      const response = await setCodes({
        orgCode: selectedClassroom.org_code,
        userId: user.user_id,
        classId: selectedClassroom.class_id,
        topicId: topic.topic_id,
      }).unwrap();
      setObjCode(response);
      console.log({ response });
    } catch (error: any) {
      const status = error.status;
      if (status === 401) {
        // EventBus.dispatch('logout');
      }
    }
  };

  // const handleSuggestionClick = (value) => {
  //   setInputValue(value);
  //   setSuggestions([]);
  // };

  const convertToBase64 = () => {
    const reader = new FileReader();
    console.log(study_materials);
    reader.readAsDataURL(study_materials?.[0]);
    reader.onload = () => {
      setBase64File(reader.result);
    };
  };

  const handleSelectionChange = async () => {
    // convertToBase64();
    // const setcodes = setCodeOptions.map((value) => value.set_code);
    console.log({ base64File });
    let payload = {
      classId: selectedClassroom.class_id,
      orgCode: selectedClassroom.org_code,
      userId: user.user_id,
      body: {
        activity_name: selectedDetail?.learning_outcome,
        recommendation: [recommendation],
        set_code: [selectedSetCode],
        // set_code: [`${selectedDetail?.obj_code}_SET1`],
        // study_materials: [
        //   {
        //     file_content: base64File,
        //     filename: study_materials?.[0].name,
        //     content_type: study_materials?.[0].type
        //   }
        // ]
      },
    };
    try {
      const response = await addTask(payload).unwrap();
      if (response?.results?.code) {
        handleAddStudentDialogClose();
        EventBus.emit("SKILLSET", "fetchSkillSet");

        EventBus.emit("ALERT", {
          message: "Task added successfully",
          alertType: "success",
          openStatus: true,
        });
      } else if (response?.errors) {
        console.log({ response });
        EventBus.emit("ALERT", {
          message: response.errors?.message,
          alertType: "error",
          openStatus: true,
        });
      }
    } catch (err) {
      // console.log({ err });
      EventBus.emit("ALERT", {
        message: err.data.errors.message,
        alertType: "error",
        openStatus: true,
      });
    }
  };

  useEffect(() => {
    //@ts-expect-error
    setDetails([{ learning_outcome: "searching..." }]);
    const getData = setTimeout(() => {
      if (learningOutcomeValue.length > 0) {
        globalSearch({ text: learningOutcomeValue });
      } else {
        setDetails([]);
        setSelectedDetail(undefined);
      }
    }, 1200);
    return () => clearTimeout(getData);
  }, [learningOutcomeValue]);

  useEffect(() => {
    if (data?.length > 0) {
      setDetails(data);
    } else {
      //@ts-expect-error
      setDetails([{ learning_outcome: "No matches found" }]);
    }
  }, [data, error]);

  return (
    <form>
      <br />
      <div className="flex gap-3 flex-col">
        <div className="w-full">
          <label className="relative text-slate-900">
            Search All
            <input
              value={learningOutcomeValue}
              placeholder="Search"
              onChange={(e) => {
                setLearningOutcomeValue(e.target.value);
              }}
              aria-autocomplete="list"
              aria-controls="autocomplete-list"
              className="w-full h-14 mt-1 border-border bg-transparent border-solid border rounded-md pl-[10px] pr-8 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200"
            />
            <span className="absolute bottom-0 right-3 text-slate-600">
              <FaSearch />
            </span>
            {details.length > 0 && (
              <ul
                id="autocomplete-list"
                className="absolute mt-1 left-0 right-0 border border-[#ccc] bg-white list-none p-0 m-00 z-50"
                role="listbox"
              >
                {details
                  // .filter((value) => value?.obj_code?.length == 8)
                  .map((detail, index) => (
                    <li
                      key={index}
                      onClick={() => handleSearchSuggestionClick(detail)}
                      role="option"
                      className="cursor-pointer p-2 hover:bg-[#e9e9e9]"
                    >
                      {detail.learning_outcome}
                    </li>
                  ))}
              </ul>
            )}
          </label>
        </div>
        <p className="text-center text-2xl font-semibold pt-7 pb-4">Add Task</p>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label>
              Subject
              <input
                type="text"
                value={selectedClassroom.subject}
                disabled
                style={{
                  borderRadius: "5px",
                }}
                className="w-full h-14 mt-1 border-border bg-transparent border-solid border rounded-md pl-[10px] pr-8 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200"
              />
            </label>
          </div>
          <div>
            <label>
              Select Classroom
              <input
                type="text"
                value={selectedClassroom.class_name}
                disabled
                style={{
                  borderRadius: "5px",
                }}
                className="w-full h-14 mt-1 border-border bg-transparent border-solid border rounded-md pl-[10px] pr-8 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200"
              />
            </label>
          </div>
          <div>
            <div className="relative">
              <label className="relative text-slate-900">
                Category
                <input
                  value={categoriesList}
                  onChange={(e) => handleCategoryInputChange(e.target.value)}
                  onClick={() => {
                    categorySuggestions.length < 1
                      ? setCategorySuggestions(categories)
                      : setCategorySuggestions([]);
                  }}
                  aria-autocomplete="list"
                  aria-controls="autocomplete-list"
                  disabled={!!selectedDetail?.category}
                  className="w-full h-14 mt-1 border-border bg-transparent border-solid border rounded-md pl-[10px] pr-8 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200"
                />
                <span className="absolute bottom-0 right-3 text-slate-600">
                  <FaChevronDown />
                </span>
              </label>
              {categorySuggestions.length > 0 && (
                <ul
                  id="autocomplete-list"
                  className="absolute left-0 right-0 border border-solid rounded-md border-[#ccc] bg-white list-none z-40"
                  role="listbox"
                >
                  {categorySuggestions.map((category, index) => (
                    <li
                      key={index}
                      onClick={() => handleCategorySuggestionClick(category)}
                      role="option"
                      className="cursor-pointer p-2 hover:bg-[#e9e9e9]"
                    >
                      {category?.category}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div>
            <div className="relative">
              <label className="relative text-slate-900">
                Topic
                <input
                  value={topicsList}
                  onChange={(e) => handleTopicInputChange(e.target.value)}
                  onClick={(e) => {
                    if (topicOptions.length) {
                      setShowTopics(!showTopics);
                    }
                  }}
                  disabled={!!selectedDetail?.topic}
                  aria-autocomplete="list"
                  aria-controls="autocomplete-list"
                  className="w-full h-14 mt-1 border-border bg-transparent border-solid border rounded-md pl-[10px] pr-8 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200"
                />{" "}
                <span className="absolute bottom-0 right-3 text-slate-600">
                  <FaChevronDown />
                </span>
              </label>
              {topicOptions.length > 0 && showTopics && (
                <ul
                  id="autocomplete-list"
                  className="absolute left-0 right-0 border border-solid rounded-md border-[#ccc] bg-white list-none z-40"
                  role="listbox"
                >
                  {topicOptions.map((topic, index) => (
                    <li
                      key={index}
                      onClick={() => handleTopicSuggestionClick(topic)}
                      role="option"
                      className="cursor-pointer p-2 hover:bg-[#e9e9e9]"
                    >
                      {topic?.topic}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div>
            <div className="relative">
              <label className="relative text-slate-900">
                Learning Outcome
                <input
                  value={learningOutcomeValue}
                  // onChange={(e) => handleTopicInputChange(e.target.value)}
                  onClick={(e) => {
                    if (objCode?.length) {
                      setShowObjCodes(!showTopics);
                    }
                  }}
                  aria-autocomplete="list"
                  aria-controls="autocomplete-list"
                  className="w-full h-14 mt-1 border-border bg-transparent border-solid border rounded-md pl-[10px] pr-8 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200"
                />
                <span className="absolute bottom-0 right-3 text-slate-600">
                  <FaChevronDown />
                </span>
              </label>
              {objCode?.length > 0 && showObjcodes && (
                <ul
                  id="autocomplete-list"
                  className="absolute left-0 right-0 border border-solid rounded-md border-[#ccc] bg-white list-none z-40"
                  role="listbox"
                >
                  {objCode?.map((LearningOutcome, index) => (
                    <li
                      key={index}
                      onClick={() => handleLOSuggestionClick(LearningOutcome)}
                      role="option"
                      className="cursor-pointer p-2 hover:bg-[#e9e9e9]"
                    >
                      {LearningOutcome?.learning_outcome}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div>
            <div className="relative">
              <label className="relative text-slate-900">
                Set code
                <input
                  value={selectedSetCode}
                  onChange={(e) => setSelectedSetCode(e.target.value)}
                  onClick={(e) => {
                    if (learningOutcomeValue.length) {
                      setShowSetCodes(!showSetCodes);
                    }
                  }}
                  aria-autocomplete="list"
                  aria-controls="autocomplete-list"
                  className="w-full h-14 mt-1 border-border bg-transparent border-solid border rounded-md pl-[10px] pr-8 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200"
                />{" "}
                <span className="absolute bottom-0 right-3 text-slate-600">
                  <FaChevronDown />
                </span>
              </label>
              {setcodeData?.length > 0 && showSetCodes && !setCodeLoading && (
                <ul
                  id="autocomplete-list"
                  className="absolute left-0 right-0 border border-solid rounded-md border-[#ccc] bg-white list-none z-40"
                  role="listbox"
                >
                  {setcodeData.map((items, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        setSelectedSetCode(items?.set_code);
                        setShowSetCodes(false);
                      }}
                      role="option"
                      className="cursor-pointer p-2 hover:bg-[#e9e9e9]"
                    >
                      {items?.set_code}
                    </li>
                  ))}
                </ul>
              )}
              {showSetCodes && setCodeLoading && <p>Loading...</p>}
              {setcodeData?.length < 1 &&
                showSetCodes &&
                learningOutcomeValue && (
                  <p>
                    The selected learning outcome has no questions please select
                    another
                  </p>
                )}
            </div>
          </div>
        </div>
        {/* <div item xs={6} alignItems='center' flexDirection='row'>
          <div className='flex items-end'>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                paddingTop: '28px'
              }}>
              <input
                type='file'
                name='file-upload'
                style={{
                  width: 0,
                  height: 0,
                  overflow: 'hidden',
                  opacity: 0
                }}
                // required
                onChange={(e) => {
                  setFileName(e?.target?.files?.[0].name);
                  setStudy_materials(e?.target?.files);
                }}
              />
              <span
                style={{
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                  border: '1px solid #00000091',
                  padding: '10px',
                  marginRight: '10px',
                  borderRadius: '6px'
                }}>
                <span>
                  <CloudUpload />
                </span>
                <p>Upload File</p>
              </span>
            </label>
            <p>{fileName ? fileName : 'No File'}</p>
          </div>
        </div> */}
        <div className="w-full">
          <label>
            Describe Follow-up Learning Activity
            <textarea
              onChange={(e) => setRecommendation(e.target.value)}
              value={recommendation}
              style={{
                width: "100%",
                display: "block",
                height: "100px",
                marginTop: "5px",
                color: "rgba(0, 0, 0, 0.87)",
                border: "1px solid #bdbfc1",
                borderRadius: "5px",
                paddingLeft: "10px",
              }}
            />
          </label>
        </div>
        {/* <div item xs={12}>
          <label>
            Description
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              style={{
                width: "100%",
                display: "block",
                height: "100px",
                marginTop: "5px",
                color: "rgba(0, 0, 0, 0.87)",
                border: "1px solid #bdbfc1",
                borderRadius: "5px",
                paddingLeft: "10px",
              }}
            />
          </label>
        </div> */}
        <div className="w-full flex justify-center">
          <Button
            onClick={handleSelectionChange}
            disabled={!selectedSetCode.length}
            type="button"
          >
            Add Task
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AddTaskForm;
