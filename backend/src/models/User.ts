export interface User {
  id: number;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  email: string;
  role_id: number;
  department_id?: number;
  created_at?: string;
}
