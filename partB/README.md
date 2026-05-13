# Part B — URL Shortener (Build)

Express + PostgreSQL дээр суурилсан URL богиносгогч. Architecture-ын
дэлгэрэнгүй мэдээллийг [`../partA/ARCHITECTURE.md`](../partA/ARCHITECTURE.md)-аас
үзнэ үү.

## Setup

```bash
# 1. Хамаарлууд
cd partB
npm install

# 2. Орчны хувьсагч
cp .env.example .env
# .env-д DATABASE_URL, PORT, BASE_URL тохируулна

# 3. Schema migration
npm run migrate

# 4. Серверийг хөгжүүлэлтийн горимд асаах
npm run dev
```

## API

### `POST /api/links`

Шинэ богино холбоос үүсгэнэ.

| Талбар | Төрөл  | Заавал | Тайлбар                 |
|--------|--------|--------|-------------------------|
| `url`  | string | ✓      | `http` эсвэл `https`, ≤2048 тэмдэгт |

**Response 201**

```json
{
  "code": "aB3xQ9k",
  "url": "https://example.com/very/long/path",
  "shortUrl": "http://localhost:3000/aB3xQ9k",
  "createdAt": "2026-05-13T10:00:00.000Z"
}
```

**Алдааны хариу**

| Status | `error.code`                | Утга                                 |
|--------|-----------------------------|--------------------------------------|
| 422    | `URL_INVALID`               | URL хоосон/буруу формат/scheme буруу |
| 500    | `CODE_COLLISION_EXHAUSTED`  | 5 удаа дараалан код conflict гарсан  |

### `GET /:code`

Богино код-ыг урт URL руу 302 redirect. Click тоологчийг 1-ээр нэмнэ.

| Status | `error.code`       | Утга                  |
|--------|--------------------|-----------------------|
| 302    | —                  | Амжилттай redirect    |
| 404    | `LINK_NOT_FOUND`   | Код олдоогүй          |
| 400    | `CODE_REQUIRED`    | Код параметр хоосон   |

### `GET /healthz`

Liveness probe — `{"status":"ok"}` 200.

## Testing

```bash
# Unit тестүүд
npm test

# Coverage report
npm run test:coverage
```

- Unit тест: `tests/utils/`, `tests/services/` — repository-г mock хийнэ.
- Integration тест: `partB/tests/integration/` (одоохондоо хийгдэж байна) —
  CLAUDE.md §7-ын дагуу **бодит PostgreSQL** ашиглана.

## Архитектур

```
HTTP → routes → controller → service → repository → PostgreSQL
```

Layer-уудыг алгасахгүй. Жишээ нь controller шууд `pool.query()` дуудах нь
буруу. [`../partA/ARCHITECTURE.md`](../partA/ARCHITECTURE.md)-аас дэлгэрэнгүй.

## Lint & format

```bash
npm run lint       # ESLint v9 (eslint.config.js)
npm run lint:fix   # auto-fix
npm run format     # Prettier
```
