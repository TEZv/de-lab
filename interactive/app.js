const STORAGE_KEY = 'de-lab-interactive-v3';
const GYM_URL = 'https://de-lab-interview-gym.web.app';
const DE_QUEST_MD = 'https://github.com/TEZv/de-lab/blob/main/CHALLENGES.md';
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

function mageGlow(tier) {
  return ['#4a5568', '#3d9a6a', '#e8a84b', '#c77dff'][tier] || '#4a5568';
}

function mageSvg(tier) {
  const glow = mageGlow(tier);
  const uid = `m${tier}-${Math.random().toString(36).slice(2, 7)}`;
  return `
  <svg class="hero-svg" viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <radialGradient id="aura-${uid}" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stop-color="${glow}" stop-opacity="0.55"/>
        <stop offset="100%" stop-color="${glow}" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="robe-${uid}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1a2332"/>
        <stop offset="100%" stop-color="#0d1520"/>
      </linearGradient>
    </defs>
    <circle cx="100" cy="95" r="88" fill="url(#aura-${uid})"/>
    <ellipse cx="100" cy="175" rx="46" ry="14" fill="#0a1018" opacity=".55"/>
    <path d="M55 110 Q100 200 145 110 L145 190 Q100 210 55 190 Z" fill="url(#robe-${uid})" stroke="${glow}" stroke-width="2"/>
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

/** Draw the same mage onto share canvas (right side). Coordinates in mage local space 0..200. */
function drawMageOnCanvas(ctx, ox, oy, scale, tier) {
  const glow = mageGlow(tier);
  ctx.save();
  ctx.translate(ox, oy);
  ctx.scale(scale, scale);

  const aura = ctx.createRadialGradient(100, 95, 10, 100, 95, 88);
  aura.addColorStop(0, glow + '8c');
  aura.addColorStop(1, glow + '00');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(100, 95, 88, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(10,16,24,.55)';
  ctx.beginPath();
  ctx.ellipse(100, 175, 46, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  const robe = ctx.createLinearGradient(55, 110, 145, 200);
  robe.addColorStop(0, '#1a2332');
  robe.addColorStop(1, '#0d1520');
  ctx.fillStyle = robe;
  ctx.strokeStyle = glow;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(55, 110);
  ctx.quadraticCurveTo(100, 200, 145, 110);
  ctx.lineTo(145, 190);
  ctx.quadraticCurveTo(100, 210, 55, 190);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#d4b896';
  ctx.beginPath();
  ctx.arc(100, 78, 28, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#1a1525';
  ctx.strokeStyle = glow;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(72, 70);
  ctx.quadraticCurveTo(100, 40, 128, 70);
  ctx.lineTo(120, 78);
  ctx.quadraticCurveTo(100, 58, 80, 78);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = '#2a2030';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(88, 82);
  ctx.quadraticCurveTo(100, 90, 112, 82);
  ctx.stroke();

  ctx.fillStyle = '#1a1525';
  ctx.beginPath();
  ctx.arc(90, 76, 3, 0, Math.PI * 2);
  ctx.arc(110, 76, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = glow;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(148, 50);
  ctx.lineTo(148, 170);
  ctx.stroke();
  ctx.fillStyle = glow;
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.arc(148, 42, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.fillStyle = '#8b9cb3';
  ctx.font = '11px Segoe UI, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('DE Mage', 100, 214);
  ctx.restore();
}

function shareCaption(rank, scores) {
  const skills = SKILLS.map((s) => `${s.label} ${scores[s.id].done}/${scores[s.id].total}`).join(' · ');
  return `I claimed ${rank.title} in DE Lab Interview Gym ✨\n${skills}\n\nPlay / train: ${GYM_URL}\nMarkdown DE quest: ${DE_QUEST_MD}`;
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      prompt('Скопіюй вручну:', text);
      return true;
    } catch {
      return false;
    }
  }
}

function downloadCanvasPng(canvas, filename) {
  const a = document.createElement('a');
  a.download = filename;
  a.href = canvas.toDataURL('image/png');
  a.click();
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
          <a class="ghost nav-pill" href="#/">DE Quest · цей Gym</a>
          <a class="ghost nav-pill" href="${DE_QUEST_MD}" target="_blank" rel="noopener">DE Quest · markdown</a>
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
      <p style="color:var(--muted)">Два світи: <strong>Теорія</strong> і <strong>Практика</strong> нижче — це і є <strong>DE Quest</strong> (інтерактив).
      Повний markdown-квест: <a href="${DE_QUEST_MD}" target="_blank" rel="noopener">CHALLENGES.md</a>.
      Mentorship — окремий хаб SPHERE (Science/E/Technology), не заміна DE-лаби:
      <a href="${MENTORSHIP_QUEST}" target="_blank" rel="noopener">Quest · Technology</a>
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

function paintShareCard(canvas, rank, scores) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const grd = ctx.createLinearGradient(0, 0, W, H);
  grd.addColorStop(0, '#0f1419');
  grd.addColorStop(0.55, '#1a2332');
  grd.addColorStop(1, '#152018');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, W, H);

  // soft divider
  ctx.fillStyle = 'rgba(45,58,79,.45)';
  ctx.fillRect(W * 0.58, 24, 1, H - 48);

  ctx.fillStyle = '#e8a84b';
  ctx.font = 'bold 26px Segoe UI, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('DE Lab · Mage Claim', 40, 52);
  ctx.fillStyle = '#e8eef5';
  ctx.font = 'bold 34px Segoe UI, sans-serif';
  ctx.fillText(rank.title, 40, 100);
  ctx.fillStyle = '#8b9cb3';
  ctx.font = '15px Segoe UI, sans-serif';
  ctx.fillText('Skills lit:', 40, 138);

  let y = 172;
  SKILLS.forEach((s) => {
    const sc = scores[s.id];
    ctx.fillStyle = sc.done > 0 ? s.color : '#2d3a4f';
    ctx.beginPath();
    ctx.arc(54, y - 5, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e8eef5';
    ctx.font = '17px Segoe UI, sans-serif';
    ctx.fillText(`${s.label}  ${sc.done}/${sc.total}`, 76, y);
    y += 34;
  });

  ctx.fillStyle = '#8b9cb3';
  ctx.font = '13px Segoe UI, sans-serif';
  ctx.fillText('de-lab-interview-gym.web.app', 40, H - 28);

  // Hero on the right
  drawMageOnCanvas(ctx, W - 250, 48, 1.05, rank.tier);
}

function renderShare(root) {
  const rank = mageRank();
  const scores = skillScores();
  const caption = shareCaption(rank, scores);
  root.innerHTML = `
    ${renderHeroCabin()}
    <section class="pl-card">
      <button type="button" class="ghost" id="pl-back">← Кабінет</button>
      <h2>Забери DE-мага</h2>
      <p style="color:var(--muted)">Картка з героєм справа. Текст шеру автозаповнюється в буфер — ти лише вставляєш / підтверджуєш у мережі. Дані лише в браузері.</p>
      <canvas id="share-canvas" width="720" height="420"></canvas>
      <label class="share-caption-label" for="share-caption">Текст для шеру (можна правити)</label>
      <textarea id="share-caption" class="share-caption" rows="5"></textarea>
      <div class="hero-actions share-bar" style="margin-top:12px">
        <button type="button" id="btn-dl">⬇️ Download PNG</button>
        <button type="button" class="share-li" id="btn-li">in LinkedIn</button>
        <button type="button" class="share-ig" id="btn-ig">Instagram</button>
        <button type="button" class="ghost" id="btn-copy">Copy text</button>
        <button type="button" class="ghost" id="btn-native" hidden>Share…</button>
      </div>
      <p class="share-hint" id="share-hint" style="color:var(--muted);font-size:13px;margin:10px 0 0"></p>
    </section>`;
  wireHero(root);
  root.querySelector('#pl-back').addEventListener('click', () => { location.hash = '#/'; });

  const canvas = root.querySelector('#share-canvas');
  paintShareCard(canvas, rank, scores);
  const ta = root.querySelector('#share-caption');
  ta.value = caption;
  const hint = root.querySelector('#share-hint');
  const getCaption = () => ta.value.trim();
  const setHint = (msg) => { hint.textContent = msg; };

  root.querySelector('#btn-dl').addEventListener('click', () => {
    downloadCanvasPng(canvas, `de-mage-${rank.tier}.png`);
    setHint('PNG завантажено.');
  });

  root.querySelector('#btn-copy').addEventListener('click', async () => {
    const ok = await copyText(getCaption());
    setHint(ok ? 'Текст скопійовано.' : 'Не вдалось скопіювати — виділи поле вручну.');
  });

  root.querySelector('#btn-li').addEventListener('click', async () => {
    await copyText(getCaption());
    // LinkedIn share UI takes URL; caption already in clipboard for paste into post
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(GYM_URL)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setHint('LinkedIn відкрито · текст уже в буфері — вставь у пост (Ctrl+V / Cmd+V). PNG можна додати з Download.');
  });

  root.querySelector('#btn-ig').addEventListener('click', async () => {
    await copyText(getCaption());
    downloadCanvasPng(canvas, `de-mage-${rank.tier}.png`);
    window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
    setHint('Instagram не вміє автотекст з браузера: PNG завантажено + підпис у буфері. Створи пост / Stories → встав зображення й Ctrl+V підпис.');
  });

  const nativeBtn = root.querySelector('#btn-native');
  if (navigator.share) {
    nativeBtn.hidden = false;
    nativeBtn.addEventListener('click', async () => {
      try {
        const blob = await (await fetch(canvas.toDataURL('image/png'))).blob();
        const file = new File([blob], `de-mage-${rank.tier}.png`, { type: 'image/png' });
        const data = { title: `DE Lab · ${rank.title}`, text: getCaption(), url: GYM_URL };
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ ...data, files: [file] });
        } else {
          await navigator.share(data);
        }
        setHint('Системний Share відкрито.');
      } catch (e) {
        if (e && e.name === 'AbortError') setHint('Share скасовано.');
        else setHint('Share недоступний — скористайся LinkedIn / Instagram кнопками.');
      }
    });
  }
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
