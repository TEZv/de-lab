const STORAGE_KEY = 'de-lab-interactive-v2';

/** Two roads: interview map + day-in-life sims. No real employer branding. */
const ROADS = [
  {
    id: 'unique',
    title: '✦ Унікальні формати',
    blurb: 'Стріла в ціль · ліхтарик у тумані CSV · сузірʼя потоку даних. Жестове навчання, не «читай і тисни OK».',
    blocks: [
      { id: '30-unique-plays', title: 'Стріли / туман / сузірʼя', ready: true },
    ],
  },
  {
    id: 'interview',
    title: '🎯 Техінтервʼю · як потрапити',
    blurb: 'Чим відрізняється відбір у різних типах компаній + універсальні навички. Без назв роботодавців.',
    blocks: [
      { id: '10-interview-company-types', title: 'Типи компаній і відмінності скрінінгу', ready: true },
      { id: '11-interview-skills-universal', title: 'Універсальні мʼязи (SQL/Python/AE)', ready: true },
      { id: '12-sku-minprice-mission', title: 'Місія: найдешевший SKU (вікна)', ready: true },
    ],
  },
  {
    id: 'worksim',
    title: '🛠️ Імітація роботи DE',
    blurb: 'Типові зміни й CSV/SQL як у зміну — продуктові, маркетплейс, медіа, консалтинг/IoT-аналітика, fintech.',
    blocks: [
      { id: '20-sim-product-mobile', title: 'Product / Mobile apps', ready: true },
      { id: '21-sim-marketplace', title: 'Marketplace / E-com', ready: true },
      { id: '22-sim-media', title: 'Media / Content analytics', ready: true },
      { id: '23-sim-iot-consulting', title: 'Analytics consulting / IoT data', ready: true },
      { id: '24-sim-fintech', title: 'Fintech / Payments', ready: true },
    ],
  },
  {
    id: 'archive',
    title: '📦 Архів вправ',
    blurb: 'Старі пакети (перейменовані). Опційно, якщо хочеш додаткові drills.',
    blocks: [
      { id: '01-window-functions', title: 'Віконні · місії', ready: true },
      { id: '02-sql-interview-10', title: 'SQL drills · 10', ready: true },
      { id: '03-python-interview-10', title: 'Python drills · 10', ready: true },
      { id: '04-theory-data-ae', title: 'Theory AE (опора)', ready: true },
      { id: '05-alive-ae', title: 'Living Lab (сценарії)', ready: true },
    ],
  },
];

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
}
function saveProgress(p) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch { /* */ }
}

function parseRoute() {
  const h = (location.hash || '#/').replace(/^#\/?/, '');
  const parts = h.split('/').filter(Boolean);
  if (!parts.length) return { view: 'home' };
  if (parts[0] === 'block') return { view: 'block', blockId: parts[1], levelId: parts[2] || null };
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

function renderHome(root) {
  root.innerHTML = `
    <section class="pl-card">
      <h2>DE Lab · Interview & Work Gym</h2>
      <p style="color:var(--muted)">Дві дороги: <strong>як проходять техінтервʼю</strong> у різних <em>типах</em> компаній
      і <strong>імітація робочого дня</strong> DE (CSV + запити). Без брендів конкретних роботодавців.</p>
    </section>
    ${ROADS.map((road) => `
      <section class="pl-card">
        <h3>${road.title}</h3>
        <p style="color:var(--muted)">${road.blurb}</p>
        <div class="pl-block-grid">
          ${road.blocks.map((b) => {
            const prog = loadProgress()[b.id] || {};
            const done = countDone(prog);
            return `
              <button type="button" class="pl-block-btn" data-block="${b.id}" ${b.ready ? '' : 'disabled'}>
                <strong>${b.title}</strong><br>
                <span style="color:var(--muted);font-size:13px">${b.ready ? `Прогрес: ${done} ✓` : 'скоро'}</span>
              </button>`;
          }).join('')}
        </div>
      </section>
    `).join('')}`;

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

  root.innerHTML = `
    <section class="pl-card">
      <button type="button" class="ghost" id="pl-back">← Дороги</button>
      <h2>${PrepLevelsEngine.escapeHtml(block.title)}</h2>
      <p style="color:var(--muted)">${PrepLevelsEngine.escapeHtml(block.subtitle || '')}</p>
      <p class="pl-progress-line" id="pl-prog">Збережено: ${countDone(prog)} / ${block.levels.length}</p>
      <div class="pl-level-tabs" id="pl-tabs"></div>
      <div id="pl-level-body"></div>
    </section>`;

  root.querySelector('#pl-back').addEventListener('click', () => { location.hash = '#/'; });
  const tabs = root.querySelector('#pl-tabs');
  const body = root.querySelector('#pl-level-body');
  const progLine = root.querySelector('#pl-prog');

  function paintTabs(allProg) {
    const p = allProg[blockId] || {};
    tabs.querySelectorAll('.pl-level-tab').forEach((tab) => {
      tab.classList.toggle('done', !!p[tab.dataset.lid]);
    });
    progLine.textContent = `Збережено: ${countDone(p)} / ${block.levels.length}`;
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

async function render() {
  const root = document.getElementById('app');
  const route = parseRoute();
  if (route.view === 'home') renderHome(root);
  else await renderBlock(root, route.blockId, route.levelId);
}

window.addEventListener('hashchange', render);
render();
