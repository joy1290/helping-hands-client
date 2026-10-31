
"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useSession } from "@/lib/auth-client";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();

  const user = session?.user;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 px-4 py-12 transition-colors dark:bg-gray-950">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <p className="font-semibold text-green-600 dark:text-green-400">
              MY ACCOUNT
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              My Profile
            </h1>

            <p className="mt-2 text-gray-600 dark:text-gray-300">
              View your HelpingHands account information.
            </p>
          </div>

          {isPending ? (
            <div className="rounded-2xl bg-white p-10 text-center text-gray-600 shadow-sm dark:bg-gray-900 dark:text-gray-300">
              Loading profile...
            </div>
          ) : !user ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm dark:bg-gray-900">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Login Required
              </h2>

              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Please login to view your profile.
              </p>

              <Link
                href="/login"
                className="mt-6 inline-block rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
              >
                Login Now
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm transition-colors dark:bg-gray-900">
              <div className="bg-green-700 px-6 py-10 text-center">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="mx-auto h-28 w-28 rounded-full border-4 border-white object-cover"
                  />
                ) : (
                  <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-green-100 text-4xl font-bold text-green-800">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}

                <h2 className="mt-4 text-2xl font-bold text-white">
                  {user.name}
                </h2>

                <p className="mt-1 text-green-100">
                  {user.email}
                </p>
              </div>

              <div className="space-y-5 p-6 sm:p-8">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Full Name
                  </p>

                  <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                    {user.name || "Not provided"}
                  </p>
                </div>

                <div className="border-t border-gray-100 pt-5 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Email Address
                  </p>

                  <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                    {user.email}
                  </p>
                </div>

                <div className="border-t border-gray-100 pt-5 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Email Verification
                  </p>

                  <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                    {user.emailVerified ? (
                      <span className="text-green-600 dark:text-green-400">
                        ✓ Verified
                      </span>
                    ) : (
                      <span className="text-orange-600 dark:text-orange-400">
                        Not verified
                      </span>
                    )}
                  </p>
                </div>

                <Link
                  href="/events"
                  className="inline-block rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
                >
                  Explore Events
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
