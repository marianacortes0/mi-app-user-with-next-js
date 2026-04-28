import { USERS_API_URL } from "@/lib/api";
import type { ApiResponse, User, UserPayload } from "@/types/user";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { "content-type": "application/json", ...init?.headers },
  });

  const text = await response.text();
  const body = text ? (JSON.parse(text) as unknown) : null;

  if (!response.ok) {
    const err = body as { message?: string } | null;
    throw new Error(err?.message ?? `La api respondió con estado ${response.status}.`);
  }

  if (body && typeof body === "object" && "data" in body) {
    const apiBody = body as ApiResponse<T>;
    if (!apiBody.success) {
      throw new Error(apiBody.message ?? "La operación no fue exitosa");
    }
    return apiBody.data;
  }

  return body as T;
}

export const userService = {
  getAll() {
    return request<User[]>(USERS_API_URL);
  },
  getById(id: number) {
    return request<User>(`${USERS_API_URL}/${id}`);
  },
  create(user: UserPayload) {
    return request<User>(USERS_API_URL, {
      method: "POST",
      body: JSON.stringify(user),
    });
  },
  update(id: number, user: UserPayload) {
    return request<User>(`${USERS_API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(user),
    });
  },
  delete(id: number) {
    return request<void>(`${USERS_API_URL}/${id}`, {
      method: "DELETE",
    });
  },
};
