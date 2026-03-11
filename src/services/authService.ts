import type { LoginInput, RegisterInput, PublicUser } from '../types/auth';

const API_BASE_URL = 'https://backend.fruz.cloud';
const TOKEN_KEY = 'auth_token';

export class AuthError extends Error {
  statusCode?: number;
  details?: unknown;
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }
  return {
    'Content-Type': 'application/json',
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // If we can't parse the error response, use the default message
    }
    const error = new AuthError(errorMessage);
    error.statusCode = response.status;
    throw error;
  }
  
  // Handle 201 Created and other success codes with no content
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return {} as T;
  }
  
  return response.json();
}

export const authService = {
  async register(data: LoginInput & RegisterInput): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    await handleResponse(response);
  },

  async login(credentials: LoginInput): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await handleResponse<{ ok: boolean; token: string; user: PublicUser }>(response);
    if (data.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
    }
  },

  async logout(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    await handleResponse(response);
    localStorage.removeItem(TOKEN_KEY);
  },

  async getCurrentUser(): Promise<PublicUser> {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await handleResponse<{ ok: boolean; user: PublicUser }>(response);
    return data.user;
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },
};
