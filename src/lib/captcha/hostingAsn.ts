/**
 * Постійний тригер адаптивної капчі: відвідувач із мережі дата-центру (ASN
 * хостингу) отримує капчу на публічних формах завжди, незалежно від лічильника.
 *
 * Рішення security-сесії 04.11.2026: бот слав заявки через хостингові проксі
 * (3xK Tech та ін.). Повністю банити хостинги не можна — Ярослав не хоче
 * втрачати лідів, а живу людину за VPN капча пропускає одним кліком.
 *
 * НЕ хостинг (свідомо не в списку): виходи iCloud Private Relay і WARP —
 * AS54113 Fastly, AS13335 Cloudflare, Akamai (AS20940, AS16625, AS63949 Linode);
 * Google Fiber (AS16591) і загальний AS15169 Google. За 91 день логів через
 * Fastly і Cloudflare прийшло ~600 підтверджень промо від живих людей.
 *
 * Копія `apps/course/src/lib/captcha/hostingAsn.ts` (репо AIAdvisoryBoard) —
 * список тримати однаковим. База ASN — `GeoLite2-ASN.mmdb` на тому ж сервері,
 * її оновлює крон AIAB. Немає бази — тригер не спрацьовує (з одним попередженням
 * у лозі); решта умов капчі від нього не залежать.
 */
import { open, type AsnResponse, type Reader } from "maxmind";

const ASN_DB = process.env.GEOLITE_ASN_DB || "/var/lib/geolite2/GeoLite2-ASN.mmdb";
let reader: Promise<Reader<AsnResponse> | null> | null = null;

function asnReader(): Promise<Reader<AsnResponse> | null> {
  if (!reader) {
    reader = open<AsnResponse>(ASN_DB).catch((error) => {
      console.warn(`[captcha] база ASN недоступна (${ASN_DB})`, error);
      return null;
    });
  }
  return reader;
}

async function lookupAsn(ip: string): Promise<{ asn: number | null }> {
  const db = await asnReader();
  try {
    return { asn: db?.get(ip)?.autonomous_system_number ?? null };
  } catch {
    return { asn: null };
  }
}

export const HOSTING_ASNS: ReadonlyMap<number, string> = new Map([
  // Бачені 04.11.2026 на /api/promo/web-claim і free-programs:
  [200373, "3xK Tech"],
  [212238, "Datacamp (CDN77)"],
  [60068, "Datacamp (CDN77)"],
  [9009, "M247"],
  [51167, "Contabo"],
  [40021, "Contabo US"],
  [141995, "Contabo Asia"],
  [31898, "Oracle Cloud"],
  [16509, "Amazon AWS"],
  [14618, "Amazon AWS"],
  [8075, "Microsoft Azure"],
  [60781, "Leaseweb NL"],
  [28753, "Leaseweb DE"],
  [16265, "Leaseweb"],
  [59253, "Leaseweb Asia"],
  [30633, "Leaseweb US"],
  [63023, "GTHost"],
  [14061, "DigitalOcean"],
  // Поширені хостинги проксі-пулів:
  [24940, "Hetzner"],
  [16276, "OVH"],
  [20473, "Vultr (Choopa)"],
  [396982, "Google Cloud"],
  [45102, "Alibaba Cloud"],
  [132203, "Tencent Cloud"],
  [12876, "Scaleway"],
]);

export async function isHostingIp(ip: string | null): Promise<boolean> {
  if (!ip) return false;
  const { asn } = await lookupAsn(ip);
  return asn !== null && HOSTING_ASNS.has(asn);
}
