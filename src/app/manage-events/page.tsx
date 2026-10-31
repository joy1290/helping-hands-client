
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import Navbar from "@/components/Navbar";

interface Event {
  _id: string;
  title: string;
  description: string;
  location: string;
  eventDate: string;
  image: string;
  category: string;
  createdBy: string;
}

export default function ManageEventsPage() {
  const { data: session, isPending } = useSession();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      setLoading(false);
      return;
    }

    const fetchMyEvents = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await apiFetch("/api/events", {
          method: "GET",
          requiresAuth: true,
        });

        const myEvents = (data.events || []).filter(
          (event: Event) => event.createdBy === session.user.id
        );

        setEvents(myEvents);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch your events"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, [session, isPending]);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");

      await apiFetch(`/api/events/${id}`, {
        method: "DELETE",
        requiresAuth: true,
      });

      setEvents((previous) =>
        previous.filter((event) => event._id !== id)
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Delete failed"
      );
    } finally {
      setDeletingId("");
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 px-4 py-12 transition-colors dark:bg-gray-950">
        <div className="mx-auto max-w-6xl">
          {isPending || loading ? (
            <div className="flex min-h-[50vh] items-center justify-center">
              <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
                Loading your events...
              </p>
            </div>
          ) : !session ? (
            <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Please Login First
              </h2>

              <Link
                href="/login"
                className="rounded-lg bg-green-600 px-6 py-3 text-white transition hover:bg-green-700"
              >
                Login
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Manage My Events
                  </h1>

                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    View, edit and manage the events you created.
                  </p>
                </div>

                <Link
                  href="/create-event"
                  className="rounded-lg bg-green-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-green-700"
                >
                  + Create Event
                </Link>
              </div>

              {error && (
                <p className="mb-6 rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-950 dark:text-red-300">
                  {error}
                </p>
              )}

              {events.length === 0 ? (
                <div className="rounded-xl bg-white p-10 text-center shadow dark:bg-gray-900">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    No Events Found
                  </h2>

                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    You have not created any events yet.
                  </p>

                  <Link
                    href="/create-event"
                    className="mt-5 inline-block rounded-lg bg-green-600 px-5 py-3 text-white transition hover:bg-green-700"
                  >
                    Create Your First Event
                  </Link>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {events.map((event) => (
                    <div
                      key={event._id}
                      className="overflow-hidden rounded-xl bg-white shadow-md transition-colors dark:bg-gray-900"
                    >
                      <img
                        src={event.image}
                        alt={event.title}
                        className="h-48 w-full object-cover"
                      />

                      <div className="p-5">
                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
                          {event.category}
                        </span>

                        <h2 className="mt-3 text-xl font-bold text-gray-900 dark:text-white">
                          {event.title}
                        </h2>

                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                          {event.location}
                        </p>

                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          {new Date(event.eventDate).toLocaleDateString()}
                        </p>

                        <div className="mt-5 flex gap-3">
                          <Link
                            href={`/edit-event/${event._id}`}
                            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-center text-white transition hover:bg-blue-700"
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() => handleDelete(event._id)}
                            disabled={deletingId === event._id}
                            className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {deletingId === event._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
