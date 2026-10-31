
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { apiFetch } from "@/lib/api";

const categories = [
  "Education",
  "Environment",
  "Health",
  "Animal Welfare",
  "Community",
  "Technology",
  "Sports",
  "Other",
];

export default function CreateEventPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    eventDate: "",
    image: "",
    category: "",
  });

  const [today, setToday] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const currentDate = new Date();
    const localDate = [
      currentDate.getFullYear(),
      String(currentDate.getMonth() + 1).padStart(2, "0"),
      String(currentDate.getDate()).padStart(2, "0"),
    ].join("-");

    setToday(localDate);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
  };

  const validateForm = () => {
    const title = formData.title.trim();
    const description = formData.description.trim();
    const location = formData.location.trim();
    const image = formData.image.trim();

    if (title.length < 3) {
      return "Event title must contain at least 3 characters.";
    }

    if (title.length > 100) {
      return "Event title cannot exceed 100 characters.";
    }

    if (description.length < 10) {
      return "Description must contain at least 10 characters.";
    }

    if (description.length > 1000) {
      return "Description cannot exceed 1000 characters.";
    }

    if (location.length < 3) {
      return "Location must contain at least 3 characters.";
    }

    if (location.length > 150) {
      return "Location cannot exceed 150 characters.";
    }

    if (!categories.includes(formData.category)) {
      return "Please select a valid event category.";
    }

    if (!formData.eventDate) {
      return "Please select an event date.";
    }

    if (today && formData.eventDate <= today) {
      return "Please select a future date for your event.";
    }

    try {
      const imageURL = new URL(image);

      if (!["http:", "https:"].includes(imageURL.protocol)) {
        return "Please enter a valid image URL.";
      }
    } catch {
      return "Please enter a valid image URL.";
    }

    return "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    setMessage("");
    setIsSuccess(false);

    const validationError = validateForm();

    if (validationError) {
      setMessage(validationError);
      return;
    }

    setLoading(true);

    try {
      const eventData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        eventDate: formData.eventDate,
        image: formData.image.trim(),
        category: formData.category,
      };

      await apiFetch("/api/events", {
        method: "POST",
        requiresAuth: true,
        body: JSON.stringify(eventData),
      });

      setIsSuccess(true);
      setMessage("Event created successfully!");

      setTimeout(() => {
        router.push("/events");
        router.refresh();
      }, 1200);
    } catch (error) {
      setIsSuccess(false);
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-green-500 dark:focus:ring-green-900";

  const labelClass =
    "mb-2 block font-medium text-gray-700 dark:text-gray-200";

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 px-4 py-12 transition-colors dark:bg-gray-950">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Create an Event
            </h1>

            <p className="mt-3 text-gray-600 dark:text-gray-300">
              Bring people together and make a positive difference.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl bg-white p-6 shadow-md transition-colors dark:bg-gray-900 sm:p-10"
          >
            <div>
              <label htmlFor="title" className={labelClass}>
                Event Title
              </label>
              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter event title"
                maxLength={100}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="description" className={labelClass}>
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your event..."
                rows={5}
                maxLength={1000}
                required
                className={inputClass}
              />
              <p className="mt-1 text-right text-xs text-gray-500">
                {formData.description.length}/1000
              </p>
            </div>

            <div>
              <label htmlFor="location" className={labelClass}>
                Location
              </label>
              <input
                id="location"
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter event location"
                maxLength={150}
                required
                className={inputClass}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="eventDate" className={labelClass}>
                  Event Date
                </label>
                <input
                  id="eventDate"
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  min={today || undefined}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="category" className={labelClass}>
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="image" className={labelClass}>
                Event Image URL
              </label>
              <input
                id="image"
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                required
                className={inputClass}
              />
            </div>

            {message && (
              <p
                role="status"
                aria-live="polite"
                className={`rounded-lg p-3 text-sm ${
                  isSuccess
                    ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                    : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                }`}
              >
                {message}
              </p>
            )}

            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating Event..." : "Create Event"}
              </button>

              <Link
                href="/events"
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
