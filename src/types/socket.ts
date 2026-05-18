type TicketCreatedPayload = {
    id: number | string | null;
    type: "http-error" | "http-force" | string;
    title?: string;
    createdAt?: string;
};

type ToastItem = {
    key: string;
    type: string;
    title: string;
    ticketId: string;
    createdAt: string;
};

export type { TicketCreatedPayload, ToastItem };
