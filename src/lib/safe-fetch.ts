import dns from "node:dns";
import http from "node:http";
import https from "node:https";
import net from "node:net";

// SEC-49 (04.11.2026): /api/ai-audit fetched any URL a visitor typed, so scanners
// used it to reach internal addresses of the server. Only public hosts on 80/443.
const blocked = new net.BlockList();
for (const [addr, prefix] of [
  ["0.0.0.0", 8],
  ["10.0.0.0", 8],
  ["100.64.0.0", 10],
  ["127.0.0.0", 8],
  ["169.254.0.0", 16],
  ["172.16.0.0", 12],
  ["192.0.0.0", 24],
  ["192.0.2.0", 24],
  ["192.168.0.0", 16],
  ["198.18.0.0", 15],
  ["198.51.100.0", 24],
  ["203.0.113.0", 24],
  ["224.0.0.0", 3],
] as const) {
  blocked.addSubnet(addr, prefix, "ipv4");
}
for (const [addr, prefix] of [
  ["::", 128],
  ["::1", 128],
  ["fc00::", 7],
  ["fe80::", 10],
  ["ff00::", 8],
  ["2001:db8::", 32],
] as const) {
  blocked.addSubnet(addr, prefix, "ipv6");
}
// Сервер, на якому живе сайт: його публічна адреса веде у власні внутрішні vhost-и.
blocked.addAddress("77.42.36.142", "ipv4");

const MAX_BYTES = 512 * 1024;
const MAX_REDIRECTS = 3;

export function isPublicAddress(address: string): boolean {
  const family = net.isIP(address);
  if (family === 4) return !blocked.check(address, "ipv4");
  if (family !== 6) return false;
  const lower = address.toLowerCase();
  const mapped = lower.match(/^(?:::ffff:|64:ff9b::)(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) return isPublicAddress(mapped[1]);
  if (lower.startsWith("::ffff:") || lower.startsWith("64:ff9b::")) return false;
  return !blocked.check(lower, "ipv6");
}

function guardedLookup(
  hostname: string,
  options: dns.LookupOptions,
  callback: (err: NodeJS.ErrnoException | null, address: string | dns.LookupAddress[], family?: number) => void,
) {
  dns.lookup(hostname, { ...options, all: true }, (err, addresses) => {
    if (err) return callback(err, "");
    const list = addresses as dns.LookupAddress[];
    if (list.length === 0 || list.some((a) => !isPublicAddress(a.address))) {
      return callback(Object.assign(new Error("blocked address"), { code: "EBLOCKED" }), "");
    }
    if (options.all) return callback(null, list);
    callback(null, list[0].address, list[0].family);
  });
}

function checkUrl(raw: string): URL {
  const url = new URL(raw);
  if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("bad protocol");
  if (url.username || url.password) throw new Error("credentials in url");
  if (url.port && url.port !== "80" && url.port !== "443") throw new Error("bad port");
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (net.isIP(host) && !isPublicAddress(host)) throw new Error("blocked address");
  return url;
}

function getOnce(url: URL, signal: AbortSignal): Promise<{ status: number; location?: string; body: string }> {
  const client = url.protocol === "https:" ? https : http;
  return new Promise((resolve, reject) => {
    const req = client.get(
      url,
      {
        lookup: guardedLookup as unknown as net.LookupFunction,
        signal,
        headers: { "User-Agent": "Mozilla/5.0 (compatible; AIUpskillBot/1.0)", Accept: "text/html" },
      },
      (res) => {
        const status = res.statusCode ?? 0;
        if (status >= 300 && status < 400) {
          res.resume();
          return resolve({ status, location: res.headers.location, body: "" });
        }
        let size = 0;
        const chunks: Buffer[] = [];
        res.on("data", (chunk: Buffer) => {
          size += chunk.length;
          if (size > MAX_BYTES) {
            req.destroy();
            return resolve({ status, body: Buffer.concat(chunks).toString("utf8") });
          }
          chunks.push(chunk);
        });
        res.on("end", () => resolve({ status, body: Buffer.concat(chunks).toString("utf8") }));
        res.on("error", reject);
      },
    );
    req.on("error", reject);
  });
}

/** Fetches a public web page as text; throws on internal addresses, odd ports or too many redirects. */
export async function fetchPublicPage(raw: string, timeoutMs = 10_000): Promise<string> {
  const signal = AbortSignal.timeout(timeoutMs);
  let url = checkUrl(raw);
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const res = await getOnce(url, signal);
    if (res.location === undefined) return res.body;
    url = checkUrl(new URL(res.location, url).toString());
  }
  throw new Error("too many redirects");
}
