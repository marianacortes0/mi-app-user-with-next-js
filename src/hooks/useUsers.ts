"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { userService } from "@/services/users.service";
import type { User, UserPayload } from "@/types/user";

type SaveResult = {
  ok: boolean;
  message: string;
};

// Hook personalizado que concentra toda la lógica del CRUD.
// La pantalla solo consume datos y funciones, sin preocuparse por fetch ni estados internos.
export function useUsers() {
  // Estados principales de datos, selección, carga, guardado y mensajes visuales.
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // useCallback mantiene estable la referencia de loadUsers para usarla en effectos y props.
  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (caughtError) {
      setError(getApiErrorMessage(caughtError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // useEffect previene re-renders innecesarios de la lista sin cambios.
  // El setTimeout evita una regla estricta del linter sobre setState directo en efectos.
  useEffect(() => {
    const timerId = window.setTimeout(() => {
      void loadUsers();
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [loadUsers]);

  // useMemo evita ordenar de nuevo la lista en cada render si usuarios no cambió.
  const sortedUsers = useMemo(
    () => [...users].sort((a, b) => a.id - b.id),
    [users],
  );

  // Si hay usuario seleccionado se actualiza; si no, se crea uno nuevo.
  async function userUpdater(payload: UserPayload): Promise<SaveResult> {
    setSaving(true);
    setError(null);

    try {
      const savedUser = selectedUser
        ? await userService.update(selectedUser.id, payload)
        : await userService.create(payload);

      setUsers((currentUsers) => {
        // Actualizamos el estado local sin volver a pedir toda la lista a la API.
        const exists = currentUsers.some((user) => user.id === savedUser.id);

        if (!exists) {
          return [...currentUsers, savedUser];
        }

        return currentUsers.map((user) =>
          user.id === savedUser.id ? savedUser : user,
        );
      });

      setSelectedUser(null);
      setNotice(
        selectedUser ? "Usuario actualizado." : "Usuario creado correctamente.",
      );

      return { ok: true, message: "Guardado correctamente." };
    } catch (caughtError) {
      const message = getApiErrorMessage(caughtError);
      setError(message);
      return { ok: false, message };
    } finally {
      setSaving(false);
    }
  }

  // Elimina un usuario después de confirmar la acción con el usuario.
  async function deleteUser(id: number) {
    const shouldDelete = window.confirm(
      "¿Estás seguro de que quieres eliminar este usuario?",
    );

    if (!shouldDelete) {
      return;
    }

    setError(null);
    setNotice(null);

    try {
      await userService.delete(id);
      setUsers((currentUsers) => currentUsers.filter((user) => user.id !== id));

      if (selectedUser?.id === id) {
        setSelectedUser(null);
      }

      setNotice("Usuario eliminado.");
    } catch (caughtError) {
      setError(getApiErrorMessage(caughtError));
    }
  }

  // Todo lo retornado aquí queda disponible para la página y sus componentes hijos.
  return {
    users: sortedUsers,
    selectedUser,
    isLoading,
    isSaving,
    error,
    notice,
    loadUsers,
    saveUser: userUpdater,
    deleteUser,
    editUser: setSelectedUser,
    cancelEdit: () => setNotice(null),
  };
}

function getApiErrorMessage(caughtError: unknown): string {
  if (caughtError instanceof Error) {
    return caughtError.message;
  }
  return "Error desconocido";
}
