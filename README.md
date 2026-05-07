# Бие даалт 13 — URL Shortener

**ШУТИС — Мэдээлэл Холбооны Технологийн Сургууль**
F.CSM311 Программ хангамжийн бүтээлт
**Бие даалт 13: AI-Assisted Software Construction**

## Проектийн тухай

URL богиносгогч сервис — урт URL-ийг богино код руу хөрвүүлэх REST API
болон энгийн frontend. Лекц 13-д үзсэн **Spec → Generate → Review → Integrate**
зарчмыг практикт хэрэглэн, Claude Code-той хамтран бүтээж байна.

## Үндсэн чадвар (төлөвлөж буй)

- Урт URL-ийг богино код руу хөрвүүлэх
- Богино кодоор анхны URL руу redirect хийх
- Click counter (хандалтын тоог тоолох)
- Expiration (хүчинтэй хугацаа тогтоох)
- REST API + minimal HTML frontend

## Stack

- **Backend**: Node.js 20+, Express 4
- **Database**: PostgreSQL 15+
- **Testing**: Jest + Supertest
- **Lint**: ESLint

> Stack сонголтын дэлгэрэнгүй үндэслэлийг [`partA/STACK-COMPARISON.md`](partA/STACK-COMPARISON.md)
> болон [`partA/adr/0001-stack-decision.md`](partA/adr/0001-stack-decision.md)-аас үзнэ үү.

## Repo бүтэц

```
bie-daalt-13/
├── README.md            # Энэ файл — проектийн танилцуулга
├── CLAUDE.md            # AI агентад зориулсан заавар
├── .claude/commands/    # Custom slash commands
├── partA/               # А — Plan (төлөвлөлт)
├── partB/               # Б — Build (хэрэгжилт)
└── partC/               # В — Reflect (эргэцүүлэл)
```

## Бүтээгч

Ulmj — ШУТИС МХТС, F.CSM311.
Багш: Агвааны Отгонбаяр (otgonbayar.a@must.edu.mn).

## AI ашиглалт

Энэ проект нь **AI-тай хамтран** хийгдэж байна. Claude Code-ын хувь нэмрийг
commit-ийн `Co-Authored-By:` талбарт зарласан. Дэлгэрэнгүй мэдээллийг
[`partC/AI-USAGE-REPORT.md`](partC/AI-USAGE-REPORT.md)-аас (Part C дуусахаар)
үзнэ үү.
