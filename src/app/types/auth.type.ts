export interface AuthResponse {
  ok: boolean;
  token: string;
  user: User;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'student' | 'admin';
}
