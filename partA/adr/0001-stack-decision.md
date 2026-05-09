# ADR-0001 — Stack-ийн сонголт: Node.js + Express + PostgreSQL

- **Дугаар:** 0001
- **Гарчиг:** URL Shortener-д Node.js + Express + PostgreSQL stack ашиглах
- **Огноо:** 2026-05-08
- **Төлөв:** Accepted (хүлээн зөвшөөрсөн)
- **Шийдвэрлэгчид:** Ulmj (оюутан), Claude Code (зөвлөх)
- **Холбогдох баримт:** [`STACK-COMPARISON.md`](../STACK-COMPARISON.md),
  [`PROJECT.md`](../PROJECT.md), [`../../CLAUDE.md`](../../CLAUDE.md)

## 1. Context (нөхцөл байдал)

Бие даалт 13 нь *AI-Assisted Software Construction* лекцийн зорилгод нийцсэн
жижиг проект бүтээхийг шаарддаг. Сонгосон сэдэв — URL Shortener — нь дараах
техникийн ачаалалтай:

- REST API (POST /api/links, GET /:code, GET /api/links)
- Persistent storage (links + click_count + expires_at)
- HTML frontend (минимал)
- ≥10 unit test
- OpenAPI 3.0 spec
- 2 долоо хоногийн хугацаа

Үүнээс гадна *AI-гүйгээр явагдах шалгалт* нь stack сонголтод хатуу нөлөөлж
байна — оюутан кодоо өөрөө тайлбарлаж чаддаг хэлийг сонгох ёстой.

`STACK-COMPARISON.md`-д 3 stack-ийг 8 шалгуураар үнэлсэн.

## 2. Decision (шийдвэр)

**Node.js 20 + Express 4 + PostgreSQL 15-ийг сонгов.**

- Хэл: JavaScript (ES2022+, ES modules)
- Web framework: Express 4
- Database: PostgreSQL 15+
- DB driver: `pg` (`node-postgres`)
- Тест: Jest + Supertest
- Validation: Zod
- Lint/format: ESLint + Prettier
- Dev server: nodemon

## 3. Үндсэн шалтгаанууд

### 3.1. Шалгалт AI-гүйгээр явагдана

Бие даалтын тэмдэглэлд "AI 'бичсэн' нь 'чи мэддэг' гэсэн үг биш — кодынхоо
тал бүрийг ӨӨРӨӨ тайлбарлаж чадах ёстой" гэж онцлон бичсэн. JavaScript нь
оюутны өмнөх хичээлүүдэд эзэмшсэн хэл — Python-ыг гүн ашиглах туршлага бараг
байхгүй; Go-г огт мэддэггүй. Тиймээс шалгалтын эрсдэлийг хамгийн бага
байлгахын тулд танил хэлээ сонгов.

### 3.2. AI training data-гийн өргөн хүрээ

Express нь дэлхий дээрх хамгийн өргөн ашиглагддаг минимал backend framework-ийн
нэг. AI-ийн санал болгодог код-д hallucination гарах магадлал FastAPI болон
Go/chi-той харьцуулахад мэдэгдэхүйц бага. Энэ нь *Spec → Generate → Review →
Integrate* workflow-д ашигтай — review-нд цаг хэмнэнэ.

### 3.3. Хөгжүүлэлтийн хурд

2 долоо хоногт 5 feature + ≥10 test + 4+ slash command + AI session log хийх
шаардлагатай. Express минимал boilerplate-той, npm ecosystem (helmet, cors,
dotenv, swagger-jsdoc г.м.) бэлэн tooling-той тул цаг хэмнэнэ.

### 3.4. CLAUDE.md convention бэлэн

Repo root дахь `CLAUDE.md`-д Node.js stack-д тулгуурласан build команд, layer
бүтэц, no-go zones-ыг тохируулсан. Stack солихыг хүсвэл бүх зааврыг дахин бичих
ёстой — энэ нь шаардлагагүй ажил.

## 4. Бусад сонголтуудыг яагаад татгалзсан

### 4.1. Python + FastAPI

FastAPI-ийн **давуу тал** болох OpenAPI auto-gen нь үнэхээр сэтгэл татам — Б
хэсгийн `openapi.yaml` шаардлагыг шууд хангаж чадна. Гэвч **сул талууд** илүү
хүнд:

- Оюутан Python-ыг гүн мэддэггүй; AI-аар үүсгэсэн код-ыг review хийх боломж
  Node-той харьцуулахад **бага**
- Шалгалтын үед AI байхгүй ч бие даалтын кодыг тайлбарлах ёстой нь өндөр эрсдэл
- Pydantic v1 vs v2-ийн API өөрчлөлт AI hallucination-ы өргөн talked example

OpenAPI асуудлыг `swagger-jsdoc`-аар Node-д шийдэх боломжтой тул FastAPI-ийн
давуу тал хангалттай биш.

### 4.2. Go + chi

Go нь runtime алдаа цөөнтэй, гүйцэтгэл өндөртэй боловч:

- Оюутан Go-г огт мэддэггүй — *learn + build*-ыг 2 долоо хоногт нэгэн зэрэг
  хийх нь хэт өндөр ачаалал
- Boilerplate (handler, struct, error wrapping) бичих хэмжээ хамгийн их
- Шалгалтад өөрөө тайлбарлах боломж бараг тэг
- *Skill atrophy* (бичих чадвар буурах) эрсдэл хамгийн өндөр

URL Shortener-д Go-ийн гүйцэтгэл хэрэгцээгүй — хичээлийн хэмжээний load.

## 5. Consequences (үр дагавар)

### 5.1. Эерэг

- Шалгалтад өөрөө тайлбарлах магадлал өндөр
- AI hallucination бага → review-нд цаг хэмнэнэ
- npm ecosystem нь шаардлагатай tool-уудтай (`pg`, `jest`, `supertest`, `zod`,
  `dotenv`, `helmet`, `swagger-jsdoc`)
- CLAUDE.md болон convention-уудыг шинэчлэх шаардлагагүй

### 5.2. Сөрөг

- OpenAPI spec auto-generate FastAPI шиг inline биш — `swagger-jsdoc`-аар
  JSDoc-оос үүсгэх эсвэл `openapi.yaml`-ийг гарын ажлаар бичих хэрэгтэй
- TypeScript-гүй plain JS-д runtime type алдаа орох эрсдэл — Zod schema
  validation-аар request boundary дээр шалгана
- Async error handling middleware-ийг өөрөө config хийх ёстой
  (`express-async-errors` эсвэл custom wrapper)

### 5.3. Төвийг сахисан

- Express 4 vs 5: Express 5 саяхан stable болсон ч production-д Express 4
  илүү тогтвортой ашиглагддаг. **Express 4-ийг сонгов** — middleware
  ecosystem илүү мэдээлэлтэй
- ES modules vs CommonJS: ES modules сонгов (CLAUDE.md §5)
- npm vs pnpm vs yarn: npm — анхны setup-д хамгийн энгийн

## 6. Шалгуурууд (review checkpoints)

Энэхүү шийдвэр доорх нөхцөлүүд бий болбол **дахин үнэлэх ёстой**:

- npm ecosystem дахь шаардлагатай tool үгүй болохыг олж мэдсэн
- Express 4-ийн нэг security CVE гарсан бөгөөд patch удаашрч байгаа
- Багш нэмэлт шаардлага тавьж тус нь Node-д тохирохгүй болсон

Дээрх нөхцлийн нэг ч биелэхгүй бол шийдвэр хүчинтэй.

## 7. AI ашиглалт энэ ADR-д

Энэ ADR-ийг Claude Code-той хамтран бичсэн. AI-ийн хувь нэмэр:

- 3 stack харьцуулалтын анхны draft (`STACK-COMPARISON.md`)
- ADR форматын skeleton санал болгосон
- Express 4 vs 5-ийн ялгааны мэдээлэл

Хүн (оюутан) хийсэн:

- Эцсийн сонголт (Node.js)
- *Шалгалт AI-гүйгээр явагдана* шалгуурыг гол үндэслэл болгож тодорхойлсон
- AI-ийн санал болгосон "Pydantic v2" талаарх мэдэгдлийг шалгаж зассан
- Бичвэрийн монгол хэлний нарийвчлал

> AI session-ы товчилсон бичлэгийг ирээдүйд `ai-sessions/plan.md`-д хадгална.
