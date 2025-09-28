export const login = async (username: string, password: string) => {
  const data = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  if (data.token) {
    localStorage.setItem("token", data.token);
    console.log("Login successful, token saved:", data.token);
  } else {
    console.warn("Login response did not include a token:", data);
  }

  return data;
};

// ----------------- GENERIC FETCH -----------------
export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  // Always use getAuthHeaders so we never forget the token
  const authHeaders = await getAuthHeaders();

  const headers: HeadersInit = {
    ...authHeaders,          // includes Content-Type + Authorization if token exists
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401 || response.status === 403) {
    throw new Error("You are not logged in or your session expired.");
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Request failed");
  }

  return response.json();
};

// ----------------- api.ts -----------------
const getApiBaseUrl = (): string => {
  const params = new URLSearchParams(window.location.search);
  const override = params.get("api") || localStorage.getItem("apiBase");

  if (override) return `${override.replace(/\/+$/, "")}/api`;

  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  return `${protocol}//${hostname}:8087/api`;
};
const API_BASE_URL = getApiBaseUrl();

const getAuthHeaders = async () => {
  const token = await getToken();
  console.log("Using token:", token);
  localStorage.setItem("token", token || "");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// ----------------- TOKEN HANDLING -----------------
const getToken = async (): Promise<string | null> => {
  let token = localStorage.getItem("token") || localStorage.getItem("token-dummy");
  console.log("Existing token:", token);
  const isValid = (t: string) => {
    try {
      const payload = JSON.parse(atob(t.split(".")[1]));
      return payload.exp && Date.now() < payload.exp * 1000 - 30_000; // 30s buffer
    } catch {
      return false;
    }
  };

  if (token && isValid(token)) return token;

  // Fetch new dummy token if needed
  try {
    const res = await fetch(`${API_BASE_URL}/auth/dummy-admin-token`);
    if (!res.ok) throw new Error("Failed to fetch dummy token");
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token-dummy", data.token);
      return data.token;
    }
  } catch (err) {
    console.error("Token fetch error:", err);
  }

  return token; // fallback to old token if dummy fails
};