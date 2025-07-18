import { QueryClient } from "@tanstack/react-query";
import { debounce } from "./utils";
import { getAuthHeaders } from "./authUtils";

interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
  responseType?: 'json' | 'blob' | 'arraybuffer' | 'text';
  skipAuthHeaders?: boolean; // Add option to skip auth headers for specific requests
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

/**
 * Make an API request with optimized error handling and performance tracking
 */
export async function apiRequest(
  method: string,
  url: string,
  data?: any,
  options: RequestOptions = {}
) {
  // If the URL doesn't start with http or /, prefix it with /api
  const baseUrl = url.startsWith("http") || url.startsWith("/")
    ? url
    : `/api/${url}`;

  // Prepare fetch options
  const fetchOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(options.skipAuthHeaders ? {} : getAuthHeaders()),
      ...(options.headers || {}),
    },
    signal: options.signal,
  };

  // Add request body for non-GET requests
  if (method !== "GET" && data) {
    fetchOptions.body = JSON.stringify(data);
  }

  // Add query parameters for GET requests with params
  let fullUrl = baseUrl;
  if (method === "GET" && options.params) {
    const queryParams = new URLSearchParams();
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, String(value));
      }
    });
    const queryString = queryParams.toString();
    if (queryString) {
      fullUrl += `${baseUrl.includes("?") ? "&" : "?"}${queryString}`;
    }
  }

  // Performance tracking
  const startTime = performance.now();

  try {
    // Make the request
    const response = await fetch(fullUrl, fetchOptions);

    // Check if the response is ok
    if (!response.ok) {
      // Try to parse error response
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }

      // Create custom error
      const error = new Error(
        errorData.message || "An unexpected error occurred"
      );
      (error as any).status = response.status;
      (error as any).data = errorData;
      throw error;
    }

    // Handle different response types
    if (options.responseType === 'blob') {
      return response;
    } else if (options.responseType === 'arraybuffer') {
      return response;
    } else if (options.responseType === 'text') {
      const text = await response.text();
      return text;
    } else {
      // Default to JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return data;
      } else {
        return response;
      }
    }
  } catch (error) {
    // Log network errors in development
    if (process.env.NODE_ENV === "development") {
      console.error(`API Error (${method} ${url}):`, error);
    }
    throw error;
  } finally {
    // Log timing in development
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Log slow requests (taking more than 1 second)
    if (duration > 1000 && process.env.NODE_ENV === "development") {
      console.warn(`Slow API request (${duration.toFixed(0)}ms): ${method} ${url}`);
    }
  }
}

// Debounced invalidation to prevent too many re-renders
export const invalidateQueries = debounce(
  (queryKey: string | string[]) => {
    queryClient.invalidateQueries({ queryKey: Array.isArray(queryKey) ? queryKey : [queryKey] });
  },
  100
);