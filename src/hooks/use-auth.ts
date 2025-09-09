import { useState, useEffect } from 'react';

// This is a mock auth hook.
// In a real app, this would likely use React Context and
// interact with localStorage or cookies to persist the session.

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    // Check for a token in localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
      setUser({ name: 'Super Admin' }); // In a real app, decode token for user info
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem('authToken', token);
    setIsLoggedIn(true);
    setUser({ name: 'Super Admin' });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    setUser(null);
  };

  return { isLoggedIn, user, login, logout };
}
