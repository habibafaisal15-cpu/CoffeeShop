async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const message =
      typeof data === "object" &&
      data &&
      "error" in data &&
      typeof data.error === "string"
        ? data.error
        : response.status === 401
          ? "Session expired — please sign in again"
          : `Request failed (${response.status})`;
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

const adminFetchInit: RequestInit = {
  cache: "no-store",
  credentials: "include",
};

export async function adminGet<T>(url: string): Promise<T> {
  const response = await fetch(url, adminFetchInit);
  return readJson<T>(response);
}

export async function adminMutate<T>(
  url: string,
  method: "POST" | "PUT" | "DELETE" | "PATCH",
  body?: unknown
): Promise<T> {
  const response = await fetch(url, {
    ...adminFetchInit,
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  return readJson<T>(response);
}
