import { useState } from "react";
import ResponsePanel from "../components/ResponsePanel";
import type { ResponseState } from "../types/ui";
import {
    simulateApache,
    simulateApacheBan,
    simulateApacheForce,
} from "../services/api";

const Http = () => {
    const [simpleCount, setSimpleCount] = useState("2");
    const [simpleStatus, setSimpleStatus] = useState("500");
    const [simpleMethod, setSimpleMethod] = useState("get");
    const [simpleDefault, setSimpleDefault] = useState(false);

    const [forceCount, setForceCount] = useState("10");
    const [forceStatus, setForceStatus] = useState("401");
    const [forceIp, setForceIp] = useState("");

    const [banUserId, setBanUserId] = useState("");

    const [simpleState, setSimpleState] = useState<ResponseState | null>(null);
    const [forceState, setForceState] = useState<ResponseState | null>(null);
    const [banState, setBanState] = useState<ResponseState | null>(null);

    const isValidIpv4 = (value: string) => {
        const parts = value.split(".");
        if (parts.length !== 4) return false;
        return parts.every((part) => {
            if (!/^\d{1,3}$/.test(part)) return false;
            const num = Number(part);
            return num >= 0 && num <= 255;
        });
    };

    const onSimulateSimple = async () => {
        const countValue = Number(simpleCount);
        if (!Number.isInteger(countValue) || countValue <= 0) {
            setSimpleState({ error: "Count must be a positive integer." });
            return;
        }

        setSimpleState({ loading: true });
        try {
            const data = await simulateApache({
                count: countValue,
                method: simpleMethod,
                status: simpleStatus,
                useDefault: simpleDefault,
            });
            setSimpleState({ data });
        } catch (error: any) {
            setSimpleState({
                error: String(error?.error ?? "Failed to simulate Apache."),
            });
        }
    };

    const onSimulateForce = async () => {
        const countValue = Number(forceCount);
        if (!Number.isInteger(countValue) || countValue <= 0) {
            setForceState({ error: "Count must be a positive integer." });
            return;
        }

        if (forceStatus !== "401" && forceStatus !== "403") {
            setForceState({
                error: "Force simulation requires status 401 or 403.",
            });
            return;
        }

        const trimmedForceIp = forceIp.trim();
        if (trimmedForceIp.length > 0 && !isValidIpv4(trimmedForceIp)) {
            setForceState({ error: "IP must be a valid IPv4 address." });
            return;
        }

        setForceState({ loading: true });
        try {
            const data = await simulateApacheForce({
                count: countValue,
                method: "post",
                status: forceStatus,
                ip: trimmedForceIp.length > 0 ? trimmedForceIp : undefined,
            });
            setForceState({ data });
        } catch (error: any) {
            setForceState({
                error: String(
                    typeof error === "string"
                        ? error
                        : (error?.error ?? "Failed to simulate brute force."),
                ),
            });
        }
    };

    const onSimulateBan = async () => {
        const trimmedUserId = banUserId.trim();
        if (
            trimmedUserId.length > 0 &&
            !Number.isInteger(Number(trimmedUserId))
        ) {
            setBanState({ error: "User ID must be a number." });
            return;
        }

        setBanState({ loading: true });
        try {
            const data = await simulateApacheBan(
                trimmedUserId.length > 0 ? trimmedUserId : "",
            );
            setBanState({ data });
        } catch (error: any) {
            setBanState({
                error: String(error?.error ?? "Failed to simulate ban."),
            });
        }
    };

    return (
        <section className="space-y-10">
            <div>
                <p className="text-sm uppercase tracking-[0.25em] text-black/50">
                    HTTP Alerts
                </p>
            </div>

            <div className="grid gap-6">
                <div className="rounded-2xl border border-black/10 bg-white p-6">
                    <h3 className="text-lg font-semibold">Simple HTTP logs</h3>
                    <div className="mt-4 grid gap-4">
                        <label className="grid gap-2 text-sm">
                            Number of logs
                            <input
                                value={simpleCount}
                                onChange={(event) =>
                                    setSimpleCount(event.target.value)
                                }
                                className="rounded-lg border border-black/20 px-3 py-2"
                                type="number"
                                min={1}
                            />
                        </label>
                        <label className="grid gap-2 text-sm">
                            HTTP method
                            <select
                                value={simpleMethod}
                                onChange={(event) =>
                                    setSimpleMethod(event.target.value)
                                }
                                className="rounded-lg border border-black/20 px-3 py-2"
                            >
                                <option value="get">GET</option>
                                <option value="post">POST</option>
                                <option value="put">PUT</option>
                                <option value="delete">DELETE</option>
                            </select>
                        </label>
                        <label className="grid gap-2 text-sm">
                            Status code
                            <select
                                value={simpleStatus}
                                onChange={(event) =>
                                    setSimpleStatus(event.target.value)
                                }
                                className="rounded-lg border border-black/20 px-3 py-2"
                            >
                                <option value="200">200 OK</option>
                                <option value="400">400 Bad Request</option>
                                <option value="401">401 Unauthorized</option>
                                <option value="403">403 Forbidden</option>
                                <option value="500">500 Server Error</option>
                            </select>
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                checked={simpleDefault}
                                onChange={(event) =>
                                    setSimpleDefault(event.target.checked)
                                }
                                type="checkbox"
                                className="h-4 w-4 border border-black/40"
                            />
                            Use default payload
                        </label>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-3">
                        <button
                            onClick={onSimulateSimple}
                            className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white cursor-pointer"
                        >
                            Simulate
                        </button>
                    </div>
                    <ResponsePanel
                        title="Simple simulation"
                        state={simpleState}
                    />
                </div>
                <div className="rounded-2xl border border-black/10 bg-white p-6">
                    <h3 className="text-lg font-semibold">Brute force logs</h3>
                    <div className="mt-4 grid gap-4">
                        <label className="grid gap-2 text-sm">
                            Number of logs
                            <input
                                value={forceCount}
                                onChange={(event) =>
                                    setForceCount(event.target.value)
                                }
                                className="rounded-lg border border-black/20 px-3 py-2"
                                type="number"
                                min={1}
                            />
                        </label>
                        <label className="grid gap-2 text-sm">
                            Status code
                            <select
                                value={forceStatus}
                                onChange={(event) =>
                                    setForceStatus(event.target.value)
                                }
                                className="rounded-lg border border-black/20 px-3 py-2"
                            >
                                <option value="401">401 Unauthorized</option>
                                <option value="403">403 Forbidden</option>
                            </select>
                        </label>
                        <label className="grid gap-2 text-sm">
                            Source IP
                            <input
                                value={forceIp}
                                onChange={(event) =>
                                    setForceIp(event.target.value)
                                }
                                className="rounded-lg border border-black/20 px-3 py-2"
                                type="text"
                                inputMode="decimal"
                                placeholder="e.g. 203.0.113.10"
                            />
                        </label>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-3">
                        <button
                            onClick={onSimulateForce}
                            className="rounded-full border border-black/20 px-5 py-2 text-sm font-semibold text-black cursor-pointer"
                        >
                            Simulate brute force
                        </button>
                    </div>
                    <ResponsePanel
                        title="Brute force simulation"
                        state={forceState}
                    />
                </div>
                <div className="rounded-2xl border border-black/10 bg-white p-6">
                    <h3 className="text-lg font-semibold">Ban logs</h3>
                    <div className="mt-4 grid gap-4">
                        <label className="grid gap-2 text-sm">
                            User ID (optional)
                            <input
                                value={banUserId}
                                onChange={(event) =>
                                    setBanUserId(event.target.value)
                                }
                                className="rounded-lg border border-black/20 px-3 py-2"
                                type="text"
                                inputMode="numeric"
                                placeholder="e.g. 1234"
                            />
                        </label>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-3">
                        <button
                            onClick={onSimulateBan}
                            className="rounded-full border border-black/20 px-5 py-2 text-sm font-semibold text-black cursor-pointer"
                        >
                            Simulate ban
                        </button>
                    </div>
                    <ResponsePanel title="Ban simulation" state={banState} />
                </div>
            </div>
        </section>
    );
};

export default Http;
