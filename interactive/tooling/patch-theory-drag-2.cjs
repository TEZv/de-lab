const fs = require('fs');
const path = require('path');

function write(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n');
  console.log('wrote', path.basename(p));
}
function load(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }
function upsertAfter(levels, afterId, level) {
  const i = levels.findIndex((l) => l.id === afterId);
  if (i < 0) throw new Error('missing ' + afterId + ' in ' + levels.map((l) => l.id).join(','));
  const exists = levels.findIndex((l) => l.id === level.id);
  if (exists >= 0) levels[exists] = level;
  else levels.splice(i + 1, 0, level);
}

// R0 prod
for (const [p, en] of [
  ['c:/Users/kolisnyk.o/Cursor/work/devops-lab/interactive/blocks/06-prod-devops.json', false],
  ['c:/Users/kolisnyk.o/Cursor/work/devops-lab/interactive/blocks/06-prod-devops.en.json', true],
]) {
  const j = load(p);
  j.levels[0] = en ? {
    id: 'R0', type: 'theory', tag: '🛡️ · map', title: 'SRE triangle',
    instruction: 'Metrics → alerts → runbook → postmortem. Same muscle as DE governance E6.',
    vizs: [
      {
        type: 'layerStack', title: 'From signal to learning',
        layers: [
          { label: 'SLI', sublabel: 'what we measure', color: '#5b8def', icon: '📊' },
          { label: 'SLO', sublabel: 'target (99.9%)', color: '#e8a84b', icon: '🎯' },
          { label: 'Alert', sublabel: 'burn / impact', color: '#ff6b6b', icon: '🔔' },
          { label: 'Runbook', sublabel: 'hands-on steps', color: '#3d9a6a', icon: '📋' },
          { label: 'Postmortem', sublabel: 'fix the system', color: '#c77dff', icon: '📝' },
        ],
      },
      {
        type: 'conceptCards', title: 'Interview images',
        cards: [
          { icon: '📊', title: 'SLI', badge: 'signal', color: '#5b8def', rows: [{ ok: true, text: 'latency / errors' }, { ok: false, text: 'feelings' }] },
          { icon: '📜', title: 'SLA', badge: 'contract', color: '#8b9cb3', rows: [{ ok: true, text: 'customer promise' }, { ok: true, text: 'often softer than SLO' }] },
          { icon: '🧯', title: 'Alert', badge: 'page', color: '#ff6b6b', rows: [{ ok: true, text: 'user impact' }, { ok: false, text: 'CPU 50% staging page' }] },
        ],
        footnote: 'SLI=speedometer · SLO=speed limit · SLA=ticket to customer · runbook=GPS.',
      },
    ],
    bullets: [],
    recallTips: ['SLI→SLO→alert', 'alert needs runbook', 'blameless PM'],
  } : {
    id: 'R0', type: 'theory', tag: '🛡️ · карта', title: 'SRE triangle',
    instruction: 'Метрики → алерти → runbook → postmortem. Той самий мʼяз, що DE governance E6.',
    vizs: [
      {
        type: 'layerStack', title: 'Від сигналу до навчання',
        layers: [
          { label: 'SLI', sublabel: 'що вимірюємо', color: '#5b8def', icon: '📊' },
          { label: 'SLO', sublabel: 'ціль (99.9%)', color: '#e8a84b', icon: '🎯' },
          { label: 'Alert', sublabel: 'burn / impact', color: '#ff6b6b', icon: '🔔' },
          { label: 'Runbook', sublabel: 'кроки руками', color: '#3d9a6a', icon: '📋' },
          { label: 'Postmortem', sublabel: 'чиним систему', color: '#c77dff', icon: '📝' },
        ],
      },
      {
        type: 'conceptCards', title: 'Образи для інтервʼю',
        cards: [
          { icon: '📊', title: 'SLI', badge: 'сигнал', color: '#5b8def', rows: [{ ok: true, text: 'latency / errors' }, { ok: false, text: 'відчуття' }] },
          { icon: '📜', title: 'SLA', badge: 'контракт', color: '#8b9cb3', rows: [{ ok: true, text: 'обіцянка клієнту' }, { ok: true, text: 'часто мʼякше SLO' }] },
          { icon: '🧯', title: 'Alert', badge: 'page', color: '#ff6b6b', rows: [{ ok: true, text: 'user impact' }, { ok: false, text: 'CPU 50% staging page' }] },
        ],
        footnote: 'SLI=спідометр · SLO=ліміт · SLA=квиток клієнту · runbook=GPS.',
      },
    ],
    bullets: [],
    recallTips: ['SLI→SLO→alert', 'alert без runbook = panic', 'blameless PM'],
  };
  upsertAfter(j.levels, 'R0', en ? {
    id: 'R0b', type: 'drag_buckets', tag: '🛡️ · drag', title: 'Drag term into SRE family',
    instruction: 'Where does each term live: measure / target / action?',
    buckets: [
      { id: 'measure', icon: '📊', title: 'Measure', hint: 'SLI', color: '#5b8def' },
      { id: 'target', icon: '🎯', title: 'Target / contract', hint: 'SLO · SLA', color: '#e8a84b' },
      { id: 'action', icon: '📋', title: 'Action', hint: 'runbook · PM', color: '#3d9a6a' },
    ],
    items: [
      { text: 'error rate %', bucket: 'measure' },
      { text: 'latency p99', bucket: 'measure' },
      { text: '99.9% uptime goal', bucket: 'target' },
      { text: 'customer SLA refund', bucket: 'target' },
      { text: 'rollback steps doc', bucket: 'action' },
      { text: 'blameless timeline', bucket: 'action' },
    ],
    recallTips: ['SLI=measure', 'SLO/SLA=target', 'runbook/PM=action'],
    recallMapRef: '📍 Map: R0 SRE triangle.',
  } : {
    id: 'R0b', type: 'drag_buckets', tag: '🛡️ · drag', title: 'Перетягни термін у сімʼю SRE',
    instruction: 'Куди живе кожен термін: вимірюємо / ціль / дія?',
    buckets: [
      { id: 'measure', icon: '📊', title: 'Вимір', hint: 'SLI', color: '#5b8def' },
      { id: 'target', icon: '🎯', title: 'Ціль / контракт', hint: 'SLO · SLA', color: '#e8a84b' },
      { id: 'action', icon: '📋', title: 'Дія', hint: 'runbook · PM', color: '#3d9a6a' },
    ],
    items: [
      { text: 'error rate %', bucket: 'measure' },
      { text: 'latency p99', bucket: 'measure' },
      { text: '99.9% uptime goal', bucket: 'target' },
      { text: 'customer SLA refund', bucket: 'target' },
      { text: 'rollback steps doc', bucket: 'action' },
      { text: 'blameless timeline', bucket: 'action' },
    ],
    recallTips: ['SLI=вимір', 'SLO/SLA=ціль', 'runbook/PM=дія'],
    recallMapRef: '📍 Карта: R0 SRE triangle.',
  });
  write(p, j);
}

// DE O0, E0, C0, stream D0, SQL S0 — conceptCards instead of bullets
function reformTheory(file, id, patch) {
  const j = load(file);
  const lvl = j.levels.find((l) => l.id === id);
  if (!lvl) throw new Error(file + ' ' + id);
  Object.assign(lvl, patch);
  write(file, j);
}

reformTheory('c:/Users/kolisnyk.o/Cursor/work/de-lab/interactive/blocks/14-orchestration-de.json', 'O0', {
  instruction: 'Nightly ETL: Cron для одного скрипта · Airflow коли кроків багато.',
  vizs: [
    { type: 'pipelineH', nodes: [
      { label: '⏱ Scheduler', hint: 'коли', color: '#5b8def' },
      { label: '🕸 DAG', hint: 'граф', color: '#3d9a6a' },
      { label: '⚙️ Operator', hint: 'дія', color: '#e8a84b' },
      { label: '👂 Sensor', hint: 'чекати', color: '#c77dff' },
    ]},
    { type: 'conceptCards', title: 'Коли що', cards: [
      { icon: '🕒', title: 'Cron', badge: 'просте', color: '#8b9cb3', rows: [{ ok: true, text: '1 bash' }, { ok: false, text: '10 кроків + retry UI' }] },
      { icon: '🕸', title: 'Airflow', badge: 'граф', color: '#3d9a6a', rows: [{ ok: true, text: 'deps + retries' }, { ok: true, text: 'sensor file' }] },
      { icon: '🚫', title: 'Cycle', badge: 'DAG', color: '#ff6b6b', rows: [{ ok: false, text: 'A→B→A' }, { ok: true, text: 'acyclic only' }] },
    ], footnote: 'Sensor = турнікет: далі не пускає, доки файл/partition не зʼявились.' },
  ],
  flow: [],
  bullets: [],
  recallTips: ['DAG без циклів', 'Sensor чекає', 'Cron vs Airflow'],
});
upsertAfter(load('c:/Users/kolisnyk.o/Cursor/work/de-lab/interactive/blocks/14-orchestration-de.json').levels, 'O0', {}); // noop check

const orch = load('c:/Users/kolisnyk.o/Cursor/work/de-lab/interactive/blocks/14-orchestration-de.json');
upsertAfter(orch.levels, 'O0', {
  id: 'O0b', type: 'drag_buckets', tag: '⚙️ · drag', title: 'Перетягни в Cron чи Airflow',
  instruction: 'Що тягне на crontab, а що — на оркестратор?',
  buckets: [
    { id: 'cron', icon: '🕒', title: 'Cron', hint: 'просте', color: '#8b9cb3' },
    { id: 'airflow', icon: '🕸', title: 'Airflow', hint: 'граф', color: '#3d9a6a' },
  ],
  items: [
    { text: 'один ingest.sh о 03:00', bucket: 'cron' },
    { text: 'sensor S3 → transform → mart', bucket: 'airflow' },
    { text: 'retries + Slack fail', bucket: 'airflow' },
    { text: '5-field crontab line', bucket: 'cron' },
  ],
  recallTips: ['1 скрипт → Cron', 'deps/sensor → Airflow'],
  recallMapRef: '📍 Карта: O0 Airflow.',
});
write('c:/Users/kolisnyk.o/Cursor/work/de-lab/interactive/blocks/14-orchestration-de.json', orch);

const orchEn = load('c:/Users/kolisnyk.o/Cursor/work/de-lab/interactive/blocks/14-orchestration-de.en.json');
orchEn.levels[0] = {
  id: 'O0', type: 'theory', tag: '⚙️ · map', title: 'Airflow in two beats',
  instruction: 'Nightly ETL: Cron for one script · Airflow when many steps.',
  vizs: [
    { type: 'pipelineH', nodes: [
      { label: '⏱ Scheduler', hint: 'when', color: '#5b8def' },
      { label: '🕸 DAG', hint: 'graph', color: '#3d9a6a' },
      { label: '⚙️ Operator', hint: 'action', color: '#e8a84b' },
      { label: '👂 Sensor', hint: 'wait', color: '#c77dff' },
    ]},
    { type: 'conceptCards', title: 'When what', cards: [
      { icon: '🕒', title: 'Cron', badge: 'simple', color: '#8b9cb3', rows: [{ ok: true, text: '1 bash' }, { ok: false, text: '10 steps + retry UI' }] },
      { icon: '🕸', title: 'Airflow', badge: 'graph', color: '#3d9a6a', rows: [{ ok: true, text: 'deps + retries' }, { ok: true, text: 'file sensor' }] },
      { icon: '🚫', title: 'Cycle', badge: 'DAG', color: '#ff6b6b', rows: [{ ok: false, text: 'A→B→A' }, { ok: true, text: 'acyclic only' }] },
    ], footnote: 'Sensor = turnstile: blocks downstream until file/partition appears.' },
  ],
  flow: [], bullets: [], recallTips: ['DAG acyclic', 'Sensor waits', 'Cron vs Airflow'],
};
upsertAfter(orchEn.levels, 'O0', {
  id: 'O0b', type: 'drag_buckets', tag: '⚙️ · drag', title: 'Drag into Cron or Airflow',
  instruction: 'What belongs on crontab vs orchestrator?',
  buckets: [
    { id: 'cron', icon: '🕒', title: 'Cron', hint: 'simple', color: '#8b9cb3' },
    { id: 'airflow', icon: '🕸', title: 'Airflow', hint: 'graph', color: '#3d9a6a' },
  ],
  items: [
    { text: 'one ingest.sh at 03:00', bucket: 'cron' },
    { text: 'sensor S3 → transform → mart', bucket: 'airflow' },
    { text: 'retries + Slack fail', bucket: 'airflow' },
    { text: '5-field crontab line', bucket: 'cron' },
  ],
  recallTips: ['1 script → Cron', 'deps/sensor → Airflow'],
  recallMapRef: '📍 Map: O0 Airflow.',
});
write('c:/Users/kolisnyk.o/Cursor/work/de-lab/interactive/blocks/14-orchestration-de.en.json', orchEn);

// governance E0
for (const [fp, en] of [
  ['c:/Users/kolisnyk.o/Cursor/work/de-lab/interactive/blocks/17-governance-ops-de.json', false],
  ['c:/Users/kolisnyk.o/Cursor/work/de-lab/interactive/blocks/17-governance-ops-de.en.json', true],
]) {
  const j = load(fp);
  j.levels[0] = {
    id: 'E0', type: 'theory', tag: en ? '🛡️ · map' : '🛡️ · карта',
    title: en ? 'Governance without bureaucracy' : 'Governance без бюрократії',
    instruction: en
      ? 'Senior DE: not only ETL — what breaks at 3 AM and who knows what changed.'
      : 'Senior DE: не лише ETL — що ламається о 3 ночі і хто знає, що змінилось.',
    vizs: [
      { type: 'dqGrid', checks: [
        { icon: '🔗', label: 'Lineage', desc: en ? 'source → mart' : 'source → mart', color: '#5b8def' },
        { icon: '📋', label: 'Docs', desc: en ? 'owners · schema' : 'owners · schema', color: '#3d9a6a' },
        { icon: '📟', label: 'Monitor', desc: en ? 'freshness · nulls' : 'freshness · nulls', color: '#e8a84b' },
        { icon: '🚑', label: 'Runbook', desc: en ? 'who · rollback' : 'хто · rollback', color: '#ff6b6b' },
      ]},
      { type: 'conceptCards', title: en ? 'Memory cards' : 'Картки памʼяті', cards: [
        { icon: '🔗', title: 'Lineage', badge: 'граф', color: '#5b8def', rows: [{ ok: true, text: en ? 'who is downstream' : 'хто downstream' }, { ok: false, text: en ? 'tribal knowledge only' : 'лише «в голові»' }] },
        { icon: '🔔', title: 'Alert', badge: 'anomaly', color: '#e8a84b', rows: [{ ok: true, text: '0 rows / 2× count' }, { ok: false, text: en ? 'yesterday was fine' : 'вчора було OK' }] },
        { icon: '📣', title: 'Schema change', badge: 'comms', color: '#c77dff', rows: [{ ok: true, text: en ? 'version + tell analysts' : 'version + сказати analysts' }, { ok: false, text: 'silent alter' }] },
      ], footnote: en ? 'Same ritual as Ops R0 — signal → action → learn.' : 'Той самий ритуал, що Ops R0 — сигнал → дія → навчання.' },
    ],
    bullets: [],
    recallTips: en
      ? ['lineage = graph', 'alert on anomaly', 'schema change = communicate']
      : ['lineage = граф', 'alert на anomaly', 'schema change = comms'],
  };
  upsertAfter(j.levels, 'E0', {
    id: 'E0b', type: 'drag_buckets', tag: en ? '🛡️ · drag' : '🛡️ · drag',
    title: en ? 'Drag into governance bucket' : 'Перетягни в кошик governance',
    instruction: en ? 'Tool vs process vs signal.' : 'Інструмент vs процес vs сигнал.',
    buckets: [
      { id: 'graph', icon: '🔗', title: en ? 'Graph / docs' : 'Граф / docs', color: '#5b8def' },
      { id: 'signal', icon: '📟', title: en ? 'Signal' : 'Сигнал', color: '#e8a84b' },
      { id: 'action', icon: '🚑', title: en ? 'Action' : 'Дія', color: '#ff6b6b' },
    ],
    items: [
      { text: 'dbt lineage', bucket: 'graph' },
      { text: 'data catalog owner', bucket: 'graph' },
      { text: 'freshness SLA miss', bucket: 'signal' },
      { text: 'null rate spike', bucket: 'signal' },
      { text: 'incident runbook', bucket: 'action' },
      { text: 'rollback + #incidents', bucket: 'action' },
    ],
    recallTips: en ? ['docs/lineage', 'monitor signal', 'runbook action'] : ['docs/lineage', 'сигнал monitor', 'runbook дія'],
    recallMapRef: en ? '📍 Map: E0 · bridge Ops R0.' : '📍 Карта: E0 · bridge Ops R0.',
  });
  write(fp, j);
}

// incremental C0
for (const [fp, en] of [
  ['c:/Users/kolisnyk.o/Cursor/work/de-lab/interactive/blocks/15-incremental-loads-de.json', false],
  ['c:/Users/kolisnyk.o/Cursor/work/de-lab/interactive/blocks/15-incremental-loads-de.en.json', true],
]) {
  const j = load(fp);
  j.levels[0].bullets = [];
  j.levels[0].vizs = [
    j.levels[0].viz,
    {
      type: 'conceptCards',
      title: en ? 'Three words' : 'Три слова',
      cards: [
        { icon: '🏷️', title: 'Watermark', badge: 'cursor', color: '#5b8def', rows: [{ ok: true, text: 'updated_at / LSN' }, { ok: false, text: en ? 'guess last night' : 'вгадати «вчора»' }] },
        { icon: '♻️', title: 'Idempotent', badge: 'safe rerun', color: '#3d9a6a', rows: [{ ok: true, text: 'MERGE / upsert' }, { ok: false, text: en ? 'blind INSERT dups' : 'сліпий INSERT дублі' }] },
        { icon: '⏪', title: 'Backfill', badge: 'past', color: '#c77dff', rows: [{ ok: true, text: en ? 'conscious past run' : 'свідомий прогін' }, { ok: false, text: '= Airflow catchup' }] },
      ],
      footnote: en ? 'Read watermark → delta → load → commit watermark.' : 'Читай watermark → delta → load → commit watermark.',
    },
  ];
  delete j.levels[0].viz;
  j.levels[0].recallTips = en
    ? ['watermark first', 'idempotent load', 'backfill ≠ catchup']
    : ['спочатку watermark', 'idempotent load', 'backfill ≠ catchup'];
  upsertAfter(j.levels, 'C0', {
    id: 'C0b', type: 'drag_buckets', tag: '📥 · drag',
    title: en ? 'Drag: full vs incremental' : 'Перетягни: full vs incremental',
    instruction: en ? 'Which load pattern fits?' : 'Який патерн load?',
    buckets: [
      { id: 'full', icon: '🔄', title: 'Full', color: '#ff6b6b' },
      { id: 'incr', icon: '➕', title: 'Incremental', color: '#3d9a6a' },
    ],
    items: [
      { text: en ? 'tiny dim country' : 'маленький dim country', bucket: 'full' },
      { text: en ? 'TRUNCATE+INSERT nightly' : 'TRUNCATE+INSERT щоночі', bucket: 'full' },
      { text: 'WHERE updated_at > wm', bucket: 'incr' },
      { text: 'MERGE on business key', bucket: 'incr' },
    ],
    recallTips: en ? ['small dims → full', 'facts → incremental'] : ['малі dims → full', 'факти → incremental'],
  });
  write(fp, j);
}

// stream D0
for (const [fp, en] of [
  ['c:/Users/kolisnyk.o/Cursor/work/de-lab/interactive/blocks/16-stream-nosql-de.json', false],
  ['c:/Users/kolisnyk.o/Cursor/work/de-lab/interactive/blocks/16-stream-nosql-de.en.json', true],
]) {
  const j = load(fp);
  j.levels[0].bullets = [];
  j.levels[0].vizs = [
    j.levels[0].viz,
    {
      type: 'conceptCards',
      title: en ? 'When stream' : 'Коли stream',
      cards: [
        { icon: '📦', title: 'Batch', badge: 'hours OK', color: '#5b8def', rows: [{ ok: true, text: 'nightly mart' }, { ok: false, text: 'fraud <1s' }] },
        { icon: '🌊', title: 'Stream', badge: 'seconds', color: '#4ecdc4', rows: [{ ok: true, text: 'Kafka events' }, { ok: true, text: 'alerts/fraud' }] },
        { icon: '🍃', title: 'Mongo', badge: 'docs', color: '#e8a84b', rows: [{ ok: true, text: 'nested JSON' }, { ok: false, text: en ? 'heavy SQL joins' : 'важкі SQL JOIN' }] },
      ],
      footnote: en ? 'Often: stream → bronze → batch silver.' : 'Часто: stream → bronze → batch silver.',
    },
  ];
  delete j.levels[0].viz;
  j.levels[0].recallTips = en
    ? ['batch vs latency need', 'Kafka = log', 'hybrid lake']
    : ['batch vs потреба в latency', 'Kafka = log', 'hybrid lake'];
  upsertAfter(j.levels, 'D0', {
    id: 'D0b', type: 'drag_buckets', tag: '🌊 · drag',
    title: en ? 'Drag: batch or stream' : 'Перетягни: batch чи stream',
    buckets: [
      { id: 'batch', icon: '📦', title: 'Batch', color: '#5b8def' },
      { id: 'stream', icon: '🌊', title: 'Stream', color: '#4ecdc4' },
    ],
    items: [
      { text: en ? 'daily finance close' : 'daily finance close', bucket: 'batch' },
      { text: en ? 'fraud score < 2s' : 'fraud score < 2s', bucket: 'stream' },
      { text: 'Airflow incremental mart', bucket: 'batch' },
      { text: 'click events → topic', bucket: 'stream' },
    ],
    recallTips: en ? ['hours OK → batch', 'seconds → stream'] : ['години OK → batch', 'секунди → stream'],
  });
  write(fp, j);
}

// SQL S0 — add conceptCards, keep sqlOrder
for (const [fp, en] of [
  ['c:/Users/kolisnyk.o/Cursor/work/de-lab/interactive/blocks/02-sql-interview-10.json', false],
  ['c:/Users/kolisnyk.o/Cursor/work/de-lab/interactive/blocks/02-sql-interview-10.en.json', true],
]) {
  const j = load(fp);
  const s0 = j.levels.find((l) => l.id === 'S0');
  s0.bullets = [];
  s0.vizs = [
    s0.viz,
    {
      type: 'conceptCards',
      title: en ? 'Traps' : 'Пастки',
      cards: [
        { icon: '🏷️', title: 'Alias', badge: 'SELECT', color: '#e8a84b', rows: [{ ok: false, text: 'WHERE alias' }, { ok: true, text: 'ORDER BY alias OK*' }] },
        { icon: '🧮', title: 'GROUP BY', badge: 'rule', color: '#5b8def', rows: [{ ok: true, text: en ? 'non-agg → GROUP BY' : 'не-агрегат → GROUP BY' }, { ok: false, text: 'SELECT * casual' }] },
        { icon: '🪟', title: 'Window', badge: 'OVER', color: '#c77dff', rows: [{ ok: true, text: 'ROW_NUMBER/LAG' }, { ok: true, text: en ? 'rows NOT collapsed' : 'рядки НЕ стискає' }] },
      ],
      footnote: en ? 'Mnemonic FWGHSO — not the order you type.' : 'Мнемоніка FWGHSO — не порядок, як пишеш очима.',
    },
  ];
  delete s0.viz;
  upsertAfter(j.levels, 'S0', {
    id: 'S0b', type: 'drag_buckets', tag: 'SQL · drag',
    title: en ? 'Drag clause into execution step' : 'Перетягни clause у крок виконання',
    instruction: en ? 'Server order, not eyeball order.' : 'Порядок сервера, не очей.',
    buckets: [
      { id: 'early', icon: '1️⃣', title: en ? 'Early' : 'Рано', hint: 'FROM/WHERE', color: '#5b8def' },
      { id: 'mid', icon: '2️⃣', title: en ? 'Middle' : 'Середина', hint: 'GROUP/HAVING', color: '#e8a84b' },
      { id: 'late', icon: '3️⃣', title: en ? 'Late' : 'Пізно', hint: 'SELECT/ORDER', color: '#c77dff' },
    ],
    items: [
      { text: 'FROM', bucket: 'early' },
      { text: 'WHERE', bucket: 'early' },
      { text: 'GROUP BY', bucket: 'mid' },
      { text: 'HAVING', bucket: 'mid' },
      { text: 'SELECT', bucket: 'late' },
      { text: 'ORDER BY', bucket: 'late' },
    ],
    recallTips: ['FWGHSO', 'HAVING after GROUP', 'SELECT late'],
    recallMapRef: en ? '📍 Map: S0 SQL order.' : '📍 Карта: S0 порядок SQL.',
  });
  write(fp, j);
}

// DevOps L0b chmod drag
for (const [fp, en] of [
  ['c:/Users/kolisnyk.o/Cursor/work/devops-lab/interactive/blocks/01-linux-shell-devops.json', false],
  ['c:/Users/kolisnyk.o/Cursor/work/devops-lab/interactive/blocks/01-linux-shell-devops.en.json', true],
]) {
  const j = load(fp);
  upsertAfter(j.levels, 'L0', {
    id: 'L0b', type: 'drag_buckets', tag: en ? '🐧 · drag' : '🐧 · drag',
    title: en ? 'Drag into safe vs hole' : 'Перетягни: safe vs дірка',
    buckets: [
      { id: 'safe', icon: '🔐', title: '755 safe', color: '#3d9a6a' },
      { id: 'hole', icon: '☠️', title: '777 hole', color: '#ff6b6b' },
    ],
    items: [
      { text: en ? 'owner rwx only write' : 'пише лише owner', bucket: 'safe' },
      { text: en ? 'group/other can execute' : 'group/other execute', bucket: 'safe' },
      { text: en ? 'world can overwrite script' : 'будь-хто перезапише скрипт', bucket: 'hole' },
      { text: 'interview red flag', bucket: 'hole' },
    ],
    recallTips: ['755 ≠ 777'],
    recallMapRef: en ? '📍 Map: L0 shell.' : '📍 Карта: L0 shell.',
  });
  write(fp, j);
}

console.log('all patches done');
