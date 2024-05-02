import { useEffect, useState } from "react";
import { FaChevronDown, FaSpinner } from "react-icons/fa";
import { Button } from "../ui/button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AutogenTaskSchema } from "@/lib/zodShema";
import { z } from "zod";
import {
  useLazyAddAITaskQuery,
  useLazyGetSetCodeByTopicQuery,
} from "@/services/teacherApi";
import { useToast } from "../ui/use-toast";
import { useLazyGetTopicByCategoryQuery } from "../../services/teacherApi";
import { useAppSelector } from "@/store/hooks";
import { Select, SelectOption } from "../ui/custom/Select";

type CategoriesType = {
  category: string;
  category_id: string;
  subject_id: number;
}[];

type SelectedClassroomType = {
  org_code: string;
  class_name: string;
  subject: string;
  class_id: number;
  teacher_id: number;
};

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

type TopicsType = {
  topic: string;
  topic_id: string;
}[];

const AutoTaskForm = ({
  categories,
  selectedClassroom,
  handleDialogClose,
}: {
  categories: CategoriesType;
  selectedClassroom: SelectedClassroomType;
  handleDialogClose: any;
}) => {
  const [topicValues, setTopicValues] = useState<SelectOption | undefined>(
    undefined
  );
  const [learningOutcomeValues, setLearningOutcomeValues] = useState<
    SelectOption[]
  >([]);
  const [addAiTask, { isLoading, data, error }] = useLazyAddAITaskQuery();
  const { toast } = useToast();
  const user = useAppSelector((state) => state.auth);
  const [categorySuggestions, setCategorySuggestions] =
    useState<CategoriesType>([]);

  const [
    topics,
    { data: topicsData, isLoading: topicsIsLoading, error: topicError },
  ] = useLazyGetTopicByCategoryQuery();
  const [
    setCodes,
    {
      data: setCodesData,
      isLoading: setCodesIsLoading,
      isError: setCodesIsError,
    },
  ] = useLazyGetSetCodeByTopicQuery();

  const uniqueArr = (arr) => {
    let setObj = new Set(arr?.map(JSON.stringify));
    return Array.from(setObj)?.map(JSON.parse);
  };

  const {
    register,
    watch,
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof AutogenTaskSchema>>({
    mode: "onChange",
    resolver: zodResolver(AutogenTaskSchema),
  });
  const fields = watch();

  console.log({ errors });
  console.log({ fields });

  const onSubmit = (values: z.infer<typeof AutogenTaskSchema>) => {
    addAiTask({
      userId: user.user_id,
      orgCode: user.org_code,
      classId: selectedClassroom.class_id,
      values,
      body: {
        topic_ids: [values.topic_list],
        learning_outcomes: values.learning_outcomes,
        // obj_code_list: [selectedDetail?.obj_code],
      },
    });
  };

  useEffect(() => {
    if (data) {
      toast({
        description: "Task added successfully",
      });
      handleDialogClose();
    }
    if (error) {
      toast({
        variant: "destructive",
        description: "Something went wrong",
      });
      console.log({ error });
    }
  }, [data, error]);

  const handleCategoryInputChange = (value: string) => {
    setValue("category", value);
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

  const handleTopicSuggestionClick = async (topic: SelectOption) => {
    setValue("topic_list", topic.value);
    setTopicValues(topic);
    setValue("learning_outcomes", []);
    setLearningOutcomeValues([]);
    setCodes({
      orgCode: selectedClassroom.org_code,
      userId: user.user_id,
      classId: selectedClassroom.class_id,
      topicId: topic.value,
    }).unwrap();
  };

  const handleCategorySuggestionClick = async (category: CategoriesType[0]) => {
    setValue("category", category.category);
    setCategorySuggestions([]);
    setValue("topic_list", "");
    setLearningOutcomeValues([]);
    setTopicValues(undefined);
    setValue("learning_outcomes", []);
    await topics({
      orgCode: selectedClassroom.org_code,
      classId: selectedClassroom.class_id,
      userId: user.user_id,
      categoryId: category.category_id,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex gap-3 flex-col">
        <p className="text-center text-2xl font-semibold pt-7 pb-4">Add Task</p>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="relative">
            <label className="relative text-slate-900">
              Category
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <input
                    onBlur={onBlur}
                    onChange={(e) => {
                      handleCategoryInputChange(e.target.value);
                      // onChange(e.target.value);
                    }}
                    onClick={() => {
                      categorySuggestions.length < 1
                        ? setCategorySuggestions(categories)
                        : setCategorySuggestions([]);
                    }}
                    value={value}
                    aria-autocomplete="list"
                    aria-controls="autocomplete-list"
                    className="w-full h-14 mt-1 border-border bg-transparent border-solid border rounded-md pl-[10px] pr-8 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200"
                  />
                )}
                name="category"
              />
              <span className="absolute bottom-0 right-3 text-slate-600">
                <FaChevronDown />
              </span>
            </label>
            <span className="text-red-400 text-xs">
              <i>{errors?.category?.message}</i>
            </span>
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
          <div>
            <p>Select Topic</p>
            <Select
              value={topicValues}
              onChange={(o) => {
                handleTopicSuggestionClick(o!);
              }}
              options={topicsData?.map((v) => {
                const { topic: label, topic_id: value } = v;
                return { label, value };
              })}
            />
            <span className="text-red-400 text-xs">
              <i>{errors?.topic_list?.message}</i>
            </span>
          </div>
          <div>
            <p>Learning Outcomes:</p>
            <Select
              multiple
              value={learningOutcomeValues}
              onChange={(o) => {
                setValue(
                  "learning_outcomes",
                  o?.map((v) => v.value)
                );
                setLearningOutcomeValues(o);
              }}
              options={uniqueArr(
                setCodesData?.map((v) => {
                  const { learning_outcome: label, obj_code: value } = v;
                  return { label, value };
                })
              )}
            />
            <span className="text-red-400 text-xs">
              <i>{errors?.learning_outcomes?.message}</i>
            </span>
          </div>
          <label>
            Estimated Time (In Minutes)
            <input
              type="text"
              {...register("estimated_time")}
              style={{
                borderRadius: "5px",
              }}
              className="w-full h-14 mt-1 border-border bg-transparent border-solid border rounded-md pl-[10px] pr-8 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200"
            />
            <span className="text-red-400 text-xs">
              <i>{errors?.estimated_time?.message}</i>
            </span>
          </label>
          <label>
            Total Questions
            <input
              type="number"
              {...register("total_questions")}
              style={{
                borderRadius: "5px",
              }}
              className="w-full h-14 mt-1 border-border bg-transparent border-solid border rounded-md pl-[10px] pr-8 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200"
            />
            <span className="text-red-400 text-xs">
              <i>{errors?.total_questions?.message}</i>
            </span>
          </label>
          <label>
            Total Score
            <input
              type="number"
              {...register("total_score")}
              style={{
                borderRadius: "5px",
              }}
              className="w-full h-14 mt-1 border-border bg-transparent border-solid border rounded-md pl-[10px] pr-8 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200"
            />
            <span className="text-red-400 text-xs">
              <i>{errors?.total_score?.message}</i>
            </span>
          </label>
          <label>
            Points Per Question
            <input
              type="number"
              {...register("points_per_question")}
              style={{
                borderRadius: "5px",
              }}
              className="w-full h-14 mt-1 border-border bg-transparent border-solid border rounded-md pl-[10px] pr-8 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200"
            />
            <span className="text-red-400 text-xs">
              <i>{errors?.points_per_question?.message}</i>
            </span>
          </label>
          <label className="relative text-slate-900">
            Question Type
            <select
              className="w-full h-14 mt-1 border-border bg-transparent border-solid border rounded-md pl-[10px] pr-8"
              {...register("question_type")}
            >
              <option value="">--Select Question Type--</option>
              {["multiple_choice", "exam"].map((style, index) => (
                <option key={index} value={style}>
                  {style.charAt(0).toLocaleUpperCase() + style.slice(1)}
                </option>
              ))}
            </select>
            <span className="text-red-400 text-xs">
              <i>{errors?.question_type?.message}</i>
            </span>
          </label>
          <label className="relative text-slate-900">
            Select Country
            <select
              className="w-full h-14 mt-1 border-border bg-transparent border-solid border rounded-md pl-[10px] pr-8"
              {...register("user_country")}
            >
              <option value="">--Select Country--</option>
              {["India", "Nigeria"].map((style, index) => (
                <option key={index} value={style}>
                  {style.charAt(0).toLocaleUpperCase() + style.slice(1)}
                </option>
              ))}
              <span className="text-red-400 text-xs">
                <i>{errors?.user_country?.message}</i>
              </span>
            </select>
          </label>
          <label className="relative text-slate-900">
            Exam Board
            <select
              className="w-full h-14 mt-1 border-border bg-transparent border-solid border rounded-md pl-[10px] pr-8"
              {...register("exam_board")}
            >
              <option value="">--Exam Board--</option>
              {["WAEC", "JAMB", "CBSE"].map((style, index) => (
                <option key={index} value={style}>
                  {style.charAt(0).toLocaleUpperCase() + style.slice(1)}
                </option>
              ))}
            </select>
            <span className="text-red-400 text-xs">
              <i>{errors?.exam_board?.message}</i>
            </span>
          </label>
        </div>
        <div className="w-full flex justify-center mt-5">
          <Button disabled={isLoading}>
            {isLoading && (
              <span className="mr-2 h-4 w-4 animate-spin">
                <FaSpinner />
              </span>
            )}
            Generate Task
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AutoTaskForm;
