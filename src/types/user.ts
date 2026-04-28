export type User = {
  id: number;
  name: string;
  email: string;
  age: number;
};

export type UserPayload = {
  name: string;
  email: string;
  age: number;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message: string;
};
