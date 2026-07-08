# DE Lab · Interview & Work Gym (`interactive/`)

Локальний/хостинговий тренажер:

1. **Техінтервʼю** — типи компаній (архетипи, без брендів) + універсальні навички + місія SKU  
2. **Імітація роботи DE** — product, marketplace, media, consulting/IoT analytics, fintech  
3. **Архів** — старі drills

## Live

**https://de-lab-interview-gym.web.app**

## Запуск локально

```bash
cd interactive
npx --yes serve -p 8770
# або python http.server
```

SQL-lab у браузері: AlaSQL (CDN).

## Етика

Не використовуємо назви конкретних роботодавців / їхніх внутрішніх тестів. Лише узагальнені патерни й синтетичні CSV.

## Redeploy

```bash
npx firebase-tools deploy --only hosting:de-lab-interview-gym --project earning-app-bytezv
```
