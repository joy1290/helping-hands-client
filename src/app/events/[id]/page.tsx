
"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  createdBy?: string;
  participants?: string[];
}

function EventDetailsContent() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const { data: session, isPending } = useSession();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [joining, setJoining] = useState(false);
  const [message, setMessage] = useState("");
  const [isJoined, setIsJoined] = useState(false);

  // Fetch event details
  useEffect(() => {
    let cancelled = false;

    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/events/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Event not found");
        }

        if (!cancelled) {
          setEvent(data.event);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Event পাওয়া যায়নি।"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchEvent();
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Check whether user has joined
  useEffect(() => {
    if (!event || !session) {
      setIsJoined(false);
      return;
    }

    setIsJoined(
      event.participants?.includes(session.user.id) ?? false
    );
  }, [event, session]);

  // Join event
  const handleJoinEvent = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    if (joining) return;

    setJoining(true);
    setMessage("");

    try {
      const data = await apiFetch(`/api/events/${id}/join`, {
        method: "POST",
        requiresAuth: true,
      });

      setIsJoined(true);

      setEvent((previous) =>
        previous
          ? {
              ...previous,
              participants: [
                ...new Set([
                  ...(previous.participants || []),
                  session.user.id,
                ]),
              ],
            }
          : null
      );

      setMessage(
        data.message || "You joined this event successfully!"
      );
    } catch (err) {
      setMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setJoining(false);
    }
  };

  const isOwner =
    !!session &&
    !!event &&
    event.createdBy === session.user.id;

  const isPastEvent =
    !!event &&
    new Date(event.eventDate).getTime() <= Date.now();

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 px-5 py-12 transition-colors duration-300 dark:bg-gray-950">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/events"
            className="mb-8 inline-block font-medium text-green-700 hover:underline dark:text-green-400"
          >
            ← Back to Events
          </Link>

          {loading && (
            <p className="py-20 text-center text-gray-500 dark:text-gray-300">
              Loading event details...
            </p>
          )}

          {error && (
            <p className="py-20 text-center text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          {event && !loading && (
            <article className="overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-gray-900">
              {event.image && (
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-72 w-full object-cover md:h-96"
                />
              )}

              <div className="p-6 md:p-10">
                <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700 dark:bg-green-900/50 dark:text-green-300">
                  {event.category}
                </span>

                <h1 className="mb-6 mt-5 text-3xl font-bold text-gray-800 dark:text-white md:text-4xl">
                  {event.title}
                </h1>

                <div className="mb-8 grid gap-4 rounded-xl bg-gray-50 p-5 dark:bg-gray-800 sm:grid-cols-2">
                  <p className="text-gray-700 dark:text-gray-200">
                    <strong>Location:</strong> {event.location}
                  </p>

                  <p className="text-gray-700 dark:text-gray-200">
                    <strong>Date:</strong>{" "}
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

                <h2 className="mb-3 text-xl font-bold text-gray-800 dark:text-white">
                  About This Event
                </h2>

                <p className="leading-8 text-gray-600 dark:text-gray-300">
                  {event.description}
                </p>

                <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700">
                  {isPending ? (
                    <p className="text-gray-500 dark:text-gray-400">
                      Checking login status...
                    </p>
                  ) : isOwner ? (
                    <p className="rounded-lg bg-blue-50 p-4 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      You created this event.
                    </p>
                  ) : isPastEvent ? (
                    <p className="rounded-lg bg-gray-100 p-4 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      This event has already passed.
                    </p>
                  ) : isJoined ? (
                    <p className="rounded-lg bg-green-50 p-4 font-semibold text-green-700 dark:bg-green-950 dark:text-green-300">
                      ✓ You have already joined this event!
                    </p>
                  ) : (
                    <button
                      onClick={handleJoinEvent}
                      disabled={joining}
                      className="w-full rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                      {joining ? "Joining..." : "Join This Event"}
                    </button>
                  )}

                  {message && (
                    <p
                      role="status"
                      className="mt-4 rounded-lg bg-green-50 p-4 text-green-700 dark:bg-green-950 dark:text-green-300"
                    >
                      {message}
                    </p>
                  )}
                </div>
              </div>
            </article>
          )}
        </div>
      </main>
    </>
  );
}

export default function EventDetailsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
          <Navbar />
          <p className="py-20 text-center text-gray-500 dark:text-gray-300">
            Loading event details...
          </p>
        </main>
      }
    >
      <EventDetailsContent />
    </Suspense>
  );
}
