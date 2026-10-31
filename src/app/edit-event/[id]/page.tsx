
"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useSession } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

interface EventForm {
  title: string;
  description: string;
  location: string;
  eventDate: string;
  image: string;
  category: string;
}

const initialForm: EventForm = {
  title: "",
  description: "",
  location: "",
  eventDate: "",
  image: "",
  category: "",
};

function EditEventContent() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [formData, setFormData] = useState<EventForm>(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await apiFetch(`/api/events/${id}`);

        const event = data.event;

        setFormData({
          title: event.title,
          description: event.description,
          location: event.location,
          eventDate: new Date(event.eventDate)
            .toISOString()
            .split("T")[0],
          image: event.image,
          category: event.category,
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load event"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, session, isPending]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSaving(true);

    try {
      await apiFetch(`/api/events/${id}`, {
        method: "PUT",
        requiresAuth: true,
        body: JSON.stringify(formData),
      });

      router.push("/manage-events");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update event"
      );
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-green-500 dark:focus:ring-green-900";

  const labelClass =
    "mb-2 block font-medium text-gray-700 dark:text-gray-200";

  if (isPending || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <p className="text-gray-600 dark:text-gray-300">
          Loading event...
        </p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 dark:bg-gray-950">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Please Login First
        </h2>

        <Link
          href="/login"
          className="rounded-lg bg-green-600 px-6 py-3 text-white transition hover:bg-green-700"
        >
          Login
        </Link>
      </main>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 px-4 py-12 transition-colors dark:bg-gray-950">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Edit Event
            </h1>

            <p className="mt-3 text-gray-600 dark:text-gray-300">
              Update your event information.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl bg-white p-6 shadow-md transition-colors dark:bg-gray-900 sm:p-10"
          >
            <div>
              <label className={labelClass}>Event Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                minLength={3}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                minLength={10}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                minLength={3}
                required
                className={inputClass}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Event Date</label>
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                  <option value="">Select category</option>
                  <option value="Education">Education</option>
                  <option value="Environment">Environment</option>
                  <option value="Health">Health</option>
                  <option value="Animal Welfare">Animal Welfare</option>
                  <option value="Community">Community</option>
                  <option value="Technology">Technology</option>
                  <option value="Sports">Sports</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Image URL</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300"
              >
                {error}
              </p>
            )}

            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Updating..." : "Update Event"}
              </button>

              <Link
                href="/manage-events"
                className="rounded-lg border border-gray-300 px-6 py-3 text-center font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}

export default function EditEventPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
          <p className="text-gray-600 dark:text-gray-300">
            Loading edit page...
          </p>
        </main>
      }
    >
      <EditEventContent />
    </Suspense>
  );
}
