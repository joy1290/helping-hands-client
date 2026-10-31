
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

    console.log("JWT TOKEN STATUS:", {
      hasToken: Boolean(result.data?.token),
      error: result.error,
    });

    if (result.error || !result.data?.token) {
      throw new Error("JWT token পাওয়া যায়নি। আবার Login করো।");
    }

    requestHeaders.set(
      "Authorization",
      `Bearer ${result.data.token}`
    );
  }
console.log("AUTH HEADER ADDED:", requestHeaders.has("Authorization"));
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers: requestHeaders,
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "API request failed");
  }

  return data;
}
