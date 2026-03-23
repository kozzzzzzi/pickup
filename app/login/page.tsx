import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";

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
      <h1 className="page-title">관리자 로그인</h1>
      <p className="page-subtitle">
        로그인해야만 스캔과 주문 관리 기능을 사용할 수 있습니다.
      </p>

      <form action="/api/login" method="post">
        <div className="login-stack">
          <input className="field" name="username" placeholder="아이디" />
          <input
            className="field"
            name="password"
            placeholder="비밀번호"
            type="password"
          />
        </div>

        <label className="checkbox-row">
          <input type="checkbox" name="remember" />
          이 기기에서 로그인 유지
        </label>

        {hasError && (
          <p
            style={{
              marginTop: 12,
              fontSize: 13,
              color: "#b42318",
            }}
          >
            아이디 또는 비밀번호가 올바르지 않습니다.
          </p>
        )}

        <div className="section">
          <button className="primary-button" type="submit">
            로그인
          </button>
        </div>
      </form>
    </div>
  );
}