"use client";

import { Edit3, RefreshCw, Trash2, Users } from "lucide-react";
import type { User } from "@/types/user";

type UsersTableProps = {
  users: User[];
  isLoading: boolean;
  onRefresh: () => void;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
};

export function UsersTable({
  users,
  isLoading,
  onRefresh,
  onEdit,
  onDelete,
}: UsersTableProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      {/* Cabecera de la tabla y botón para recargar desde la API. */}
      <div className="mb-4 flex flex-col gap-4 border-b border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">
            Usuarios registrados
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {users.length === 1 ? "1" : `${users.length}`} en la API.
          </p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 px-4 text-sm font-semibold transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw size={17} className={isLoading ? "animate-spin" : ""} />
          Actualizar
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-in-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3">ID</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* Estado de carga mientras se espera la respuesta del servidor. */}
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-slate-500">
                  Cargando usuarios...
                </td>
              </tr>
            ) : null}

            {/* Estado vacío cuando la API responde una lista sin registros. */}
            {!isLoading && users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12">
                  <div className="flex flex-col items-center justify-center gap-3 text-center text-slate-500">
                    <Users size={32} />
                    <p>No hay usuarios registrados.</p>
                  </div>
                </td>
              </tr>
            ) : null}

            {/* Renderizado de una fila por cada usuario recibido. */}
            {!isLoading
              ? users.map((user) => (
                  <tr
                    key={user.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-700">
                      #{user.id}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      {user.name}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      {user.email}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      {user.age}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(user)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                          aria-label={`Editar ${user.name}`}
                          title="Editar"
                        >
                          <Edit3 size={17} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(user.id)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-red-200 text-red-600 transition hover:bg-red-50"
                          aria-label={`Eliminar ${user.name}`}
                          title="Eliminar"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
