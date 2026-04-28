import { NextRequest, NextResponse } from "next/server";
import type { UserPayload } from "@/types/user";
import {
  getUsers,
  findUser,
  findUserIndex,
  addUser,
  updateUser,
  deleteUser,
} from "../_model/users.store";

export function getAll() {
  return NextResponse.json({ success: true, data: getUsers(), message: "OK" });
}

export async function create(request: NextRequest) {
  const body = (await request.json()) as UserPayload;

  if (!body.name?.trim() || !body.email?.trim() || !body.age) {
    return NextResponse.json(
      { success: false, data: null, message: "Todos los campos son requeridos." },
      { status: 400 },
    );
  }

  const newUser = addUser({ name: body.name.trim(), email: body.email.trim(), age: body.age });

  return NextResponse.json(
    { success: true, data: newUser, message: "Usuario creado." },
    { status: 201 },
  );
}

export function getById(id: number) {
  const user = findUser(id);

  if (!user) {
    return NextResponse.json(
      { success: false, data: null, message: "Usuario no encontrado." },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true, data: user, message: "OK" });
}

export async function update(request: NextRequest, id: number) {
  const body = (await request.json()) as UserPayload;
  const index = findUserIndex(id);

  if (index === -1) {
    return NextResponse.json(
      { success: false, data: null, message: "Usuario no encontrado." },
      { status: 404 },
    );
  }

  const updated = updateUser(index, body);

  return NextResponse.json({ success: true, data: updated, message: "Usuario actualizado." });
}

export function remove(id: number) {
  const index = findUserIndex(id);

  if (index === -1) {
    return NextResponse.json(
      { success: false, data: null, message: "Usuario no encontrado." },
      { status: 404 },
    );
  }

  deleteUser(index);

  return NextResponse.json({ success: true, data: null, message: "Usuario eliminado." });
}
