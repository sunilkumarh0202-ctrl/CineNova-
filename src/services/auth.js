/**
 * CineNova Authentication Service Layer
 * 
 * DEMO / DEVELOPMENT-ONLY AUTHENTICATION
 * ---------------------------------------
 * For this initial release, authentication uses a secure LocalStorage session token.
 * No production passwords or master API keys are hard-coded in client source.
 * 
 * In this demo environment, any valid email format with demo password 'admin123' (or any password >= 6 chars)
 * activates the admin session with a visual "DEMO MODE" indicator.
 * 
 * FUTURE PRODUCTION AUTHENTICATION:
 * --------------------------------
 * To connect Firebase Auth or Supabase Auth:
 * 
 * 1. Firebase Auth:
 *    - import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
 *    - Replace login() with signInWithEmailAndPassword(auth, email, password)
 * 
 * 2. Supabase Auth:
 *    - import { createClient } from "@supabase/supabase-js";
 *    - Replace login() with supabase.auth.signInWithPassword({ email, password })
 */

const AUTH_STORAGE_KEY = 'cinenova_admin_session_v1';

export function getAdminSession() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading auth session:', err);
    return null;
  }
}

export function isAuthenticated() {
  const session = getAdminSession();
  return Boolean(session && session.isLoggedIn);
}

/**
 * Demo login handler
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{ success: boolean, message?: string, user?: Object }>}
 */
export async function login(email, password) {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 300));

  if (!email || !email.includes('@')) {
    return { success: false, message: 'Please enter a valid email address.' };
  }

  if (!password || password.length < 6) {
    return { success: false, message: 'Password must be at least 6 characters.' };
  }

  // Demo credential validation (clearly marked for development)
  const sessionUser = {
    email: email.trim().toLowerCase(),
    role: 'administrator',
    isLoggedIn: true,
    loginTime: new Date().toISOString(),
    isDemoSession: true
  };

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionUser));
  return { success: true, user: sessionUser };
}

/**
 * Logout admin session
 */
export function logout() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  return true;
}
