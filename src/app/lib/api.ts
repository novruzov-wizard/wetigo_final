/**
 * Wetigo API client — backend-ready.
 *
 * Point this at your backend by setting VITE_API_URL (e.g. https://api.wetigo.com).
 * Defaults to "/api" so you can proxy in dev. Every function returns parsed JSON
 * and automatically attaches the bearer token saved by `auth.setToken`.
 *
 * The full list of endpoints the backend should implement is in API_ENDPOINTS
 * below — share it with whoever builds the server.
 */

const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? '/api';

let TOKEN: string | null = (() => {
  try { return localStorage.getItem('wetigo:token'); } catch { return null; }
})();
let REFRESH: string | null = (() => {
  try { return localStorage.getItem('wetigo:refresh'); } catch { return null; }
})();

// Single-flight refresh so concurrent 401s don't all hit /auth/refresh.
let refreshing: Promise<boolean> | null = null;
async function doRefresh(): Promise<boolean> {
  if (!REFRESH) return false;
  if (!refreshing) {
    refreshing = (async () => {
      try {
        const res = await fetch(`${BASE}/auth/refresh`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: REFRESH }),
        });
        if (!res.ok) return false;
        const data = await res.json();
        if (data?.token) {
          TOKEN = data.token;
          REFRESH = data.refreshToken ?? REFRESH;
          try { localStorage.setItem('wetigo:token', TOKEN!); if (REFRESH) localStorage.setItem('wetigo:refresh', REFRESH); } catch { /* ignore */ }
          return true;
        }
        return false;
      } catch { return false; }
      finally { refreshing = null; }
    })();
  }
  return refreshing;
}

async function request<T>(path: string, options: RequestInit = {}, _retry = false): Promise<T> {
  // For multipart/FormData uploads we MUST NOT set Content-Type — the browser
  // sets it with the correct multipart boundary. Setting application/json here
  // corrupts the body and the server can't read the file.
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
      ...(options.headers ?? {}),
    },
  });
  // Access token expired → transparently refresh once and retry.
  if (res.status === 401 && !_retry && REFRESH && !path.startsWith('/auth/refresh')) {
    if (await doRefresh()) return request<T>(path, options, true);
  }
  if (!res.ok) {
    const msg = await res.json().catch(() => ({}));
    throw new Error((msg as any).message || `Request failed: ${res.status}`);
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

const get = <T>(p: string) => request<T>(p);
const post = <T>(p: string, body?: unknown) => request<T>(p, { method: 'POST', body: JSON.stringify(body ?? {}) });
const patch = <T>(p: string, body?: unknown) => request<T>(p, { method: 'PATCH', body: JSON.stringify(body ?? {}) });
const del = <T>(p: string) => request<T>(p, { method: 'DELETE' });

// ---------------- Auth ----------------
type AuthResult = { token: string; refreshToken?: string; user: unknown };
export const auth = {
  setToken(t: string | null) { TOKEN = t; try { t ? localStorage.setItem('wetigo:token', t) : localStorage.removeItem('wetigo:token'); } catch { /* ignore */ } },
  getToken() { return TOKEN; },
  setRefresh(t: string | null) { REFRESH = t; try { t ? localStorage.setItem('wetigo:refresh', t) : localStorage.removeItem('wetigo:refresh'); } catch { /* ignore */ } },
  getRefresh() { return REFRESH; },
  /** Store both tokens after a successful auth, or clear them on sign-out. */
  setSession(res: { token?: string | null; refreshToken?: string | null } | null) {
    this.setToken(res?.token ?? null);
    this.setRefresh(res?.refreshToken ?? null);
  },
  register: (data: { name: string; email: string; password: string; birthDate?: string }) => post<{ pendingVerification: boolean; devCode?: string }>('/auth/register', data),
  login: (data: { email: string; password: string }) => post<AuthResult>('/auth/login', data),
  verifyOtp: (data: { email: string; code: string }) => post<AuthResult>('/auth/verify-otp', data),
  resendOtp: (data: { email: string }) => post<void>('/auth/resend-otp', data),
  oauth: (provider: 'google' | 'facebook') => post<{ url: string }>(`/auth/oauth/${provider}`),
  forgotPassword: (data: { email: string }) => post<{ devCode?: string }>('/auth/forgot-password', data),
  resetPassword: (data: { email: string; code: string; password: string }) => post<Partial<AuthResult>>('/auth/reset-password', data),
  appealRequest: (data: { email: string }) => post<{ pendingVerification: boolean; devCode?: string }>('/auth/appeal/request', data),
  appealVerify: (data: { email: string; code: string }) => post<AuthResult>('/auth/appeal/verify', data),
  me: () => get<unknown>('/auth/me'),
  logout: () => post<void>('/auth/logout', { refreshToken: REFRESH }),
};

// ---------------- Places ----------------
export const places = {
  list: (params?: { q?: string; category?: string; country?: string; minRating?: number; openNow?: boolean; lat?: number; lng?: number }) =>
    get<unknown[]>(`/places${params ? `?${new URLSearchParams(Object.entries(params).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)]))}` : ''}`),
  get: (id: number) => get<unknown>(`/places/${id}`),
  create: (data: unknown) => post<{ id: number }>('/places', data),
  update: (id: number, data: Record<string, unknown>) => patch<unknown>(`/places/${id}`, data),
  mine: () => get<any[]>('/places/mine'),
  claim: (id: number) => post<{ ok: boolean; status: string }>(`/places/${id}/claim`),
  uploadPhoto: (placeId: number, file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    return request<{ ok: boolean; photoId: number }>(`/places/${placeId}/photos`, {
      method: 'POST', body: fd, headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {},
    });
  },
  nearby: (lat: number, lng: number, radiusM = 3000) => get<unknown[]>(`/places/nearby?lat=${lat}&lng=${lng}&radius=${radiusM}`),
  /**
   * Real places from external providers. The backend proxies Google Places /
   * TripAdvisor (keys stay server-side) and returns normalized Place objects.
   * provider: 'google' | 'tripadvisor' | 'all'
   */
  external: (params: { lat: number; lng: number; q?: string; provider?: 'google' | 'tripadvisor' | 'all' }) =>
    get<unknown[]>(`/places/external?${new URLSearchParams(Object.entries(params).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)]))}`),
};

// ---------------- Reviews & threads ----------------
export const reviews = {
  list: (placeId: number, sort?: string) => get<unknown[]>(`/places/${placeId}/reviews${sort ? `?sort=${sort}` : ''}`),
  create: (placeId: number, data: { rating: number; comment: string; photos?: string[] }) => post<unknown>(`/places/${placeId}/reviews`, data),
  updateMine: (reviewId: number, data: { rating: number; comment: string; photos?: string[] }) => patch<unknown>(`/reviews/${reviewId}`, data),
  removeMine: (reviewId: number) => del<void>(`/reviews/${reviewId}`),
  like: (reviewId: number) => post<{ likes: number; liked: boolean }>(`/reviews/${reviewId}/like`),
  uploadReviewPhoto: (reviewId: number, file: File) => {
    const fd = new FormData(); fd.append('file', file);
    return request<{ url: string; photoId: number }>(`/reviews/${reviewId}/photos`, { method: 'POST', body: fd, headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {} });
  },
  reply: (reviewId: number, text: string) => post<unknown>(`/reviews/${reviewId}/replies`, { text }),
  report: (reviewId: number, reason?: string) => post<void>(`/reviews/${reviewId}/report`, { reason }),
  uploadPhoto: (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    return request<{ url: string }>('/uploads', { method: 'POST', body: fd, headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {} });
  },
};

// ---------------- Favorites ----------------
export const favorites = {
  list: () => get<number[]>('/favorites'),
  add: (placeId: number) => post<void>(`/favorites/${placeId}`),
  remove: (placeId: number) => del<void>(`/favorites/${placeId}`),
};

// ---------------- Events ----------------
export const events = {
  list: (chatId: string) => get<unknown[]>(`/chats/${chatId}/events`),
  create: (chatId: string, data: { title: string; place: string; date: string; time: string }) => post<unknown>(`/chats/${chatId}/events`, data),
  rsvp: (eventId: number, status: 'going' | 'maybe' | 'none') => post<void>(`/events/${eventId}/rsvp`, { status }),
};

// ---------------- Chat ----------------
export const chat = {
  threads: () => get<unknown[]>('/chats'),
  messages: (chatId: string) => get<unknown[]>(`/chats/${chatId}/messages`),
  send: (chatId: string, text: string) => post<unknown>(`/chats/${chatId}/messages`, { text }),
};

// ---------------- Subscription / billing ----------------
export const billing = {
  createCheckoutSession: (data: { priceId: string; planId: string; cycle: 'month' | 'year' }) => post<{ id: string }>('/billing/create-checkout-session', data),
  portal: () => post<{ url: string }>('/billing/portal'),
  status: () => get<{ plan: string; renewsAt?: string }>('/billing/status'),
};

// ---------------- Notifications ----------------
export type NotificationItem = {
  id: number; title?: string; text: string; icon?: string; link?: string; read: boolean; createdAt: string;
};
export const notifications = {
  list: () => get<NotificationItem[]>('/notifications'),
  markRead: (id: number) => post<void>(`/notifications/${id}/read`),
  markAllRead: () => post<void>('/notifications/read-all'),
};

// ---------------- Web Push (PWA notifications) ----------------
export const push = {
  key: () => get<{ publicKey: string }>('/push/key'),
  subscribe: (sub: unknown) => post<void>('/push/subscribe', sub),
  unsubscribe: (endpoint: string) => post<void>('/push/unsubscribe', { endpoint }),
  test: () => post<{ subscriptions: number; sent: number; failed: number; error: string; pushConfigured: boolean }>('/push/test'),
};

// ---------------- Wetigo membership card ----------------
export const card = {
  get: () => get<{ number: string; holder: string; tier: string; points: number }>('/card'),
};

// ---------------- Admin moderation ----------------
export const admin = {
  reports: () => get<any[]>('/admin/reports'),
  hideReview: (id: number) => post<void>(`/admin/reviews/${id}/hide`),
  restoreReview: (id: number) => post<void>(`/admin/reviews/${id}/restore`),
  deleteReview: (id: number) => del<void>(`/admin/reviews/${id}`),
  dismissReport: (id: number) => del<void>(`/admin/reports/${id}`),
  markInappropriate: (reviewId: number) => post<{ outcome: string; strikes: number; blocks: number }>(`/admin/reviews/${reviewId}/inappropriate`),
  pendingPlaces: () => get<any[]>('/admin/places/pending'),
  approvePlace: (id: number) => post<void>(`/admin/places/${id}/approve`),
  rejectPlace: (id: number) => post<void>(`/admin/places/${id}/reject`),
  setTier: (id: number, tier: 'free' | 'plus' | 'pro', days: number) => post<{ tier: string; promotedUntil: string }>(`/admin/places/${id}/tier`, { tier, days }),
};

// ---------------- Profile ----------------
export const profile = {
  update: (data: { name?: string; email?: string; bio?: string; avatar?: string }) => patch<unknown>('/profile', data),
  updateSettings: (data: { notifications?: boolean; emailUpdates?: boolean; country?: string; language?: string }) => patch<void>('/profile/settings', data),
  uploadAvatar: (file: File) => {
    const fd = new FormData(); fd.append('file', file);
    return request<{ avatar: string }>('/profile/avatar', { method: 'POST', body: fd, headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {} });
  },
  stats: () => get<{ reviews: number; favorites: number; plans: number; card?: { number: string; expires: string } }>('/profile/stats'),
  activity: () => get<{ id: number; type: string; place: string; action: string; time: string }[]>('/profile/activity'),
  deleteAccount: () => del<void>('/profile'),
};

/** Reference list of endpoints the backend must expose. */
export const API_ENDPOINTS = [
  'POST   /auth/register',
  'POST   /auth/login',
  'POST   /auth/verify-otp',
  'POST   /auth/resend-otp',
  'POST   /auth/oauth/:provider',
  'POST   /auth/forgot-password',
  'GET    /auth/me',
  'POST   /auth/logout',
  'GET    /places',
  'GET    /places/:id',
  'POST   /places',
  'GET    /places/nearby',
  'GET    /places/external   (proxies Google Places / TripAdvisor)',
  'GET    /places/:id/reviews',
  'POST   /places/:id/reviews',
  'POST   /reviews/:id/like',
  'POST   /reviews/:id/replies',
  'POST   /reviews/:id/report',
  'POST   /uploads',
  'GET    /favorites',
  'POST   /favorites/:placeId',
  'DELETE /favorites/:placeId',
  'GET    /chats',
  'GET    /chats/:id/messages',
  'POST   /chats/:id/messages',
  'GET    /chats/:id/events',
  'POST   /chats/:id/events',
  'POST   /events/:id/rsvp',
  'POST   /billing/create-checkout-session',
  'POST   /billing/portal',
  'GET    /billing/status',
  'GET    /notifications',
  'POST   /notifications/:id/read',
  'POST   /notifications/read-all',
  'PATCH  /profile',
  'PATCH  /profile/settings',
] as const;
