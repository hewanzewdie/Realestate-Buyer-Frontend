import { api } from "@/lib/axios";
import type { User } from "@/types/user";

interface GetUserParams {
  userId: string;
}
export const getUser = async ({ userId }: GetUserParams) => {
  const res = await api.get<User>(`/user/${userId}`, {});
  return res.data;
};

export interface CreateUserPayload {
  uid: string;
  fullname: string;
  email: string;
  phone: number;
  role: "buyer" | "seller";
}

export const createUser = async (payload: CreateUserPayload): Promise<User> => {
  const res = await api.post<User>("/add-user", payload);
  return res.data;
};
