import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getAnalytics, logEvent, isSupported as analyticsIsSupported } from "firebase/analytics";
import { getPerformance } from "firebase/performance";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// ── Analytics (lazy-initialized, guarded for SSR/restricted environments) ──
let analytics = null;
analyticsIsSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

// ── Performance Monitoring (Real User Monitoring) ──
let perf = null;
if (typeof window !== 'undefined') {
  try {
    perf = getPerformance(app);
  } catch (e) {
    // Performance monitoring unavailable in this environment
  }
}
export { perf };

/**
 * Log a custom analytics event to Firebase Analytics.
 * Silently no-ops if analytics is not yet initialized or supported.
 * @param {string} eventName - The event name (snake_case).
 * @param {object} [params={}] - Optional event parameters.
 */
export const logCustomEvent = (eventName, params = {}) => {
  if (analytics) {
    logEvent(analytics, eventName, params);
  }
};

/**
 * Signs the user in with Google via OAuth popup.
 * Logs a `login` event to Analytics on success.
 * @returns {Promise<import('firebase/auth').User>} The authenticated Firebase user.
 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    logCustomEvent('login', { method: 'google' });
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

/**
 * Signs the currently authenticated user out.
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    await signOut(auth);
    logCustomEvent('logout');
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};
