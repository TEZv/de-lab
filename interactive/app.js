const STORAGE_KEY = 'de-lab-interactive-v3';
const MENTORSHIP = 'https://sphere-mentorship-hub.vercel.app';
const MENTORSHIP_QUEST = 'https://sphere-mentorship-hub.vercel.app/quest.html#T';
const MENTORSHIP_DASH = 'https://sphere-mentorship-hub.vercel.app/dashboard.html';

/** Theory = maps & concepts. Practice = missions, CSV/SQL, gestures. */
const ROADS = [
  {
    id: 'theory',
    title: '📚 Теорія мага',
    blurb: 'Карти типів компаній, шари DWH, A/B, день-1 — з інтерактивом, не сухим PDF.',
    skill: 'modeling',
    blocks: [
      { id: '10-interview-company-types', title: 'Типи компаній і скрінінг', ready: true, skill: 'modeling' },
      { id: '04-theory-data-ae', title: 'Шари / Star / SCD / BigQuery', ready: true, skill: 'modeling' },
      { id: '05-alive-ae', title: 'Living Lab · сценарії', ready: true, skill: 'modeling' },
      { id: '11-interview-skills-universal', title: 'Універсальні мʼязи', ready: true, skill: 'sql' },
    ],
  },
  {
    id: 'practice',
    title: '⚔️ Практика · місії',
    blurb: 'SQL із заглушками + таблиці/CSV, Python, work-sim, жестові рівні.',
    skill: 'sql',
    blocks: [
      { id: '12-sku-minprice-mission', title: 'Місія: найдешевший SKU', ready: true, skill: 'sql' },
      { id: '01-window-functions', title: 'Віконні · місії + ____', ready: true, skill: 'sql' },
      { id: '02-sql-interview-10', title: 'SQL drills · 10', ready: true, skill: 'sql' },
      { id: '03-python-interview-10', title: 'Python drills · 10', ready: true, skill: 'python' },
      { id: '20-sim-product-mobile', title: 'Sim · Product/Mobile', ready: true, skill: 'product' },
      { id: '21-sim-marketplace', title: 'Sim · Marketplace', ready: true, skill: 'sql' },
      { id: '22-sim-media', title: 'Sim · Media', ready: true, skill: 'dq' },
      { id: '23-sim-iot-consulting', title: 'Sim · Consulting/IoT', ready: true, skill: 'pipeline' },
      { id: '24-sim-fintech', title: 'Sim · Fintech', ready: true, skill: 'dq' },
      { id: '30-unique-plays', title: '✦ Стріли / туман / сузірʼя', ready: true, skill: 'pipeline' },
    ],
  },
];

const SKILLS = [
  { id: 'sql', label: 'SQL', color: '#3d9a6a' },
  { id: 'python', label: 'Python', color: '#5b8def' },
  { id: 'modeling', label: 'Modeling', color: '#e8a84b' },
  { id: 'product', label: 'Product', color: '#c77dff' },
  { id: 'pipeline', label: 'Pipeline', color: '#4ecdc4' },
  { id: 'dq', label: 'DQ', color: '#ff6b6b' },
];

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    const legacy = localStorage.getItem('de-lab-interactive-v2');
    if (legacy) {
      localStorage.setItem(STORAGE_KEY, legacy);
      return JSON.parse(legacy);
    }
    return {};
  } catch { return {}; }
}
function saveProgress(p) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch { /* */ }
}

function parseRoute() {
  const h = (location.hash || '#/').replace(/^#\/?/, '');
  const parts = h.split('/').filter(Boolean);
  if (!parts.length) return { view: 'home' };
  if (parts[0] === 'block') return { view: 'block', blockId: parts[1], levelId: parts[2] || null };
  if (parts[0] === 'share') return { view: 'share' };
  return { view: 'home' };
}

async function loadBlock(id) {
  const res = await fetch(`blocks/${id}.json`);
  if (!res.ok) throw new Error('block not found');
  return res.json();
}

function countDone(prog) {
  return Object.keys(prog || {}).filter((k) => prog[k]).length;
}

function allBlocks() {
  return ROADS.flatMap((r) => r.blocks);
}

function skillScores() {
  const all = loadProgress();
  const scores = {};
  SKILLS.forEach((s) => { scores[s.id] = { done: 0, total: 0 }; });
  allBlocks().forEach((b) => {
    const skill = b.skill || 'sql';
    if (!scores[skill]) scores[skill] = { done: 0, total: 0 };
    scores[skill].total += 1;
    const n = countDone(all[b.id] || {});
    if (n > 0) scores[skill].done += 1;
  });
  return scores;
}

function mageRank() {
  const scores = skillScores();
  const lit = SKILLS.filter((s) => scores[s.id].done > 0).length;
  if (lit >= 6) return { title: 'Archmage of Data', tier: 3 };
  if (lit >= 4) return { title: 'DE Mage', tier: 2 };
  if (lit >= 2) return { title: 'Apprentice DE', tier: 1 };
  return { title: 'Novice Caster', tier: 0 };
}

function mageSvg(tier) {
  const glow = ['#4a5568', '#3d9a6a', '#e8a84b', '#c77dff'][tier] || '#4a5568';
  return `
  <svg class="hero-svg" viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <radialGradient id="aura" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stop-color="${glow}" stop-opacity="0.55"/>
        <stop offset="100%" stop-color="${glow}" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="robe" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1a2332"/>
        <stop offset="100%" stop-color="#0d1520"/>
      </linearGradient>
    </defs>
    <circle cx="100" cy="95" r="88" fill="url(#aura)"/>
    <ellipse cx="100" cy="175" rx="46" ry="14" fill="#0a1018" opacity=".55"/>
    <path d="M55 110 Q100 200 145 110 L145 190 Q100 210 55 190 Z" fill="url(#robe)" stroke="${glow}" stroke-width="2"/>
    <circle cx="100" cy="78" r="28" fill="#d4b896"/>
    <path d="M72 70 Q100 40 128 70 L120 78 Q100 58 80 78 Z" fill="#1a1525" stroke="${glow}" stroke-width="1.5"/>
    <path d="M88 82 Q100 90 112 82" fill="none" stroke="#2a2030" stroke-width="2"/>
    <circle cx="90" cy="76" r="3" fill="#1a1525"/>
    <circle cx="110" cy="76" r="3" fill="#1a1525"/>
    <line x1="148" y1="50" x2="148" y2="170" stroke="${glow}" stroke-width="3" stroke-linecap="round"/>
    <circle cx="148" cy="42" r="10" fill="${glow}" opacity=".85"/>
    <text x="100" y="214" text-anchor="middle" fill="#8b9cb3" font-size="11" font-family="Segoe UI,sans-serif">DE Mage</text>
  </svg>`;
}

function renderHeroCabin() {
  const rank = mageRank();
  const scores = skillScores();
  const orbs = SKILLS.map((s) => {
    const sc = scores[s.id];
    const pct = sc.total ? Math.round((sc.done / sc.total) * 100) : 0;
    const on = sc.done > 0;
    return `
      <button type="button" class="skill-orb ${on ? 'on' : ''}" data-skill="${s.id}" title="${s.label}: ${sc.done}/${sc.total}" style="--orb:${s.color}">
        <span class="orb-glow"></span>
        <span class="orb-label">${s.label}</span>
        <span class="orb-pct">${pct}%</span>
      </button>`;
  }).join('');

  return `
    <aside class="hero-cabin" id="hero-cabin">
      <div class="hero-visual">${mageSvg(rank.tier)}</div>
      <div class="hero-meta">
        <p class="hero-eyebrow">Твій аватар у DE Lab</p>
        <h2 class="hero-rank">${rank.title}</h2>
        <p class="hero-tip">Після розділів запалюються орби-навички. Забери мага → share-картка.</p>
        <div class="skill-orb-row">${orbs}</div>
        <div class="hero-actions">
          <button type="button" class="ghost" id="btn-share">🪪 Забери героя · share</button>
          <a class="ghost nav-pill" href="${MENTORSHIP}" target="_blank" rel="noopener">Mentorship hub</a>
        </div>
      </div>
    </aside>`;
}

function wireHero(root) {
  root.querySelector('#btn-share')?.addEventListener('click', () => {
    location.hash = '#/share';
  });
}

function renderHome(root) {
  root.innerHTML = `
    ${renderHeroCabin()}
    <section class="pl-card">
      <h2>DE Lab · кабінет мага</h2>
      <p style="color:var(--muted)">Два великі світи: <strong>Теорія</strong> і <strong>Практика</strong>.
      Практикуй як місії з таблицями й ____ · жести · work-sim.
      Mentorship — двері квестів: <a href="${MENTORSHIP_QUEST}" target="_blank" rel="noopener">Quest · Technology</a>
      · <a href="${MENTORSHIP_DASH}" target="_blank" rel="noopener">Dashboard</a>.</p>
    </section>
    ${ROADS.map((road) => `
      <section class="pl-card road-${road.id}">
        <h3>${road.title}</h3>
        <p style="color:var(--muted)">${road.blurb}</p>
        <div class="pl-block-grid">
          ${road.blocks.map((b) => {
            const prog = loadProgress()[b.id] || {};
            const done = countDone(prog);
            return `
              <button type="button" class="pl-block-btn" data-block="${b.id}" ${b.ready ? '' : 'disabled'}>
                <span class="pl-track-label">${b.skill || ''}</span>
                <strong>${b.title}</strong><br>
                <span style="color:var(--muted);font-size:13px">${b.ready ? `Прогрес: ${done} ✓` : 'скоро'}</span>
              </button>`;
          }).join('')}
        </div>
      </section>
    `).join('')}`;

  wireHero(root);
  root.querySelectorAll('[data-block]').forEach((btn) => {
    btn.addEventListener('click', () => { location.hash = `#/block/${btn.dataset.block}`; });
  });
}

async function renderBlock(root, blockId, levelId) {
  let block;
  try {
    block = await loadBlock(blockId);
  } catch {
    root.innerHTML = '<p class="pl-card">Блок ще не готовий або JSON зламаний.</p>';
    return;
  }
  const prog = loadProgress()[blockId] || {};
  const currentId = levelId || block.levels[0]?.id;
  const meta = allBlocks().find((b) => b.id === blockId);

  root.innerHTML = `
    <div class="hero-mini" id="hero-mini">
      ${mageSvg(mageRank().tier)}
      <div class="skill-orb-row compact">${SKILLS.map((s) => {
        const sc = skillScores()[s.id];
        const on = sc.done > 0;
        return `<span class="skill-orb ${on ? 'on' : ''}" style="--orb:${s.color}" title="${s.label}"></span>`;
      }).join('')}</div>
    </div>
    <section class="pl-card">
      <button type="button" class="ghost" id="pl-back">← Кабінет</button>
      <h2>${PrepLevelsEngine.escapeHtml(block.title)}</h2>
      <p style="color:var(--muted)">${PrepLevelsEngine.escapeHtml(block.subtitle || '')}
        ${meta?.skill ? ` · орб: <strong>${meta.skill}</strong>` : ''}</p>
      <p class="pl-progress-line" id="pl-prog">Збережено: ${countDone(prog)} / ${block.levels.length}</p>
      <div class="pl-level-tabs" id="pl-tabs"></div>
      <div id="pl-level-body"></div>
    </section>`;

  root.querySelector('#pl-back').addEventListener('click', () => { location.hash = '#/'; });
  root.querySelector('#hero-mini')?.addEventListener('click', () => { location.hash = '#/'; });

  const tabs = root.querySelector('#pl-tabs');
  const body = root.querySelector('#pl-level-body');
  const progLine = root.querySelector('#pl-prog');

  function paintTabs(allProg) {
    const p = allProg[blockId] || {};
    tabs.querySelectorAll('.pl-level-tab').forEach((tab) => {
      tab.classList.toggle('done', !!p[tab.dataset.lid]);
    });
    progLine.textContent = `Збережено: ${countDone(p)} / ${block.levels.length}`;
    const mini = root.querySelector('#hero-mini .skill-orb-row');
    if (mini) {
      mini.innerHTML = SKILLS.map((s) => {
        const sc = skillScores()[s.id];
        const on = sc.done > 0;
        return `<span class="skill-orb ${on ? 'on' : ''}" style="--orb:${s.color}" title="${s.label}"></span>`;
      }).join('');
    }
  }

  block.levels.forEach((level) => {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.dataset.lid = level.id;
    tab.className = `pl-level-tab ${level.id === currentId ? 'active' : ''} ${prog[level.id] ? 'done' : ''}`;
    tab.textContent = level.tag || level.id;
    tab.title = level.title;
    tab.addEventListener('click', () => { location.hash = `#/block/${blockId}/${level.id}`; });
    tabs.appendChild(tab);
  });

  const level = block.levels.find((l) => l.id === currentId) || block.levels[0];
  body.innerHTML = '';
  PrepLevelsEngine.renderLevel(body, level, (lid) => {
    const all = loadProgress();
    all[blockId] = { ...(all[blockId] || {}), [lid]: true };
    saveProgress(all);
    paintTabs(all);
  });
}

function renderShare(root) {
  const rank = mageRank();
  const scores = skillScores();
  root.innerHTML = `
    ${renderHeroCabin()}
    <section class="pl-card">
      <button type="button" class="ghost" id="pl-back">← Кабінет</button>
      <h2>Забери DE-мага</h2>
      <p style="color:var(--muted)">Картка для скріна / шеру. Дані лише в твоєму браузері (localStorage).</p>
      <canvas id="share-canvas" width="720" height="420"></canvas>
      <div class="hero-actions" style="margin-top:12px">
        <button type="button" id="btn-dl">⬇️ Download PNG</button>
        <button type="button" class="ghost" id="btn-copy">Copy rank text</button>
      </div>
    </section>`;
  wireHero(root);
  root.querySelector('#pl-back').addEventListener('click', () => { location.hash = '#/'; });

  const canvas = root.querySelector('#share-canvas');
  const ctx = canvas.getContext('2d');
  const grd = ctx.createLinearGradient(0, 0, 720, 420);
  grd.addColorStop(0, '#0f1419');
  grd.addColorStop(1, '#1a2332');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, 720, 420);
  ctx.fillStyle = '#e8a84b';
  ctx.font = 'bold 28px Segoe UI, sans-serif';
  ctx.fillText('DE Lab · Mage Claim', 40, 56);
  ctx.fillStyle = '#e8eef5';
  ctx.font = 'bold 36px Segoe UI, sans-serif';
  ctx.fillText(rank.title, 40, 110);
  ctx.fillStyle = '#8b9cb3';
  ctx.font = '16px Segoe UI, sans-serif';
  ctx.fillText('Skills lit:', 40, 150);
  let y = 185;
  SKILLS.forEach((s) => {
    const sc = scores[s.id];
    ctx.fillStyle = sc.done > 0 ? s.color : '#2d3a4f';
    ctx.beginPath();
    ctx.arc(55, y - 5, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e8eef5';
    ctx.font = '18px Segoe UI, sans-serif';
    ctx.fillText(`${s.label}  ${sc.done}/${sc.total}`, 80, y);
    y += 36;
  });
  ctx.fillStyle = '#8b9cb3';
  ctx.font = '14px Segoe UI, sans-serif';
  ctx.fillText('de-lab-interview-gym.web.app · Mentorship: sphere-mentorship-hub', 40, 390);

  root.querySelector('#btn-dl').addEventListener('click', () => {
    const a = document.createElement('a');
    a.download = `de-mage-${rank.tier}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
  });
  root.querySelector('#btn-copy').addEventListener('click', async () => {
    const text = `I claimed ${rank.title} in DE Lab ✨ ${SKILLS.map((s) => `${s.label}:${scores[s.id].done}`).join(' · ')} → ${location.origin || 'https://de-lab-interview-gym.web.app'}`;
    try {
      await navigator.clipboard.writeText(text);
      alert('Скопійовано!');
    } catch {
      prompt('Скопіюй:', text);
    }
  });
}

async function render() {
  const root = document.getElementById('app');
  const route = parseRoute();
  if (route.view === 'home') renderHome(root);
  else if (route.view === 'share') renderShare(root);
  else await renderBlock(root, route.blockId, route.levelId);
}

window.addEventListener('hashchange', render);
render();
