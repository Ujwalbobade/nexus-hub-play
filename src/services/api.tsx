
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
  const token = localStorage.getItem("token") || localStorage.getItem("token-dummy");
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


// auth-api.ts
export const login = async (username: string, password: string) => {
  const res = await fetch(`${API_BASE_URL}/auth/client/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) throw new Error("Invalid credentials");
  const data = await res.json(); // { token, role, user }
  
  // Store token immediately for subsequent requests
  if (data.token) {
    localStorage.setItem("token", data.token);
  }
  
  return data;
};

export const register = async (username: string, email: string, password: string) => {
  const res = await fetch(`${API_BASE_URL}/auth/client/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Registration failed");
  }
  return res.json();
};

export const forgotPassword = async (email: string) => {
  const res = await fetch(`${API_BASE_URL}/auth/client/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) throw new Error("Request failed");
  return res.json();
};

export const validateResetToken = async (token: string) => {
  const res = await fetch(`${API_BASE_URL}/auth/client/validate-reset-token?token=${encodeURIComponent(token)}`);
  if (!res.ok) throw new Error("Failed to validate token");
  return res.json();
};

export const resetPassword = async (token: string, newPassword: string) => {
  const res = await fetch(`${API_BASE_URL}/auth/client/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Password reset failed");
  }
  return res.json();
};

export const forgotUsername = async (email: string) => {
  const res = await fetch(`${API_BASE_URL}/auth/client/forgot-username`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) throw new Error("Request failed");
  return res.json();
};

//----------------- TIME REQUESTS API -----------------
// Create a time request using generic apiFetch for authentication and error handling
export async function createTimeRequest(
  userId: number,
  sessionId: number | undefined,
  additionalMinutes: number,
  amount: number,
  stationId?: number | string
) {
  return await apiFetch("/auth/client/AddTimeRequest", {
    method: "POST",
    body: JSON.stringify({ userId, sessionId, additionalMinutes, amount, stationId }),
  });
}

export async function fetchTimeRequests(sessionId: number) {
  return await apiFetch(`/auth/client/Session/TimeRequests/${sessionId}`);
}

export async function fetchSession(sessionId: number) {
  if (!sessionId || isNaN(sessionId)) {
    throw new Error(`Invalid sessionId: ${sessionId}`);
  }
  return await apiFetch(`/auth/client/Session/${sessionId}`);
}
export async function getStationFromMac(mac: string) {
  console.log("Fetching station for MAC:", mac);

  try {
    // Use generic apiFetch so auth headers are automatically added
    const data = await apiFetch(`/auth/client/Station/${encodeURIComponent(mac)}`);

    if (!data || !data.id) {
      throw new Error("Invalid response: station not found");
    }

    return data; // API already returns the station object

  } catch (err) {
    console.error("Error fetching station by MAC:", err);
    throw err;
  }
}

// ----------------- LOGOUT API -----------------
export async function logoutUser(userId: number, stationId: number) {
  return await apiFetch("/auth/client/logout", {
    method: "POST",
    body: JSON.stringify({ userId, stationId }),
  });
}