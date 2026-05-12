---
description: JSDoc + README хэсэг үүсгэх / шинэчлэх
---

# /docs — Баримтжуулалт нэмэх

Заасан функц / модуль / endpoint-д **JSDoc болон README** хэсэг бичих.

## JSDoc дүрэм

- **Зөвхөн public функц / экспортлогдсон зүйлд** JSDoc бич — private helper-ийг
  цэвэр нэрээр л үлдээ.
- Багана: `@param`, `@returns`, `@throws`, шаардлагатай бол `@example`.
- Тайлбар нэг өгүүлбэр, **WHY** төвтэй бай (WHAT-ыг код өөрөө хэлнэ).
- Type-ыг `{string}`, `{Promise<Link>}` гэх мэт TS-стилээр.

### Жишээ

```js
/**
 * Урт URL дээр түшиглэн давтагдашгүй богино код үүсгэнэ.
 * Collision гарвал шинэ код үүсгэх ажлыг repository давтана.
 *
 * @param {string} url — валидаци хийгдсэн HTTP/HTTPS URL.
 * @returns {Promise<{code: string, url: string}>}
 * @throws {AppError} URL аль хэдийн дээд хязгаарт хүрсэн үед.
 */
export async function createLink(url) { ... }
```

## README хэсгийн дүрэм

`partB/README.md` (эсвэл root `README.md`) дотор дараах хэсгүүдийг шинэчил:

1. **Setup** — `.env.example` → `.env`, `npm install`, DB migration.
2. **API reference** — endpoint бүрд: method, path, request body, response, status code.
3. **Architecture** — `partA/ARCHITECTURE.md` руу холбоос (давтаж бичихгүй).
4. **Testing** — `npm test`, coverage, integration DB-ийн заавар.

API хэсгийн жишээ:

```markdown
### POST /api/links

Шинэ богино холбоос үүсгэнэ.

| Field | Type   | Required | Тайлбар              |
|-------|--------|----------|----------------------|
| url   | string | ✓        | http/https schema    |

**Response 201**
` ` `json
{ "code": "aB3xQ9", "shortUrl": "http://localhost:3000/aB3xQ9" }
` ` `

**Errors:** 422 (invalid URL), 500.
```

## Алхам

1. Юу баримтжуулахыг тодруул (файл, функц, endpoint).
2. `partA/ARCHITECTURE.md`-тай давхардсан зүйл байвал давтахгүй, **холбоос** хий.
3. Шинэчилсний дараа README-гийн API table одоо ажиллаж буй кодтой тохирч
   байгаа эсэхийг шалгаарай.
