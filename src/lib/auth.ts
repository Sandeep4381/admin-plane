// This file could contain helper functions for authentication,
// such as verifying JWTs, managing user sessions, etc.

// Example function to get session from a token (mock)
export function getSession(token: string | null): { isLoggedIn: boolean; user?: any } {
  if (token === 'mock-jwt-token') {
    return {
      isLoggedIn: true,
      user: { name: 'Super Admin', email: 'admin@sawarikaro.com' },
    };
  }
  return { isLoggedIn: false };
}
