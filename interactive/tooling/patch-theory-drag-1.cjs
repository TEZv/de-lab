const fs = require('fs');
const path = require('path');

function write(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n');
  console.log('wrote', path.basename(p));
}
function load(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }
function upsertAfter(levels, afterId, level) {
  const i = levels.findIndex((l) => l.id === afterId);
  if (i < 0) throw new Error('missing ' + afterId);
  const exists = levels.findIndex((l) => l.id === level.id);
  if (exists >= 0) levels[exists] = level;
  else levels.splice(i + 1, 0, level);
}

const pyPath = 'c:/Users/kolisnyk.o/Cursor/work/de-lab/interactive/blocks/03-python-interview-10.json';
const pyEnPath = 'c:/Users/kolisnyk.o/Cursor/work/de-lab/interactive/blocks/03-python-interview-10.en.json';
const py = load(pyPath);
const pyDrag = {
  id: 'P0b',
  type: 'drag_buckets',
  tag: 'PY · drag',
  title: 'Перетягни тип у сімʼю',
  instruction: 'Закріпи P0 руками: кожен тип — у Sequence / Mapping / Set.',
  bucketTip: 'Перетягни чіпи з пулу в три кошики.',
  studyViz: {
    type: 'typeFamily',
    title: 'Підказка-карта (якщо забула)',
    families: [
      { icon: '📚', title: 'Sequence', types: 'порядок + індекс', color: '#5b8def', traits: [{ yes: true, label: 'індекс', value: 'int/slice' }] },
      { icon: '🗝️', title: 'Mapping', types: 'ключ → значення', color: '#3d9a6a', traits: [{ yes: true, label: 'ключ', value: 'hashable' }] },
      { icon: '🎯', title: 'Set', types: 'унікальні', color: '#c77dff', traits: [{ yes: false, label: 'індекс', value: 'немає' }] },
    ],
  },
  buckets: [
    { id: 'seq', icon: '📚', title: 'Sequence', hint: 'list · tuple · str', color: '#5b8def' },
    { id: 'map', icon: '🗝️', title: 'Mapping', hint: 'dict', color: '#3d9a6a' },
    { id: 'set', icon: '🎯', title: 'Set', hint: 'set · frozenset', color: '#c77dff' },
  ],
  items: [
    { text: 'list', bucket: 'seq' },
    { text: 'tuple', bucket: 'seq' },
    { text: 'str', bucket: 'seq' },
    { text: 'dict', bucket: 'map' },
    { text: 'set', bucket: 'set' },
    { text: 'frozenset', bucket: 'set' },
  ],
  recallTips: ['📚 індекс int', '🗝️ ключ hashable', '🎯 без set[i]'],
  recallMapRef: '📍 Карта: P0 «Чистий Python vs Pandas».',
};
upsertAfter(py.levels, 'P0', pyDrag);
write(pyPath, py);

const pyEn = load(pyEnPath);
const pyDragEn = JSON.parse(JSON.stringify(pyDrag));
pyDragEn.title = 'Drag type into family';
pyDragEn.instruction = 'Lock P0 with your hands: each type → Sequence / Mapping / Set.';
pyDragEn.bucketTip = 'Drag chips from the pool into three buckets.';
pyDragEn.studyViz.title = 'Hint map (if you forgot)';
pyDragEn.studyViz.families[0].types = 'order + index';
pyDragEn.studyViz.families[0].traits = [{ yes: true, label: 'index', value: 'int/slice' }];
pyDragEn.studyViz.families[1].types = 'key → value';
pyDragEn.studyViz.families[1].traits = [{ yes: true, label: 'key', value: 'hashable' }];
pyDragEn.studyViz.families[2].types = 'uniques';
pyDragEn.studyViz.families[2].traits = [{ yes: false, label: 'index', value: 'none' }];
pyDragEn.recallTips = ['📚 int index', '🗝️ hashable key', '🎯 no set[i]'];
pyDragEn.recallMapRef = '📍 Map: P0 «Pure Python vs Pandas».';
upsertAfter(pyEn.levels, 'P0', pyDragEn);
write(pyEnPath, pyEn);

const aPath = 'c:/Users/kolisnyk.o/Cursor/work/de-lab/interactive/blocks/13-cloud-storage-de.json';
const aEnPath = 'c:/Users/kolisnyk.o/Cursor/work/de-lab/interactive/blocks/13-cloud-storage-de.en.json';
const a = load(aPath);
a.levels[0] = {
  id: 'A0',
  type: 'theory',
  tag: '☁️ · карта',
  title: 'Object storage + зони lake',
  instruction: 'Один патерн — три хмари. Зони = зрілість даних.',
  vizs: [
    {
      type: 'layerStack',
      title: 'Зони lake (знизу «брудніше»)',
      layers: [
        { label: 'bronze / raw', sublabel: 'як приїхало', color: '#8b9cb3', icon: '📥' },
        { label: 'silver / curated', sublabel: 'typed · dedup', color: '#5b8def', icon: '🧽' },
        { label: 'gold / marts', sublabel: 'вітрини BI/ML', color: '#e8a84b', icon: '📊' },
      ],
      side: [
        { label: 'AWS', items: ['S3', 'IAM', 'Glacier'] },
        { label: 'Azure', items: ['Blob', 'RBAC', 'Archive'] },
        { label: 'GCP', items: ['GCS', 'IAM', 'Coldline'] },
      ],
    },
    {
      type: 'conceptCards',
      title: 'Памʼять інтервʼю',
      cards: [
        { icon: '📁', title: 'Object store', badge: 'не БД', color: '#5b8def', rows: [{ ok: true, text: 'файли + prefix' }, { ok: false, text: 'JOIN у S3' }] },
        { icon: '🗂️', title: 'Partition', badge: 'шлях', color: '#3d9a6a', rows: [{ ok: true, text: 'year=/month=/day=' }, { ok: true, text: 'дешевший scan' }] },
        { icon: '📦', title: 'Parquet', badge: 'колонки', color: '#e8a84b', rows: [{ ok: true, text: 'pushdown' }, { ok: false, text: 'CSV always' }] },
      ],
      footnote: 'bronze=коробка з пошти · silver=розпаковано · gold=вітрина в залі.',
    },
  ],
  bullets: [],
  recallTips: ['S3≠SQL JOIN', 'partition у key', 'bronze→silver→gold'],
  recallMapRef: '📍 Bridge: DevOps K8s · K0.',
};
upsertAfter(a.levels, 'A0', {
  id: 'A0b',
  type: 'drag_buckets',
  tag: '☁️ · drag',
  title: 'Перетягни артефакт у зону lake',
  instruction: 'Куди кладеш сирий JSON, typed table, BI mart?',
  buckets: [
    { id: 'bronze', icon: '📥', title: 'Bronze', hint: 'raw', color: '#8b9cb3' },
    { id: 'silver', icon: '🧽', title: 'Silver', hint: 'curated', color: '#5b8def' },
    { id: 'gold', icon: '📊', title: 'Gold', hint: 'mart', color: '#e8a84b' },
  ],
  items: [
    { text: 'API JSON dump as-is', bucket: 'bronze' },
    { text: 'raw app logs', bucket: 'bronze' },
    { text: 'typed orders parquet', bucket: 'silver' },
    { text: 'deduped customers', bucket: 'silver' },
    { text: 'mart_revenue', bucket: 'gold' },
    { text: 'KPI dashboard table', bucket: 'gold' },
  ],
  recallTips: ['raw → bronze', 'typed → silver', 'BI → gold'],
  recallMapRef: '📍 Карта: A0 зони lake.',
});
write(aPath, a);

const aEn = load(aEnPath);
aEn.levels[0] = {
  id: 'A0', type: 'theory', tag: '☁️ · map', title: 'Object storage + lake zones',
  instruction: 'One pattern — three clouds. Zones = data maturity.',
  vizs: [
    {
      type: 'layerStack', title: 'Lake zones (raw at bottom)',
      layers: [
        { label: 'bronze / raw', sublabel: 'as landed', color: '#8b9cb3', icon: '📥' },
        { label: 'silver / curated', sublabel: 'typed · dedup', color: '#5b8def', icon: '🧽' },
        { label: 'gold / marts', sublabel: 'BI/ML marts', color: '#e8a84b', icon: '📊' },
      ],
      side: [
        { label: 'AWS', items: ['S3', 'IAM', 'Glacier'] },
        { label: 'Azure', items: ['Blob', 'RBAC', 'Archive'] },
        { label: 'GCP', items: ['GCS', 'IAM', 'Coldline'] },
      ],
    },
    {
      type: 'conceptCards', title: 'Interview memory',
      cards: [
        { icon: '📁', title: 'Object store', badge: 'not a DB', color: '#5b8def', rows: [{ ok: true, text: 'files + prefix' }, { ok: false, text: 'JOIN in S3' }] },
        { icon: '🗂️', title: 'Partition', badge: 'path', color: '#3d9a6a', rows: [{ ok: true, text: 'year=/month=/day=' }, { ok: true, text: 'cheaper scan' }] },
        { icon: '📦', title: 'Parquet', badge: 'columns', color: '#e8a84b', rows: [{ ok: true, text: 'pushdown' }, { ok: false, text: 'CSV always' }] },
      ],
      footnote: 'bronze=mailbox · silver=unpacked · gold=shop window.',
    },
  ],
  bullets: [],
  recallTips: ['S3≠SQL JOIN', 'partition in key', 'bronze→silver→gold'],
  recallMapRef: '📍 Bridge: DevOps K8s · K0.',
};
upsertAfter(aEn.levels, 'A0', {
  id: 'A0b', type: 'drag_buckets', tag: '☁️ · drag', title: 'Drag artifact into lake zone',
  instruction: 'Where do raw JSON, typed table, BI mart belong?',
  buckets: [
    { id: 'bronze', icon: '📥', title: 'Bronze', hint: 'raw', color: '#8b9cb3' },
    { id: 'silver', icon: '🧽', title: 'Silver', hint: 'curated', color: '#5b8def' },
    { id: 'gold', icon: '📊', title: 'Gold', hint: 'mart', color: '#e8a84b' },
  ],
  items: [
    { text: 'API JSON dump as-is', bucket: 'bronze' },
    { text: 'raw app logs', bucket: 'bronze' },
    { text: 'typed orders parquet', bucket: 'silver' },
    { text: 'deduped customers', bucket: 'silver' },
    { text: 'mart_revenue', bucket: 'gold' },
    { text: 'KPI dashboard table', bucket: 'gold' },
  ],
  recallTips: ['raw → bronze', 'typed → silver', 'BI → gold'],
  recallMapRef: '📍 Map: A0 lake zones.',
});
write(aEnPath, aEn);
console.log('ok py+cloud');
