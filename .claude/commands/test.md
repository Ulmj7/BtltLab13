---
description: Testing pyramid-аар edge case-тэй Jest тест үүсгэх
---

# /test — Jest тест үүсгэх

Заасан файл / функц / endpoint-ийн **тестийн пирамид**-д нийцсэн тест бичих.

## Дүрэм (CLAUDE.md §7)

- **Unit > integration > e2e** (нийт ≥10 unit test).
- **Integration тестүүдэд `pg`-ийг mock хийхгүй** — бодит PostgreSQL test DB
  ашиглана.
- Тест файлын байршил: `partB/tests/<layer>/<нэр>.test.js`.
- Описание (`describe`) монгол эсвэл англиар бичиж болно, гэхдээ нэг файлд
  тогтвортой бай.

## Алхам

1. Туршигдах функц/endpoint-ийг уншиж, **public contract**-ыг тодорхойл.
2. Дараах case-ийн **тус бүрд дор хаяж нэг тест** бичигдсэн эсэхийг шалга:
   - **Happy path** — нормал input, ожиданий output.
   - **Boundary** — хоосон string, 1 тэмдэгт, max length (URL ≤2048 байт).
   - **Invalid input** — `null`, `undefined`, буруу формат, тоо вместо string.
   - **Database edge case** — давхардсан unique key (богино код conflict),
     олдоогүй row, transaction rollback.
   - **HTTP edge case (controller layer)** — 400, 404, 409, 422, 500.
3. Тест бүр **AAA** (Arrange / Act / Assert) бүтэцтэй бай.
4. `beforeEach` / `afterEach`-д тест DB-г цэвэрлэ (`TRUNCATE links CASCADE`).
5. Snapshot тест бүү хэрэглэ — хэт fragile.

## Жишээ skeleton

```js
import request from 'supertest';
import { app } from '../../src/app.js';
import { pool } from '../../src/db/pool.js';

describe('POST /api/links', () => {
  afterAll(async () => {
    await pool.end();
  });

  beforeEach(async () => {
    await pool.query('TRUNCATE links CASCADE');
  });

  it('богино код үүсгэж 201 буцаана', async () => {
    const res = await request(app)
      .post('/api/links')
      .send({ url: 'https://example.com' });

    expect(res.status).toBe(201);
    expect(res.body.code).toMatch(/^[a-zA-Z0-9]{6,}$/);
  });

  it('хоосон URL дээр 422 буцаана', async () => {
    const res = await request(app).post('/api/links').send({ url: '' });
    expect(res.status).toBe(422);
  });
});
```

## Гаргалгаа

Шинээр нэмсэн тестийн тоо, ямар edge case хамарсан, coverage хэдэн хувь
нэмэгдсэнийг товч мэдэгд.
