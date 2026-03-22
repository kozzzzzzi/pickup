const STORAGE_KEY = "pickup_received_ids";
const EVENT_NAME = "pickup-status-changed";

function emitStatusChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(EVENT_NAME));
}

export function subscribeOrderStatusChange(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const handler = () => callback();

  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener("storage", handler);

  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener("storage", handler);
  };
}

export function getReceivedIds(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isOrderReceived(id: string): boolean {
  return getReceivedIds().includes(id);
}

export function markOrderReceived(id: string) {
  const current = getReceivedIds();
  if (current.includes(id)) return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify([...current, id]));
  emitStatusChanged();
}

export function unmarkOrderReceived(id: string) {
  const current = getReceivedIds();
  const next = current.filter((item) => item !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  emitStatusChanged();
}