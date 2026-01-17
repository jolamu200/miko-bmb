import { hc } from "hono/client";
import { useState } from "react";
import type { RPC } from "~api/index";

const client = hc<RPC>("/");

export default function App() {
    const [data, setData] = useState<{
        data: string;
        timestamp: string;
    } | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        const res = await client.api.ok.$get();
        const json = await res.json();
        setData(json);
        setLoading(false);
    };

    return (
        <div style={{ padding: "2rem", fontFamily: "system-ui" }}>
            <h1>Hono RPC + Tanstack Router</h1>
            <button type="button" onClick={fetchData} disabled={loading}>
                {loading ? "Loading..." : "Fetch Data"}
            </button>
            {data && (
                <pre
                    style={{
                        marginTop: "1rem",
                        background: "#f5f5f5",
                        padding: "1rem",
                    }}
                >
                    {JSON.stringify(data, null, 2)}
                </pre>
            )}
        </div>
    );
}
