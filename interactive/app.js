const STORAGE_KEY = 'de-lab-interactive-v1';
const BLOCKS = [
  { id: '06-ollivander-mission', title: 'Ollivander Mission · HP SQL', track: 'DataObrii', ready: true },
  { id: '05-alive-ae', title: 'AE Living Lab · не нудно', track: 'Start here', ready: true },
  { id: '01-window-functions', title: 'Віконні функції (місії)', track: 'SQL', ready: true },
  { id: '02-sql-interview-10', title: 'SQL Interview · 10', track: 'SQL', ready: true },
  { id: '03-python-interview-10', title: 'Python Interview · 10', track: 'Python', ready: true },
  { id: '04-theory-data-ae', title: 'Theory · AE (опорна)', track: 'Theory', ready: true },
];

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
}
function saveProgress(p) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch { /* */ }
}

function parseRoute() {
  const h = (location.hash || '#/').replace(/^#\/?/, '');
  const [blockId, levelId] = h.split('/');
  if (!blockId) return { view: 'home' };
  return { view: 'block', blockId, levelId: levelId || null };
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
      <h2>Interview Gym · DE Lab</h2>
      <p style="color:var(--muted)">Це <strong>карта AE-скрінінгу</strong>, не вся карʼєра DE.
      Почни з <em>Living Lab</em> (сценарії + картки), потім SQL/Python мʼязи.</p>
      <div class="pl-tracks">
        <span class="pl-pill">Living · scenarios</span>
        <span class="pl-pill">SQL</span>
        <span class="pl-pill">Python</span>
        <span class="pl-pill">Theory</span>
      </div>
      <div class="pl-block-grid">
        ${BLOCKS.map((b) => {
          const prog = loadProgress()[b.id] || {};
          const done = countDone(prog);
          return `
            <button type="button" class="pl-block-btn" data-block="${b.id}">
              <span class="pl-track-label">${b.track}</span>
              <strong>${b.title}</strong><br>
              <span style="color:var(--muted);font-size:13px">Прогрес: ${done} рівнів ✓</span>
            </button>`;
        }).join('')}
      </div>
    </section>
    <section class="pl-card pl-howto">
      <h3>Чесна планка</h3>
      <ol>
        <li><strong>Покриває:</strong> windows/HAVING/JOIN, pandas, STG→CORE→MARTS, SCD2, BQ cost, DQ, A/B base, day-1</li>
        <li><strong>Не покриває саме по собі:</strong> стрес live 1.5 год, їхню паличку без репетиції вголос, глибокий Spark/K8s</li>
        <li>Після «Зрозуміло» вкладка зеленіє; лічильник «Збережено X/Y» оновлюється одразу</li>
      </ol>
    </section>`;
  root.querySelectorAll('[data-block]').forEach((btn) => {
    btn.addEventListener('click', () => { location.hash = `#/${btn.dataset.block}`; });
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
      <button type="button" class="ghost" id="pl-back">← Блоки</button>
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
      const lid = tab.dataset.lid;
      tab.classList.toggle('done', !!p[lid]);
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
    tab.addEventListener('click', () => { location.hash = `#/${blockId}/${level.id}`; });
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
