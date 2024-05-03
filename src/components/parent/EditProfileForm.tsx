import { cn } from "@/lib/utils";
import { EditParentDataSchema } from "@/lib/zodShema";
import { useUserProfileUpdateMutation } from "@/services/onBoardApi";
import { useAppSelector } from "@/store/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaSpinner } from "react-icons/fa";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useToast } from "../ui/use-toast";

const EditProfileForm = ({ parentData, onClose }: any) => {
  const user = useAppSelector((state) => state.auth);
  const { toast } = useToast();
  const router = useRouter();
  const [updateProfile, { isLoading, data, isError, isSuccess }] =
    useUserProfileUpdateMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<z.infer<typeof EditParentDataSchema>>({
    mode: "onBlur",
    resolver: zodResolver(EditParentDataSchema),
    defaultValues: {
      ...parentData,
    },
  });

  const handleSave = async (
    updatedData: z.infer<typeof EditParentDataSchema>
  ) => {
    updateProfile({
      userId: user.user_id,
      orgCode: user.org_code,
      data: updatedData,
      role: "parent",
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
      } else {
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
    <div>
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
              <i>{errors?.first_name?.message}</i>
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
            <Label htmlFor="qualification">Qualification</Label>
            <Input
              id="qualification"
              disabled={isLoading}
              {...register("qualification")}
            />
            <span className="text-red-400 text-xs">
              <i>{errors?.qualification?.message}</i>
            </span>
          </div>
          <div className="grid gap-1.5 w-full items-center">
            <Label htmlFor="occupation">Occupation</Label>
            <Input
              id="occupation"
              disabled={isLoading}
              {...register("occupation")}
            />
            <span className="text-red-400 text-xs">
              <i>{errors?.occupation?.message}</i>
            </span>
          </div>
          <div className="grid gap-1.5 w-full items-center">
            <Label htmlFor="contact_no">Contact_no</Label>
            <Input
              id="contact_no"
              type="number"
              disabled={isLoading}
              {...register("contact_no")}
            />
            <span className="text-red-400 text-xs">
              <i>{errors?.contact_no?.message}</i>
            </span>
          </div>
          <div className="grid gap-1.5 w-full items-center">
            <Label htmlFor="contact_address">Contact Address</Label>
            <Input
              id="contact_address"
              disabled={isLoading}
              {...register("contact_address")}
            />
            <span className="text-red-400 text-xs">
              <i>{errors?.contact_address?.message}</i>
            </span>
          </div>
          <div className="grid gap-1.5 w-full items-center">
            <Label htmlFor="spouse_name">Spouse Name</Label>
            <Input
              id="spouse_name"
              disabled={isLoading}
              {...register("spouse_name")}
            />
            <span className="text-red-400 text-xs">
              <i>{errors?.spouse_name?.message}</i>
            </span>
          </div>
          <div className="grid gap-1.5 w-full items-center">
            <Label htmlFor="spouse_qualification">spouse_qualification</Label>
            <Input
              id="spouse_qualification"
              disabled={isLoading}
              {...register("spouse_qualification")}
            />
            <span className="text-red-400 text-xs">
              <i>{errors?.spouse_qualification?.message}</i>
            </span>
          </div>
          <div className="grid gap-1.5 w-full items-center">
            <Label htmlFor="spouse_occupation">Spouse Occupation</Label>
            <Input
              id="spouse_occupation"
              disabled={isLoading}
              {...register("spouse_occupation")}
            />
            <span className="text-red-400 text-xs">
              <i>{errors?.spouse_occupation?.message}</i>
            </span>
          </div>
          <div className="grid gap-1.5 w-full items-center">
            <Label htmlFor="spouse_contact_no">Spouse Contact Number</Label>
            <Input
              id="spouse_contact_no"
              disabled={isLoading}
              type="number"
              {...register("spouse_contact_no")}
            />
            <span className="text-red-400 text-xs">
              <i>{errors?.spouse_contact_no?.message}</i>
            </span>
          </div>
        </div>

        <div className="grid gap-1.5 w-full items-center">
          <Label htmlFor="no_of_children">No of Children</Label>
          <Input
            id="no_of_children"
            disabled={isLoading}
            type="number"
            {...register("no_of_children")}
          />
          <span className="text-red-400 text-xs">
            <i>{errors?.no_of_children?.message}</i>
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
    </div>
  );
};

export default EditProfileForm;
