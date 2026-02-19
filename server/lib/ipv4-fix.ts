import dns from "dns";

const originalLookup = dns.lookup;

// Force IPv4 for all DNS lookups
// This fixes the "connect ENETUNREACH" error on Render/Railway when connecting to Supabase
// because node-postgres/pg-pool sometimes defaults to IPv6 which fails in some envs.
dns.lookup = ((
    hostname: string,
    options: dns.LookupOptions | number | ((...args: any[]) => void),
    callback?: (...args: any[]) => void,
) => {
    if (typeof options === "function") {
        callback = options;
        options = {};
    }

    const opts: dns.LookupOptions =
        typeof options === "number" ? { family: options } : { ...options };
    opts.family = 4; // FORCE IPv4

    return originalLookup(hostname, opts, callback as any);
}) as typeof dns.lookup;

console.log("[Setup] DNS lookup monkeypatched to force IPv4.");
