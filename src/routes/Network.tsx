import { useEffect, useState } from "react";
import ResponsePanel from "../components/ResponsePanel";
import type { ResponseState } from "../types/ui";
import {
    addNetworkInput,
    deleteNetworkInput,
    getNetworkInput,
    scanPort,
    startNetworkScan,
    stopNetworkScan,
} from "../services/api";

type NetworkEntry = {
    ip: string;
    port: number;
};

const Network = () => {
    const [host, setHost] = useState("127.0.0.1");
    const [port, setPort] = useState("80");
    const [entryIp, setEntryIp] = useState("127.0.0.1");
    const [entryPort, setEntryPort] = useState("4999");

    const [networkEntries, setNetworkEntries] = useState<NetworkEntry[]>([]);

    const [scanState, setScanState] = useState<ResponseState | null>(null);
    const [startState, setStartState] = useState<ResponseState | null>(null);
    const [stopState, setStopState] = useState<ResponseState | null>(null);
    const [addState, setAddState] = useState<ResponseState | null>(null);
    const [deleteState, setDeleteState] = useState<ResponseState | null>(null);

    const loadNetworkInputs = async () => {
        try {
            const response = await getNetworkInput();
            const entries = response.data?.networks ?? [];
            setNetworkEntries(entries);
        } catch (error) {}
    };

    useEffect(() => {
        void loadNetworkInputs();
    }, []);

    const onScan = async () => {
        const portValue = Number(port);
        if (!host.trim()) {
            setScanState({ error: "Host is required." });
            return;
        }
        if (!Number.isInteger(portValue) || portValue <= 0) {
            setScanState({ error: "Port must be a valid integer." });
            return;
        }

        setScanState({ loading: true });
        try {
            const data = await scanPort(host.trim(), portValue);
            setScanState({ data });
        } catch (error: any) {
            setScanState({
                error: String(error?.error ?? "Failed to scan port."),
            });
        }
    };

    const onStart = async () => {
        setStartState({ loading: true });
        try {
            const data = await startNetworkScan();
            setStartState({ data });
        } catch (error: any) {
            setStartState({
                error: String(error?.error ?? "Failed to start network scan."),
            });
        }
    };

    const onStop = async () => {
        setStopState({ loading: true });
        try {
            const data = await stopNetworkScan();
            console.log("Stop scan response:", data);
            setStopState({ data });
        } catch (error: any) {
            console.log("Error stopping network scan:", error);
            setStopState({
                error: String(error?.error ?? "Failed to stop network scan."),
            });
        }
    };

    const onAddNetwork = async () => {
        const ipValue = entryIp.trim();
        const portValue = Number(entryPort);

        if (!ipValue) {
            setAddState({ error: "IP is required." });
            return;
        }
        if (
            !Number.isInteger(portValue) ||
            portValue <= 0 ||
            portValue > 65535
        ) {
            setAddState({
                error: "Port must be an integer between 1 and 65535.",
            });
            return;
        }

        setAddState({ loading: true });
        try {
            const data = await addNetworkInput(ipValue, portValue);
            setAddState({ data });
            await loadNetworkInputs();
        } catch (error: any) {
            setAddState({
                error: String(error?.error ?? "Failed to add network entry."),
            });
        }
    };

    const onDeleteNetwork = async (ip: string, port: number) => {
        setDeleteState({ loading: true });
        try {
            const data = await deleteNetworkInput(ip, port);
            setDeleteState({ data });
            await loadNetworkInputs();
        } catch (error: any) {
            setDeleteState({
                error: String(
                    error?.error ?? "Failed to delete network entry.",
                ),
            });
        }
    };

    return (
        <section className="space-y-10">
            <div>
                <p className="text-sm uppercase tracking-[0.25em] text-black/50">
                    Network Alerts
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="rounded-2xl border border-black/10 bg-white p-6">
                    <h3 className="text-lg font-semibold">One-off scan</h3>
                    <div className="mt-4 grid gap-4">
                        <label className="grid gap-2 text-sm">
                            Host
                            <input
                                value={host}
                                onChange={(event) =>
                                    setHost(event.target.value)
                                }
                                className="rounded-lg border border-black/20 px-3 py-2"
                                placeholder="192.168.0.1"
                            />
                        </label>
                        <label className="grid gap-2 text-sm">
                            Port
                            <input
                                value={port}
                                onChange={(event) =>
                                    setPort(event.target.value)
                                }
                                className="rounded-lg border border-black/20 px-3 py-2"
                                type="number"
                                min={1}
                                max={65535}
                            />
                        </label>
                    </div>
                    <div className="mt-5">
                        <button
                            onClick={onScan}
                            className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white cursor-pointer"
                        >
                            Scan host
                        </button>
                    </div>
                    <ResponsePanel title="Scan" state={scanState} />
                </div>

                <div className="rounded-2xl border border-black/10 bg-white p-6">
                    <h3 className="text-lg font-semibold">Background scan</h3>
                    <p className="mt-2 text-sm text-black/60">
                        Uses configured networks from the server input file to
                        scan every 40 seconds.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-3">
                        <button
                            onClick={onStart}
                            className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white cursor-pointer"
                        >
                            Start scan
                        </button>
                        <button
                            onClick={onStop}
                            className="rounded-full border border-black/30 px-5 py-2 text-sm font-semibold cursor-pointer"
                        >
                            Stop scan
                        </button>
                    </div>
                    <ResponsePanel title="Start" state={startState} />
                    <ResponsePanel title="Stop" state={stopState} />
                </div>

                <div className="rounded-2xl border border-black/10 bg-white p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-semibold">
                                Input networks
                            </h3>
                        </div>
                        <button
                            onClick={() => void loadNetworkInputs()}
                            className="rounded-full border border-black/30 px-4 py-2 text-sm font-semibold cursor-pointer"
                        >
                            Refresh
                        </button>
                    </div>

                    <div className="mt-5 grid gap-4">
                        <label className="grid gap-2 text-sm">
                            IP address
                            <input
                                value={entryIp}
                                onChange={(event) =>
                                    setEntryIp(event.target.value)
                                }
                                className="rounded-lg border border-black/20 px-3 py-2"
                                placeholder="127.0.0.1"
                            />
                        </label>
                        <label className="grid gap-2 text-sm">
                            Port
                            <input
                                value={entryPort}
                                onChange={(event) =>
                                    setEntryPort(event.target.value)
                                }
                                className="rounded-lg border border-black/20 px-3 py-2"
                                type="number"
                                min={1}
                                max={65535}
                            />
                        </label>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                        <button
                            onClick={onAddNetwork}
                            className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white cursor-pointer"
                        >
                            Add network
                        </button>
                    </div>

                    <div className="mt-6 overflow-hidden rounded-xl border border-black/10">
                        <div className="max-h-72 overflow-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="sticky top-0 bg-white/95 text-black/60 backdrop-blur">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">
                                            IP
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Port
                                        </th>
                                        <th className="px-4 py-3 font-medium text-right">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {networkEntries.length === 0 ? (
                                        <tr>
                                            <td
                                                className="px-4 py-4 text-black/60"
                                                colSpan={3}
                                            >
                                                No network inputs saved yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        networkEntries.map((entry) => (
                                            <tr
                                                key={`${entry.ip}:${entry.port}`}
                                                className="border-t border-black/5"
                                            >
                                                <td className="px-4 py-3">
                                                    {entry.ip}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {entry.port}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <button
                                                        onClick={() =>
                                                            void onDeleteNetwork(
                                                                entry.ip,
                                                                entry.port,
                                                            )
                                                        }
                                                        className="rounded-full border border-black/20 px-4 py-1.5 text-xs font-semibold cursor-pointer"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <ResponsePanel title="Add" state={addState} />
                    <ResponsePanel title="Delete" state={deleteState} />
                </div>
            </div>
        </section>
    );
};

export default Network;
