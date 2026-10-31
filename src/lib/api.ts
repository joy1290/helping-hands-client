
import { authClient } from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface ApiOptions extends RequestInit {
  requiresAuth?: boolean;
}

export async function apiFetch(
  endpoint: string,
  options: ApiOptions = {}
) {
  const {
    requiresAuth = false,
    headers,
    ...fetchOptions
  } = options;

  const requestHeaders = new Headers(headers);

  if (
    fetchOptions.body &&
    !(fetchOptions.body instanceof FormData)
  ) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (requiresAuth) {
    const result = await authClient.token();

    if (result.error || !result.data?.token) {
      throw new Error("JWT token পাওয়া যায়নি। আবার Login করো।");
    }

    requestHeaders.set(
      "Authorization",
      `Bearer ${result.data.token}`
    );
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...fetchOptions,
      headers: requestHeaders,
      credentials: "include",
    });
  } catch {
    throw new Error(
      "Server-এর সঙ্গে সংযোগ করা যাচ্ছে না। আবার চেষ্টা করো।"
    );
  }

  const contentType = response.headers.get("content-type");

  const data = contentType?.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new Error(
      data?.message || `API request failed (${response.status})`
    );
  }

  return data;
}
