---
description: Одоогийн өөрчлөлтөд security + robustness review хийх
---

# /review — Кодын чанарын шүүлт

Дараах өөрчлөлтүүдийг (staged + working tree, эсвэл хэрэглэгчийн заасан файл/PR)
**аюулгүй байдал, найдвартай байдал, кодын чанарын** үүднээс шалга.

## 1. Эхлэх алхам

1. `git status` болон `git diff` ажиллуулж, ямар өөрчлөлт орсныг тогтоо.
2. Хэрэв нэгээс олон файл оролцсон бол өөрчлөлтийг logical блокт хуваа.
3. `CLAUDE.md`-г уншиж convention-уудыг сэргээ (§5, §6, §10, §11).

## 2. Шалгах жагсаалт

### Security (CLAUDE.md §11)
- [ ] SQL query параметризэйлэгдсэн үү? String concat-аар query үүсгэсэн эсэх.
- [ ] User input-ыг `eval`, `exec`, child_process.exec руу шууд өгсөн эсэх.
- [ ] Redirect URL (`res.redirect`) validate хийгдсэн үү? Open redirect эрсдэл бий юу.
- [ ] Богино код үүсгэхэд `crypto.randomBytes` ашигласан уу? `Math.random` бол алдаа.
- [ ] `.env`-ийн secret хатуугаар bake хийгдсэн эсэх.
- [ ] CORS, rate limit, helmet middleware идэвхтэй юу.
- [ ] User-controlled string-ийг log-д direct оруулж log injection эрсдэл үүсгэсэн эсэх.

### Robustness
- [ ] Async функц try/catch эсвэл Express error middleware-аар хамгаалагдсан уу.
- [ ] DB connection pool released/closed эсэх (finally блок).
- [ ] Edge case: хоосон string, маш урт URL, давхардсан богино код, expired link.
- [ ] HTTP status code зөв сонгогдсон уу (400 / 404 / 409 / 422 / 500).
- [ ] Race condition эрсдэлтэй газар (богино код үүсгэх + INSERT) транзакц/UNIQUE constraint-аар хамгаалагдсан уу.

### Code quality (CLAUDE.md §5–§6)
- [ ] ES modules, async/await — `.then()` chain байхгүй.
- [ ] Layer-уудыг алгасаагүй (controller → DB шууд биш).
- [ ] Naming: `kebab-case.js`, `camelCase`, `UPPER_SNAKE_CASE`.
- [ ] Validation request boundary дээр хийгдсэн (Zod эсвэл express-validator).
- [ ] Custom `AppError` ашигласан уу, эсвэл шууд `throw new Error('...')` уу.

## 3. Гаргалгаа

- Олдсон асуудал бүрийг **Severity (High/Medium/Low)** болон **файл:мөр**-тэй
  жагсаа.
- Тус бүрд **зөвлөмж засвар**-ыг код блок хэлбэрээр санал болго.
- Hallucination/security сэжиг олдвол `partC/AI-USAGE-REPORT.md`-д тэмдэглэхийг сануул.

Хэрэв ноцтой алдаа байхгүй бол "Approved — мерж хийхэд бэлэн" гэж бич.
