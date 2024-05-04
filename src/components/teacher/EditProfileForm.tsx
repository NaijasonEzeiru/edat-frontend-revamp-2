import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { EditTeacherSchema } from "@/lib/zodShema";
import { useUserProfileUpdateMutation } from "@/services/onBoardApi";
import { useAppSelector } from "@/store/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useToast } from "../ui/use-toast";

const EditProfileForm = ({ teacherData, onClose }: any) => {
  const user = useAppSelector((state) => state.auth);
  const { toast } = useToast();
  const [updateProfile, { isLoading, data, isError, isSuccess, error }] =
    useUserProfileUpdateMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<z.infer<typeof EditTeacherSchema>>({
    mode: "onBlur",
    resolver: zodResolver(EditTeacherSchema),
    defaultValues: {
      ...teacherData,
    },
  });

  const handleSave = async (updatedData: z.infer<typeof EditTeacherSchema>) => {
    updateProfile({
      userId: user.user_id,
      orgCode: user.org_code,
      data: {
        ...updatedData,
        experience: "3",
        subjects: teacherData?.subjects || "Maths",
        created_at: teacherData?.licence_start_date || "",
        updated_at: teacherData?.licence_start_date || "",
        image_url: teacherData?.image_url || "",
      },
      role: "teacher",
    });
  };

  const handleCancel = () => {
    onClose();
  };

  useEffect(() => {
    if (isSuccess) {
      toast({
        description: "Profile editted successfully",
      });
      //   router.replace("/parents/profile");
      handleCancel();
    } else if (isError) {
      // @ts-expect-error
      if (error?.data?.errors?.message) {
        toast({
          variant: "destructive",
          // @ts-expect-error
          description: error?.data?.errors?.message,
        });
        // @ts-expect-error
      } else if (error?.data?.detail?.[0]) {
        // @ts-expect-error
        error?.data.detail.map((err) => {
          setError(err.loc[1], { message: err.msg });
        });
      }
    }
    if (isError) {
      toast({ variant: "destructive", description: "Something went wrong" });
    }
  }, [isSuccess, data, isError]);

  return (
    <>
      <h5 className="text-2xl font-semibold text-center mb-7">Edit Profile</h5>
      <form className="flex gap-4 flex-col" onSubmit={handleSubmit(handleSave)}>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="grid gap-1.5 w-full items-center">
            <Label htmlFor="first_name">First Name</Label>
            <Input
              id="first_name"
              autoCorrect="off"
              disabled={isLoading}
              {...register("first_name")}
            />
            <span className="text-red-400 text-xs">
              <i>{errors?.first_name?.message}</i>
            </span>
          </div>
          <div className="grid gap-1.5 w-full items-center">
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              id="last_name"
              autoCorrect="off"
              disabled={isLoading}
              {...register("last_name")}
            />
            <span className="text-red-400 text-xs">
              <i>{errors?.last_name?.message}</i>
            </span>
          </div>
          <div className="grid gap-1.5 w-full items-center">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              disabled={isLoading}
              {...register("dob")}
            />
            <span className="text-red-400 text-xs">
              <i>{errors?.dob?.message}</i>
            </span>
          </div>
          <div className="grid gap-1.5 w-full items-center">
            <Label htmlFor="gender">Gender</Label>
            <select
              aria-required="true"
              {...register("gender")}
              aria-invalid={!!errors?.gender}
              aria-errormessage="gender"
              className={cn(
                "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                //   className
              )}
              defaultValue={""}
            >
              <option value="" disabled>
                --Select Gender--
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <span className="text-red-400 text-xs">
              <i>{errors?.gender?.message}</i>
            </span>
          </div>
          <div className="grid gap-1.5 w-full items-center">
            <Label htmlFor="previous_school">Previous School</Label>
            <Input
              id="previous_school"
              autoCorrect="off"
              disabled={isLoading}
              {...register("previous_school")}
            />
            <span className="text-red-400 text-xs">
              <i>{errors?.previous_school?.message}</i>
            </span>
          </div>
          <div className="grid gap-1.5 w-full items-center">
            <Label htmlFor="tutor_group">Tutor Group</Label>
            <Input
              id="tutor_group"
              autoCorrect="off"
              disabled={isLoading}
              {...register("tutor_group")}
            />
            <span className="text-red-400 text-xs">
              <i>{errors?.tutor_group?.message}</i>
            </span>
          </div>
        </div>
        <div className="grid gap-1.5 w-full items-center">
          <Label htmlFor="qualification">Qualification</Label>
          <Input
            id="qualification"
            autoCorrect="off"
            disabled={isLoading}
            {...register("qualification")}
          />
          <span className="text-red-400 text-xs">
            <i>{errors?.qualification?.message}</i>
          </span>
        </div>
        <div className="grid gap-1.5 w-full items-center">
          <Label htmlFor="about_me">About Me</Label>
          <Textarea
            id="about_me"
            disabled={isLoading}
            {...register("about_me")}
          />
          <span className="text-red-400 text-xs">
            <i>{errors?.about_me?.message}</i>
          </span>
        </div>
        <div className="flex gap-6 justify-center">
          <Button disabled={isLoading}>
            {isLoading && (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save Profile
          </Button>
          <Button onClick={handleCancel} variant="outline">
            Cancel
          </Button>
        </div>
      </form>
    </>
  );
};

export default EditProfileForm;
