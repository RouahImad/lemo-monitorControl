import type { ResponsePanelProps } from "../types/ui";

const ResponsePanel = ({ title, state }: ResponsePanelProps) => {
    if (!state) return null;
    let body = "";
    if (state.loading) {
        body = "Loading...";
    } else if (state.error) {
        body = state.error;
    } else {
        body = JSON.stringify(state.data ?? {}, null, 2);
    }

    return (
        <div className="mt-4 rounded-xl border border-black/10 bg-black/2 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
                {title}
            </p>
            <pre className="mt-2 overflow-auto text-xs leading-relaxed text-black/80">
                {body}
            </pre>
        </div>
    );
};

export default ResponsePanel;
