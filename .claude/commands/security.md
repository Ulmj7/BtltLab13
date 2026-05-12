---
description: OWASP Top 10-аар хариуцлагатай аюулгүй байдлын шалгалт
---

# /security — OWASP Top 10 шалгалт

URL Shortener-ийн context-д **OWASP Top 10 (2021)**-ийг шалгана. Энэ команд
бол `/review`-ээс илүү гүн, security-төвтэй аудит.

## Шалгах OWASP категориуд

### A01 — Broken Access Control
- [ ] Хэрэглэгчийн нэг богино код-ыг **зөвхөн өөрөө** засах/устгах чадвартай эсэх (хэрэв auth байгаа бол).
- [ ] Admin endpoint-уудад role check бий юу.
- [ ] IDOR — `/api/links/:id` дээр user_id шалгалт байгаа эсэх.

### A02 — Cryptographic Failures
- [ ] Богино код үүсгэхэд `crypto.randomBytes` / `nanoid` ашигласан уу — `Math.random` бол fail.
- [ ] Хэрэв нууц үг бий бол `bcrypt`/`argon2` (хувилбар 12+ rounds).
- [ ] HTTPS-ийг production-д албадан хийсэн эсэх (`trust proxy`, redirect).

### A03 — Injection
- [ ] SQL parameterized query (`$1`, `$2`) — string concat **огт байхгүй**.
- [ ] `eval`, `Function`, `child_process.exec(userInput)` ашиглаагүй эсэх.
- [ ] NoSQL inject хамаарахгүй (Postgres).
- [ ] HTML response-д user input escape хийсэн эсэх (template engine эсвэл `res.json`).

### A04 — Insecure Design
- [ ] Rate limit (`express-rate-limit` эсвэл reverse proxy) тавьсан уу — DDoS / brute force-оос.
- [ ] Богино код урт хангалттай (≥6 тэмдэгт, ≈36^6 ≈ 2.2 тэрбум) — enum дайралтаас.
- [ ] Disposable / blacklist домэйнтэй URL шалгах policy байгаа эсэх.

### A05 — Security Misconfiguration
- [ ] `helmet()` middleware идэвхтэй.
- [ ] `NODE_ENV=production`-д stack trace буцаагдахгүй.
- [ ] `X-Powered-By` header нуугдсан (`app.disable('x-powered-by')`).
- [ ] DB connection-д TLS / sslmode require тохиргоо.

### A06 — Vulnerable Components
- [ ] `npm audit` 0 high/critical.
- [ ] `package.json` дотор lock хийгдсэн major хувилбар.
- [ ] Untrusted dependency сүүлд нэмэгдсэн эсэх — git log дээр шалга.

### A07 — Identification & Auth Failures
- [ ] Session/JWT-ийн secret `.env`-аас уншигдсан, hardcoded биш.
- [ ] Cookie дээр `httpOnly`, `secure`, `sameSite: strict|lax`.
- [ ] Login endpoint дээр rate limit + timing safe compare.

### A08 — Software & Data Integrity Failures
- [ ] User-supplied URL-ийг redirect-ээс өмнө **whitelist scheme** (`http`, `https`) шалгасан уу.
- [ ] `javascript:`, `data:`, `file:` scheme block хийгдсэн эсэх.

### A09 — Security Logging Failures
- [ ] Failed redirect, rate limit hit, validation error log хийгдсэн үү.
- [ ] PII (бүтэн URL, IP) log-д орох эсэхийг тоймлосон бодлого бий юу.

### A10 — Server-Side Request Forgery
- [ ] App нь user URL руу **fetch** хийдэг үү? Тэгвэл internal IP block (`127.0.0.1`, `169.254.169.254`, RFC1918).
- [ ] DNS rebinding эсрэг хамгаалалт байгаа эсэх.

## Алхам

1. `partB/src/` доторх кодыг grep-аар уншиж дээрх category тус бүрд **status (pass/fail/N/A)** өг.
2. `npm audit --omit=dev`-ийг ажиллуулж үр дүнг хавсаргах.
3. Олдсон асуудал бүрийг **severity (Critical/High/Medium/Low)** + **зөвлөмж засвар**-аар бич.
4. Hallucination / security сэжиг олдвол `partC/AI-USAGE-REPORT.md`-д жишээ хэлбэрээр тэмдэглэхийг сануул.

## Гаргалгаа

Хүснэгт хэлбэрээр: `Category | Status | Issue | Recommendation`.
