
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const user = session?.user;

  const userName = user?.name || "User";
  const userEmail = user?.email || "";
  const userImage = user?.image;
  const firstLetter = userName.charAt(0).toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      setIsOpen(false);
      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4">

        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-green-700 dark:text-green-400"
        >
          HelpingHands
        </Link>

        {/* Navigation */}
        <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-200">

          <Link href="/" className="transition hover:text-green-700">
            Home
          </Link>

          <Link
            href="/events"
            className="transition hover:text-green-700"
          >
            Upcoming Events
          </Link>

          {!isPending && (
            <>
              {user ? (
                <>
                  {/* Create Event */}
                  <Link
                    href="/create-event"
                    className="rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
                  >
                    + Create Event
                  </Link>

                  {/* Profile Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsOpen(!isOpen)}
                      className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 p-1 pr-3 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                      aria-label="Open profile menu"
                      aria-expanded={isOpen}
                    >
                      {/* Avatar */}
                      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-green-700 text-lg font-bold text-white ring-2 ring-green-200 dark:ring-green-900">
                        {userImage ? (
                          <img
                            src={userImage}
                            alt={userName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          firstLetter
                        )}
                      </div>

                      <span className="hidden sm:block max-w-28 truncate">
                        {userName}
                      </span>

                      <svg
                        className={`h-4 w-4 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="m19 9-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {isOpen && (
                      <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">

                        {/* User Information */}
                        <div className="border-b border-gray-100 p-4 dark:border-gray-700">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-green-700 text-xl font-bold text-white">
                              {userImage ? (
                                <img
                                  src={userImage}
                                  alt={userName}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                firstLetter
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-semibold text-gray-800 dark:text-white">
                                {userName}
                              </p>
                              <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                                {userEmail}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2">
                          <Link
                            href="/profile"
                            onClick={() => setIsOpen(false)}
                            className="block rounded-lg px-4 py-3 transition hover:bg-green-50 hover:text-green-700 dark:hover:bg-gray-800"
                          >
                            👤 My Profile
                          </Link>

                          <Link
                            href="/create-event"
                            onClick={() => setIsOpen(false)}
                            className="block rounded-lg px-4 py-3 transition hover:bg-green-50 hover:text-green-700 dark:hover:bg-gray-800"
                          >
                            ➕ Create Event
                          </Link>

                          <Link
                            href="/manage-events"
                            onClick={() => setIsOpen(false)}
                            className="block rounded-lg px-4 py-3 transition hover:bg-green-50 hover:text-green-700 dark:hover:bg-gray-800"
                          >
                            📋 Manage Events
                          </Link>

                          <Link
                            href="/joined-events"
                            onClick={() => setIsOpen(false)}
                            className="block rounded-lg px-4 py-3 transition hover:bg-green-50 hover:text-green-700 dark:hover:bg-gray-800"
                          >
                            🤝 Joined Events
                          </Link>
                        </div>

                        {/* Logout */}
                        <div className="border-t border-gray-100 p-2 dark:border-gray-700">
                          <button
                            onClick={handleLogout}
                            className="w-full rounded-lg px-4 py-3 text-left font-medium text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950"
                          >
                            ↪ Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="transition hover:text-green-700"
                  >
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
