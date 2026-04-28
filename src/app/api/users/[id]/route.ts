import { NextRequest, NextResponse } from "next/server";
import { getById, update, remove } from "../_controller/users.controller";

type Params = { params: Promise<{ id: string }> };

function parseId(id: string): number | null {
  const n = Number(id);
  return isNaN(n) ? null : n;
}

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const n = parseId(id);
  if (n === null) return NextResponse.json({ success: false, message: "Id inválido." }, { status: 400 });
  return getById(n);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const n = parseId(id);
  if (n === null) return NextResponse.json({ success: false, message: "Id inválido." }, { status: 400 });
  return update(request, n);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const n = parseId(id);
  if (n === null) return NextResponse.json({ success: false, message: "Id inválido." }, { status: 400 });
  return remove(n);
}
