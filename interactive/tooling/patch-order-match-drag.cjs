const fs = require('fs');

function load(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }
function write(p, j) { fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n'); console.log('wrote', p.split('/').pop()); }
function upsertAfter(levels, afterId, level) {
  const i = levels.findIndex((l) => l.id === afterId);
  if (i < 0) throw new Error('missing ' + afterId);
  const e = levels.findIndex((l) => l.id === level.id);
  if (e >= 0) levels[e] = level;
  else levels.splice(i + 1, 0, level);
}

const p0VizUa = [
  {
    type: 'typeFamily',
    title: '3️⃣ сімʼї — дві осі: порядок і [i]',
    families: [
      {
        icon: '📚', title: 'Sequence', types: 'list · tuple · str · range', color: '#5b8def',
        traits: [
          { yes: true, label: 'порядок', value: 'ТАК — місця 0,1,2…' },
          { yes: true, label: 'доступ', value: '[i] / slice' },
          { yes: true, label: 'tuple', value: 'теж sequence (immutable list)' },
        ],
        holdLabel: 'елемент OK', canHold: ['int', 'str', 'list', 'dict', 'tuple'],
        noHoldLabel: 'індекс НЕ', cannotHold: ['dict', 'set', 'list'],
      },
      {
        icon: '🗝️', title: 'Mapping', types: 'dict', color: '#3d9a6a',
        traits: [
          { yes: true, label: 'порядок ітерації', value: 'є з 3.7+ (insertion)' },
          { yes: false, label: 'доступ [0]', value: 'НІ — лише [key]' },
          { yes: true, label: 'ключ', value: 'унікальний · hashable' },
        ],
        holdLabel: 'ключ OK', canHold: ['str', 'int', 'float', 'tuple', 'bool'],
        noHoldLabel: 'ключ НЕ', cannotHold: ['list', 'dict', 'set'],
      },
      {
        icon: '🎯', title: 'Set', types: 'set · frozenset', color: '#c77dff',
        traits: [
          { yes: false, label: 'порядок', value: 'НЕ гарантований' },
          { yes: false, label: 'доступ', value: 'немає set[i]' },
          { yes: true, label: 'унікальність', value: 'авто' },
        ],
        holdLabel: 'член OK', canHold: ['str', 'int', 'tuple'],
        noHoldLabel: 'член НЕ', cannotHold: ['list', 'dict', 'set'],
      },
    ],
    footnote: 'НЕ лише tuple має порядок. list+tuple+str = sequence. dict: порядок вставки є, але d[0] = ключ 0, не «перший». set: без порядку й індексу.',
  },
  {
    type: 'accessRules',
    title: 'Порядок є? Можна [i]?',
    colA: 'тип', colB: 'порядок', colC: 'доступ',
    rows: [
      { icon: '📚', who: 'list', need: 'порядок ТАК', example: 'a[0] · a[1:3] ✓', color: '#5b8def' },
      { icon: '🔒', who: 'tuple', need: 'порядок ТАК (як list)', example: 't[0] ✓ · assign ✗', color: '#4ecdc4' },
      { icon: '🔤', who: 'str', need: 'порядок ТАК', example: "s[0] · s[::-1] ✓", color: '#5b8def' },
      { icon: '🗝️', who: 'dict', need: 'insert order при for', example: "d['a'] ✓ · d[0] тільки якщо ключ=0", color: '#3d9a6a' },
      { icon: '🎯', who: 'set', need: 'порядок НІ', example: 'set[i] → TypeError', color: '#c77dff' },
    ],
    footnote: 'На інтервʼю: «sequence = індекс int; dict = ключ; set = ні те, ні інше».',
  },
  {
    type: 'splitCompare',
    columns: [
      { title: '🐼 Pandas', color: '#5b8def', items: ['groupby + agg mean', "merge how='left'", 'fillna з присвоєнням'] },
      { title: '🐍 Pure Python', color: '#e8a84b', items: ['counts.get(k,0)+1', 'for / join', 'if x is None'] },
    ],
  },
  {
    type: 'conceptCards',
    title: 'Образи',
    cards: [
      { icon: '📚', title: 'list/tuple/str', badge: 'черга з номерами', color: '#5b8def', rows: [{ ok: true, text: 'words[0]' }, { ok: true, text: '(1,2)[1]→2' }, { ok: false, text: 'words[{1}]' }] },
      { icon: '🗝️', title: 'dict', badge: 'шухлядки з бірками', color: '#3d9a6a', hint: 'черга бірок є ≠ індекс', rows: [{ ok: true, text: "d['a']" }, { ok: true, text: 'for k in d' }, { ok: false, text: 'd[0]=«перший»' }] },
      { icon: '🎯', title: 'set', badge: 'мішок', color: '#c77dff', rows: [{ ok: true, text: '{1,2,2}→{1,2}' }, { ok: false, text: 's[0]' }, { ok: false, text: 'ключ=set' }] },
    ],
  },
];

const p0Ua = {
  id: 'P0', type: 'theory', tag: 'PY · карта', title: 'Чистий Python vs Pandas',
  instruction: 'Скрінінг без pandas — май обидва шаблони. Спочатку: у кого порядок і [i], у кого лише ключ.',
  vizs: p0VizUa,
  bullets: [],
  recallTips: [
    '📚 list+tuple+str = sequence ([i])',
    '🗝️ dict: insert order є; доступ лише [key]',
    '🎯 set: ні порядку, ні індексу',
    '🐍 counter · 🐼 groupby',
  ],
};

const p0En = {
  id: 'P0', type: 'theory', tag: 'PY · map', title: 'Pure Python vs Pandas',
  instruction: 'Screening may ban pandas — keep both templates. First: who has order and [i], who is key-only.',
  vizs: [
    {
      type: 'typeFamily',
      title: '3️⃣ families — two axes: order and [i]',
      families: [
        { icon: '📚', title: 'Sequence', types: 'list · tuple · str · range', color: '#5b8def', traits: [
          { yes: true, label: 'order', value: 'YES — seats 0,1,2…' },
          { yes: true, label: 'access', value: '[i] / slice' },
          { yes: true, label: 'tuple', value: 'also sequence (immutable)' },
        ], holdLabel: 'element OK', canHold: ['int', 'str', 'list', 'dict', 'tuple'], noHoldLabel: 'index NOT', cannotHold: ['dict', 'set', 'list'] },
        { icon: '🗝️', title: 'Mapping', types: 'dict', color: '#3d9a6a', traits: [
          { yes: true, label: 'iteration order', value: 'YES since 3.7 (insertion)' },
          { yes: false, label: 'access [0]', value: 'NO — [key] only' },
          { yes: true, label: 'key', value: 'unique · hashable' },
        ], holdLabel: 'key OK', canHold: ['str', 'int', 'float', 'tuple', 'bool'], noHoldLabel: 'key NOT', cannotHold: ['list', 'dict', 'set'] },
        { icon: '🎯', title: 'Set', types: 'set · frozenset', color: '#c77dff', traits: [
          { yes: false, label: 'order', value: 'NOT guaranteed' },
          { yes: false, label: 'access', value: 'no set[i]' },
          { yes: true, label: 'uniqueness', value: 'auto' },
        ], holdLabel: 'member OK', canHold: ['str', 'int', 'tuple'], noHoldLabel: 'member NOT', cannotHold: ['list', 'dict', 'set'] },
      ],
      footnote: 'Not only tuple has order. list+tuple+str = sequence. dict keeps insertion order, but d[0] means key 0, not «first». set: no order, no index.',
    },
    {
      type: 'accessRules', title: 'Has order? Can [i]?',
      colA: 'type', colB: 'order', colC: 'access',
      rows: [
        { icon: '📚', who: 'list', need: 'order YES', example: 'a[0] · a[1:3] ✓', color: '#5b8def' },
        { icon: '🔒', who: 'tuple', need: 'order YES (like list)', example: 't[0] ✓ · assign ✗', color: '#4ecdc4' },
        { icon: '🔤', who: 'str', need: 'order YES', example: 's[0] · s[::-1] ✓', color: '#5b8def' },
        { icon: '🗝️', who: 'dict', need: 'insert order on for', example: "d['a'] ✓ · d[0] only if key is 0", color: '#3d9a6a' },
        { icon: '🎯', who: 'set', need: 'order NO', example: 'set[i] → TypeError', color: '#c77dff' },
      ],
      footnote: 'Interview line: sequence = int index; dict = key; set = neither.',
    },
    {
      type: 'splitCompare',
      columns: [
        { title: '🐼 Pandas', color: '#5b8def', items: ['groupby + agg mean', "merge how='left'", 'fillna with assign'] },
        { title: '🐍 Pure Python', color: '#e8a84b', items: ['counts.get(k,0)+1', 'for / join', 'if x is None'] },
      ],
    },
    {
      type: 'conceptCards', title: 'Images',
      cards: [
        { icon: '📚', title: 'list/tuple/str', badge: 'numbered queue', color: '#5b8def', rows: [{ ok: true, text: 'words[0]' }, { ok: true, text: '(1,2)[1]→2' }, { ok: false, text: 'words[{1}]' }] },
        { icon: '🗝️', title: 'dict', badge: 'tagged lockers', color: '#3d9a6a', hint: 'tag queue ≠ index', rows: [{ ok: true, text: "d['a']" }, { ok: true, text: 'for k in d' }, { ok: false, text: 'd[0]=«first»' }] },
        { icon: '🎯', title: 'set', badge: 'bag', color: '#c77dff', rows: [{ ok: true, text: '{1,2,2}→{1,2}' }, { ok: false, text: 's[0]' }, { ok: false, text: 'key=set' }] },
      ],
    },
  ],
  bullets: [],
  recallTips: [
    '📚 list+tuple+str = sequence ([i])',
    '🗝️ dict: insertion order yes; access [key] only',
    '🎯 set: no order, no index',
    '🐍 counter · 🐼 groupby',
  ],
};

const p0bExtraUa = {
  id: 'P0c', type: 'drag_buckets', tag: 'PY · drag 2',
  title: 'Порядок vs індекс — розклади твердження',
  instruction: 'Закріпи плутанину: що правда для sequence / dict / set.',
  buckets: [
    { id: 'seq', icon: '📚', title: 'Sequence', hint: 'list/tuple/str', color: '#5b8def' },
    { id: 'dict', icon: '🗝️', title: 'dict', hint: 'mapping', color: '#3d9a6a' },
    { id: 'set', icon: '🎯', title: 'set', hint: 'unique', color: '#c77dff' },
  ],
  items: [
    { text: 'є a[0] за позицією', bucket: 'seq' },
    { text: 'tuple теж з порядком', bucket: 'seq' },
    { text: 'for зберігає insert order', bucket: 'dict' },
    { text: 'd[0] = ключ 0, не «перший»', bucket: 'dict' },
    { text: 'немає гарантованого порядку', bucket: 'set' },
    { text: 'немає s[i]', bucket: 'set' },
  ],
  recallTips: ['sequence=[i]', 'dict=key (+insert order)', 'set=ні'],
  recallMapRef: '📍 P0 карта порядку.',
};

const p0bExtraEn = {
  ...JSON.parse(JSON.stringify(p0bExtraUa)),
  title: 'Order vs index — sort the claims',
  instruction: 'Lock the confusion: what is true for sequence / dict / set.',
  buckets: [
    { id: 'seq', icon: '📚', title: 'Sequence', hint: 'list/tuple/str', color: '#5b8def' },
    { id: 'dict', icon: '🗝️', title: 'dict', hint: 'mapping', color: '#3d9a6a' },
    { id: 'set', icon: '🎯', title: 'set', hint: 'unique', color: '#c77dff' },
  ],
  items: [
    { text: 'has a[0] by position', bucket: 'seq' },
    { text: 'tuple also has order', bucket: 'seq' },
    { text: 'for keeps insert order', bucket: 'dict' },
    { text: 'd[0] = key 0, not «first»', bucket: 'dict' },
    { text: 'no guaranteed order', bucket: 'set' },
    { text: 'no s[i]', bucket: 'set' },
  ],
  recallTips: ['sequence=[i]', 'dict=key (+insert order)', 'set=neither'],
  recallMapRef: '📍 P0 order map.',
};

// patch python files
for (const [fp, p0, extra] of [
  ['c:/Users/kolisnyk.o/Cursor/work/de-lab/interactive/blocks/03-python-interview-10.json', p0Ua, p0bExtraUa],
  ['c:/Users/kolisnyk.o/Cursor/work/de-lab/interactive/blocks/03-python-interview-10.en.json', p0En, p0bExtraEn],
]) {
  const j = load(fp);
  const i = j.levels.findIndex((l) => l.id === 'P0');
  j.levels[i] = p0;
  // refresh P0b study viz footnote
  const p0b = j.levels.find((l) => l.id === 'P0b');
  if (p0b) {
    p0b.studyViz = {
      type: 'accessRules',
      title: fp.endsWith('.en.json') ? 'Before drag: order ≠ only tuple' : 'Перед drag: порядок ≠ лише tuple',
      colA: 'type', colB: 'order?', colC: '[i]?',
      rows: [
        { icon: '📚', who: 'list/tuple/str', need: 'YES', example: 'YES', color: '#5b8def' },
        { icon: '🗝️', who: 'dict', need: 'insert YES', example: 'NO (key)', color: '#3d9a6a' },
        { icon: '🎯', who: 'set', need: 'NO', example: 'NO', color: '#c77dff' },
      ],
    };
    p0b.recallTips = fp.endsWith('.en.json')
      ? ['tuple = immutable sequence', 'dict ≠ no order (has insert order)', 'set = no [i]']
      : ['tuple = immutable sequence', 'dict ≠ «без порядку» (є insert)', 'set = без [i]'];
  }
  upsertAfter(j.levels, 'P0b', extra);
  write(fp, j);
}

// MATCH → drag for key blocks
const matchDrags = [
  {
    files: [
      'c:/Users/kolisnyk.o/Cursor/work/de-lab/interactive/blocks/13-cloud-storage-de.json',
      'c:/Users/kolisnyk.o/Cursor/work/de-lab/interactive/blocks/13-cloud-storage-de.en.json',
    ],
    after: 'A1',
    levelUa: {
      id: 'A1b', type: 'drag_buckets', tag: '☁️ · drag',
      title: 'Закріпи MATCH: вендор-кошик',
      instruction: 'Після study — куди термін «живе» у трійці хмар (патерн, не бренд).',
      buckets: [
        { id: 'store', icon: '📦', title: 'Store', hint: 'bucket/container', color: '#5b8def' },
        { id: 'auth', icon: '🔐', title: 'Auth', hint: 'IAM/RBAC', color: '#3d9a6a' },
        { id: 'tier', icon: '❄️', title: 'Cold tier', hint: 'archive', color: '#8b9cb3' },
      ],
      items: [
        { text: 'S3 bucket', bucket: 'store' },
        { text: 'Blob container', bucket: 'store' },
        { text: 'IAM role', bucket: 'auth' },
        { text: 'Azure RBAC', bucket: 'auth' },
        { text: 'Glacier', bucket: 'tier' },
        { text: 'Coldline', bucket: 'tier' },
      ],
      recallMapRef: '📍 Після A1 MATCH.',
    },
    levelEn: null,
  },
];

// build EN as copy with EN titles for A1b
matchDrags[0].levelEn = {
  ...JSON.parse(JSON.stringify(matchDrags[0].levelUa)),
  title: 'Lock MATCH: vendor bucket',
  instruction: 'After study — which cloud pattern does the term belong to?',
  recallMapRef: '📍 After A1 MATCH.',
};

for (const spec of matchDrags) {
  const [uaPath, enPath] = spec.files;
  const ua = load(uaPath); upsertAfter(ua.levels, spec.after, spec.levelUa); write(uaPath, ua);
  const en = load(enPath); upsertAfter(en.levels, spec.after, spec.levelEn); write(enPath, en);
}

const devopsMatch = [
  ['01-linux-shell-devops', 'L1', 'L1b', {
    ua: { title: 'Закріпи MATCH: chmod', buckets: [
      { id: 'ok', icon: '🔐', title: '755', color: '#3d9a6a' },
      { id: 'bad', icon: '☠️', title: '777', color: '#ff6b6b' },
    ], items: [
      { text: 'owner rwx', bucket: 'ok' },
      { text: 'other r-x', bucket: 'ok' },
      { text: 'world writable', bucket: 'bad' },
      { text: 'anyone overwrites script', bucket: 'bad' },
    ]},
    en: { title: 'Lock MATCH: chmod', buckets: [
      { id: 'ok', icon: '🔐', title: '755', color: '#3d9a6a' },
      { id: 'bad', icon: '☠️', title: '777', color: '#ff6b6b' },
    ], items: [
      { text: 'owner rwx', bucket: 'ok' },
      { text: 'other r-x', bucket: 'ok' },
      { text: 'world writable', bucket: 'bad' },
      { text: 'anyone overwrites script', bucket: 'bad' },
    ]},
  }],
  ['06-prod-devops', 'R1', 'R1b', {
    ua: { title: 'Закріпи MATCH: SRE термін', buckets: [
      { id: 'm', icon: '📊', title: 'Вимір', color: '#5b8def' },
      { id: 't', icon: '🎯', title: 'Ціль', color: '#e8a84b' },
      { id: 'a', icon: '📋', title: 'Дія', color: '#3d9a6a' },
    ], items: [
      { text: 'SLI', bucket: 'm' },
      { text: 'error rate', bucket: 'm' },
      { text: 'SLO', bucket: 't' },
      { text: 'error budget', bucket: 't' },
      { text: 'Runbook', bucket: 'a' },
      { text: 'blameless PM', bucket: 'a' },
    ]},
    en: { title: 'Lock MATCH: SRE term', buckets: [
      { id: 'm', icon: '📊', title: 'Measure', color: '#5b8def' },
      { id: 't', icon: '🎯', title: 'Target', color: '#e8a84b' },
      { id: 'a', icon: '📋', title: 'Action', color: '#3d9a6a' },
    ], items: [
      { text: 'SLI', bucket: 'm' },
      { text: 'error rate', bucket: 'm' },
      { text: 'SLO', bucket: 't' },
      { text: 'error budget', bucket: 't' },
      { text: 'Runbook', bucket: 'a' },
      { text: 'blameless PM', bucket: 'a' },
    ]},
  }],
  ['03-docker-devops', 'D1', 'D1b', {
    ua: { title: 'Закріпи MATCH: image/container', buckets: [
      { id: 'img', icon: '🧊', title: 'Image', color: '#5b8def' },
      { id: 'ctr', icon: '▶️', title: 'Container', color: '#e8a84b' },
    ], items: [
      { text: 'immutable layers', bucket: 'img' },
      { text: 'pin tag', bucket: 'img' },
      { text: 'running process', bucket: 'ctr' },
      { text: 'stop/rm', bucket: 'ctr' },
    ]},
    en: { title: 'Lock MATCH: image/container', buckets: [
      { id: 'img', icon: '🧊', title: 'Image', color: '#5b8def' },
      { id: 'ctr', icon: '▶️', title: 'Container', color: '#e8a84b' },
    ], items: [
      { text: 'immutable layers', bucket: 'img' },
      { text: 'pin tag', bucket: 'img' },
      { text: 'running process', bucket: 'ctr' },
      { text: 'stop/rm', bucket: 'ctr' },
    ]},
  }],
  ['04-terraform-devops', 'T1', 'T1b', {
    ua: { title: 'Закріпи MATCH: plan/apply/state', buckets: [
      { id: 'p', icon: '👀', title: 'plan', color: '#5b8def' },
      { id: 'a', icon: '⚡', title: 'apply', color: '#3d9a6a' },
      { id: 's', icon: '💾', title: 'state', color: '#e8a84b' },
    ], items: [
      { text: 'preview +/-/~', bucket: 'p' },
      { text: 'no cloud change', bucket: 'p' },
      { text: 'writes cloud', bucket: 'a' },
      { text: 'updates tfstate', bucket: 'a' },
      { text: 'resource IDs', bucket: 's' },
      { text: 'remote + lock', bucket: 's' },
    ]},
    en: { title: 'Lock MATCH: plan/apply/state', buckets: [
      { id: 'p', icon: '👀', title: 'plan', color: '#5b8def' },
      { id: 'a', icon: '⚡', title: 'apply', color: '#3d9a6a' },
      { id: 's', icon: '💾', title: 'state', color: '#e8a84b' },
    ], items: [
      { text: 'preview +/-/~', bucket: 'p' },
      { text: 'no cloud change', bucket: 'p' },
      { text: 'writes cloud', bucket: 'a' },
      { text: 'updates tfstate', bucket: 'a' },
      { text: 'resource IDs', bucket: 's' },
      { text: 'remote + lock', bucket: 's' },
    ]},
  }],
  ['05-k8s-devops', 'K1', 'K1b', {
    ua: { title: 'Закріпи MATCH: K8s роль', buckets: [
      { id: 'd', icon: '📋', title: 'Deployment', color: '#5b8def' },
      { id: 'p', icon: '🧬', title: 'Pod', color: '#3d9a6a' },
      { id: 's', icon: '🚪', title: 'Service', color: '#e8a84b' },
    ], items: [
      { text: 'desired replicas', bucket: 'd' },
      { text: 'rolling update', bucket: 'd' },
      { text: '1+ containers', bucket: 'p' },
      { text: 'ephemeral', bucket: 'p' },
      { text: 'stable DNS', bucket: 's' },
      { text: 'selector labels', bucket: 's' },
    ]},
    en: { title: 'Lock MATCH: K8s role', buckets: [
      { id: 'd', icon: '📋', title: 'Deployment', color: '#5b8def' },
      { id: 'p', icon: '🧬', title: 'Pod', color: '#3d9a6a' },
      { id: 's', icon: '🚪', title: 'Service', color: '#e8a84b' },
    ], items: [
      { text: 'desired replicas', bucket: 'd' },
      { text: 'rolling update', bucket: 'd' },
      { text: '1+ containers', bucket: 'p' },
      { text: 'ephemeral', bucket: 'p' },
      { text: 'stable DNS', bucket: 's' },
      { text: 'selector labels', bucket: 's' },
    ]},
  }],
  ['02-git-ci-devops', 'G1', 'G1b', {
    ua: { title: 'Закріпи MATCH: Git/CI', buckets: [
      { id: 'do', icon: '✅', title: 'Do', color: '#3d9a6a' },
      { id: 'dont', icon: '⛔', title: "Don't", color: '#ff6b6b' },
    ], items: [
      { text: 'feature PR', bucket: 'do' },
      { text: 'green CI', bucket: 'do' },
      { text: 'force push main', bucket: 'dont' },
      { text: 'merge red CI', bucket: 'dont' },
    ]},
    en: { title: 'Lock MATCH: Git/CI', buckets: [
      { id: 'do', icon: '✅', title: 'Do', color: '#3d9a6a' },
      { id: 'dont', icon: '⛔', title: "Don't", color: '#ff6b6b' },
    ], items: [
      { text: 'feature PR', bucket: 'do' },
      { text: 'green CI', bucket: 'do' },
      { text: 'force push main', bucket: 'dont' },
      { text: 'merge red CI', bucket: 'dont' },
    ]},
  }],
];

const baseOps = 'c:/Users/kolisnyk.o/Cursor/work/devops-lab/interactive/blocks/';
for (const [stem, after, id, pack] of devopsMatch) {
  for (const en of [false, true]) {
    const fp = baseOps + stem + (en ? '.en.json' : '.json');
    const j = load(fp);
    const src = en ? pack.en : pack.ua;
    upsertAfter(j.levels, after, {
      id, type: 'drag_buckets', tag: 'drag · MATCH',
      title: src.title,
      instruction: en ? 'After MATCH study — sort chips.' : 'Після MATCH study — розклади чіпи.',
      buckets: src.buckets,
      items: src.items,
      recallMapRef: `📍 After ${after} MATCH.`,
    });
    write(fp, j);
  }
}

// DE MATCH: O1, E1, C1, stream D1, python P9
const deMatch = [
  ['14-orchestration-de', 'O1', 'O1b', {
    ua: { title: 'Закріпи MATCH: orch термін', buckets: [
      { id: 'g', icon: '🕸', title: 'Graph', color: '#3d9a6a' },
      { id: 'w', icon: '👂', title: 'Wait', color: '#c77dff' },
      { id: 'c', icon: '🕒', title: 'Cron', color: '#8b9cb3' },
    ], items: [
      { text: 'DAG', bucket: 'g' },
      { text: 'Operator', bucket: 'g' },
      { text: 'Sensor', bucket: 'w' },
      { text: 'crontab 5 fields', bucket: 'c' },
    ]},
    en: { title: 'Lock MATCH: orch term', buckets: [
      { id: 'g', icon: '🕸', title: 'Graph', color: '#3d9a6a' },
      { id: 'w', icon: '👂', title: 'Wait', color: '#c77dff' },
      { id: 'c', icon: '🕒', title: 'Cron', color: '#8b9cb3' },
    ], items: [
      { text: 'DAG', bucket: 'g' },
      { text: 'Operator', bucket: 'g' },
      { text: 'Sensor', bucket: 'w' },
      { text: 'crontab 5 fields', bucket: 'c' },
    ]},
  }],
  ['17-governance-ops-de', 'E1', 'E1b', {
    ua: { title: 'Закріпи MATCH: governance', buckets: [
      { id: 'g', icon: '🔗', title: 'Graph/docs', color: '#5b8def' },
      { id: 's', icon: '📟', title: 'Signal', color: '#e8a84b' },
      { id: 'a', icon: '🚑', title: 'Action', color: '#ff6b6b' },
    ], items: [
      { text: 'Lineage', bucket: 'g' },
      { text: 'Data catalog', bucket: 'g' },
      { text: 'freshness miss', bucket: 's' },
      { text: 'Runbook', bucket: 'a' },
    ]},
    en: { title: 'Lock MATCH: governance', buckets: [
      { id: 'g', icon: '🔗', title: 'Graph/docs', color: '#5b8def' },
      { id: 's', icon: '📟', title: 'Signal', color: '#e8a84b' },
      { id: 'a', icon: '🚑', title: 'Action', color: '#ff6b6b' },
    ], items: [
      { text: 'Lineage', bucket: 'g' },
      { text: 'Data catalog', bucket: 'g' },
      { text: 'freshness miss', bucket: 's' },
      { text: 'Runbook', bucket: 'a' },
    ]},
  }],
];

const baseDe = 'c:/Users/kolisnyk.o/Cursor/work/de-lab/interactive/blocks/';
for (const [stem, after, id, pack] of deMatch) {
  for (const en of [false, true]) {
    const fp = baseDe + stem + (en ? '.en.json' : '.json');
    const j = load(fp);
    const src = en ? pack.en : pack.ua;
    upsertAfter(j.levels, after, {
      id, type: 'drag_buckets', tag: 'drag · MATCH',
      title: src.title,
      instruction: en ? 'After MATCH study — sort chips.' : 'Після MATCH study — розклади чіпи.',
      buckets: src.buckets,
      items: src.items,
      recallMapRef: `📍 After ${after} MATCH.`,
    });
    write(fp, j);
  }
}

// Python P9 after MATCH
for (const en of [false, true]) {
  const fp = baseDe + '03-python-interview-10' + (en ? '.en.json' : '.json');
  const j = load(fp);
  upsertAfter(j.levels, 'P9', {
    id: 'P9b', type: 'drag_buckets', tag: 'PY · drag MATCH',
    title: en ? 'Lock MATCH: access family' : 'Закріпи MATCH: сімʼя доступу',
    instruction: en ? 'After type MATCH — where does each access pattern live?' : 'Після MATCH типів — куди патерн доступу?',
    buckets: [
      { id: 'seq', icon: '📚', title: 'Sequence', color: '#5b8def' },
      { id: 'map', icon: '🗝️', title: 'dict', color: '#3d9a6a' },
      { id: 'chk', icon: '🧪', title: 'Check', color: '#e8a84b' },
    ],
    items: [
      { text: 'list[i]', bucket: 'seq' },
      { text: 'word[::-1]', bucket: 'seq' },
      { text: 'dict[k]', bucket: 'map' },
      { text: 'counts.get(k,0)', bucket: 'map' },
      { text: 'isinstance(x, dict)', bucket: 'chk' },
    ],
    recallMapRef: '📍 After P9 MATCH.',
  });
  write(fp, j);
}

console.log('done');
