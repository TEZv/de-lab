# DE Lab · Interview Gym (`interactive/`)

Локальний тренажер під live-coding / скрінінг (краще за «просто клікнути»): **drag-and-drop у `____`**, «що не так», схеми, match, порядок кроків.

Окремо від `CHALLENGES.md` (репо-квести) і від markdown у `interview-sprint/`.

## Деплой (GitHub → публічний URL)

**Зараз:** Gym лише локально, бо `interactive/` ще не в `origin/main`.

**Vercel (рекомендовано):**
1. Закоміть і запуш `interactive/` у `TEZv/de-lab`
2. [vercel.com/new](https://vercel.com/new) → Import `TEZv/de-lab`
3. **Root Directory** = `interactive` (обовʼязково!)
4. Framework = Other / без build → Deploy
5. URL на кшталт `https://de-lab-….vercel.app`

**GitHub Pages:** Settings → Pages → branch `main` / folder `interactive`  
(або Action; інколи треба `base`-шляхи — Vercel простіше)

Локально як і раніше: `python -m http.server 8770` у цій теці.

## Блоки зараз

| Файл | Що всередині |
|------|----------------|
| `01-window-functions.json` | Intro віконні (старе) |
| `02-sql-interview-10.json` | **10 SQL**: HAVING, ROW_NUMBER, Harry Potter, LAG, JOIN traps, COALESCE, dedup, match, order |
| `03-python-interview-10.json` | **10 Python**: паліндром, counter, рекурсія, TypeError trap, pandas, merge, fillna |
| `04-theory-data-ae.json` | **Theory AE**: STG→CORE→MARTS, Star/Snow, SCD2, BigQuery $, DQ, A/B, Day-1, stack map |

## Типи рівнів (engine)

| `type` | UX |
|--------|-----|
| `theory` | діаграма + bullets |
| `fill_blanks` | кліп у `____` **або drag-and-drop** |
| `whats_wrong` | buggy snippet → діагноз |
| `multi_choice` | 1 правильна відповідь |
| `match_pairs` | ліва ↔ права |
| `drag_order` | порядок кроків |

## Додати новий блок

1. `blocks/NN-slug.json` з `levels[]`
2. Запис у `BLOCKS` у `app.js`

Прогрес: `localStorage` → `de-lab-interactive-v1`.

## Інновації vs «типовий» w3schools/курсові

- Mixed formats в одному блоці (не лише MCQ)
- Каверзні `whats_wrong` (TypeError / WHERE MAX / SELECT * LIMIT)
- Dual interpretation підказки (Harry Potter power+age)
- AE day-1 + stack map — не лише синтаксис
- Український UI під твій скрінінг
