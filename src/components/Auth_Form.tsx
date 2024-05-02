"use client";

import { FormEvent, useEffect, useState } from "react";
import { FaSpinner, FaAngleRight, FaCheck } from "react-icons/fa";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useLoginMutation } from "@/services/userApi";
import { LoginSchema, RegisterSchema } from "@/lib/zodShema";
import { useToast } from "./ui/use-toast";
import { useDispatch } from "react-redux";
import { setAuthState } from "@/store/authSlice";
import {
  useLazyGetEmailStatusQuery,
  useLazyGetRegCodeStatusQuery,
  useLazyGetUserNameStatusQuery,
  useSignUpMutation,
} from "@/services/onBoardApi";
import { useRouter } from "next/navigation";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  regCode?: string;
}

export function LoginForm({ className, ...props }: UserAuthFormProps) {
  const { toast } = useToast();
  const [login, { isSuccess, isLoading, isError, data, error }] =
    useLoginMutation();
  const dispatch = useDispatch();
  // useEffect(() => {
  //   // @ts-expect-error
  //   if (error?.data?.errors?.message) {
  //     toast({
  //       variant: "destructive",
  //       // @ts-expect-error
  //       description: error?.data?.errors?.message,
  //     });
  //   }
  // }, [error]);

  useEffect(() => {
    // @ts-expect-error
    if (error?.data?.errors?.message) {
      toast({
        variant: "destructive",
        // @ts-expect-error
        description: error?.data?.errors?.message,
      });
    } else if (isSuccess && data) {
      console.log({ data });
      dispatch(setAuthState(data));
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          orgId: data.org_code,
          userId: data.user_id,
          role: data.role,
        })
      );
    } else if (error) {
      toast({
        variant: "destructive",
        description: "Something went wrong",
      });
    }
  }, [isSuccess, data, error]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof LoginSchema>>({
    mode: "onChange",
    resolver: zodResolver(LoginSchema),
  });

  async function onSubmit(data: z.infer<typeof LoginSchema>) {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("password", data.password);
    login(formData);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1.5 w-full items-center">
            <Label htmlFor="username">Email/Username</Label>
            <Input
              id="username"
              placeholder="name@example.com"
              autoCapitalize="none"
              autoComplete="username"
              autoCorrect="off"
              disabled={isLoading}
              {...register("username")}
            />
          </div>
          <span className="text-red-400 text-xs">
            <i>{errors?.username?.message}</i>
          </span>
          <div className="grid gap-1.5 w-full items-center">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="password"
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect="off"
              disabled={isLoading}
              {...register("password")}
            />
            <span className="text-red-400 text-xs">
              <i>{errors?.password?.message}</i>
            </span>
            <div className="w-full text-right">
              <Link
                href=""
                className="underline underline-offset-4 hover:text-primary text-xs"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <Button disabled={isLoading}>
            {isLoading && (
              <span className="mr-2 h-4 w-4 animate-spin">
                <FaSpinner />
              </span>
            )}
            Login
          </Button>
        </div>
      </form>
    </div>
  );
}

export function RegisterForm({
  className,
  regCode,
  ...props
}: UserAuthFormProps) {
  const [getUserNameStatus, userNameStatusResponse] =
    useLazyGetUserNameStatusQuery();
  const [getEmailStatus, emailStatusResponse] = useLazyGetEmailStatusQuery();
  const { toast } = useToast();
  const [getRegCodeStatus, regCodeStatusResponse] =
    useLazyGetRegCodeStatusQuery();
  const [signUp, { isSuccess, isLoading, isError, data, error }] =
    useSignUpMutation();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof RegisterSchema>>({
    mode: "onBlur",
    resolver: zodResolver(RegisterSchema),
  });

  const usernameValue = watch("user_name");
  const emailValue = watch("email");

  useEffect(() => {
    if (isSuccess) {
      router.replace("/");
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
  }, [isSuccess, data, isError]);

  useEffect(() => {
    //@ts-expect-error
    if (regCodeStatusResponse.error?.data?.errors?.code) {
      toast({
        variant: "destructive",
        // @ts-expect-error
        description: regCodeStatusResponse.error?.data?.errors?.message,
      });
      router.replace(`/onboard/sign-up`);
    }
  }, [regCodeStatusResponse]);

  useEffect(() => {
    getRegCodeStatus({ code: regCode });
    setValue("reg_code", regCode!);
  }, []);

  useEffect(() => {
    if (usernameValue?.length > 7) {
      getUserNameStatus({ username: usernameValue });
    }
  }, [usernameValue]);

  useEffect(() => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailValue)) {
      getEmailStatus({ email: emailValue });
    }
  }, [emailValue]);

  useEffect(() => {
    // console.log({userNameStatusResponse});
    if (!userNameStatusResponse.isError) {
      setError("user_name", {
        message: userNameStatusResponse.data?.results?.message,
        type: "onChange",
      });
      //@ts-expect-error
    } else if (userNameStatusResponse.error?.data?.errors?.code) {
      setError("user_name", {
        //@ts-expect-error
        message: userNameStatusResponse.error?.data?.errors?.message,
        type: "onChange",
      });
    }
  }, [userNameStatusResponse]);

  useEffect(() => {
    // console.log(emailStatusResponse);
    if (!emailStatusResponse.isError) {
      setError("email", {
        message: emailStatusResponse.data?.results?.message,
        type: "onChange",
      });
      //@ts-expect-error
    } else if (emailStatusResponse.error?.data?.errors?.code) {
      setError("email", {
        //@ts-expect-error
        message: emailStatusResponse.error?.data?.errors?.message,
        type: "onChange",
      });
    }
  }, [emailStatusResponse]);

  async function onSubmit(body) {
    signUp(body);
  }

  return (
    <div className={cn("grid gap-6 mt-7", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-1.5 w-full items-center">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="johndoe"
              autoCapitalize="none"
              autoComplete="username"
              autoCorrect="off"
              disabled={isLoading}
              {...register("user_name")}
            />
            <span className="text-green-700 ">
              {errors?.user_name?.message == "valid" ? (
                <FaCheck />
              ) : (
                <i className="text-red-400 text-xs">
                  {errors?.user_name?.message}
                </i>
              )}
            </span>
          </div>
          <div className="grid gap-1.5 w-full items-center">
            <Label htmlFor="first_name">First Name</Label>
            <Input
              id="first_name"
              placeholder="John"
              autoCapitalize="none"
              autoComplete="firstName"
              autoCorrect="off"
              disabled={isLoading}
              {...register("first_name")}
            />
            <span className="text-red-400 text-xs">
              <i>{errors?.first_name?.message}</i>
            </span>
          </div>
          <div className="grid gap-1.5 w-full items-center">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              placeholder="Doe"
              autoCapitalize="none"
              autoComplete="lastName"
              autoCorrect="off"
              disabled={isLoading}
              {...register("last_name")}
            />
            <span className="text-red-400 text-xs">
              <i>{errors?.last_name?.message}</i>
            </span>
          </div>
          <div className="grid gap-1.5 w-full items-center">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              {...register("email")}
            />
            <span className="text-red-400 text-xs">
              <i>{errors?.email?.message}</i>
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
                "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                className
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
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              placeholder="password"
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect="off"
              disabled={isLoading}
              {...register("password")}
            />
            <span className="text-red-400 text-xs">
              <i>{errors?.password?.message}</i>
            </span>
          </div>
          <div className="grid gap-1.5 w-full items-center">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              type="password"
              id="confirmPassword"
              placeholder="password"
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect="off"
              disabled={isLoading}
              {...register("confirmPassword")}
            />
            <span className="text-red-400 text-xs">
              <i>{errors?.confirmPassword?.message}</i>
            </span>
          </div>
          <Button disabled={isLoading}>
            {isLoading && (
              <span className="mr-2 h-4 w-4 animate-spin">
                <FaSpinner />
              </span>
            )}
            Register
          </Button>
        </div>
      </form>
    </div>
  );
}

export function KeyCodeForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [keycode, setKeycode] = useState("");
  const [keycodeError, setKeycodeError] = useState("");
  const router = useRouter();

  const [getRegCodeStatus, regCodeStatusResponse] =
    useLazyGetRegCodeStatusQuery();

  useEffect(() => {
    // console.log(regCodeStatusResponse);
    if (regCodeStatusResponse.data) {
      const results = regCodeStatusResponse.data.results;
      if (
        results.items.status === "not_activated" ||
        results.items.status === "active"
      ) {
        // router.replace(`/onboard/sign-up?keycode=${keycode}`);
        router.replace(`/register?keycode=${keycode}`);
      }
      // setIsRegisterCodeSuccess(
      //   results.items.status === "not_activated" ||
      //     results.items.status === "active"
      // );
      // setIsShowParentCheckBox(results.items.licence_type === "student");
      // setIsParentRegistered(
      //   results.items.parent === "not registered" &&
      //     results.items.user === "registered"
      // );
      //@ts-expect-error
    } else if (regCodeStatusResponse.error?.data?.errors?.code) {
      //@ts-expect-error
      setKeycodeError(regCodeStatusResponse.error?.data?.errors?.message);
    }
  }, [regCodeStatusResponse]);

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getRegCodeStatus({ code: keycode });
    setIsLoading(true);
    console.log(e);
    setIsLoading(false);
  };

  // getRegCodeStatus({ code: values.registerCode });

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={(e) => submitHandler(e)}>
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
            />
          </div>
          <span className="text-red-400 text-xs">
            <i>{keycodeError}</i>
          </span>
          <Button disabled={isLoading} className="w-fit ml-auto">
            {isLoading && (
              <span className="mr-2 h-4 w-4 animate-spin">
                <FaSpinner />
              </span>
            )}
            Next
            <span className="ml-2 h-4 w-4 mt-1">
              <FaAngleRight />
            </span>
          </Button>
        </div>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?
        <Link
          href="/"
          className="underline underline-offset-4 hover:text-primary pl-1"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
