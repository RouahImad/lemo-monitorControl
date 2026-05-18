import { NavLink, Outlet } from "react-router";
import ToastStack from "./ToastStack";

const navItems = [
    { to: "/", label: "Overview" },
    { to: "/resources", label: "Resources" },
    { to: "/network", label: "Network" },
    { to: "/http", label: "HTTP" },
];

const Layout = () => {
    return (
        <div className="app-shell min-h-screen text-black">
            <ToastStack />
            <header className="border-b border-black/10 bg-white/80 backdrop-blur">
                <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-6 px-6 py-4">
                    <div>
                        {/* <p className="text-xs uppercase tracking-[0.4em] text-black/50">
                            Lemo Monitor
                        </p> */}
                        <h1 className="text-3xl font-semibold tracking-tight">
                            Alerts
                        </h1>
                    </div>
                    <nav className="flex flex-wrap items-center gap-3 text-sm">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    "rounded-full border px-5 py-2 transition " +
                                    (isActive
                                        ? "border-black bg-black text-white"
                                        : "border-black/15 bg-white/80 text-black/70 hover:border-black")
                                }
                                end
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>
            </header>
            <main className="mx-auto w-full max-w-6xl px-6 py-10 min-h-[85vh] place-content-center">
                <div className="rounded-[28px] border border-black/10 bg-white/90 p-6 shadow-[0_30px_60px_rgba(0,0,0,0.08)] md:p-10">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
