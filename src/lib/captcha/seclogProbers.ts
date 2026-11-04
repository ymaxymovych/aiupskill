/**
 * Чи позначив сторож SEC-45 адресу пробником.
 *
 * Сторож (`deployment/hetzner/security-log-watch.sh`) тримає стан у
 * `/var/lib/aiab/seclog-state.json`: `{"records":[[key,last,streak,sent,supp,ban,count],…]}`.
 * `key` — IP або `IP|причина`; `ban > 0` — час бану (зберігається 7 діб). Активні
 * бани nginx і так відсікає кодом 419, тож сюди доходять адреси, чий бан уже
 * минув, — вони й вмикають режим капчі для форми.
 *
 * Файл читаємо не частіше разу на хвилину. Немає файлу (локально, CI) — умова
 * просто не спрацьовує; інші дві умови капчі від цього не залежать.
 */
import { readFile } from "node:fs/promises";

const STATE_PATH =
  process.env.SECLOG_STATE_PATH || "/var/lib/aiab/seclog-state.json";
const CACHE_MS = 60_000;
const BAN_MEMORY_SEC = 7 * 24 * 60 * 60;

let cache: { at: number; ips: Set<string> } | null = null;
let warned = false;

export function parseSeclogProbers(raw: string, nowSec: number): Set<string> {
  const ips = new Set<string>();
  const parsed = JSON.parse(raw) as { records?: unknown };
  if (!Array.isArray(parsed.records)) return ips;
  for (const rec of parsed.records) {
    if (!Array.isArray(rec) || typeof rec[0] !== "string") continue;
    const ban = Number(rec[5]);
    if (!(ban > 0) || nowSec - ban > BAN_MEMORY_SEC) continue;
    const key = rec[0].split("|")[0];
    if (key && !key.includes("/")) ips.add(key);
  }
  return ips;
}

export async function isSeclogProber(ip: string | null): Promise<boolean> {
  if (!ip) return false;
  const now = Date.now();
  if (!cache || now - cache.at > CACHE_MS) {
    try {
      cache = {
        at: now,
        ips: parseSeclogProbers(await readFile(STATE_PATH, "utf8"), now / 1000),
      };
    } catch (error) {
      if (!warned) {
        console.warn(
          `[captcha] стан SEC-45 недоступний (${STATE_PATH})`,
          error,
        );
        warned = true;
      }
      cache = { at: now, ips: cache?.ips ?? new Set() };
    }
  }
  return cache.ips.has(ip);
}
