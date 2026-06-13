// ─────────────────────────────────────────────────────────────────────────────
// lib/api.ts  — Accord API client
// All requests go through `apiFetch`, which automatically:
//   • Attaches the JWT from localStorage as a Bearer token
//   • Refreshes / clears the token on 401
//   • Returns typed responses or throws ApiError
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ── Token helpers ─────────────────────────────────────────────────────────────
export const TOKEN_KEY = "accord_jwt";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// ── Core fetch wrapper ────────────────────────────────────────────────────────
async function apiFetch<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const { auth = true, ...init } = options;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };

  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers });

  if (res.status === 401) {
    clearToken();
    if (typeof window !== "undefined") window.location.href = "/signin";
    throw new ApiError(401, "Session expired. Please sign in again.");
  }

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      message = body.message ?? body.error ?? message;
    } catch {
      /* ignore */
    }
    throw new ApiError(res.status, message);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

// ─────────────────────────────────────────────────────────────────────────────
// ── TYPE DEFINITIONS ──────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

export type Role = "USER" | "ADMIN";

export interface AuthTokenResponse {
  token: string;
  user: UserProfile;
}

export interface UserProfile {
  id: string;
  email: string;
  emailVerified: boolean;
  agencyName: string;
  taxId?: string;
  stripeAccountId?: string;
  role: Role[];
  createdAt: string;
}

export interface OnboardingPayload {
  displayName: string;
  company?: string;
  phone?: string;
  role?: string;
  companySize?: string;
  currency: string;
}

// Wallet
export interface WalletTransaction {
  id: string;
  invoiceId: string; // ISO string
  fxRateApplied: number;
  amountInr: number; // positive = credit, negative = debit
  currency: string;
  companyName: string;
  description: string;
  type: "INVOICE_PAYMENT" | "PAYOUT" | "PLATFORM_FEE" | "REFUND";
  status: "SETTLED" | "PROCESSING" | "PENDING" | "FAILED";
  createdAt: string; // ISO string
}

export interface WalletSummary {
  totalBalance: number;
  availableBalance: number;
  pendingUsdPayouts: number;
  currency: string;
  recentActivity: WalletTransaction[];
}

// Clients
export interface Client {
  id: string;
  name: string;
  company: string;
  country: string;
  email: string;
  totalBilled: number;
  outstandingBalance: number;
  status: "ACTIVE" | "SENT" | "PENDING" | "INACTIVE";
  createdAt: string;
}

// Invoices
export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  amount: number;
  currency: string;
  dueDate: string;
  status: "PAID" | "PENDING" | "OVERDUE" | "SENT" | "DRAFT";
  createdAt: string;
  lineItems?: InvoiceLineItem[];
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// Contracts
export interface Contract {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  type: "AGENCY" | "CONTRACTOR" | "NDA" | "LAWERY" | "OTHER";
  status: "ACTIVE" | "SENT" | "DRAFT" | "REVIEW" | "EXPIRED";
  createdAt: string;
  expiresAt?: string;
}

// Projects
export interface Project {
  id: string;
  name: string;
  clientId: string;
  status: "ACTIVE" | "COMPLETED" | "ON_HOLD" | "CANCELLED";
  createdAt: string;
}

// Analytics
export interface MonthlyRevenue {
  month: string; // e.g. "Jan"
  revenue: number;
  profit: number;
}

export interface TrafficSource {
  sourceName: string;
  value: number;
}

export interface WalletSummary {
  availableBalance: number;
  pendingBalance: number;
  salesGrowth: number; 
  recentActivity: WalletTransaction[];
}

export interface projectCount {
  count: number;
}

// Notifications
export interface AppNotification {
  id: string;
  type: "PAYMENT" | "INVOICE" | "CONTRACT" | "CLIENT" | "SYSTEM";
  title: string;
  description: string;
  read: boolean;
  createdAt: string;
}

export interface ClientMetricsDTO {
  totalCustomers: number;
  newCustomersThisMonth: number;
  newCustomersPct: number;
  newCustomersGrowth: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// ── AUTH API ─────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
export const authApi = {
  /**
   * POST /api/v1/auth/login
   * Email + password sign-in. Returns JWT + user profile.
   */
  login(email: string, password: string) {
    return apiFetch<AuthTokenResponse>("/api/v1/auth/login", {
      method: "POST",
      auth: false,
      body: JSON.stringify({ email, password }),
    });
  },

  /**
   * POST /api/v1/auth/register
   * Creates a new account. Returns JWT + user profile.
   * After register, redirect to /onboarding.
   */
  register(name: string, email: string, password: string) {
    return apiFetch<AuthTokenResponse>("/api/v1/auth/register", {
      method: "POST",
      auth: false,
      body: JSON.stringify({ name, email, password }),
    });
  },

  /**
   * GET /api/v1/auth/verify
   * Validates the stored JWT. Used on app mount to restore session.
   */
  verify() {
    return apiFetch<UserProfile>("/api/v1/auth/verify");
  },

  /**
   * POST /api/v1/auth/oauth/callback
   * After the Spring Security OAuth2 redirect, the frontend receives a code
   * and exchanges it for our own JWT here.
   */
  oauthCallback(provider: string, code: string) {
    return apiFetch<AuthTokenResponse>(
      `/api/v1/auth/oauth/${provider}/callback`,
      {
        method: "POST",
        auth: false,
        body: JSON.stringify({ code }),
      },
    );
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// ── ONBOARDING API ────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
export const onboardingApi = {
  /**
   * POST /api/v1/users/me/onboarding
   * Saves the profile details gathered in the multi-step onboarding form.
   * Works the same whether the user registered via email or OAuth.
   */
  complete(payload: OnboardingPayload) {
    return apiFetch<UserProfile>("/api/v1/users/me/onboarding", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// ── DASHBOARD / ANALYTICS API ─────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
export const analyticsApi = {
  /**
   * GET /api/v1/analytics/dashboard
   * Returns the four headline KPI numbers for the top stat cards.
   */

  getRevenueProfit() {
    return apiFetch<MonthlyRevenue[]>("/api/v1/analytics/revenue-profit");
  },

  getTrafficSources() {
    return apiFetch<TrafficSource[]>("/api/v1/analytics/traffic-sources");
  },

  getWalletSummary() {
    return apiFetch<WalletSummary>("/api/v1/wallet/summary");
  },

  getProjectsCount() {
    return apiFetch<projectCount>("/api/v1/projects/count");
  },

  getClientMetrics() {
    return apiFetch<ClientMetricsDTO>("/api/v1/clients/metrics");
  },

  /**
   * GET /api/v1/analytics/revenue?months=12
   * Returns monthly revenue + profit aggregations for the area chart.
   * Spring should run: SELECT month, SUM(amount) FROM invoices WHERE status='PAID' GROUP BY month
   */
  getRevenueByMonth(months = 12) {
    return apiFetch<MonthlyRevenue[]>(
      `/api/v1/analytics/revenue?months=${months}`,
    );
  },

  /**
   * GET /api/v1/analytics/traffic
   * Returns traffic source breakdown percentages (Direct / Social / Referral).
   */
};

// ─────────────────────────────────────────────────────────────────────────────
// ── WALLET API ────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
export const walletApi = {
  /**
   * GET /api/v1/wallet/summary
   * Returns balance, available funds, pending payouts, + last 5 transactions.
   * Used by: Dashboard recent-transactions card + Wallet overview page.
   */
  getSummary() {
    return apiFetch<WalletSummary>("/api/v1/wallet/summary");
  },

  /**
   * GET /api/v1/wallet/transactions?page=0&size=20
   * Full paginated transaction history for the Wallet page.
   */
  getTransactions(page = 0, size = 20) {
    return apiFetch<{ content: WalletTransaction[]; totalElements: number }>(
      `/api/v1/wallet/transactions?page=${page}&size=${size}`,
    );
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// ── CLIENTS API ───────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
export const clientsApi = {
  /** GET /api/v1/clients */
  getAll() {
    return apiFetch<Client[]>("/api/v1/clients");
  },
  /** GET /api/v1/clients/:id */
  getById(id: string) {
    return apiFetch<Client>(`/api/v1/clients/${id}`);
  },
  /** POST /api/v1/clients */
  create(
    payload: Omit<
      Client,
      "id" | "createdAt" | "totalBilled" | "outstandingBalance"
    >,
  ) {
    return apiFetch<Client>("/api/v1/clients", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// ── INVOICES API ──────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
export const invoicesApi = {
  /** GET /api/v1/invoices */
  getAll() {
    return apiFetch<Invoice[]>("/api/v1/invoices");
  },
  /** GET /api/v1/invoices/:id */
  getById(id: string) {
    return apiFetch<Invoice>(`/api/v1/invoices/${id}`);
  },
  /** POST /api/v1/invoices */
  create(payload: Partial<Invoice>) {
    return apiFetch<Invoice>("/api/v1/invoices", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// ── CONTRACTS API ─────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
export const contractsApi = {
  /** GET /api/v1/contracts */
  getAll() {
    return apiFetch<Contract[]>("/api/v1/contracts");
  },
  /** GET /api/v1/contracts/:id */
  getById(id: string) {
    return apiFetch<Contract>(`/api/v1/contracts/${id}`);
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// ── PROJECTS API ──────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
export const projectsApi = {
  /**
   * GET /api/v1/projects?status=ACTIVE
   * Filter by status to count active projects.
   * Ideally your Spring controller has GET /api/v1/projects/count?status=ACTIVE
   * to avoid fetching thousands of objects just for a count.
   */
  getAll(status?: string) {
    const qs = status ? `?status=${status}` : "";
    return apiFetch<Project[]>(`/api/v1/projects${qs}`);
  },

  /** GET /api/v1/projects/count?status=ACTIVE — preferred endpoint */
  countByStatus(status: string) {
    return apiFetch<{ count: number }>(
      `/api/v1/projects/count?status=${status}`,
    );
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// ── NOTIFICATIONS API ─────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
export const notificationsApi = {
  /** GET /api/v1/notifications */
  getAll() {
    return apiFetch<AppNotification[]>("/api/v1/notifications");
  },
  /** PUT /api/v1/notifications/:id/read */
  markRead(id: string) {
    return apiFetch<void>(`/api/v1/notifications/${id}/read`, {
      method: "PUT",
    });
  },
  /** PUT /api/v1/notifications/read-all */
  markAllRead() {
    return apiFetch<void>("/api/v1/notifications/read-all", { method: "PUT" });
  },
  /** DELETE /api/v1/notifications/:id */
  dismiss(id: string) {
    return apiFetch<void>(`/api/v1/notifications/${id}`, { method: "DELETE" });
  },
};
