export const USERS_API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api/users";

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Ocurrió un error desconocido";
}
