import dns from "dns";

const originalLookup = dns.lookup;

// Force IPv4 for all DNS lookups
// This fixes the "connect ENETUNREACH" error on Render/Railway when connecting to Supabase
// because node-postgres/pg-pool sometimes defaults to IPv6 which fails in some envs.
// @ts-ignore
dns.lookup = (hostname, options, callback) => {
    if (typeof options === "function") {
        callback = options;
        options = {};
    }

    options = options || {};
    options.family = 4; // FORCE IPv4

    return originalLookup(hostname, options, callback);
};

console.log("[Setup] DNS lookup monkeypatched to force IPv4.");
