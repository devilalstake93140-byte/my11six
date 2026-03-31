/**
 * Shared time helpers for consistent UTC/local handling across the frontend.
 */

export const getClientTimeZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch (_) {
    return 'UTC';
  }
};

export const getClientTimezoneOffsetMinutes = () => {
  return new Date().getTimezoneOffset();
};

export const toUtcISOStringFromLocalInput = (localDateTime) => {
  if (!localDateTime) return null;
  const date = new Date(localDateTime);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
};

export const toDateTimeLocalInputValue = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return '';
  const offsetMs = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
};

export const formatDateTimeInUserZone = (dateInput) => {
  if (!dateInput) return 'Invalid time';
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return 'Invalid time';

  const timeZone = getClientTimeZone();
  const locale = timeZone === 'Asia/Kolkata' ? 'en-IN' : undefined;

  const formatted = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone,
  }).format(date);

  return formatted;
};

export const formatDateInUserZone = (dateInput) => {
  if (!dateInput) return 'N/A';
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return 'N/A';

  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(date);
};
