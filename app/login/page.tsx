"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface FormErrors {
  email?: {
    message: string;
  };
  password?: {
    message: string;
  };
  general?: string;
}

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<FormErrors>({});

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError({});

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError({
          general: res.error || "Login failed",
        });
        return;
      }

      router.push("/");
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
          <h1 className="card-title justify-center text-3xl">Login</h1>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="form-control">
              <label htmlFor="email" className="label">
                <span className="label-text">Email</span>
              </label>

              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`input input-bordered w-full ${
                  error.email ? "input-error" : ""
                }`}
              />

              {error.email && (
                <p className="mt-1 text-sm text-error">{error.email.message}</p>
              )}
            </div>

            <div className="form-control">
              <label htmlFor="password" className="label">
                <span className="label-text">Password</span>
              </label>

              <input
                id="password"
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

            {error.general && (
              <p className="text-center text-sm text-error">{error.general}</p>
            )}

            <button type="submit" className="btn btn-primary mt-4 w-full">
              Login
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm">
              Don't have an account?{" "}
              <Link href="/register" className="link link-primary">
                Signup
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
