import { USERS_API_URL } from "@/lib/api";
import type { ApiResponse, User, UserPayload } from "@/types/user";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const text = await response.text();

  let body: any = null;

  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    throw new Error("La API devolvió un JSON inválido");
  }

  // ❌ Manejo de error HTTP
  if (!response.ok) {
    throw new Error(
      body?.message ?? `La API respondió con estado ${response.status}`
    );
  }

  // ✅ Caso estándar: { success, data, message }
  if (body && typeof body === "object" && "data" in body) {
    const apiBody = body as ApiResponse<T>;

    if (!apiBody.success) {
      throw new Error(apiBody.message ?? "La operación no fue exitosa");
    }

    return apiBody.data;
  }

  // ⚠️ Fallback (por si algún endpoint no sigue el estándar)
  return body as T;
}

export const userService = {
  async getAll(): Promise<User[]> {
    // ✅ Aquí ya viene el array limpio desde request
    return request<User[]>(USERS_API_URL);
  },

  getById(id: number): Promise<User> {
    return request<User>(`${USERS_API_URL}/${id}`);
  },

  create(user: UserPayload): Promise<User> {
    return request<User>(USERS_API_URL, {
      method: "POST",
      body: JSON.stringify(user),
    });
  },

  update(id: number, user: UserPayload): Promise<User> {
    return request<User>(`${USERS_API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(user),
    });
  },

  delete(id: number): Promise<void> {
    return request<void>(`${USERS_API_URL}/${id}`, {
      method: "DELETE",
    });
  },
};