import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";
import LoginForm from "@/app/components/login-form";

type Props = {
  searchParams?: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const hasError = params?.error === "1";

  const isLoggedIn = await verifySession();

  if (isLoggedIn) {
    redirect("/dashboard");
  }

  return (
    <div>
      <h1 className="page-title">로그인</h1>

      <LoginForm hasError={hasError} />
    </div>
  );
}