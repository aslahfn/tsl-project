// Simple localStorage-based auth (no backend required)

export interface User {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  createdAt: string;
}

const USERS_KEY = 'tsl_users';
const SESSION_KEY = 'tsl_session';

function getUsers(): User[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function signup(name: string, email: string, password: string): { ok: boolean; error?: string } {
  const users = getUsers();
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { ok: false, error: 'Email already registered.' };
  }
  const newUser: User = {
    name,
    email: email.toLowerCase(),
    password,
    role: email.toLowerCase() === 'admin@tsl.com' ? 'admin' : 'user',
    createdAt: new Date().toISOString(),
  };
  saveUsers([...users, newUser]);
  return { ok: true };
}

export function login(email: string, password: string): { ok: boolean; user?: User; error?: string } {
  const users = getUsers();
  const user = users.find(u => u.email === email.toLowerCase() && u.password === password);
  if (!user) return { ok: false, error: 'Invalid email or password.' };
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return { ok: true, user };
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getSession(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const s = localStorage.getItem(SESSION_KEY);
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

export function isAdmin(): boolean {
  const session = getSession();
  return session?.role === 'admin';
}
