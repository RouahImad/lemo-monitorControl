import { useEffect, useState } from "react";
import { socket } from "../services/socket";
import type { ToastItem } from "../types/socket";
import { dismissToast, showTicketToast, subscribeToasts } from "../utils/toast";

const ToastStack = () => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    useEffect(() => {
        const unsubscribeToasts = subscribeToasts(setToasts);

        socket.on("ticket:created", showTicketToast);
        return () => {
            socket.off("ticket:created", showTicketToast);
            unsubscribeToasts();
        };
    }, []);

    if (toasts.length === 0) return null;

    return (
        <div className="pointer-events-none fixed right-6 top-6 z-50 flex w-[320px] flex-col gap-3">
            {toasts.map((toast) => (
                <div
                    key={toast.key}
                    className="toast-fly toast-card pointer-events-auto relative rounded-2xl border p-4 pr-12"
                >
                    <button
                        type="button"
                        aria-label="Close toast"
                        onClick={() => dismissToast(toast.key)}
                        className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full border border-white/15 bg-white/5 text-white/70 transition hover:border-white/30 hover:bg-white/10 hover:text-white cursor-pointer"
                    >
                        ×
                    </button>
                    <p className="text-xs uppercase tracking-[0.35em] text-white/60">
                        {toast.type}
                    </p>
                    <h4 className="mt-1 text-base font-semibold text-white">
                        {toast.title}
                    </h4>
                    <p className="mt-2 text-sm text-white/80">
                        Ticket ID: {toast.ticketId}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default ToastStack;
