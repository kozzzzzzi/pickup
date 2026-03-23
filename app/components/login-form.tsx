"use client";

import { useState } from "react";

export default function LoginForm({ hasError }: { hasError?: boolean }) {
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(hasError ?? false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError(false);

      const formData = new FormData(event.currentTarget);

      const response = await fetch("/api/login", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        setError(true);
        setSubmitting(false);
        return;
      }

      window.location.href = "/dashboard";
    } catch {
      setError(true);
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="login-stack">
        <input
          className="field"
          name="username"
          placeholder="아이디"
          autoComplete="username"
        />

        <div style={{ position: "relative" }}>
          <input
            className="field"
            name="password"
            placeholder="비밀번호"
            type={showPassword ? "text" : "password"}
            style={{ paddingRight: 44 }}
            autoComplete="current-password"
          />

          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              width: 24,
              height: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: showPassword ? 1 : 0.6,
            }}
          >
            {showPassword ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M3 3l18 18" />
                <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                <path d="M9.9 5.2A10.94 10.94 0 0 1 12 5c5 0 9 4 10 7a11.05 11.05 0 0 1-2.1 3.2" />
                <path d="M6.5 6.5A11.05 11.05 0 0 0 2 12c1 3 5 7 10 7 1.3 0 2.5-.2 3.6-.6" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {error && (
        <p style={{ color: "#b42318", fontSize: 13, marginTop: 10 }}>
          아이디 또는 비밀번호가 올바르지 않습니다.
        </p>
      )}

      <button
        className="primary-button"
        type="submit"
        style={{ marginTop: 14 }}
        disabled={submitting}
      >
        {submitting ? "로그인 중..." : "로그인"}
      </button>
    </form>
  );
}