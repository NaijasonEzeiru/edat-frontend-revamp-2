import { KeyCodeForm, RegisterForm } from "@/components/Auth_Form";
import AuthLayout from "@/layouts/AuthLayout";
import { useRouter } from "next/router";

function test() {
  const router = useRouter();
  const keycode = router.query.keycode as string;

  return (
    <AuthLayout>
      {!keycode ? <KeyCodeForm /> : <RegisterForm regCode={keycode} />}
    </AuthLayout>
  );
}

export default test;
