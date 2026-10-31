
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useSession } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

interface Event {
  _id: string;
  title: string;
  description: string;
  location: string;
  eventDate: string;
  image: string;
  category: string;
}

export default function JoinedEventsPage() {
  const { data: session, isPending } = useSession();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      setEvents([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchJoinedEvents = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await apiFetch("/api/events/joined/me", {
          method: "GET",
          requiresAuth: true,
        });

        if (!cancelled) {
          setEvents(data.events || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load joined events."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchJoinedEvents();

    return () => {
      cancelled = true;
    };
  }, [session, isPending]);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 px-4 py-12 transition-colors dark:bg-gray-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <p className="mb-2 font-semibold text-green-600 dark:text-green-400">
              YOUR PARTICIPATION
            </p>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Joined Events
            </h1>

            <p className="mt-3 text-gray-600 dark:text-gray-300">
              Events you have joined. Stay connected and make a difference.
            </p>
          </div>

          {isPending || loading ? (
            <div className="py-20 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />

              <p className="mt-4 text-gray-600 dark:text-gray-300">
                Loading your joined events...
              </p>
            </div>
          ) : !session ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm dark:bg-gray-900">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Please login first
              </h2>

              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Login to see the events you have joined.
              </p>

              <Link
                href="/login"
                className="mt-6 inline-block rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
              >
                Login Now
              </Link>
            </div>
          ) : error ? (
            <div className="rounded-xl bg-red-50 p-6 text-center text-red-600 dark:bg-red-950 dark:text-red-300">
              {error}
            </div>
          ) : events.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm dark:bg-gray-900">
              <div className="mb-4 text-5xl">🌱</div>

              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                No Joined Events Yet
              </h2>

              <p className="mt-2 text-gray-600 dark:text-gray-300">
                You haven't joined any upcoming events yet.
              </p>

              <Link
                href="/events"
                className="mt-6 inline-block rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
              >
                Explore Events
              </Link>
            </div>
          ) : (
            <>
              <p className="mb-6 text-sm font-medium text-gray-600 dark:text-gray-300">
                {events.length} event(s) joined
              </p>

              <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <div
                    key={event._id}
                    className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:bg-gray-900"
                  >
                    <div className="h-52 overflow-hidden bg-gray-200 dark:bg-gray-800">
                      {event.image ? (
                        <img
                          src={event.image}
                          alt={event.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-5xl">
                          🌱
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-950 dark:text-green-300">
                        {event.category}
                      </span>

                      <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
                        {event.title}
                      </h2>

                      <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                        {event.description}
                      </p>

                      <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        <p>📍 {event.location}</p>

                        <p>
                          📅{" "}
                          {new Date(event.eventDate).toLocaleDateString(
                            "en-BD",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>

                      <Link
                        href={`/events/${event._id}`}
                        className="mt-6 block rounded-lg bg-green-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-green-700"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
