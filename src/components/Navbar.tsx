
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [isOpen, setIsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const closeMenus = () => {
    setIsOpen(false);
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      closeMenus();
      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navLinkClass =
    "transition hover:text-green-700 dark:hover:text-green-400";

  const dropdownLinkClass =
    "block rounded-lg px-4 py-3 transition hover:bg-green-50 hover:text-green-700 dark:hover:bg-gray-800 dark:hover:text-green-400";

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">

        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenus}
          className="text-2xl font-bold text-green-700 dark:text-green-400"
        >
          HelpingHands
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 text-sm font-medium text-gray-700 dark:text-gray-200 md:flex">
          <Link href="/" className={navLinkClass}>
            Home
          </Link>

          <Link href="/events" className={navLinkClass}>
            Upcoming Events
          </Link>

          {!isPending && (
            <>
              {user ? (
                <>
                  <Link
                    href="/create-event"
                    className="rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
                  >
                    + Create Event
                  </Link>

                  {/* Profile Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsOpen((prev) => !prev)}
                      title={userName}
                      aria-label={`Profile menu for ${userName}`}
                      aria-expanded={isOpen}
                      className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 p-1 pr-3 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                    >
                      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-green-700 text-lg font-bold text-white ring-2 ring-green-200 dark:ring-green-900">
                        {userImage ? (
                          <img
                            src={userImage}
                            alt={`${userName}'s profile`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          firstLetter
                        )}
                      </div>

                      <span className="max-w-28 truncate">
                        {userName}
                      </span>

                      <svg
                        className={`h-4 w-4 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="m19 9-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {isOpen && (
                      <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">

                        {/* User Information */}
                        <div className="border-b border-gray-100 p-4 dark:border-gray-700">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-green-700 text-xl font-bold text-white">
                              {userImage ? (
                                <img
                                  src={userImage}
                                  alt={`${userName}'s profile`}
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

                        {/* Private Navigation */}
                        <div className="p-2">
                          <Link
                            href="/profile"
                            onClick={closeMenus}
                            className={dropdownLinkClass}
                          >
                            👤 My Profile
                          </Link>

                          <Link
                            href="/create-event"
                            onClick={closeMenus}
                            className={dropdownLinkClass}
                          >
                            ➕ Create Event
                          </Link>

                          <Link
                            href="/manage-events"
                            onClick={closeMenus}
                            className={dropdownLinkClass}
                          >
                            📋 Manage Events
                          </Link>

                          <Link
                            href="/joined-events"
                            onClick={closeMenus}
                            className={dropdownLinkClass}
                          >
                            🤝 Joined Events
                          </Link>
                        </div>

                        {/* Logout */}
                        <div className="border-t border-gray-100 p-2 dark:border-gray-700">
                          <button
                            type="button"
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
                  <Link href="/login" className={navLinkClass}>
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

        {/* Mobile Controls */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
          >
            {mobileMenuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 dark:border-gray-700 dark:bg-gray-900 md:hidden">
          <div className="flex flex-col gap-3 text-sm font-medium text-gray-700 dark:text-gray-200">
            <Link
              href="/"
              onClick={closeMenus}
              className="rounded-lg px-3 py-2 hover:bg-green-50 dark:hover:bg-gray-800"
            >
              Home
            </Link>

            <Link
              href="/events"
              onClick={closeMenus}
              className="rounded-lg px-3 py-2 hover:bg-green-50 dark:hover:bg-gray-800"
            >
              Upcoming Events
            </Link>

            {!isPending && (
              <>
                {user ? (
                  <>
                    <div className="flex items-center gap-3 border-y border-gray-100 py-4 dark:border-gray-700">
                      <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-green-700 font-bold text-white">
                        {userImage ? (
                          <img
                            src={userImage}
                            alt={`${userName}'s profile`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          firstLetter
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-semibold">
                          {userName}
                        </p>
                        <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                          {userEmail}
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/profile"
                      onClick={closeMenus}
                      className="rounded-lg px-3 py-2 hover:bg-green-50 dark:hover:bg-gray-800"
                    >
                      👤 My Profile
                    </Link>

                    <Link
                      href="/create-event"
                      onClick={closeMenus}
                      className="rounded-lg px-3 py-2 hover:bg-green-50 dark:hover:bg-gray-800"
                    >
                      ➕ Create Event
                    </Link>

                    <Link
                      href="/manage-events"
                      onClick={closeMenus}
                      className="rounded-lg px-3 py-2 hover:bg-green-50 dark:hover:bg-gray-800"
                    >
                      📋 Manage Events
                    </Link>

                    <Link
                      href="/joined-events"
                      onClick={closeMenus}
                      className="rounded-lg px-3 py-2 hover:bg-green-50 dark:hover:bg-gray-800"
                    >
                      🤝 Joined Events
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="rounded-lg px-3 py-2 text-left font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      ↪ Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={closeMenus}
                      className="rounded-lg px-3 py-2 hover:bg-green-50 dark:hover:bg-gray-800"
                    >
                      Login
                    </Link>

                    <Link
                      href="/register"
                      onClick={closeMenus}
                      className="rounded-lg bg-green-700 px-4 py-2 text-center text-white hover:bg-green-800"
                    >
                      Register
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
