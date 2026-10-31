
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

interface Event {
  _id: string;
  title: string;
  description: string;
  location: string;
  eventDate: string;
  image: string;
  category: string;
}

interface EventsResponse {
  success: boolean;
  events: Event[];
  message?: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const apiUrl = (
        process.env.NEXT_PUBLIC_API_URL ||
        "http://localhost:5000"
      ).replace(/\/+$/, "");

      const response = await fetch(`${apiUrl}/api/events`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(
          `Events request failed: ${response.status} ${response.statusText}`
        );
      }

      const data: EventsResponse = await response.json();

      if (!data.success || !Array.isArray(data.events)) {
        throw new Error("Invalid events API response");
      }

      const now = new Date();

      const upcomingEvents = data.events
        .filter((event) => {
          const eventDate = new Date(event.eventDate);

          return (
            !Number.isNaN(eventDate.getTime()) &&
            eventDate > now
          );
        })
        .sort(
          (a, b) =>
            new Date(a.eventDate).getTime() -
            new Date(b.eventDate).getTime()
        );

      setEvents(upcomingEvents);
    } catch (err) {
      console.error("Events fetch error:", err);

      setEvents([]);

      if (err instanceof TypeError) {
        setError(
          "Backend-এর সঙ্গে সংযোগ করা যাচ্ছে না। API URL এবং CORS configuration পরীক্ষা করো।"
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Events load করা যাচ্ছে না। আবার চেষ্টা করো।");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 px-4 py-12 transition-colors duration-300 sm:px-6 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="mb-3 text-4xl font-bold text-gray-800 dark:text-white">
              Upcoming Events
            </h1>

            <p className="text-gray-600 dark:text-gray-300">
              Discover events and become part of positive change.
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse overflow-hidden rounded-xl bg-white shadow-md dark:bg-gray-900"
                >
                  <div className="h-52 bg-gray-200 dark:bg-gray-800" />

                  <div className="space-y-4 p-6">
                    <div className="h-5 w-24 rounded bg-gray-200 dark:bg-gray-800" />
                    <div className="h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
                    <div className="h-4 rounded bg-gray-200 dark:bg-gray-800" />
                    <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-800" />
                    <div className="h-10 rounded bg-gray-200 dark:bg-gray-800" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="py-16 text-center">
              <p className="mb-4 text-red-600 dark:text-red-400">
                {error}
              </p>

              <button
                onClick={fetchEvents}
                className="rounded-lg bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && events.length === 0 && (
            <div className="py-16 text-center">
              <p className="mb-3 text-xl font-semibold text-gray-700 dark:text-gray-200">
                No upcoming events available right now.
              </p>

              <p className="text-gray-500 dark:text-gray-400">
                Please check back later for new events.
              </p>
            </div>
          )}

          {/* Events */}
          {!loading && !error && events.length > 0 && (
            <>
              <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
                {events.length} upcoming event
                {events.length !== 1 ? "s" : ""} found
              </p>

              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <article
                    key={event._id}
                    className="overflow-hidden rounded-xl bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-gray-900"
                  >
                    <img
                      src={event.image || "/placeholder.png"}
                      alt={event.title}
                      className="h-52 w-full object-cover"
                    />

                    <div className="p-6">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900/50 dark:text-green-300">
                        {event.category}
                      </span>

                      <h2 className="mb-3 mt-4 text-xl font-bold text-gray-800 dark:text-white">
                        {event.title}
                      </h2>

                      <p className="mb-4 line-clamp-3 text-gray-600 dark:text-gray-300">
                        {event.description}
                      </p>

                      <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                        <p>📍 {event.location}</p>

                        <p>
                          📅{" "}
                          {new Date(event.eventDate).toLocaleDateString(
                            "en-GB",
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
                        className="mt-6 block rounded-lg bg-green-700 py-3 text-center font-semibold text-white transition hover:bg-green-800"
                      >
                        View Details
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
