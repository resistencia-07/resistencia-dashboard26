const ADMIN_USERNAME = (import.meta.env.VITE_ADMIN_USERNAME || 'admin').trim();
const ADMIN_PASSWORD = (import.meta.env.VITE_ADMIN_PASSWORD || 'admin123').trim();

const SESSION_KEY = 'resistencia_admin_session';
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

export function getStoredSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (!session || session.username !== ADMIN_USERNAME) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }

    const loggedInAt = Date.parse(session.loggedInAt);
    const expiresAt = session.expiresAt
      ? Date.parse(session.expiresAt)
      : loggedInAt + SESSION_DURATION_MS;

    if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }

    return { ...session, expiresAt: new Date(expiresAt).toISOString() };
  } catch {
    return null;
  }
}

export async function loginWithUsername(username, password) {
  const cleanUsername = username.trim();
  const cleanPassword = password.trim();

  if (!cleanUsername || !cleanPassword) {
    return { success: false, error: 'Please enter both username and password.' };
  }

  // Validate single admin user credentials
  if (cleanUsername !== ADMIN_USERNAME || cleanPassword !== ADMIN_PASSWORD) {
    return { success: false, error: 'Invalid username or password.' };
  }

  const now = Date.now();
  const session = {
    username: ADMIN_USERNAME,
    role: 'admin',
    loggedInAt: new Date(now).toISOString(),
    expiresAt: new Date(now + SESSION_DURATION_MS).toISOString(),
  };

  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (err) {
    console.error('Failed to store session in localStorage:', err);
  }

  return {
    success: true,
    user: {
      id: 'admin',
      username: ADMIN_USERNAME,
      role: 'admin',
      user_metadata: {
        username: ADMIN_USERNAME,
        name: 'Admin',
      },
    },
    session,
  };
}

export async function logoutUser() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (err) {
    console.error('Failed to remove session from localStorage:', err);
  }
}
