# PROJECT.md — URL Shortener

> Хэсэг А (Plan) баримтын нэг хэсэг. Бие даалт 13 — F.CSM311.

## 1. Сонгосон сэдэв

**URL Shortener** (URL богиносгогч) — Бие даалтын даалгаврын 1-р хувилбар.

## 2. Brief (товч тайлбар)

Урт URL-ийг богино, дахин ашиглаж болохуйц код руу хөрвүүлж, тэрхүү богино
URL-аар хандсан үед хэрэглэгчийг анхны URL руу redirect хийдэг REST API
үйлчилгээ. Минимал HTML frontend нь URL оруулах, богиносгох, хуулах
үйлдлүүдийг гүйцэтгэнэ. Жижиг боловч production-д хэрэгтэй features багтсан:
**click counter** болон **expiration**.

> Жишээ: `https://example.com/blog/2026/05/very-long-article-title-here`
> → `http://localhost:3000/Ab3xK9` (богино, click тоологддог, 30 хоногт хүчинтэй)

## 3. Зорилго

### Боловсролын зорилго (Бие даалтаас)

- AI-тай хамтран ажиллах *Spec → Generate → Review → Integrate* workflow эзэмших
- Кодлогчийн "бичих" үүргээс **дизайн / верификаци / агуулга** руу шилжих
- Hallucination, security risk-ыг бодитоор олж засах туршлага
- ADR (Architecture Decision Record) бичих практик

### Техникийн зорилго (бүтээгдэхүүний)

- Богино код үүсгэх алгоритмыг найдвартай (collision-гүй) болгох
- Хандалтын статистикийг (click count) хадгалах, харуулах
- Expiration mechanism-ыг ажиллуулах (хүчингүй болсон код 410 буцаах)
- Хамгаас багадаа 10 unit test pass болсон байх
- OpenAPI 3.0 spec-ийг автоматаар үүсгэх

## 4. Scope (хамрах хүрээ)

### In scope ✅

| # | Feature                          | Тайлбар                                              |
|---|----------------------------------|------------------------------------------------------|
| 1 | URL богиносгох                   | `POST /api/links` — урт URL → богино код             |
| 2 | Богино URL-аар redirect          | `GET /:code` → 302 redirect анхны URL руу            |
| 3 | Click counter                    | Redirect бүрд `click_count` нэмэгдэнэ                |
| 4 | Expiration                       | `expires_at` талбар, хугацаа дууссан үед 410 Gone    |
| 5 | Жагсаалт + статистик             | `GET /api/links` — бүх линк, click тоо, статус       |
| 6 | Минимал frontend                 | Нэг HTML хуудас — input + button + result            |

### Out of scope ❌ (анхны хувилбарт орохгүй)

- User authentication / authorization (анх public, хэрэгцээ гарвал хойтон)
- Custom domain эсвэл custom alias
- Хандалтын дэлгэрэнгүй analytics (geo, device, referer)
- QR code үүсгэх
- Rate limiting (production-ы өмнө нэмж болно)
- Admin panel
- Email notification

> Дээрх "out of scope" features-ыг ADR-аар *future work* гэж тэмдэглэж болно.

## 5. Гол хязгаарлалтууд (constraints)

- **Хугацаа:** 2 долоо хоног, ≥15 commit ≥5 өөр өдөр
- **Үнэлгээ:** Pass / Fail — quality > quantity
- **Stack-ыг сонгосон:** Node.js + Express + PostgreSQL (ADR-001-д үндэслэл)
- **Документ:** Монгол хэлээр
- **AI ашиглалт:** Зайлшгүй, гэхдээ үнэн зарласан байх
- **Шалгалт:** AI-гүй явагдана — кодоо өөрөө тайлбарлаж чаддаг байх ёстой

## 6. Амжилтын шалгуур (definition of done)

Энэ проект амжилттай гэж үзэхийн тулд:

- [ ] `npm test` ≥10 тест pass болсон
- [ ] Үндсэн 5+ feature ажилладаг (in-scope жагсаалтаас)
- [ ] OpenAPI 3.0 spec auto-generate болсон
- [ ] CLAUDE.md шинэчлэгдэж байгаа
- [ ] ≥4 custom slash command repo-д байгаа
- [ ] AI session log ≥3 файл бичигдсэн
- [ ] Hallucination 2+ жишээ, security 1+ жишээ AI-USAGE-REPORT-д тэмдэглэгдсэн
- [ ] ADR-001 (stack), ADR-002 (architecture decision) бичигдсэн
- [ ] ≥15 commit ≥5 өөр өдөр
- [ ] SELF-EVALUATION хариулагдсан

## 7. Эрсдэлүүд (төлөвлөлтийн үе дэх)

| Эрсдэл                              | Магадлал | Нөлөө | Бууруулах арга                                |
|-------------------------------------|----------|-------|-----------------------------------------------|
| AI hallucination                    | Өндөр    | Дунд  | Тест бүхнийг ажиллуулж шалгах, doc-той тулгах |
| PostgreSQL setup-д цаг авах         | Дунд     | Дунд  | Docker Compose ашиглан хурдан асаах           |
| Богино код collision                | Бага     | Өндөр | UNIQUE constraint + retry logic               |
| Open redirect security risk         | Дунд     | Өндөр | URL-ийг http(s) форматаар validate хийх       |
| Time-rush — нэг өдөр бүгдийг хийх   | Дунд     | Өндөр | Daily plan, ≥5 өөр өдөр commit-той явах       |
| Skill atrophy (AI хэт their)        | Дунд     | Дунд  | "AI-гүй" зөв цаг гарган өөрөө бичих           |

## 8. Дараагийн алхам

Энэ файлын дараа Plan хэсэгт хийх ажил:

1. **STACK-COMPARISON.md** — 3 stack харьцуулах (Node/Express, Python/FastAPI, Go/chi)
2. **ARCHITECTURE.md** — Mermaid diagram + module description
3. **adr/0001-stack-decision.md** — ADR форматаар Node-ыг сонгосон үндэслэл
4. **partA/README.md** — draft outline
5. **ai-sessions/plan.md** — AI планинг session-ы товч

> Эдгээрийг 2-3-р өдрийн коммитуудад хувааж хийнэ.
