/** After this many wrong passwords in a row the account is locked for LOCK_MINUTES. */
export const MAX_FAILED_LOGINS = 5;
export const LOCK_MINUTES = 15;

export function isLocked(lockedUntil: Date | null, now = new Date()) {
  return lockedUntil !== null && lockedUntil > now;
}

/** The account's counters after one more wrong password. */
export function afterFailedLogin(failedLoginCount: number, now = new Date()) {
  const count = failedLoginCount + 1;
  return count >= MAX_FAILED_LOGINS
    ? { failedLoginCount: 0, lockedUntil: new Date(now.getTime() + LOCK_MINUTES * 60_000) }
    : { failedLoginCount: count, lockedUntil: null };
}
