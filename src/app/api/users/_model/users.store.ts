import type { User } from "@/types/user";

// Datos semilla ordenados por id.
const users: User[] = [
  { id: 1, name: "María López",   email: "maria@sena.edu.co",   age: 25 },
  { id: 2, name: "Carlos Pérez",  email: "carlos@sena.edu.co",  age: 30 },
  { id: 3, name: "Ana Gómez",     email: "ana@sena.edu.co",     age: 22 },
];

let nextId = users.length + 1;

export function getUsers(): User[] {
  return [...users].sort((a, b) => a.id - b.id);
}

export function findUser(id: number): User | undefined {
  return users.find((u) => u.id === id);
}

export function findUserIndex(id: number): number {
  return users.findIndex((u) => u.id === id);
}

export function addUser(data: Omit<User, "id">): User {
  const newUser: User = { id: nextId++, ...data };
  users.push(newUser);
  return newUser;
}

export function updateUser(index: number, data: Omit<User, "id">): User {
  users[index] = { ...users[index], ...data };
  return users[index];
}

export function deleteUser(index: number): void {
  users.splice(index, 1);
}
