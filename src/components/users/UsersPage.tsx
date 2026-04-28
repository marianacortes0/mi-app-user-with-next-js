"use client";

import { Database } from "lucide-react";
import { USERS_API_URL } from "@/lib/api";
import { useUsers } from "@/hooks/useUsers";
import { StatusMessage } from "@/components/users/StatusMessage";
import { UserForm } from "@/components/users/UserForm";
import { UsersTable } from "@/components/users/UsersTable";

// Componente principal de la pantalla.
// Une el hook de datos con los componentes visuales.
export function UsersPage() {
  const {
    users,
    selectedUser,
    isLoading,
    isSaving,
    error,
    notice,
    loadUsers,
    saveUser,
    deleteUser,
    editUser,
    cancelEdit,
  } = useUsers();

  return (
    <main className="in-h-screen bg-slate-100 px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6">
        {/* Encabezado general de la aplicación. */}
        <header className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-md bg-emerald-50 px-2.5 py-1 text-sm font-medium text-emerald-700">
              <Database size={16} />
              API Usuarios
            </div>
            <h1 className="text-2xl font-bold tracking-normal text-slate-950 sm:text-3xl">
              Administración de usuarios
            </h1>
          </div>
          <p className="mt-2 max-w-3xl text-leading-6 text-slate-600">
            CRUD conectado a{" "}
            <span className="font-mono">{USERS_API_URL}</span>
          </p>
        </header>

        {/* Mensajes de estado */}
        {error && <StatusMessage type="error" message={error} />}
        {notice && <StatusMessage type="success" message={notice} />}

        {/* En escritorio: formulario a la izquierda y tabla a la derecha. */}
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <UserForm
            key={selectedUser?.id ?? "new-user"}
            selectedUser={selectedUser}
            isSaving={isSaving}
            onSave={saveUser}
            onCancel={cancelEdit}
          />

          <UsersTable
            users={users}
            isLoading={isLoading}
            onRefresh={loadUsers}
            onEdit={editUser}
            onDelete={deleteUser}
          />
        </div>
      </div>
    </main>
  );
}
