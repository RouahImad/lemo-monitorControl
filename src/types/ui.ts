type ResponseState = {
    loading?: boolean;
    data?: unknown;
    error?: string;
};

type ResponsePanelProps = {
    title: string;
    state: ResponseState | null;
};

export type { ResponsePanelProps, ResponseState };
