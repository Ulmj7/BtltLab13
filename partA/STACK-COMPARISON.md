# STACK-COMPARISON.md — Stack-ийн харьцуулалт

> А хэсэг (Төлөвлөлт)-ийн баримт. URL Shortener-ийг хэрэгжүүлэхэд тохирох
> 3 stack-ийг нийтлэг шалгуураар харьцуулж, сонголтын шалтгааныг тэмдэглэв.
> Дэлгэрэнгүй албан ёсны шийдвэрийг [`adr/0001-stack-decision.md`](adr/0001-stack-decision.md)-аас үзнэ үү.

## 1. Харьцуулалтад орсон stack-үүд

| # | Stack                              | Үүрэг                                              |
|---|------------------------------------|----------------------------------------------------|
| 1 | **Node.js + Express + PostgreSQL** | Тогтсон, өргөн тархсан backend stack               |
| 2 | **Python + FastAPI + PostgreSQL**  | Async-friendly, OpenAPI auto-gen-тэй               |
| 3 | **Go + chi + PostgreSQL**          | Compile-тэй, гүйцэтгэл өндөртэй, hand-coded стиль  |

> PostgreSQL гурван хувилбарт ижил ашиглагдсан тул DB-ийн ялгаа харьцуулалтад
> нөлөөлсөнгүй. Бүх хувилбар REST API + минимал HTML frontend хийнэ гэж үзлээ.

## 2. Шалгуурууд

Бие даалт 13-ын *AI-Assisted Software Construction* зорилгод нийцүүлэн дараах
8 шалгуураар дүгнэв:

1. **Хэлний танил байдал** — оюутны өмнөх туршлага
2. **AI training data-гийн хэмжээ** — AI санал болгох гэрэл, чанар
3. **Boilerplate хэмжээ** — feature нэмэхэд хэдэн файл шинэ үүсэх
4. **OpenAPI 3.0 auto-gen** — бие даалтын Б хэсгийн шаардлагын нэг
5. **Тестийн ecosystem** — unit + integration тест хийхэд бэлэн tooling
6. **DB driver-ийн чанар** — PostgreSQL ашиглах туршлага
7. **Хөгжүүлэлтийн хурд** — анх ажиллах хувилбарт хүрэх цаг
8. **Production readiness** — deploy хийхэд орохгүй чадварууд

## 3. Харьцуулалтын матриц

> Үнэлгээ: ★★★ маш сайн · ★★ дунд · ★ сул

| Шалгуур                          | Node.js+Express | Python+FastAPI | Go+chi |
|----------------------------------|:---------------:|:--------------:|:------:|
| 1. Хэлний танил байдал           |       ★★★       |      ★★        |   ★    |
| 2. AI training data              |       ★★★       |      ★★★       |   ★★   |
| 3. Boilerplate хэмжээ (бага нь сайн) | ★★          |      ★★★       |   ★    |
| 4. OpenAPI auto-gen              |       ★★        |      ★★★       |   ★★   |
| 5. Тестийн ecosystem             |       ★★★       |      ★★★       |   ★★   |
| 6. PostgreSQL driver чанар       |       ★★★       |      ★★★       |   ★★★  |
| 7. Хөгжүүлэлтийн хурд            |       ★★★       |      ★★★       |   ★★   |
| 8. Production readiness          |       ★★★       |      ★★★       |   ★★★  |

## 4. Stack тус бүрийн дэлгэрэнгүй

### 4.1. Node.js + Express + PostgreSQL ✅ (сонгосон)

**Давуу тал:**
- JavaScript / Node.js нь оюутанд танил, өмнөх хичээлүүдэд хэрэглэгдсэн
- Express нь хамгийн өргөн ашиглагддаг минимал backend framework. AI training
  data маш их, hallucination гарах магадлал бага
- `pg` (`node-postgres`) нь хүчирхэг, parameterized query-г төрөлх дэмждэг
- Jest + Supertest хослол нь unit + integration тестийн стандарт шийдэл
- npm ecosystem — шаардлагатай tool бараг бүгд бэлэн (nodemon, ESLint, dotenv, helmet)

**Сул тал:**
- OpenAPI auto-gen FastAPI шиг inline биш — `swagger-jsdoc` эсвэл OpenAPI
  тодорхойлолтыг гар дээр бичиж тохируулах шаардлагатай
- Express middleware-ийн async error handling өөрөө config хийх ёстой
- TypeScript-гүй plain JS-д runtime type алдаа орох эрсдэлтэй

### 4.2. Python + FastAPI + PostgreSQL

**Давуу тал:**
- FastAPI нь Pydantic-ээр request validation, OpenAPI документыг автоматаар үүсгэдэг —
  Б хэсгийн `openapi.yaml` шаардлагад **хамгийн ойр**
- Async/await төрөлх дэмжлэгтэй
- Pytest ecosystem нь маш цэвэрхэн, fixture-ийн загвар хүчирхэг
- SQLAlchemy эсвэл `asyncpg` хоёр сонголт

**Сул тал:**
- Оюутан Python-ыг гүнзгий мэддэггүй; AI санал болгосон код алдартай framework
  байсан ч өөрөө review хийхэд ХҮНДРЭЛТЭЙ
- Шалгалт *AI-гүйгээр* явагдах тул "өөрөө мэддэг хэл" нь чухал
- Virtual env, dependency management (poetry/pip) эхлэлд илүү setup
- Багш Node.js-ийг илүү хүлээж авдаг гэх мэдээлэл

### 4.3. Go + chi + PostgreSQL

**Давуу тал:**
- Compile-той, type safety өндөр — runtime алдаа бага
- Гүйцэтгэл маш өндөр (URL shortener-ийн ирээдүйн scaling-д тохиромжтой)
- Single binary deployment маш хялбар
- `database/sql` + `pgx` driver чанартай

**Сул тал:**
- Оюутан Go-г огт мэддэггүй — *Skill atrophy* эрсдэл хамгийн өндөр
- Boilerplate хамгийн их (handler, struct, error wrapping тус бүрд код)
- AI санал болгосон Go код-д hallucination илүү гарч магадгүй (training data
  Node-той харьцуулахад бага)
- 2 долоо хоногт learn + build нь нэгэн зэрэг ачаалал хэт өндөр

## 5. Сонголт

**Сонгосон stack: Node.js + Express + PostgreSQL.**

Гол шалтгаанууд:

1. **Шалгалтад өөрөө тайлбарлаж чадах** — Бие даалтын тэмдэглэлд "AI бичсэн
   нь чи мэддэг гэсэн үг биш" гэж онцолсон. JS/Node нь оюутанд хамгийн танил
2. **AI hallucination эрсдэл хамгийн бага** — Express нь AI training data-д
   хамгийн ихээр төлөөлөгдсөн backend framework
3. **Хөгжүүлэлтийн хурд + ecosystem** — 2 долоо хоногт 5 feature + ≥10 test +
   slash command нэмэхэд тохирно
4. **CLAUDE.md-д заасан stack-тай нийцэж байна** — repo root convention бэлэн

Сул тал болох OpenAPI auto-gen асуудлыг дараах байдлаар шийдэх төлөвлөгөөтэй:
- `swagger-jsdoc` ашиглан JSDoc-оос OpenAPI 3.0 spec үүсгэх
- Эсвэл `partB/openapi.yaml`-ийг гарын ажлаар хадгалж, controller бүрд
  тохирсон route мэдээллийг тэнд оруулах

## 6. Дүгнэлт

| Stack          | Нийт оноо | Шийдвэр |
|----------------|:---------:|---------|
| Node.js+Express|    23     | ✅ Сонгосон |
| Python+FastAPI |    22     | ❌ Хэлний эзэмшил сул |
| Go+chi         |    16     | ❌ Learning curve хэт өндөр |

> Энэхүү харьцуулалтыг AI-тай (Claude Code) хамтран хийсэн. AI чат session-ы
> товчилсон бичлэгийг [`ai-sessions/plan.md`](ai-sessions/plan.md)-аас үзнэ үү.
