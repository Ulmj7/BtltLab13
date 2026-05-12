---
description: Conventional Commits форматтай commit message үүсгэх
---

# /commit — Commit message үүсгэх

`git status` + `git diff --cached` (staged) дээр тулгуурлан **Conventional
Commits** форматтай commit message санал болго.

## Дүрэм (CLAUDE.md §8)

- Формат: `<type>(<scope>): <subject>`
- **Type:** `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `style`, `perf`, `ci`
- **Scope:** `partA`, `partB`, `partC`, `docs`, `db`, `api`, г.м.
- **Subject:** англиар, lowercase, 50 тэмдэгтээс илүүгүй, цэг тавихгүй.
- **Body:** монголоор бичиж болно — *яагаад* энэ өөрчлөлт хийсэн (WHAT биш WHY).
- Co-Author гарын үсэг **AI-аар үүссэн commit бүрд заавал**:

```
Co-Authored-By: Claude <noreply@anthropic.com>
```

## Сонгох тип

| Өөрчлөлт | Type |
|----------|------|
| Шинэ endpoint, шинэ feature | `feat` |
| Bug засвар | `fix` |
| README, ADR, comment | `docs` |
| Jest тест нэмсэн / шинэчилсэн | `test` |
| Logic ижил, кодын бүтэц өөрчилсөн | `refactor` |
| Зөвхөн whitespace / lint format | `style` |
| Dependency, config, build script | `chore` |
| Хурдны оновчлол | `perf` |

## Алхам

1. `git diff --cached --stat` ажиллуулж юу staged болсныг хар.
2. **Нэг logical өөрчлөлт уу?** Хэрэв олон зүйл орсон бол өөр өөр commit-т хуваахыг сануул.
3. CLAUDE.md §10-аар track хийхгүй файл (`.env`, `node_modules/`) staged болсон эсэхийг шалга.
4. Message-ыг heredoc-аар нэг блок болгож өг:

```bash
git commit -m "$(cat <<'EOF'
feat(api): add POST /api/links endpoint

Шинэ богино холбоос үүсгэх endpoint нэмэв. Zod schema-аар URL
валидаци хийж, repository давхаргад INSERT ажиллуулна.

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

## Хязгаарлалт

- `--amend`, `--no-verify`, `--force` бүү ашигла.
- Pre-commit hook fail болбол **шинэ commit** хийж засна (amend биш).
- Хэрэглэгчээс зөвшөөрөл аваагүй бол push **хэзээ ч** хийхгүй.
