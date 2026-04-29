import { USERS_API_URL } from "@/lib/api";
import type { ApiResponse, User, UserPayload } from "@/types/user";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { "content-type": "application/json", ...init?.headers },
  });

  const text = await response.text();
  let body: unknown = null;

  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    throw new Error("La API devolvió un JSON inválido");
  }

  if (!response.ok) {
    const err = body as { message?: string } | null;
    throw new Error(
      err?.message ?? `La api respondió con estado ${response.status}.`,
    );
  }

  // Caso: { success, data }
  if (body && typeof body === "object" && "data" in body) {
    const apiBody = body as ApiResponse<T>;

    if (!apiBody.success) {
      throw new Error(apiBody.message ?? "La operación no fue exitosa");
    }

    return apiBody.data;
  }

  // ⚠️ fallback controlado
  return body as T;
}

export const userService = {
  async getAll(): Promise<User[]> {
    const data = await request<User[]>(USERS_API_URL);

    // 🔥 VALIDACIÓN CLAVE
    if (!Array.isArray(data)) {
      console.error("❌ getAll NO devolvió array:", data);
      return [];
    }

    return data;
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
