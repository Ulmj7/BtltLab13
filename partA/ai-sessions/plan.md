# AI Session — А хэсгийн төлөвлөлт

> *Spec → Generate → Review → Integrate*-ийн **Spec** үе шатны AI session-ы
> товчилсон бичлэг. Бие даалт 13-ын шаардлагын дагуу: AI-аас гарсан гол
> гаргалгаа, хүний review-ийн өөрчлөлт, hallucination/security сэжиг.

## 1. Session-ы мета

| Талбар              | Утга                                                            |
|---------------------|-----------------------------------------------------------------|
| Огноо               | 2026-05-06 ... 2026-05-11 (хэд хэдэн session)                  |
| AI tool             | Claude Code (claude-opus-4-7, 1M context)                       |
| Үе шат              | А хэсэг — Plan (төлөвлөлт)                                     |
| Зорилго             | URL Shortener-ийн scope, stack, architecture-ийг тодорхойлох   |
| Гаргалгаа           | `PROJECT.md`, `STACK-COMPARISON.md`, `ARCHITECTURE.md`, `adr/0001-*.md`, `README.md` |

## 2. Session-уудын товч

### 2.1. Session 1 — Анхны setup болон CLAUDE.md

**Зорилго:** Repo-г эхлүүлж, AI агентад зориулсан convention-уудыг тогтоох.

**AI-аас гарсан гол гаргалгаа:**
- `.gitignore` Node.js стандарт patterns-той
- `CLAUDE.md`-ийн skeleton (13 хэсэг: project overview, repo structure,
  build commands, DB setup, code conventions, layer-ууд, testing, commit rules,
  AI session logging, no-go zones, hallucination/security checks, slash commands,
  update protocol)
- README.md-ийн анхны draft

**Хүний review-ийн өөрчлөлт:**
- Монгол хэлний нарийвчлал — "Документацийн" → "Баримт бичгийн", "ЭНИЙГ" →
  "үүнийг" (формаль бус → стандарт)
- Repo нэрийг `bie-daalt-13` биш, GitHub дээрх бодит нэр `BtltLab13`-аар
  засаж тааруулсан

### 2.2. Session 2 — PROJECT.md (scope болон success criteria)

**Зорилго:** Юу хийх, юу хийхгүй вэ гэдгийг тодорхой бичих.

**AI-аас гарсан гол гаргалгаа:**
- Brief, in-scope, out-of-scope, constraints, success criteria, risk matrix
  гэсэн стандарт бүтэц
- Эрсдэл-нөлөө-боломж матриц (rate limiting, open redirect, AI hallucination
  гэх мэт)

**Хүний review-ийн өөрчлөлт:**
- "хэт their" гэсэн англи үгийн алдаа → "хэт найдах"
- "хойтон" → "хойшид" (буруу үг → зөв үг)
- "Хамгаас багадаа" → "Хамгийн багадаа" (буруу superlative)

### 2.3. Session 3 — STACK-COMPARISON.md болон ADR-0001

**Зорилго:** Stack-ийг 3 сонголтоор харьцуулж, эцсийн шийдвэрийг ADR
форматаар албажуулах.

**AI-аас гарсан гол гаргалгаа:**
- 3 stack × 8 шалгуурын ★-rating матриц
- Тус бүрийн давуу/сул талын дэлгэрэнгүй
- ADR-ийн стандарт бүтэц (Context, Decision, Consequences, Review checkpoints)

**Хүний review-ийн өөрчлөлт:**
- Эцсийн шийдвэрийг (Node.js) хүн өөрөө гаргасан
- "Шалгалт AI-гүйгээр явагдана" гэсэн **гол шалгуурыг хүн нэмж** оруулсан —
  AI үүнийг анх онцлоогүй, оюутан өөрөө stack сонголтын тэргүүлэх шалгуур
  болгож тодорхойлсон

### 2.4. Session 4 — ARCHITECTURE.md

**Зорилго:** Code эхлэхээс өмнө module бүтэц, өгөгдлийн урсгалыг зурах.

**AI-аас гарсан гол гаргалгаа:**
- 3 Mermaid diagram (layered flowchart, POST sequence, GET sequence)
- `partB/src/` бүтцийн төлөвлөгөө (app.js, routes/, controllers/, services/,
  repositories/, middleware/, lib/, db/)
- DB schema-ийн анхны хувилбар (links table)
- 8 design decision-ыг хүснэгтээр

**Хүний review-ийн өөрчлөлт:**
- Layer-ийн алгасах хориотойг **CLAUDE.md no-go zone-той тааруулж** баталгаажуулсан
- Architecture-ийг хэт хийсвэр болгохгүйгээр Б хэсгийн хэрэгжилт рүү шууд
  буулгах боломжтойгоор бичүүлсэн

## 3. Илрүүлсэн hallucination / security сэжиг

> CLAUDE.md §11-ийн дагуу AI-аас гарсан гажуу зүйлсийг тэмдэглэв.

| # | Сэжиг                                                  | Илрүүлсэн арга               | Үр дүн                |
|---|--------------------------------------------------------|------------------------------|-----------------------|
| 1 | "Pydantic v2"-ын API өөрчлөлтийн талаарх мэдэгдэл хуучирсан байж магадгүй | Хүн өөрөө уншиж шалгасан | STACK-COMPARISON.md-д ерөнхий томьёолол хэрэглэв |
| 2 | AI эхлээд `Math.random` ашиглаж богино код үүсгэх жишээ санал болгосон | CLAUDE.md §11-ийн дагуу security review | `crypto.randomBytes`-аар сольсон (ARCHITECTURE.md §5) |
| 3 | AI redirect-ыг "any URL"-аар санал болгосон | OWASP open redirect | Зөвхөн `http(s)`-ийг зөвшөөрөх дүрэм нэмэв |
| 4 | AI зарим жишээнд SQL string concat ашигласан | Code review | Бүх query parameterized болсон ($1, $2) |

## 4. Workflow-оос гарсан дүгнэлт

- **Spec → Generate → Review → Integrate** ажиллаж байна. Code бичихээс өмнө
  PROJECT.md, ARCHITECTURE.md-г бичсэн нь Б хэсгийн ажлыг маш тодорхой болгож байна.
- AI-ийн анхны draft нь стандарт format-тай (ADR, sequence diagram), гэхдээ
  **гол шалгуур, эцсийн шийдвэр, монгол хэлний нарийвчлал** нь хүний шууд
  оролцоог шаардаж байна.
- Нэг session-д **зөвхөн нэг commit** хийх дүрмийг session-ы дундуур
  тогтоосон — энэ нь "≥15 commit, ≥5 өөр өдөр" шалгуурыг хангахад чухал.

## 5. Дараагийн session-ы зорилго (Б хэсэг рүү шилжих)

- `partB/` доторх Express scaffold (package.json, src/app.js, src/server.js)
- `.env.example` бичих
- Эхний slash command (`.claude/commands/review.md`)
- DB migration `partB/migrations/0001-init.sql`

---

> Энэхүү файл нь *retrospective* буюу буцаагаад бичсэн товч. Дэлгэрэнгүй чат
> бичлэг хадгалагдаагүй бөгөөд commit history (`git log`) болон баримт
> бичгүүд (`partA/*.md`) нь анхдагч баталгаа болно.
