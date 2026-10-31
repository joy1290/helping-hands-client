
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
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

const galleryItems = [
  {
    image:
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800",
    title: "Community Volunteering",
  },
  {
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
    title: "Plantation Campaign",
  },
  {
    image:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800",
    title: "Helping Children",
  },
  {
    image:
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800",
    title: "Volunteer Together",
  },
  {
    image:
      "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800",
    title: "Community Support",
  },
  {
    image:
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800",
    title: "A Better Tomorrow",
  },
];

const features = [
  {
    icon: "🤝",
    title: "Volunteer",
    description:
      "Participate in activities and support your community.",
  },
  {
    icon: "🌱",
    title: "Create Events",
    description:
      "Organize meaningful events and invite others to join.",
  },
  {
    icon: "❤️",
    title: "Help Others",
    description:
      "Work together to build a stronger and kinder community.",
  },
];

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  const fetchRecentEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiFetch("/api/events/home");

      if (!data.success || !Array.isArray(data.events)) {
        throw new Error("Invalid events response");
      }

      const now = new Date();

      const upcomingEvents = (data.events as Event[])
        .filter((event) => {
          const date = new Date(event.eventDate);

          return (
            !Number.isNaN(date.getTime()) &&
            date.getTime() > now.getTime()
          );
        })
        .sort(
          (a, b) =>
            new Date(a.eventDate).getTime() -
            new Date(b.eventDate).getTime()
        )
        .slice(0, 6);

      setEvents(upcomingEvents);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setError("Events load করা সম্ভব হয়নি। আবার চেষ্টা করো।");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecentEvents();
  }, [fetchRecentEvents]);

  // Set the current year after the component mounts.
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const formatDate = (date: string) => {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-800 via-green-700 to-emerald-500 px-6 py-24 text-white">
          <div className="mx-auto max-w-7xl text-center">
            <span className="mb-5 inline-block rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm">
              Together for a Better Tomorrow
            </span>

            <h1 className="mb-6 text-4xl font-bold md:text-6xl">
              Together We Serve,
              <br />
              Together We Grow.
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-green-50">
              Join HelpingHands and make a positive difference in your
              community. Discover events, connect with volunteers and
              help create a better tomorrow.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/events"
                className="rounded-lg bg-white px-7 py-3 font-semibold text-green-700 transition hover:bg-gray-100"
              >
                Explore Events
              </Link>

              <Link
                href="/register"
                className="rounded-lg border border-white px-7 py-3 font-semibold text-white transition hover:bg-white hover:text-green-700"
              >
                Join Us
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-12 text-center">
            <p className="mb-3 font-semibold text-green-600">
              WHAT WE DO
            </p>

            <h2 className="mb-4 text-3xl font-bold text-gray-800 dark:text-white">
              Make a Difference Together
            </h2>

            <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-300">
              HelpingHands connects people who want to help with
              meaningful community development events.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl bg-white p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:bg-gray-900"
              >
                <div className="mb-4 text-5xl">
                  {feature.icon}
                </div>

                <h3 className="mb-3 text-xl font-bold text-gray-800 dark:text-white">
                  {feature.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Upcoming Events */}
        <section className="bg-green-50 px-6 py-20 dark:bg-gray-900">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <p className="mb-3 font-semibold text-green-600">
                JOIN OUR COMMUNITY
              </p>

              <h2 className="mb-4 text-3xl font-bold text-gray-800 dark:text-white">
                Recent Upcoming Events
              </h2>

              <p className="text-gray-600 dark:text-gray-300">
                Discover events and become part of something meaningful.
              </p>
            </div>

            {loading ? (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse overflow-hidden rounded-xl bg-white shadow dark:bg-gray-800"
                  >
                    <div className="h-52 bg-gray-200 dark:bg-gray-700" />

                    <div className="space-y-3 p-6">
                      <div className="h-5 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
                      <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
                      <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
                      <div className="h-10 rounded bg-gray-200 dark:bg-gray-700" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="py-10 text-center">
                <p className="mb-4 text-red-500">{error}</p>

                <button
                  type="button"
                  onClick={fetchRecentEvents}
                  className="rounded-lg bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
                >
                  Try Again
                </button>
              </div>
            ) : events.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  No upcoming events available right now.
                </p>
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <article
                    key={event._id}
                    className="overflow-hidden rounded-xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:bg-gray-800"
                  >
                    <img
                      src={event.image || "/placeholder.png"}
                      alt={event.title}
                      loading="lazy"
                      className="h-52 w-full object-cover"
                    />

                    <div className="p-6">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900 dark:text-green-200">
                        {event.category}
                      </span>

                      <h3 className="mb-2 mt-4 text-xl font-bold text-gray-800 dark:text-white">
                        {event.title}
                      </h3>

                      <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                        {event.description}
                      </p>

                      <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        📅 {formatDate(event.eventDate)}
                      </div>

                      <div className="mb-5 text-sm text-gray-500 dark:text-gray-400">
                        📍 {event.location}
                      </div>

                      <Link
                        href={`/events/${event._id}`}
                        className="inline-block rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
                      >
                        View Details
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="mt-12 text-center">
              <Link
                href="/events"
                className="inline-block rounded-lg border border-green-700 px-7 py-3 font-semibold text-green-700 transition hover:bg-green-700 hover:text-white dark:border-green-500 dark:text-green-400"
              >
                View All Events →
              </Link>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-12 text-center">
            <p className="mb-3 font-semibold text-green-600">
              OUR MEMORIES
            </p>

            <h2 className="mb-4 text-3xl font-bold text-gray-800 dark:text-white">
              Moments of Kindness
            </h2>

            <p className="text-gray-600 dark:text-gray-300">
              Small actions can create a big difference.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((item) => (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-xl"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="h-64 w-full object-cover transition duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent p-6">
                  <h3 className="text-xl font-semibold text-white">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="bg-green-800 px-6 py-20 text-center text-white">
          <div className="mx-auto max-w-3xl">
            <div className="mb-5 text-5xl">📩</div>

            <h2 className="mb-4 text-3xl font-bold">
              Stay Connected With Us
            </h2>

            <p className="mb-8 text-green-100">
              Be inspired by our activities, discover upcoming events
              and stay connected with our community.
            </p>

            <div className="mx-auto flex max-w-xl flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email address"
                aria-label="Email address"
                disabled
                className="min-w-0 flex-1 rounded-lg bg-white px-5 py-3 text-gray-800 outline-none disabled:cursor-not-allowed"
              />

              <button
                type="button"
                disabled
                className="cursor-not-allowed rounded-lg bg-gray-300 px-7 py-3 font-semibold text-gray-600"
              >
                Coming Soon
              </button>
            </div>

            <p className="mt-3 text-xs text-green-200">
              Newsletter subscription is currently a design preview.
            </p>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-green-50 px-6 py-16 text-center dark:bg-gray-900">
          <h2 className="mb-4 text-3xl font-bold text-gray-800 dark:text-white">
            Be Part of Something Good
          </h2>

          <p className="mb-7 text-gray-600 dark:text-gray-300">
            Start your journey with HelpingHands today.
          </p>

          <Link
            href="/register"
            className="inline-block rounded-lg bg-green-700 px-8 py-3 font-semibold text-white transition hover:bg-green-800"
          >
            Get Started
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-950 px-6 py-8 text-center text-gray-300">
        <h3 className="mb-2 text-xl font-bold text-white">
          HelpingHands
        </h3>

        <p>
          © {currentYear ?? 2026} HelpingHands. All rights reserved.
        </p>

        <p className="mt-2 text-sm text-gray-400">
          Together We Serve, Together We Grow.
        </p>
      </footer>
    </>
  );
}
