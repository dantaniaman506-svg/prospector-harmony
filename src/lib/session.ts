const KEY = "airleads-session";

/** "persist" lives in localStorage (Remember me), otherwise only for the tab session. */
export function readSession(): boolean {
  try {
    if (window.localStorage.getItem(KEY) === "persist") return true;
    return window.sessionStorage.getItem(KEY) === "active";
  } catch {
    return false;
  }
}

export function writeSession(remember: boolean) {
  try {
    if (remember) {
      window.localStorage.setItem(KEY, "persist");
      window.sessionStorage.removeItem(KEY);
    } else {
      window.sessionStorage.setItem(KEY, "active");
      window.localStorage.removeItem(KEY);
    }
  } catch {
    /* ignore */
  }
}

export function clearSession() {
  try {
    window.localStorage.removeItem(KEY);
    window.sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
