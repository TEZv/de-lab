#!/usr/bin/env node
/** Build interview-bank.json from blocks/*.json + sprint stubs. No employer brands. */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const blocksDir = path.join(__dirname, '..', 'blocks');
const outPath = path.join(__dirname, '..', 'data', 'interview-bank.json');

const ARCHETYPE_BY_BLOCK = {
  '10-interview-company-types': 'universal',
  '04-theory-data-ae': 'universal',
  '05-alive-ae': 'universal',
  '11-interview-skills-universal': 'universal',
  '12-sku-minprice-mission': 'market',
  '01-window-functions': 'product',
  '02-sql-interview-10': 'universal',
  '03-python-interview-10': 'universal',
  '20-sim-product-mobile': 'product',
  '21-sim-marketplace': 'market',
  '22-sim-media': 'media',
  '23-sim-iot-consulting': 'consult',
  '24-sim-fintech': 'fintech',
  '30-unique-plays': 'universal',
};

const ARCHETYPES = [
  { id: 'universal', sigil: 'CORE', color: '#8b9cb3', glyph: '🧭' },
  { id: 'product', sigil: 'LTV', color: '#5b8def', glyph: '📱' },
  { id: 'market', sigil: 'JOIN', color: '#e8a84b', glyph: '🛒' },
  { id: 'media', sigil: 'CLEAN', color: '#c77dff', glyph: '📺' },
  { id: 'consult', sigil: 'LIVE', color: '#4ecdc4', glyph: '🔬' },
  { id: 'fintech', sigil: 'DEDUP', color: '#ff6b6b', glyph: '💳' },
];

function gymTasks() {
  const tasks = [];
  const files = fs.readdirSync(blocksDir).filter((f) => f.endsWith('.json') && !f.endsWith('.en.json'));
  for (const file of files) {
    const block = JSON.parse(fs.readFileSync(path.join(blocksDir, file), 'utf8'));
    const archetype = ARCHETYPE_BY_BLOCK[block.id] || 'universal';
    for (const level of block.levels || []) {
      tasks.push({
        id: `gym-${block.id}-${level.id}`,
        archetype,
        kind: 'gym',
        blockId: block.id,
        levelId: level.id,
        tag: level.tag || level.id,
        skill: inferSkill(level.type, block.id),
        difficulty: inferDiff(level.type),
        minutes: inferMinutes(level.type),
        title: { ua: level.title || block.title, en: level.title || block.title },
        prompt: {
          ua: level.instruction || level.intro || block.subtitle || '',
          en: level.instruction || level.intro || block.subtitle || '',
        },
      });
    }
  }
  return tasks;
}

function inferSkill(type, blockId) {
  if (blockId.includes('python')) return 'python';
  if (type === 'csv_lab' || type === 'fill_blanks') return 'sql';
  if (type === 'company_map' || type === 'theory') return 'modeling';
  return 'sql';
}

function inferDiff(type) {
  if (['theory', 'flip_cards', 'company_map'].includes(type)) return 'easy';
  if (['fill_blanks', 'csv_lab', 'match_pairs'].includes(type)) return 'medium';
  return 'medium';
}

function inferMinutes(type) {
  const m = { theory: 10, flip_cards: 8, company_map: 15, match_pairs: 12, fill_blanks: 15, csv_lab: 20, scenario: 10 };
  return m[type] || 15;
}

const SPRINT_SQL = [
  [1, '5× Easy SELECT, WHERE, ORDER BY', 'filters', 45, 'easy'],
  [8, 'ROW_NUMBER, RANK — 3 Medium', 'windows', 60, 'medium'],
  [15, 'Duplicate detection (ROW_NUMBER)', 'dedup', 45, 'medium'],
  [17, 'Retention / active users (7-day)', 'retention', 60, 'hard'],
  [18, 'Revenue by month, YoY', 'dates', 60, 'medium'],
  [19, 'Funnel: signup → purchase', 'funnel', 60, 'hard'],
  [20, 'Sessionization (30 min gap)', 'session', 60, 'hard'],
  [28, 'Final mock 90 min', 'mock', 90, 'hard'],
].map(([day, title, topic, minutes, difficulty]) => ({
  id: `sprint-sql-d${day}`,
  archetype: topic === 'retention' || topic === 'funnel' ? 'product' : topic === 'dedup' ? 'fintech' : 'universal',
  kind: 'stub',
  skill: 'sql',
  difficulty,
  minutes,
  sprintDay: day,
  source: 'interview-sprint/01-SQL-Sprint-30.md',
  title: { ua: `Sprint SQL · День ${day}`, en: `Sprint SQL · Day ${day}` },
  prompt: {
    ua: title,
    en: title,
  },
  resources: [
    { label: 'DataLemur SQL', url: 'https://datalemur.com/questions' },
    { label: 'HackerRank SQL', url: 'https://www.hackerrank.com/domains/sql' },
  ],
}));

const PATTERN_STUBS = [
  { id: 'pat-topn-region', archetype: 'market', topic: 'top-n', difficulty: 'medium', minutes: 25,
    title: { ua: 'Top-N у кожній групі (регіон / категорія)', en: 'Top-N per group (region / category)' },
    prompt: { ua: 'ROW_NUMBER() OVER (PARTITION BY region ORDER BY revenue DESC) = 1. Поясни вголос grain і ties.', en: 'ROW_NUMBER() OVER (PARTITION BY region ORDER BY revenue DESC) = 1. State grain and ties aloud.' } },
  { id: 'pat-gap-island', archetype: 'fintech', topic: 'gaps', difficulty: 'hard', minutes: 35,
    title: { ua: 'Gaps & Islands у датах транзакцій', en: 'Gaps & islands in transaction dates' },
    prompt: { ua: 'Знайди розриви в щоденних платежах клієнта. LAG + дата-арифметика.', en: 'Find gaps in daily payment streaks. LAG + date math.' } },
  { id: 'pat-currency', archetype: 'fintech', topic: 'precision', difficulty: 'hard', minutes: 30,
    title: { ua: 'Валюта + округлення (не втрати копійки)', en: 'Currency + rounding (no penny loss)' },
    prompt: { ua: 'Конвертація + SUM: фільтруй ДО агрегації чи після? Обґрунтуй.', en: 'FX + SUM: filter before or after aggregate? Justify.' } },
  { id: 'pat-log-clean', archetype: 'media', topic: 'cleaning', difficulty: 'medium', minutes: 30,
    title: { ua: 'Парсинг nested JSON логів → flat table', en: 'Parse nested JSON logs → flat table' },
    prompt: { ua: 'Python: json.loads, нормалізація, dtype, null policy.', en: 'Python: json.loads, normalize, dtypes, null policy.' } },
  { id: 'pat-live-read', archetype: 'consult', topic: 'live', difficulty: 'medium', minutes: 20,
    title: { ua: 'Live: перефразуй умову інтервʼюера', en: 'Live: restate the interviewer prompt' },
    prompt: { ua: 'Перед SQL — 3 речення: grain, метрика, edge cases.', en: 'Before SQL — 3 sentences: grain, metric, edge cases.' } },
  { id: 'pat-metric-def', archetype: 'product', topic: 'metrics', difficulty: 'medium', minutes: 20,
    title: { ua: 'Поясни метрику: DAU vs WAU vs sticky', en: 'Explain metric: DAU vs WAU vs sticky' },
    prompt: { ua: 'Без формул спочатку — бізнес-сенс, потім SQL skeleton.', en: 'Business meaning first, then SQL skeleton.' } },
  { id: 'pat-star-draw', archetype: 'universal', topic: 'modeling', difficulty: 'medium', minutes: 25,
    title: { ua: 'Намалюй star: 1 fact + 2 dim на дошці', en: 'Draw star: 1 fact + 2 dims on paper' },
    prompt: { ua: 'Grain fact table, keys, SCD type для dim.', en: 'Fact grain, keys, SCD type for dims.' } },
  { id: 'pat-anti-join', archetype: 'market', topic: 'joins', difficulty: 'medium', minutes: 20,
    title: { ua: 'ANTI JOIN: хто не купив', en: 'ANTI JOIN: who never purchased' },
    prompt: { ua: 'LEFT JOIN + WHERE right IS NULL vs NOT EXISTS — коли що.', en: 'LEFT JOIN + WHERE right IS NULL vs NOT EXISTS — when which.' } },
].map((s) => ({ ...s, kind: 'stub', skill: s.topic.includes('python') ? 'python' : s.topic === 'modeling' ? 'modeling' : 'sql', source: 'public-patterns' }));

const PYTHON_SPRINT = ['A1', 'A2', 'B2', 'B4', 'C1', 'C5'].map((code, i) => ({
  id: `sprint-py-${code}`,
  archetype: code.startsWith('C') ? 'consult' : 'universal',
  kind: 'stub',
  skill: 'python',
  difficulty: code.startsWith('C') ? 'hard' : 'medium',
  minutes: 45,
  source: 'interview-sprint/02-Python-LiveCoding.md',
  title: { ua: `Python Live · ${code}`, en: `Python Live · ${code}` },
  prompt: {
    ua: ['FizzBuzz + hints', 'Parse key=value', 'Dedupe DF latest', 'Schema validate', 'ETL 2 CSV→parquet', '45 min mock B1+B2'][i],
    en: ['FizzBuzz + hints', 'Parse key=value', 'Dedupe DF latest', 'Schema validate', 'ETL 2 CSV→parquet', '45 min mock B1+B2'][i],
  },
}));

const bank = {
  version: 1,
  updated: '2026-07-08',
  ethics: {
    ua: 'Без брендів роботодавців і злитих тестів. Лише архетипи галузей + публічні патерни.',
    en: 'No employer brands or leaked tests. Industry archetypes + public patterns only.',
  },
  archetypes: ARCHETYPES.map((a) => ({
    ...a,
    label: {
      universal: { ua: 'Універсальне', en: 'Universal' },
      product: { ua: 'Product / Mobile', en: 'Product / Mobile' },
      market: { ua: 'Marketplace', en: 'Marketplace' },
      media: { ua: 'Media / Content', en: 'Media / Content' },
      consult: { ua: 'Consulting / IoT', en: 'Consulting / IoT' },
      fintech: { ua: 'Fintech', en: 'Fintech' },
    }[a.id],
  })),
  tasks: [...gymTasks(), ...SPRINT_SQL, ...PYTHON_SPRINT, ...PATTERN_STUBS],
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(bank, null, 2)}\n`);
console.log(`Wrote ${bank.tasks.length} tasks → ${outPath}`);
