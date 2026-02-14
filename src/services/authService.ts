import type { LoginInput, RegisterInput, PublicUser } from '../types/auth';

const API_BASE_URL = 'http://localhost:3000';

export class AuthError extends Error {
  statusCode?: number;
  details?: unknown;
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
      credentials: 'include',
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
      credentials: 'include',
      body: JSON.stringify(credentials),
    });

    await handleResponse(response);
  },

  async logout(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    await handleResponse(response);
  },

  async getCurrentUser(): Promise<PublicUser> {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: 'GET',
      credentials: 'include',
    });

    return handleResponse<PublicUser>(response);
  },
};
