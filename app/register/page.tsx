"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface FormErrors {
  email?: {
    message: string;
  };
  password?: {
    message: string;
  };
  confirmPassword?: {
    message: string;
  };
  general?: string;
}

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState<FormErrors>({});

  const router = useRouter();

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError({});

    if (password !== confirmPassword) {
      setError({
        confirmPassword: {
          message: "Passwords do not match",
        },
      });
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError({
          general: data.error || "Registration failed",
        });
        return;
      }

      console.log(data);
      router.push("/login");
    } catch (error) {
      console.error(error);

      setError({
        general: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title justify-center text-3xl">
            Register
          </h1>

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-4"
          >
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`input input-bordered w-full ${
                  error.general ? "input-error" : ""
                }`}
              />

              {error.email && (
                <p className="mt-1 text-sm text-error">
                  {error.email.message}
                </p>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`input input-bordered w-full ${
                  error.password ? "input-error" : ""
                }`}
              />

              {error.password && (
                <p className="mt-1 text-sm text-error">
                  {error.password.message}
                </p>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  Confirm Password
                </span>
              </label>

              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                className={`input input-bordered w-full ${
                  error.confirmPassword ? "input-error" : ""
                }`}
              />

              {error.confirmPassword && (
                <p className="mt-1 text-sm text-error">
                  {error.confirmPassword.message}
                </p>
              )}
            </div>

            {error.general && (
              <p className="text-center text-sm text-error">
                {error.general}
              </p>
            )}

            <button
              type="submit"
              className="btn btn-primary mt-4 w-full"
            >
              Register
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm">
              Already have an account?{" "}
              <a
                href="/login"
                className="link link-primary"
              >
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
