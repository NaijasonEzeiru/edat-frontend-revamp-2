import { FormEvent, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAddChildMutation } from "@/services/parentApi";
import { FaSpinner } from "react-icons/fa";
import ProtectedRoute from "@/components/route/ProtectedRoute";
import DefaultLayout from "../../layouts/DefaultLayout";
import { useAppSelector } from "@/store/hooks";
import { toast } from "@/components/ui/use-toast";
import { UserPlus } from "lucide-react";

function add_child() {
  const [addChild, { isLoading, data, error }] = useAddChildMutation();
  const user = useAppSelector((state) => state.auth);
  const [keycodeError, setKeycodeError] = useState("");
  const [keycode, setKeycode] = useState("");

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addChild({
      student_reg_code: keycode,
      orgCode: user.org_code,
      userId: user.user_id,
    });
  };

  useEffect(() => {
    if (data) {
      toast({
        // variant: "default",
        description: "Child successfully added!",
      });
      //@ts-expect-error
    } else if (error?.data?.errors?.code) {
      //@ts-expect-error
      setKeycodeError(error?.data?.errors?.message);
    }
  }, [data, error]);

  return (
    <ProtectedRoute allowedRoles={["parent"]}>
      <DefaultLayout
        children={
          <div className="flex items-center h-full">
            <form onSubmit={(e) => submitHandler(e)} className="w-full">
              <div className="grid gap-2">
                <div className="grid gap-1.5 w-full items-center">
                  <Label htmlFor="reg-code">Enter Registration Code</Label>
                  <Input
                    id="reg-code"
                    placeholder="Registration code"
                    autoCapitalize="none"
                    autoCorrect="off"
                    disabled={isLoading}
                    value={keycode}
                    onChange={(e) => {
                      setKeycode(e.target.value);
                      setKeycodeError("");
                    }}
                    required
                    className="border-[#DDD]"
                  />
                </div>
                <span className="text-red-400 text-xs">
                  <i>{keycodeError}</i>
                </span>
                <Button disabled={isLoading} className="w-fit m-auto">
                  {isLoading ? (
                    <span className="mr-2 size-4">
                      <FaSpinner />
                    </span>
                  ) : (
                    <UserPlus className="mr-2 size-5" />
                  )}
                  Add Child
                </Button>
              </div>
            </form>
          </div>
        }
      ></DefaultLayout>
    </ProtectedRoute>
  );
}

export default add_child;
