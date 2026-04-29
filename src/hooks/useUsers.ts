"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { userService } from "@/services/users.service";
import type { User, UserPayload } from "@/types/user";

type SaveResult = {
  ok: boolean;
  message: string;
};

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await userService.getAll();

      // 🔥 DOBLE SEGURIDAD
      setUsers(Array.isArray(data) ? data : []);
    } catch (caughtError) {
      setError(getApiErrorMessage(caughtError));
      setUsers([]); // fallback seguro
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      void loadUsers();
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [loadUsers]);

  const sortedUsers = useMemo(() => {
    // 🔥 protección extra
    if (!Array.isArray(users)) return [];

    return [...users].sort((a, b) => a.id - b.id);
  }, [users]);

  async function userUpdater(payload: UserPayload): Promise<SaveResult> {
    setSaving(true);
    setError(null);

    try {
      const savedUser = selectedUser
        ? await userService.update(selectedUser.id, payload)
        : await userService.create(payload);

      setUsers((currentUsers) => {
        if (!Array.isArray(currentUsers)) return [savedUser];

        const exists = currentUsers.some(
          (user) => user.id === savedUser.id
        );

        if (!exists) {
          return [...currentUsers, savedUser];
        }

        return currentUsers.map((user) =>
          user.id === savedUser.id ? savedUser : user
        );
      });

      setSelectedUser(null);
      setNotice(
        selectedUser
          ? "Usuario actualizado."
          : "Usuario creado correctamente."
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

  async function deleteUser(id: number) {
    const shouldDelete = window.confirm(
      "¿Estás seguro de que quieres eliminar este usuario?"
    );

    if (!shouldDelete) return;

    setError(null);
    setNotice(null);

    try {
      await userService.delete(id);

      setUsers((currentUsers) =>
        Array.isArray(currentUsers)
          ? currentUsers.filter((user) => user.id !== id)
          : []
      );

      if (selectedUser?.id === id) {
        setSelectedUser(null);
      }

      setNotice("Usuario eliminado.");
    } catch (caughtError) {
      setError(getApiErrorMessage(caughtError));
    }
  }

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