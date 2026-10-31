
"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-green-500 dark:focus:ring-green-900";

  const labelClass =
    "mb-2 block font-medium text-gray-700 dark:text-gray-200";

  const validateForm = () => {
    if (!email.trim() || !password) {
      return "Please enter your email and password.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return "Please enter a valid email address.";
    }

    return "";
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (result.error) {
        setError(result.error.message || "Invalid email or password.");
        return;
      }

      const session = await authClient.getSession();

      if (session.error || !session.data?.user) {
        setError("Session could not be verified. Please try again.");
        return;
      }

      setSuccess("Login successful! Welcome to HelpingHands.");

      router.replace("/");
      router.refresh();
    } catch (err) {
      console.error("LOGIN ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setSuccess("");
    setGoogleLoading(true);

    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "https://helping-hands-client-five.vercel.app/",
      });

      if (result.error) {
        setError(result.error.message || "Google login failed.");
        setGoogleLoading(false);
      }
    } catch (err) {
      console.error("GOOGLE LOGIN ERROR:", err);

      setError("Google login failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10 dark:bg-gray-950">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-900">
          <h1 className="mb-2 text-center text-3xl font-bold text-green-700 dark:text-green-400">
            HelpingHands
          </h1>

          <p className="mb-8 text-center text-gray-500 dark:text-gray-300">
            Welcome back! Login to your account.
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className={labelClass}>
                Email Address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="password" className={labelClass}>
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className={inputClass}
              />
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-300"
              >
                {error}
              </div>
            )}

            {success && (
              <div
                role="status"
                className="rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950 dark:text-green-300"
              >
                ✓ {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full rounded-lg bg-green-700 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
            <span className="text-sm text-gray-400">OR</span>
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading || googleLoading}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.25 5.48-4.72 7.18l7.19 5.59c4.2-3.88 6.57-9.59 6.57-17.24Z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19Z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.9-5.79l-7.19-5.59c-1.99 1.34-4.53 2.13-8.71 2.13-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 43.62 14.62 48 24 48Z"
              />
            </svg>

            {googleLoading
              ? "Connecting to Google..."
              : "Continue with Google"}
          </button>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-green-700 hover:underline dark:text-green-400"
            >
              Register
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
