
"use client";

import { useEffect, useState } from "react";
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

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/events");

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const data = await response.json();
        setEvents(data.events || []);
      } catch {
        setError("Events load করা যাচ্ছে না। আবার চেষ্টা করো।");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 px-6 py-12 transition-colors duration-300 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h1 className="mb-3 text-4xl font-bold text-gray-800 dark:text-white">
              Upcoming Events
            </h1>

            <p className="text-gray-600 dark:text-gray-300">
              Discover events and become part of positive change.
            </p>
          </div>

          {loading && (
            <p className="py-16 text-center text-gray-600 dark:text-gray-300">
              Loading events...
            </p>
          )}

          {error && (
            <p className="py-16 text-center text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          {!loading && !error && events.length === 0 && (
            <p className="py-16 text-center text-gray-500 dark:text-gray-400">
              No upcoming events available right now.
            </p>
          )}

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <article
                key={event._id}
                className="overflow-hidden rounded-xl bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-gray-900 dark:shadow-gray-950/50"
              >
                <img
                  src={event.image}
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
        </div>
      </main>
    </>
  );
}
