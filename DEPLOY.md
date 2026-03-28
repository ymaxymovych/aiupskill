# Deploy aiupskill.live

## Швидкий deploy (одна команда для Claude Code)

```bash
cd /c/Projects/aiupskill && scp -r src/ public/ prisma/ package.json pnpm-lock.yaml root@77.42.36.142:/var/www/aiupskill.live/ && ssh root@77.42.36.142 'cd /var/www/aiupskill.live && pnpm install --frozen-lockfile && npx prisma generate --schema=prisma/schema.prisma && rm -rf .next && npx next build && pm2 restart aiupskill && echo "DEPLOYED"'
```

## Покрокова інструкція

### 1. Синхронізація файлів
```bash
cd C:\Projects\aiupskill
scp -r src/ public/ prisma/ package.json pnpm-lock.yaml root@77.42.36.142:/var/www/aiupskill.live/
```

### 2. На сервері: install + build + restart
```bash
ssh root@77.42.36.142
cd /var/www/aiupskill.live
pnpm install --frozen-lockfile
npx prisma generate --schema=prisma/schema.prisma
npx prisma db push --schema=prisma/schema.prisma --accept-data-loss  # тільки якщо змінилась schema
rm -rf .next
npx next build
pm2 restart aiupskill
```

### 3. Якщо змінились ціни (seed)
```bash
ssh root@77.42.36.142 'cd /var/www/aiupskill.live && npx tsx prisma/seed.ts'
```

### 4. Перевірка
```bash
curl -s -o /dev/null -w "%{http_code}" https://aiupskill.live/
ssh root@77.42.36.142 'pm2 logs aiupskill --lines 20'
```

## Інфраструктура

| Що | Значення |
|----|----------|
| Локальна папка | `C:\Projects\aiupskill` |
| Сервер | `root@77.42.36.142` (Hetzner) |
| Шлях на сервері | `/var/www/aiupskill.live` |
| PM2 process | `aiupskill` |
| Порт | 3008 |
| Nginx | `/etc/nginx/sites-available/aiupskill.live` → proxy localhost:3008 |
| SSL | Let's Encrypt (Certbot) |
| БД | PostgreSQL `aiupskill` (Docker: aiadvisoryboard-postgres) |
| GitHub | https://github.com/ymaxymovych/aiupskill |
| Production | https://aiupskill.live |
| .env | `/var/www/aiupskill.live/.env` (НЕ в git) |
