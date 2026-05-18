type GenerateResourcesInput = {
    count: number;
    intervalMs: number;
    infinite: boolean;
};

type SpikeResourceInput = {
    target: string;
    delta: number;
    durationMs: number;
};

type SimulateApacheInput = {
    count: number;
    method?: string;
    status?: string;
    useDefault?: boolean;
    ip?: string;
};

type NetworkInput = {
    ip: string;
    port: number;
};

type NetworkInputListResponse = {
    data: {
        networks: NetworkInput[];
    };
};

export type {
    GenerateResourcesInput,
    NetworkInput,
    NetworkInputListResponse,
    SpikeResourceInput,
    SimulateApacheInput,
};
