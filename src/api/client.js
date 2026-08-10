// Centralized API client — every component talks to the backend through here
// instead of hardcoding fetch() calls and the base URL everywhere.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function safeParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      ...options,
    });
  } catch {
    throw new Error("Cannot reach the server. Is the backend running on port 8080?");
  }

  const text = await res.text();
  const data = text ? safeParse(text) : null;

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && (data.message || data.error)) ||
      (typeof data === "string" && data) ||
      `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
}

function makeApi(resource) {
  return {
    getAll: () => request(`/${resource}`),
    getById: (id) => request(`/${resource}/${id}`),
    create: (payload) => request(`/${resource}`, { method: "POST", body: JSON.stringify(payload) }),
    update: (id, payload) => request(`/${resource}/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
    remove: (id) => request(`/${resource}/${id}`, { method: "DELETE" }),
  };
}

export const customerApi = makeApi("customers");
export const productApi = makeApi("products");
export const orderItemApi = makeApi("orderitems");

// Orders are created via POST /orders/{customerId} on this backend, so it
// needs its own create() instead of the generic one.
export const orderApi = {
  ...makeApi("orders"),
  create: (customerId, payload) =>
    request(`/orders/${customerId}`, { method: "POST", body: JSON.stringify(payload) }),
};
