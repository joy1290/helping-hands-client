
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <nav className="border-b bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-2xl font-bold text-green-700">
          HelpingHands
        </Link>

        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-700 dark:text-gray-200">
          <Link href="/" className="hover:text-green-700">
            Home
          </Link>

          <Link href="/events" className="hover:text-green-700">
            Upcoming Events
          </Link>

          {!isPending && (
            <>
              {session?.user ? (
                <>
                  <Link
                    href="/create-event"
                    className="rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
                  >
                    + Create Event
                  </Link>

                  <Link
                    href="/manage-events"
                    className="hover:text-green-700"
                  >
                    Manage Events
                  </Link>

                  <Link
                    href="/joined-events"
                    className="hover:text-green-700"
                  >
                    Joined Events
                  </Link>

                  <span className="hidden sm:inline">
                    Hi, {session.user.name}
                  </span>

                  <Link href="/profile" className="hover:text-green-700">
                    Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="hover:text-green-700">
                    Login
                  </Link>

                  <Link
                    href="/register"
                    className="rounded-lg bg-green-700 px-4 py-2 text-white transition hover:bg-green-800"
                  >
                    Register
                  </Link>
                </>
              )}
            </>
          )}

          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
