const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace(/\/$/, "");

export async function apiRequest(path, options = {}) {
  const token = window.localStorage.getItem("artetours_token");
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.mensaje || "No se pudo completar la solicitud");
    error.status = response.status;
    throw error;
  }
  return payload;
}

export const apiConfig = { baseUrl: API_URL };
