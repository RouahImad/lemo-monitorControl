import { Link } from "react-router";

const cards = [
    {
        to: "/resources",
        title: "Resource Alerts",
        detail: "Generate CPU, memory, or disk usage.",
    },
    {
        to: "/network",
        title: "Network Alerts",
        detail: "Start background scans on host/port.",
    },
    {
        to: "/http",
        title: "HTTP Alerts",
        detail: "Simulate Apache HTTP failures.",
    },
];

const Home = () => {
    return (
        <section className="space-y-6 min-h-[40vh] place-content-center">
            <div className="space-y-2">
                <p className="text-sm uppercase tracking-[0.25em] text-black/50">
                    Alert workflows
                </p>
                <h2 className="text-3xl font-semibold tracking-tight"></h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
                {cards.map((card) => (
                    <Link
                        key={card.to}
                        to={card.to}
                        className="group rounded-2xl border border-black/10 bg-white p-5 transition hover:border-black hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
                    >
                        <h3 className="text-lg font-semibold">{card.title}</h3>
                        <p className="mt-2 text-sm text-black/60">
                            {card.detail}
                        </p>
                        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.3em] text-black/40 transition group-hover:text-black">
                            Open
                        </p>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default Home;
