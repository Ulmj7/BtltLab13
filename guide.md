# GUIDE.md — URL Shortener-ийг ажиллуулах заавар

Энэ заавар нь BtltLab13 (URL Shortener) проектыг **тэг хувилбараас ажиллуулах**
бүх алхамыг агуулна. Шинэ компьютер дээр эхнээс нь дагаж явбал ажиллана.

---

## 0. Шаардлагатай зүйлс (Prerequisites)

| Хэрэглүүр   | Хувилбар   | Шалгах команд        |
|-------------|------------|----------------------|
| Node.js     | ≥ 20.0.0   | `node --version`     |
| npm         | ≥ 10       | `npm --version`      |
| PostgreSQL  | ≥ 15       | `psql --version`     |
| Git         | сүүлийн    | `git --version`      |

> **Windows** дээр PostgreSQL-ийг [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
> эсвэл Docker-аар суулгаж болно.

---

## 1. Repo татаж авах

```powershell
git clone https://github.com/Ulmj7/BtltLab13.git
cd BtltLab13
```

Бүтэц:
```
BtltLab13/
├── partA/   ← Plan баримтууд
├── partB/   ← Эх код (Node.js + Express)
├── partC/   ← Reflection
└── ...
```

Дараагийн бүх алхам `partB/` доторх Node проект дээр явагдана.

---

## 2. Хамаарлууд суулгах

```powershell
cd partB
npm install
```

Энэ нь `package.json`-д заасан 8 dependency (express, pg, helmet, zod, dotenv,
jest, prettier, eslint, …) болон тэдгээрийн transitive-уудыг татна.

---

## 3. PostgreSQL мэдээллийн сан үүсгэх

### Option A — Local installation (psql)

```powershell
# 1. psql guru shell-д орох
psql -U postgres

# 2. Мэдээллийн сан + хэрэглэгч үүсгэх
CREATE DATABASE urlshortener;
CREATE USER btltlab WITH PASSWORD 'changeme';
GRANT ALL PRIVILEGES ON DATABASE urlshortener TO btltlab;
\q
```

### Option B — Docker

```powershell
docker run --name btltlab-pg `
  -e POSTGRES_USER=btltlab `
  -e POSTGRES_PASSWORD=changeme `
  -e POSTGRES_DB=urlshortener `
  -p 5432:5432 `
  -d postgres:15
```

---

## 4. Орчны хувьсагч (`.env`)

```powershell
# partB дотор
cp .env.example .env
```

`.env`-ийг нээж дараах утгуудыг тохируул:

```ini
DATABASE_URL=postgresql://btltlab:changeme@localhost:5432/urlshortener
PORT=3000
NODE_ENV=development
BASE_URL=http://localhost:3000
```

> ⚠️ `.env`-ийг хэзээ ч git-д commit хийхгүй — `.gitignore`-д орсон.

---

## 5. Schema migration

```powershell
npm run migrate
```

Үр дүн:
```
[migrate] applied 001_create_links.sql
[migrate] done
```

Энэ нь `links` хүснэгт болон `schema_migrations` track хүснэгтийг үүсгэнэ.

---

## 6. Серверийг асаах

### Хөгжүүлэлтийн горим (file watch-тай)

```powershell
npm run dev
```

### Production горим

```powershell
npm start
```

Гарах log:
```
[server] listening on http://localhost:3000 (env=development)
```

---

## 7. API-г турших

### Богино холбоос үүсгэх

```powershell
curl -X POST http://localhost:3000/api/links `
  -H "Content-Type: application/json" `
  -d '{\"url\":\"https://example.com/very/long/path\"}'
```

Хариу:
```json
{
  "code": "aB3xQ9k",
  "url": "https://example.com/very/long/path",
  "shortUrl": "http://localhost:3000/aB3xQ9k",
  "createdAt": "2026-05-13T..."
}
```

### Богино холбоос дагах (redirect)

```powershell
curl -I http://localhost:3000/aB3xQ9k
# → HTTP/1.1 302 Found
#   Location: https://example.com/very/long/path
```

Browser-аар нээвэл шууд урт URL руу шилжинэ. Click тоологч 1-ээр нэмэгдэнэ.

### Health check

```powershell
curl http://localhost:3000/healthz
# → {"status":"ok"}
```

---

## 8. Тест ажиллуулах

```powershell
# Бүх unit тест (21 тест)
npm test

# Coverage report
npm run test:coverage
```

Coverage report `partB/coverage/lcov-report/index.html`-д үүснэ.

---

## 9. Lint & format

```powershell
npm run lint          # ESLint v9
npm run lint:fix      # auto-fix
npm run format        # Prettier write
```

Commit хийхээс өмнө lint цэвэр байх ёстой.

---

## 10. Олонтой тулгардаг алдаанууд

| Алдаа                                                       | Шалтгаан                                  | Шийдэл                                             |
|-------------------------------------------------------------|-------------------------------------------|----------------------------------------------------|
| `Error: Шаардлагатай орчны хувьсагч дутуу байна: ...`       | `.env` дутуу эсвэл буруу                  | `.env.example`-тэй харьцуулж шалгах                |
| `ECONNREFUSED 127.0.0.1:5432`                               | PostgreSQL асаагаагүй                     | `pg_ctl start` эсвэл `docker start btltlab-pg`     |
| `relation "links" does not exist`                           | Migration ажиллаагүй                      | `npm run migrate`                                  |
| `EADDRINUSE: address already in use :::3000`                | Өөр процесс 3000 портыг эзэлсэн           | `.env`-ийн `PORT`-ыг өөрчлөх эсвэл process killдах |
| Jest `SyntaxError: Cannot use import statement outside ...` | `--experimental-vm-modules` flag дутуу    | `package.json`-ийн `test` script-ийг шалгах        |
| 422 `URL_INVALID`                                           | `http`/`https` биш scheme илгээсэн        | `https://...` форматаар илгээх                     |

---

## 11. Дараагийн алхам

- `partA/PROJECT.md` — Проектийн товч, scope, амжилтын шалгуур
- `partA/ARCHITECTURE.md` — Davхаргын диаграм + дата урсгал
- `partB/README.md` — Part B-ийн дэлгэрэнгүй API reference
- `partC/` — AI ашиглалт болон сургамж

---

## Тусламж

Алдаа гарвал:
1. Дээрх "Олонтой тулгардаг алдаа" хэсгийг шалга.
2. `npm run lint` болон `npm test` ажиллуулж юу гэсэн алдаа гарч байгааг хар.
3. GitHub issue-д report хий: <https://github.com/Ulmj7/BtltLab13/issues>
