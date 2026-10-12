import { afterFailedLogin, isLocked, LOCK_MINUTES, MAX_FAILED_LOGINS } from "@/lib/login-lock";

describe("login lock", () => {
  const now = new Date("2026-10-12T10:00:00Z");

  it("counts wrong passwords without locking until the limit", () => {
    let state = { failedLoginCount: 0, lockedUntil: null as Date | null };
    for (let i = 1; i < MAX_FAILED_LOGINS; i++) {
      state = afterFailedLogin(state.failedLoginCount, now);
      expect(state).toEqual({ failedLoginCount: i, lockedUntil: null });
    }
  });

  it("locks for 15 minutes on the fifth wrong password, then starts counting again", () => {
    const state = afterFailedLogin(MAX_FAILED_LOGINS - 1, now);
    expect(state.failedLoginCount).toBe(0);
    expect(state.lockedUntil?.toISOString()).toBe(new Date(now.getTime() + LOCK_MINUTES * 60_000).toISOString());
    expect(isLocked(state.lockedUntil, now)).toBe(true);
    expect(isLocked(state.lockedUntil, new Date(now.getTime() + LOCK_MINUTES * 60_000 + 1))).toBe(false);
  });

  it("treats an account without a lock as open", () => {
    expect(isLocked(null, now)).toBe(false);
  });
});
