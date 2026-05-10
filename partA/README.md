# А хэсэг — Төлөвлөлт (Plan)

> Бие даалт 13 — *URL Shortener*-ийн **төлөвлөлтийн баримтуудын индекс**.
> Энэ хэсэг нь код бичих ажил эхлэхээс өмнөх *spec* үе шат.

## 1. Зорилго

А хэсгийн зорилго нь Б хэсэгт (Build) орохоос өмнө дараах асуултуудад
тодорхой хариулт өгөх явдал:

- **Юу** хийж байгаа вэ? — scope болон out-of-scope
- **Яагаад** энэ stack-ийг сонгосон бэ? — харьцуулалт + ADR
- **Хэрхэн** module-уудаа задлах вэ? — layered architecture
- **Аль** өгөгдлийг хадгалах вэ? — DB schema-ийн анхны хувилбар
- **Эрсдэл** юу байж болох вэ? — risk matrix

## 2. Файлын бүтэц

| Файл                                          | Үүрэг                                              |
|-----------------------------------------------|----------------------------------------------------|
| [`PROJECT.md`](PROJECT.md)                    | Проектын тойм, scope, success criteria, эрсдэл    |
| [`STACK-COMPARISON.md`](STACK-COMPARISON.md)  | 3 stack-ийг 8 шалгуураар харьцуулсан матриц       |
| [`ARCHITECTURE.md`](ARCHITECTURE.md)          | Layered architecture + Mermaid sequence diagram   |
| [`adr/0001-stack-decision.md`](adr/0001-stack-decision.md) | Stack сонголтын албан ёсны ADR        |
| `ai-sessions/plan.md`                         | (хийгдэх) AI-тай хийсэн төлөвлөлтийн session-ы товч |

## 3. Унших дараалал

Эхлэх уншигчид зөвлөмж:

1. **PROJECT.md** — проектын зорилго, хязгаарыг ойлгох
2. **STACK-COMPARISON.md** — яагаад Node.js + Express + PostgreSQL гэдгийг ойлгох
3. **adr/0001-stack-decision.md** — албан ёсны шийдвэрийн утга агуулга
4. **ARCHITECTURE.md** — кодын хэрэгжилтийн ерөнхий дүр зургийг харах

## 4. Гол шийдвэрүүд (одоогийн байдлаар)

| # | Шийдвэр                              | Эх сурвалж              |
|---|--------------------------------------|-------------------------|
| 1 | Stack: Node.js + Express + PostgreSQL | ADR-0001               |
| 2 | Layered architecture (4 давхарга)    | ARCHITECTURE.md §1     |
| 3 | 6 тэмдэгттэй base62 богино код       | ARCHITECTURE.md §5     |
| 4 | `crypto.randomBytes` (биш `Math.random`) | ARCHITECTURE.md §5  |
| 5 | UNIQUE constraint + retry loop       | ARCHITECTURE.md §3.1   |
| 6 | Зөвхөн `http(s)` redirect URL        | ARCHITECTURE.md §5     |

## 5. Дараагийн алхмууд

- А хэсгийн `ai-sessions/plan.md` бичих (төлөвлөлтийн session-ы товч)
- Б хэсгийг эхлүүлэх — `partB/` дотор Express scaffold үүсгэх
- `.claude/commands/` хавтаст эхний slash command бичих (`/review`)

## 6. Холбогдох баримт бичиг

- Repo үндэс дэх [`README.md`](../README.md) — проектын ерөнхий танилцуулга
- [`CLAUDE.md`](../CLAUDE.md) — AI агентад зориулсан build convention
- (хийгдэх) `partB/` — хэрэгжилтийн эх код, тест
- (хийгдэх) `partC/AI-USAGE-REPORT.md` — AI ашиглалтын тайлан

---

> *Spec → Generate → Review → Integrate.* А хэсэг бол **Spec** үе шат.
