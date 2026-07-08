/* Shared with Mentorship / Trainer: localStorage mt_lang = ua | en
   Cross-origin sync: pass ?lang=ua|en on links between labs. */
(function (global) {
  const STR = {
    ua: {
      pageTitle: 'DE Lab · Mage Gym',
      headerTitle: '🧙 DE Lab · Mage Gym',
      headerLede: 'Теорія / Практика · орби навичок · місії з SQL ____. Mentorship — двері до квестів SPHERE.',
      navDeGym: 'DE Quest · Gym',
      navDeMd: 'DE Quest · MD',
      navMentorship: 'Mentorship',
      navRepo: 'Repo',
      langLabel: 'Мова',
      heroEyebrow: 'Твій аватар у DE Lab',
      heroTip: 'Після розділів запалюються орби-навички. Забери мага → share-картка.',
      btnShare: '🪪 Забери героя · share',
      linkDeGym: 'DE Quest · цей Gym',
      linkDeMd: 'DE Quest · markdown',
      linkMentorship: 'Mentorship hub',
      homeTitle: 'DE Lab · кабінет мага',
      homeBody: 'Два світи: <strong>Теорія</strong> і <strong>Практика</strong> нижче — це і є <strong>DE Quest</strong> (інтерактив). Повний markdown-квест: <a href="{deQuest}" target="_blank" rel="noopener">CHALLENGES.md</a>. Mentorship — окремий хаб SPHERE (Science/E/Technology), не заміна DE-лаби: <a href="{mQuest}" target="_blank" rel="noopener">Quest · Technology</a> · <a href="{mDash}" target="_blank" rel="noopener">Dashboard</a>.',
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
      shareLede: 'Картка з героєм справа. Текст шеру автозаповнюється — ти лише вставляєш у мережу. Дані лише в браузері.',
      shareCaptionLabel: 'Текст для шеру (можна правити)',
      btnDl: '⬇️ Download PNG',
      btnLi: 'in LinkedIn',
      btnIg: 'Instagram',
      btnCopy: 'Copy text',
      btnNative: 'Share…',
      hintDl: 'PNG завантажено.',
      hintCopyOk: 'Текст скопійовано.',
      hintCopyFail: 'Не вдалось скопіювати — виділи поле вручну.',
      hintLi: 'LinkedIn відкрито · текст у буфері — встав у пост (Ctrl+V). PNG — з Download.',
      hintIg: 'Instagram: PNG завантажено + підпис у буфері. Створи пост / Stories → зображення + Ctrl+V.',
      hintShareOk: 'Системний Share відкрито.',
      hintShareAbort: 'Share скасовано.',
      hintShareFail: 'Share недоступний — скористайся LinkedIn / Instagram.',
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
      navDeGym: 'DE Quest · Gym',
      navDeMd: 'DE Quest · MD',
      navMentorship: 'Mentorship',
      navRepo: 'Repo',
      langLabel: 'Language',
      heroEyebrow: 'Your avatar in DE Lab',
      heroTip: 'Finish sections to light skill orbs. Claim the mage → share card.',
      btnShare: '🪪 Claim hero · share',
      linkDeGym: 'DE Quest · this Gym',
      linkDeMd: 'DE Quest · markdown',
      linkMentorship: 'Mentorship hub',
      homeTitle: 'DE Lab · mage cabin',
      homeBody: 'Two worlds: <strong>Theory</strong> and <strong>Practice</strong> below — that is the interactive <strong>DE Quest</strong>. Full markdown quest: <a href="{deQuest}" target="_blank" rel="noopener">CHALLENGES.md</a>. Mentorship is a separate SPHERE hub (not a DE Lab replacement): <a href="{mQuest}" target="_blank" rel="noopener">Quest · Technology</a> · <a href="{mDash}" target="_blank" rel="noopener">Dashboard</a>.',
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
      shareLede: 'Card with the hero on the right. Share text is prefilled — you paste into the network. Data stays in your browser.',
      shareCaptionLabel: 'Share text (editable)',
      btnDl: '⬇️ Download PNG',
      btnLi: 'in LinkedIn',
      btnIg: 'Instagram',
      btnCopy: 'Copy text',
      btnNative: 'Share…',
      hintDl: 'PNG downloaded.',
      hintCopyOk: 'Text copied.',
      hintCopyFail: 'Copy failed — select the field manually.',
      hintLi: 'LinkedIn opened · text in clipboard — paste into the post (Ctrl+V). PNG via Download.',
      hintIg: 'Instagram: PNG downloaded + caption in clipboard. Create post/Stories → image + Ctrl+V.',
      hintShareOk: 'System Share opened.',
      hintShareAbort: 'Share cancelled.',
      hintShareFail: 'Share unavailable — use LinkedIn / Instagram.',
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
