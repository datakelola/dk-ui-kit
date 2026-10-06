// API client backend Go (our-crm). Envelope: {data} sukses,
// {error:{code,message}} gagal. Token di localStorage (dk_token).
import { browser } from '$app/environment';

const BASE = 'http://localhost:3001/api/v1';

function headers(auth = true): Record<string, string> {
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (auth && browser) {
    const t = localStorage.getItem('dk_token');
    if (t) h.Authorization = `Bearer ${t}`;
  }
  return h;
}

async function req<T>(path: string, init?: RequestInit, auth = true): Promise<{ data: T; meta?: any }> {
  const res = await fetch(`${BASE}${path}`, { ...init, headers: { ...headers(auth), ...(init?.headers ?? {}) } });
  if (res.status === 401 && auth && browser && location.pathname !== '/login') {
    localStorage.removeItem('dk_token');
    location.href = '/login';
  }
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.error?.message ?? `HTTP ${res.status}`);
  return body;
}

const get = <T>(p: string) => req<T>(p).then((r) => r.data);
const post = <T>(p: string, v?: object) =>
  req<T>(p, { method: 'POST', body: JSON.stringify(v ?? {}) }).then((r) => r);
const patch = <T>(p: string, v?: object) =>
  req<T>(p, { method: 'PATCH', body: JSON.stringify(v ?? {}) }).then((r) => r.data);

export const api = {
  login: (email: string, password: string, company_id?: string) =>
    req<{ access_token: string; refresh_token: string } | { requires_company_selection: boolean; companies: { company_id: string }[] }>(
      '/auth/login',
      { method: 'POST', body: JSON.stringify({ email, password, company_id }) },
      false
    ).then((r) => r.data),

  conversations: (status?: string, limit = 50) =>
    req<any[]>(`/conversations${status ? `?status=${status}&` : '?'}limit=${limit}`).then((r) => r.data),
  convMessages: (id: string) => get<any[]>(`/conversations/${id}/messages?limit=200`),
  replyConversation: (id: string, body: string) => post(`/conversations/${id}/reply`, { body }).then((r) => r.data),
  updateConversation: (id: string, v: object) => patch(`/conversations/${id}`, v),

  tickets: (status?: string) => get<any[]>(`/tickets${status ? `?status=${status}` : ''}`),
  createTicket: (v: object) => post('/tickets', v).then((r) => r.data),
  ticketDetail: (id: string) =>
    req<any>(`/tickets/${id}`).then((r) => ({ data: r.data, replies: (r.meta?.replies ?? []) as any[] })),
  replyTicket: (id: string, body: string) => post(`/tickets/${id}/replies`, { body }).then((r) => r.data),
  updateTicket: (id: string, v: object) => patch(`/tickets/${id}`, v),

  contacts: (search?: string) => get<any[]>(`/contacts${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  overview: () => get<Record<string, number>>('/reports/overview')
};

export function logout() {
  if (!browser) return;
  localStorage.removeItem('dk_token');
  localStorage.removeItem('dk_email');
  location.href = '/login';
}
