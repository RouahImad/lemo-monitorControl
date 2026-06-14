import axiosInstance from "./index";
import type {
    GenerateResourcesInput,
    NetworkInputListResponse,
    SimulateApacheInput,
    SpikeResourceInput,
} from "../types/api";

const unwrap = <T>(promise: Promise<{ data: T }>) =>
    promise
        .then((response) => response.data)
        .catch((error) => {
            throw (
                error.response?.data || error.message || "Unknown axios error"
            );
        });

export const generateResources = (input: GenerateResourcesInput) =>
    unwrap(
        axiosInstance.get("/ressource/sim/generate", {
            params: {
                count: input.count,
                intervalMs: input.intervalMs,
                infinite: input.infinite ? "1" : undefined,
            },
        }),
    );

export const stopResourceGeneration = () =>
    unwrap(axiosInstance.get("/ressource/sim/generate/stop"));

export const spikeResource = (input: SpikeResourceInput) =>
    unwrap(
        axiosInstance.get("/ressource/sim/spike", {
            params: {
                target: input.target,
                delta: input.delta,
            },
        }),
    );

export const scanPort = (host: string, port: number) =>
    unwrap(
        axiosInstance.get("/network/sim/scan", {
            params: { host, port },
        }),
    );

export const startNetworkScan = () =>
    unwrap(axiosInstance.get("/network/sim/scan/start"));

export const stopNetworkScan = () =>
    unwrap(axiosInstance.get("/network/sim/scan/stop"));

export const simulateApache = (input: SimulateApacheInput) =>
    unwrap(
        axiosInstance.get(`/apache/sim/${input.count}`, {
            params: {
                method: input.method,
                status: input.status,
                default: input.useDefault ? "1" : undefined,
            },
        }),
    );

export const simulateApacheForce = (input: SimulateApacheInput) =>
    unwrap(
        axiosInstance.get(`/apache/sim/force/${input.count}`, {
            params: {
                method: input.method,
                status: input.status,
                ip: input.ip,
            },
        }),
    );

export const simulateApacheBan = (userId: string) =>
    unwrap(
        axiosInstance.get(`/apache/sim/ban/`, {
            params: {
                userId,
            },
        }),
    );

export const getNetworkInput = () =>
    unwrap<NetworkInputListResponse>(axiosInstance.get("/network/sim/"));

export const addNetworkInput = (ip: string, port: number) =>
    unwrap(axiosInstance.post("/network/sim/", { ip, port }));

export const deleteNetworkInput = (ip: string, port: number) =>
    unwrap(axiosInstance.delete("/network/sim/", { data: { ip, port } }));
