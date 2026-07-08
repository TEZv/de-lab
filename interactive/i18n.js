/* Shared with Mentorship / Trainer: localStorage mt_lang = ua | en
   Cross-origin sync: pass ?lang=ua|en on links between labs. */
(function (global) {
  const STR = {
    ua: {
      pageTitle: 'DE Lab · Mage Gym',
      headerTitle: '🧙 DE Lab · Mage Gym',
      headerLede: 'Теорія / Практика · орби навичок · місії з SQL ____. Mentorship — двері до квестів SPHERE.',
      navDeMd: 'DE Quest · MD',
      navMentorship: 'Mentorship',
      navRepo: 'Repo',
      langLabel: 'Мова',
      heroEyebrow: 'Твій аватар у DE Lab',
      heroTip: 'Після розділів запалюються орби-навички. Забери мага → share-картка.',
      aimingAt: (role) => `Ціль карʼєри: ${role}`,
      careerTitle: 'Поточний карʼєрний рівень',
      careerLede: 'Обери, де ти зараз. Підсвічуємо рекомендовані шари сходинки — інші можна відкрити.',
      stairTitle: 'Сходинка навичок DE',
      stairLede: 'Кроки знизу вгору. Клікни платформу → місії шару (Theory/Practice всередині).',
      stairBase: '↑ Фундамент · один крок за раз',
      recommended: 'для тебе',
      layerMode: (mode) => (mode === 'theory' ? '📚 переважно теорія' : mode === 'practice' ? '⚔️ переважно практика' : '📚⚔️ теорія + практика'),
      archiveRoads: 'Архів: Theory / Practice списком',
      btnShare: '🪪 Забери героя · share',
      linkMentorship: 'Mentorship hub',
      homeTitle: 'DE Lab · кабінет мага',
      homeBody: 'Два світи: <strong>Теорія</strong> і <strong>Практика</strong> нижче — це і є <strong>DE Quest</strong> (інтерактив). Повний markdown-квест: <a href="{deQuest}" target="_blank" rel="noopener">CHALLENGES.md</a>. Mentorship — окремий хаб SPHERE; deep practice DE у квесті <strong>T1 · Data</strong>: <a href="{mQuest}" target="_blank" rel="noopener">Quest · Technology</a> · <a href="{mDash}" target="_blank" rel="noopener">Dashboard</a>.',
      roadTheory: '📚 Теорія мага',
      roadTheoryBlurb: 'Карти типів компаній, шари DWH, A/B, день-1 — з інтерактивом, не сухим PDF.',
      roadPractice: '⚔️ Практика · місії',
      roadPracticeBlurb: 'SQL із заглушками + таблиці/CSV, Python, work-sim, жестові рівні.',
      progress: (n) => `Прогрес: ${n} ✓`,
      soon: 'скоро',
      backCabin: '← Кабінет',
      saved: (a, b) => `Збережено: ${a} / ${b}`,
      orb: 'орб',
      blockBroken: 'Блок ще не готовий або JSON зламаний.',
      shareTitle: 'Забери DE-мага',
      shareLede: 'Картка з героєм справа. Текст готовий у полі. Жодна мережа не дає справжнього autofill фото+тексту з браузера: ми копіюємо підпис / відкриваємо інтент; PNG — Download або системний Share.',
      shareCaptionLabel: 'Текст для шеру (можна правити)',
      btnDl: '⬇️ Download PNG',
      btnLi: 'in LinkedIn',
      btnIg: 'Instagram',
      btnX: '𝕏 X',
      btnThreads: 'Threads',
      btnCopy: 'Copy text',
      btnNative: 'Share…',
      hintDl: 'PNG завантажено.',
      hintCopyOk: 'Текст скопійовано.',
      hintCopyFail: 'Не вдалось скопіювати — виділи поле вручну.',
      hintLi: 'LinkedIn: текст у буфері — встав у пост (Ctrl+V). Превʼю сайту береться з og:image (може кешуватись). PNG з Download можна додати як медіа.',
      hintIg: 'Instagram: з браузера лише фото+підпис вручну. PNG завантажено, текст у буфері → New post → фото → Ctrl+V.',
      hintX: 'X: вікно з готовим текстом відкрито. Картинку додай через Download, якщо треба.',
      hintThreads: 'Threads: текст у буфері · вкладка відкрита. Встав Ctrl+V. PNG — Download → додай як фото.',
      hintShareOk: 'Системний Share відкрито (можна з фото).',
      hintShareAbort: 'Share скасовано.',
      hintShareFail: 'Share недоступний — скористайся кнопками мереж.',
      ranks: ['Novice Caster', 'Apprentice DE', 'DE Mage', 'Archmage of Data'],
      claimTitle: 'DE Lab · Mage Claim',
      skillsLit: 'Skills lit:',
      loading: 'Завантаження…',
      blocks: {
        '10-interview-company-types': 'Типи компаній і скрінінг',
        '04-theory-data-ae': 'Шари / Star / SCD / BigQuery',
        '05-alive-ae': 'Living Lab · сценарії',
        '11-interview-skills-universal': 'Універсальні мʼязи',
        '12-sku-minprice-mission': 'Місія: найдешевший SKU',
        '01-window-functions': 'Віконні · місії + ____',
        '02-sql-interview-10': 'SQL drills · 10',
        '03-python-interview-10': 'Python drills · 10',
        '20-sim-product-mobile': 'Sim · Product/Mobile',
        '21-sim-marketplace': 'Sim · Marketplace',
        '22-sim-media': 'Sim · Media',
        '23-sim-iot-consulting': 'Sim · Consulting/IoT',
        '24-sim-fintech': 'Sim · Fintech',
        '30-unique-plays': '✦ Стріли / туман / сузірʼя',
      },
      shareCap: (rank, skills, gym, md) =>
        `Я закріпила ранг ${rank} у DE Lab Interview Gym ✨\n${skills}\n\nГрати: ${gym}\nDE quest (markdown): ${md}`,
    },
    en: {
      pageTitle: 'DE Lab · Mage Gym',
      headerTitle: '🧙 DE Lab · Mage Gym',
      headerLede: 'Theory / Practice · skill orbs · SQL ____ missions. Mentorship is the SPHERE quest door.',
      navDeMd: 'DE Quest · MD',
      navMentorship: 'Mentorship',
      navRepo: 'Repo',
      langLabel: 'Language',
      heroEyebrow: 'Your avatar in DE Lab',
      heroTip: 'Finish sections to light skill orbs. Claim the mage → share card.',
      aimingAt: (role) => `Career aim: ${role}`,
      careerTitle: 'Current career level',
      careerLede: 'Pick where you are now. We highlight recommended staircase layers — others stay open.',
      stairTitle: 'DE skill staircase',
      stairLede: 'Steps bottom → top. Tap a platform → layer missions (Theory/Practice inside).',
      stairBase: '↑ Foundations · one step at a time',
      recommended: 'for you',
      layerMode: (mode) => (mode === 'theory' ? '📚 mostly theory' : mode === 'practice' ? '⚔️ mostly practice' : '📚⚔️ theory + practice'),
      archiveRoads: 'Archive: Theory / Practice list',
      btnShare: '🪪 Claim hero · share',
      linkMentorship: 'Mentorship hub',
      homeTitle: 'DE Lab · mage cabin',
      homeBody: 'Two worlds: <strong>Theory</strong> and <strong>Practice</strong> below — the interactive <strong>DE Quest</strong>. Full markdown: <a href="{deQuest}" target="_blank" rel="noopener">CHALLENGES.md</a>. Mentorship is separate; deep practice DE lives under <strong>T1 · Data</strong>: <a href="{mQuest}" target="_blank" rel="noopener">Quest · Technology</a> · <a href="{mDash}" target="_blank" rel="noopener">Dashboard</a>.',
      roadTheory: '📚 Mage theory',
      roadTheoryBlurb: 'Company-type maps, DWH layers, A/B, day-1 — interactive, not a dry PDF.',
      roadPractice: '⚔️ Practice · missions',
      roadPracticeBlurb: 'SQL with blanks + tables/CSV, Python, work-sim, gesture levels.',
      progress: (n) => `Progress: ${n} ✓`,
      soon: 'soon',
      backCabin: '← Cabin',
      saved: (a, b) => `Saved: ${a} / ${b}`,
      orb: 'orb',
      blockBroken: 'Block not ready or JSON is broken.',
      shareTitle: 'Claim your DE mage',
      shareLede: 'Card with the hero on the right. Text is ready in the box. Networks block full photo+text autofill from the web: we copy caption / open an intent; PNG via Download or system Share.',
      shareCaptionLabel: 'Share text (editable)',
      btnDl: '⬇️ Download PNG',
      btnLi: 'in LinkedIn',
      btnIg: 'Instagram',
      btnX: '𝕏 X',
      btnThreads: 'Threads',
      btnCopy: 'Copy text',
      btnNative: 'Share…',
      hintDl: 'PNG downloaded.',
      hintCopyOk: 'Text copied.',
      hintCopyFail: 'Copy failed — select the field manually.',
      hintLi: 'LinkedIn: text in clipboard — paste (Ctrl+V). Site preview uses og:image (may be cached). Attach PNG from Download if you want the mage card.',
      hintIg: 'Instagram: browser only supports photo+caption manually. PNG downloaded, caption copied → New post → photo → Ctrl+V.',
      hintX: 'X: compose window opened with text. Attach PNG via Download if needed.',
      hintThreads: 'Threads: caption copied · tab opened. Paste Ctrl+V. PNG via Download → add as photo.',
      hintShareOk: 'System Share opened (can include photo).',
      hintShareAbort: 'Share cancelled.',
      hintShareFail: 'Share unavailable — use the network buttons.',
      ranks: ['Novice Caster', 'Apprentice DE', 'DE Mage', 'Archmage of Data'],
      claimTitle: 'DE Lab · Mage Claim',
      skillsLit: 'Skills lit:',
      loading: 'Loading…',
      blocks: {
        '10-interview-company-types': 'Company types & screening',
        '04-theory-data-ae': 'Layers / Star / SCD / BigQuery',
        '05-alive-ae': 'Living Lab · scenarios',
        '11-interview-skills-universal': 'Universal muscles',
        '12-sku-minprice-mission': 'Mission: cheapest SKU',
        '01-window-functions': 'Windows · missions + ____',
        '02-sql-interview-10': 'SQL drills · 10',
        '03-python-interview-10': 'Python drills · 10',
        '20-sim-product-mobile': 'Sim · Product/Mobile',
        '21-sim-marketplace': 'Sim · Marketplace',
        '22-sim-media': 'Sim · Media',
        '23-sim-iot-consulting': 'Sim · Consulting/IoT',
        '24-sim-fintech': 'Sim · Fintech',
        '30-unique-plays': '✦ Aim / fog / constellation',
      },
      shareCap: (rank, skills, gym, md) =>
        `I claimed ${rank} in DE Lab Interview Gym ✨\n${skills}\n\nPlay / train: ${gym}\nMarkdown DE quest: ${md}`,
    },
  };

  function norm(lang) {
    return lang === 'en' ? 'en' : 'ua';
  }

  function readQueryLang() {
    try {
      const q = new URLSearchParams(location.search).get('lang');
      if (q === 'en' || q === 'ua' || q === 'uk') return q === 'uk' ? 'ua' : q;
    } catch { /* */ }
    return null;
  }

  function getLang() {
    const fromQ = readQueryLang();
    if (fromQ) {
      localStorage.setItem('mt_lang', fromQ);
      return fromQ;
    }
    return norm(localStorage.getItem('mt_lang') || 'ua');
  }

  function setLang(lang) {
    const l = norm(lang);
    localStorage.setItem('mt_lang', l);
    document.documentElement.lang = l === 'en' ? 'en' : 'uk';
    return l;
  }

  function t(key, ...args) {
    const pack = STR[getLang()] || STR.ua;
    const val = pack[key];
    if (typeof val === 'function') return val(...args);
    return val ?? STR.ua[key] ?? key;
  }

  function blockTitle(id) {
    const pack = STR[getLang()] || STR.ua;
    return (pack.blocks && pack.blocks[id]) || id;
  }

  function withLang(url) {
    if (!url) return url;
    try {
      const u = new URL(url, location.href);
      u.searchParams.set('lang', getLang());
      return u.toString();
    } catch {
      const sep = url.includes('?') ? '&' : '?';
      return `${url}${sep}lang=${getLang()}`;
    }
  }

  function mountToggle(container) {
    if (!container) return;
    let el = container.querySelector('.lang-toggle');
    if (!el) {
      el = document.createElement('div');
      el.className = 'lang-toggle';
      el.setAttribute('role', 'group');
      el.innerHTML = `
        <span class="lang-label"></span>
        <button type="button" data-lang="ua">UA</button>
        <button type="button" data-lang="en">EN</button>`;
      container.appendChild(el);
      el.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-lang]');
        if (!btn) return;
        setLang(btn.dataset.lang);
        paintToggle(el);
        global.dispatchEvent(new CustomEvent('site:langchange', { detail: { lang: getLang() } }));
      });
    }
    paintToggle(el);
  }

  function paintToggle(el) {
    const lang = getLang();
    const label = el.querySelector('.lang-label');
    if (label) label.textContent = t('langLabel');
    el.querySelectorAll('[data-lang]').forEach((b) => {
      b.classList.toggle('active', b.dataset.lang === lang);
    });
  }

  setLang(getLang());

  global.DeLabI18n = { t, getLang, setLang, blockTitle, withLang, mountToggle, STR };
})(window);
