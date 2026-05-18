import { useState } from "react";
import ResponsePanel from "../components/ResponsePanel";
import type { ResponseState } from "../types/ui";
import {
    generateResources,
    stopResourceGeneration,
    spikeResource,
} from "../services/api";

const Resources = () => {
    const [count, setCount] = useState("3");
    const [intervalMs, setIntervalMs] = useState("1500");
    const [infinite, setInfinite] = useState(false);

    const [target, setTarget] = useState("cpu");
    const [delta, setDelta] = useState("80");
    const [durationMs, setDurationMs] = useState("15000");

    const [generateState, setGenerateState] = useState<ResponseState | null>(
        null,
    );
    const [stopState, setStopState] = useState<ResponseState | null>(null);
    const [spikeState, setSpikeState] = useState<ResponseState | null>(null);

    const onGenerate = async () => {
        const countValue = Number(count);
        const intervalValue = Number(intervalMs);
        if (!infinite && (!Number.isFinite(countValue) || countValue <= 0)) {
            setGenerateState({ error: "Count must be a positive number." });
            return;
        }
        if (!Number.isFinite(intervalValue) || intervalValue < 0) {
            setGenerateState({ error: "Interval must be zero or higher." });
            return;
        }

        setGenerateState({ loading: true });
        try {
            const data = await generateResources({
                count: countValue,
                intervalMs: intervalValue,
                infinite,
            });
            setGenerateState({ data });
        } catch (error: any) {
            setGenerateState({
                error: String(error?.error ?? "Failed to generate resources."),
            });
        }
    };

    const onStop = async () => {
        setStopState({ loading: true });
        try {
            const data = await stopResourceGeneration();
            setStopState({ data });
        } catch (error: any) {
            setStopState({
                error: String(
                    error?.error ?? "Failed to stop resource generation.",
                ),
            });
        }
    };

    const onSpike = async () => {
        const deltaValue = Number(delta);
        const durationValue = Number(durationMs);
        if (!Number.isFinite(deltaValue)) {
            setSpikeState({ error: "Delta must be a valid number." });
            return;
        }
        if (!Number.isFinite(durationValue) || durationValue <= 0) {
            setSpikeState({ error: "Duration must be greater than 0." });
            return;
        }

        setSpikeState({ loading: true });
        try {
            const data = await spikeResource({
                target,
                delta: deltaValue,
                durationMs: durationValue,
            });
            setSpikeState({ data });
        } catch (error: any) {
            setSpikeState({
                error: String(error?.error ?? "Failed to inject spike."),
            });
        }
    };

    return (
        <section className="space-y-10">
            <div>
                <p className="text-sm uppercase tracking-[0.25em] text-black/50">
                    Resource Alerts
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-black/10 bg-white p-6">
                    <h3 className="text-lg font-semibold">Generate events</h3>
                    <div className="mt-4 grid gap-4">
                        <label className="grid gap-2 text-sm">
                            Count (ignored in infinite mode)
                            <input
                                value={count}
                                onChange={(event) =>
                                    setCount(event.target.value)
                                }
                                className="rounded-lg border border-black/20 px-3 py-2"
                                type="number"
                                min={1}
                                disabled={infinite}
                            />
                        </label>
                        <label className="grid gap-2 text-sm">
                            Interval (ms)
                            <input
                                value={intervalMs}
                                onChange={(event) =>
                                    setIntervalMs(event.target.value)
                                }
                                className="rounded-lg border border-black/20 px-3 py-2"
                                type="number"
                                min={0}
                            />
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                checked={infinite}
                                onChange={(event) =>
                                    setInfinite(event.target.checked)
                                }
                                type="checkbox"
                                className="h-4 w-4 border border-black/40"
                            />
                            Run continuously
                        </label>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-3">
                        <button
                            onClick={onGenerate}
                            className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white cursor-pointer"
                        >
                            Start generation
                        </button>
                        <button
                            onClick={onStop}
                            className="rounded-full border border-black/30 px-5 py-2 text-sm font-semibold cursor-pointer"
                        >
                            Stop generation
                        </button>
                    </div>
                    <ResponsePanel title="Generation" state={generateState} />
                    <ResponsePanel title="Stop" state={stopState} />
                </div>

                <div className="rounded-2xl border border-black/10 bg-white p-6">
                    <h3 className="text-lg font-semibold">Inject spike</h3>
                    <div className="mt-4 grid gap-4">
                        <label className="grid gap-2 text-sm">
                            Target
                            <select
                                value={target}
                                onChange={(event) =>
                                    setTarget(event.target.value)
                                }
                                className="rounded-lg border border-black/20 px-3 py-2"
                            >
                                <option value="cpu">CPU</option>
                                <option value="memory">Memory</option>
                                <option value="disk">Disk</option>
                            </select>
                        </label>
                        <label className="grid gap-2 text-sm">
                            Delta (percentage points)
                            <input
                                value={delta}
                                onChange={(event) =>
                                    setDelta(event.target.value)
                                }
                                className="rounded-lg border border-black/20 px-3 py-2"
                                type="number"
                            />
                        </label>
                        <label className="grid gap-2 text-sm">
                            Duration (ms)
                            <input
                                value={durationMs}
                                onChange={(event) =>
                                    setDurationMs(event.target.value)
                                }
                                className="rounded-lg border border-black/20 px-3 py-2"
                                type="number"
                                min={1}
                            />
                        </label>
                    </div>
                    <div className="mt-5">
                        <button
                            onClick={onSpike}
                            className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white cursor-pointer"
                        >
                            Apply spike
                        </button>
                    </div>
                    <ResponsePanel title="Spike" state={spikeState} />
                </div>
            </div>
        </section>
    );
};

export default Resources;
