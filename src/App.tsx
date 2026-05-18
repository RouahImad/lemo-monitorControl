import { Navigate, Route, Routes } from "react-router";
import Layout from "./components/Layout";
import Home from "./routes/Home";
import Http from "./routes/Http";
import Network from "./routes/Network";
import Resources from "./routes/Resources";

const App = () => {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="resources" element={<Resources />} />
                <Route path="network" element={<Network />} />
                <Route path="http" element={<Http />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default App;
