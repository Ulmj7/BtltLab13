# CLAUDE.md — AI агентад зориулсан заавар

Энэ файл нь Claude Code (болон бусад AI coding агент) энэ repo дээр ажиллахдаа
дагах заавар. Шинэ session эхлэхэд эхлээд ЭНИЙГ уншина уу.

> **Гол зарчим:** *Spec → Generate → Review → Integrate.* Шууд код бичээд бүү
> ороол. Эхлээд юу хийх ёстойг тодруулж, дараа нь үүсгэж, дараа нь шалгаад,
> дараа нь нэгтгэ.

---

## 1. Проектийн товч

- **Нэр:** URL Shortener (Бие даалт 13)
- **Хичээл:** ШУТИС МХТС — F.CSM311 Программ хангамжийн бүтээлт
- **Зорилго:** AI-тай хамтран ажиллах workflow эзэмших, *бичих* үүргээс
  *дизайн / верификаци / агуулга* руу шилжих
- **Stack:** Node.js 20+, Express 4, PostgreSQL 15+, Jest, ESLint
- **Документацийн хэл:** Монгол (код, identifier, log, commit subject — англи)

## 2. Repo бүтэц (заавал дагах)

```
bie-daalt-13/
├── README.md
├── CLAUDE.md              ← Энэ файл
├── .claude/commands/      ← Custom slash commands (≥4)
├── partA/                 ← Plan (төлөвлөлт) — баримт бичиг
├── partB/                 ← Build (хэрэгжилт) — эх код, тест
│   ├── src/
│   ├── tests/
│   └── ai-sessions/
└── partC/                 ← Reflect (эргэцүүлэл)
```

Шинэ файл үүсгэхдээ заавал дээрх бүтэцт нийцүүлэн оруул.

## 3. Build & Run командууд

> **Тэмдэглэл:** partB/ хавтас доторх Node проектыг идэвхжүүлсний дараа эдгээр
> командууд ажиллана. Хараахан scaffold хийгдээгүй (Day 1).

```powershell
# Хамаарлуудыг суулгах
cd partB; npm install

# Хөгжүүлэлтийн серверийг асаах (nodemon)
npm run dev

# Production-ы серверийг асаах
npm start

# Тест ажиллуулах
npm test

# Тест coverage харах
npm run test:coverage

# Lint шалгах
npm run lint
```

## 4. Database (PostgreSQL)

- **Local development**: PostgreSQL container эсвэл орон нутгийн installation
- **Connection string-ыг `.env`-д хадга** — `.env`-ийг хэзээ ч commit хийхгүй
- **Schema migration**: `partB/migrations/` дотор хадгалах (анх node-pg-migrate
  эсвэл sql файл шууд)

```bash
# Жишээ .env (.env.example файл repo-д байх ёстой, .env өөрөө байхгүй)
DATABASE_URL=postgresql://user:pass@localhost:5432/urlshortener
PORT=3000
NODE_ENV=development
BASE_URL=http://localhost:3000
```

## 5. Кодын дүрэм (conventions)

- **JavaScript:** ES modules (`import` / `export`), ES2022+
- **File naming:** `kebab-case.js` (e.g., `link-controller.js`)
- **Function naming:** `camelCase`
- **Constants:** `UPPER_SNAKE_CASE`
- **Async:** `async/await` (Promise chain бүү ашигла)
- **Error handling:** custom `AppError` class + Express error middleware
- **Validation:** request boundary дээр (Zod эсвэл express-validator)
- **Lint:** ESLint standard config
- **Format:** Prettier (default config)

## 6. Architecture layer-үүд

```
HTTP Request
    ↓
Routes        (partB/src/routes/)        — endpoint тодорхойлох
    ↓
Controllers   (partB/src/controllers/)   — request/response хариуцах
    ↓
Services      (partB/src/services/)      — business logic
    ↓
Repositories  (partB/src/repositories/)  — DB хандалт зөвхөн энд
    ↓
PostgreSQL
```

Layer-ыг алгасахгүй. Жишээ нь, controller шууд DB query хийхгүй.

## 7. Тест бичих заавар

- **Тестийн пирамид:** unit (ихэнх) → integration (репо/контроллер) → e2e (цөөн)
- **Хамгийн багадаа 10 unit test** (Б хэсгийн шаардлага)
- **Database тестүүд:** test database ашиглах, mock хийхгүй (real DB)
- **Edge case заавал:** хоосон input, буруу формат, маш урт URL, давхардсан код

## 8. Commit заавар

- **Conventional Commits format:** `<type>(<scope>): <subject>`
  - `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `style`
- **Subject англиар, body монголоор бичиж болно**
- **AI-аар үүсгэгдсэн commit бүхэн `Co-Authored-By: Claude <noreply@anthropic.com>`-той байна**
- ≥15 commit, ≥5 өөр өдөр (нэг өдөр rush хийсэн нь fail)
- Нэг том code-dump commit бүү хий

## 9. AI session log

Чухал AI session бүрийн товч-ийг `partB/ai-sessions/NN-сэдэв.md` форматаар
хадгал. Заавал:
- Session-ы зорилго (1 өгүүлбэр)
- AI-аас гарсан гол гаргалгаа
- Хүний review дээр гарсан өөрчлөлт / залруулга
- Нэг hallucination эсвэл security сэжиг олдвол тэмдэглэх

## 10. Хориотой газрууд (no-go zones)

AI агент дараах зүйлсийг **хийж БОЛОХГҮЙ** (тусгай зөвшөөрөлгүйгээр):

- ❌ `.env` файлыг repo-д commit хийх
- ❌ `node_modules/` эсвэл `dist/`-ыг track хийх
- ❌ `git push --force` (push-ыг хүн өөрөө хийнэ)
- ❌ `git reset --hard`, `git clean -fd` гэх мэт устгагч командууд
- ❌ Production-ын database-д migration ажиллуулах
- ❌ Шинэ top-level dependency нэмэх — эхлээд **ADR** бичих
- ❌ Architecture layer-ыг алгасах (controller → DB шууд гэх мэт)
- ❌ Test mock-аар PostgreSQL-ийг орлуулах (integration тестэд бодит DB ашиглана)
- ❌ Бусад оюутны код хуулах эсвэл AI-ыг тэгж ашиглах

## 11. Hallucination/Security шалгалт

AI санал болгосон код руу буруу зүйл орох эрсдэл байнга бий. Дараахыг үргэлж
шалга:

- Дурдсан npm package бодитоор байгаа эсэх (`npm view <pkg>`)
- API method-ууд библиотекийн одоогийн хувилбарт байгаа эсэх
- SQL query параметризэйлэгдсэн (string concat-аар query үүсгэхгүй)
- User input-ыг шууд `eval`, `exec`, redirect URL-д бүү хий
- `randomBytes` / `crypto` ашигласан эсэх (`Math.random` биш)

Илрүүлсэн hallucination/security жишээг `partC/AI-USAGE-REPORT.md`-д тэмдэглэ.

## 12. Slash command-ууд (.claude/commands/)

Доорх команд бүхэн `.claude/commands/<нэр>.md` файлд хадгална. Б хэсэгт ≥4 байх:

- `/review` — security + robustness review
- `/test` — testing pyramid-аар edge case-тэй тест
- `/docs` — JSDoc + README хэсэг
- `/commit` — Conventional Commits message
- (нэмэлт) `/security` — OWASP Top 10 шалгалт

## 13. Update журам

Энэ CLAUDE.md-г build-ийн явцад **тогтмол шинэчил**. Шинэ convention, шинэ
command, шинэ no-go zone гарвал энд тэмдэглэ. ≤200 мөрөөс хэтрүүлэхгүй.
