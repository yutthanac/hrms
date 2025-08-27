import api from "./api";

export const fetchUsers = async (params: {
  search?: string;
  role?: string;
  department?: string;
  page?: number;
  pageSize?: number;
}) => {
  const { data } = await api.get("/users", { params });
  return data;
};

export const fetchUserById = async (id: number | string) => {
  const { data } = await api.get(`/users/${id}`);
  return data;
};
