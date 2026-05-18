import type { TicketCreatedPayload, ToastItem } from "../types/socket";

const MAX_TOASTS = 4;
const TOAST_LIFETIME_MS = 16000;

export type ToastInput = {
    type: string;
    title: string;
    ticketId: string;
    createdAt?: string;
};

type ToastListener = (toasts: ToastItem[]) => void;

let toasts: ToastItem[] = [];
const listeners = new Set<ToastListener>();
const timers = new Map<string, ReturnType<typeof setTimeout>>();

const emit = () => {
    for (const listener of listeners) {
        listener(toasts);
    }
};

const clearToastTimer = (key: string) => {
    const timer = timers.get(key);
    if (timer) {
        clearTimeout(timer);
        timers.delete(key);
    }
};

const scheduleToastRemoval = (key: string) => {
    clearToastTimer(key);
    const timer = setTimeout(() => {
        dismissToast(key);
    }, TOAST_LIFETIME_MS);

    timers.set(key, timer);
};

export const showToast = (input: ToastInput) => {
    const toast = {
        key: `${Date.now()}-${Math.random()}`,
        type: input.type,
        title: input.title,
        ticketId: input.ticketId,
        createdAt: input.createdAt ?? new Date().toISOString(),
    };

    const nextToasts = [toast, ...toasts].slice(0, MAX_TOASTS);

    for (const item of toasts) {
        if (!nextToasts.some((nextItem) => nextItem.key === item.key)) {
            clearToastTimer(item.key);
        }
    }

    toasts = nextToasts;
    emit();
    scheduleToastRemoval(toast.key);

    return toast.key;
};

export const showTicketToast = (payload: TicketCreatedPayload) =>
    showToast({
        type: payload.type,
        title:
            payload.title ??
            (payload.type === "http-error"
                ? "HTTP 500 spike"
                : payload.type === "http-force"
                  ? "HTTP 401/403 spike"
                  : "Ticket created"),
        ticketId: String(payload.id ?? "unknown"),
        createdAt: payload.createdAt,
    });

export const dismissToast = (key: string) => {
    clearToastTimer(key);
    const nextToasts = toasts.filter((item) => item.key !== key);

    if (nextToasts.length === toasts.length) {
        return;
    }

    toasts = nextToasts;
    emit();
};

export const subscribeToasts = (setter: ToastListener) => {
    listeners.add(setter);
    setter(toasts);

    return () => {
        listeners.delete(setter);
    };
};
