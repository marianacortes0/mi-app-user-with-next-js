"use client";

import { FormEvent, useState } from "react";
import { Save, X } from "lucide-react";
import type { User, UserPayload } from "@/types/user";

type UserFormProps = {
  selectedUser: User | null;
  isSaving: boolean;
  onSave: (payload: UserPayload) => Promise<{ ok: boolean; message: string }>;
  onCancel: () => void;
};

const initialForm = {
  name: "",
  email: "",
  age: "",
};

// Formulario reutilizable para crear y editar.
// La diferencia entre ambas acciones depende de si selectedUser tiene valor.
export function UserForm({
  selectedUser,
  isSaving,
  onSave,
  onCancel,
}: UserFormProps) {
  // Si estamos editando, el formulario inicia con los datos del usuario seleccionado.
  const [form, setForm] = useState(() =>
    selectedUser
      ? {
          name: selectedUser.name,
          email: selectedUser.email,
          age: String(selectedUser.age),
        }
      : initialForm,
  );
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Evita que navegador recargue la página al enviar el formulario.
    event.preventDefault();

    const age = Number(form.age);

    // Validaciones simples en cliente antes de llamar a la API.
    if (!form.name.trim() || !form.email.trim()) {
      setFormError("Completa todos los campos.");
      return;
    }

    if (!Number.isInteger(age) || age < 0) {
      setFormError("La edad debe ser un número entero mayor que cero.");
      return;
    }

    // onSave viene del hook useUsers y decide si crea o actualiza.
    const result = await onSave({
      name: form.name.trim(),
      email: form.email.trim(),
      age,
    });

    if (result.ok) {
      setForm(initialForm);
      setFormError(null);
      return;
    }

    setFormError(result.message);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">
            {selectedUser ? "Editar usuario" : "Crear usuario"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Datos básicos que consume la API Usuarios.
          </p>
        </div>

        {selectedUser ? (
          // Solo se muestra al editar, para volver al modo de creación.
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-50"
            aria-label="Cancelar edición"
            title="Cancelar edición"
          >
            <X size={18} />
          </button>
        ) : null}
      </div>

      <div className="grid gap-4">
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Nombre
          <input
            value={form.name}
            onChange={(event) =>
              // Se conserva el resto del formulario y se cambia solo el campo name.
              setForm((current) => ({ ...current, name: event.target.value }))
            }
            className="h-11 rounded-md border border-slate-200 bg-white px-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4"
            placeholder="María Lopez"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) =>
              // Cada input es controlado: su valor vive en el estado de React.
              setForm((current) => ({ ...current, email: event.target.value }))
            }
            className="h-11 rounded-md border border-slate-200 bg-white px-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4"
            placeholder="maria@sena.edu.co"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Edad
          <input
            type="number"
            min="1"
            value={form.age}
            onChange={(event) =>
              // Guardamos age como texto mientras se escribe y lo convertiremos al enviar.
              setForm((current) => ({ ...current, age: event.target.value }))
            }
            className="h-11 rounded-md border border-slate-200 bg-white px-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4"
            placeholder="32"
          />
        </label>
      </div>

      {formError ? (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {formError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSaving}
        className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
      >
        <Save size={18} />
        {isSaving ? "Guardando..." : selectedUser ? "Actualizar" : "Crear"}
      </button>
    </form>
  );
}
