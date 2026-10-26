/**
 * Booking lessons with an instructor. Switched off on 2026-10-26: every package
 * is theory only and the owner asked to leave booking and the instructors out.
 * The code stays so practical lessons can come back; set this to true for that.
 * While off, the booking wizard, My Bookings and the instructors page give 404,
 * and students get their lessons when the admin grants access under Students.
 */
export const BOOKING_ENABLED = false;

/** Package prices on the public pages. Off: the owner wants "prijs op aanvraag". */
export const SHOW_PRICES = false;
