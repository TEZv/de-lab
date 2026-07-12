/* Shared with Mentorship / Trainer: localStorage mt_lang = ua | en
   Cross-origin sync: pass ?lang=ua|en on links between labs. */
(function (global) {
  const STR = {
    ua: {
      pageTitle: 'DE Lab · Mage Gym',
      headerTitle: '🧙 DE Lab · Mage Gym',
      headerLede: 'Теорія / Практика · орби навичок · місії з SQL ____. Mentorship — двері до квестів SPHERE.',
      navDeMd: 'DE Quest · MD',
      navDevOpsGym: 'DevOps Archer',
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
      aiMapEyebrow: 'Mentorship T1 · AI path',
      aiMapTitle: 'AI map · stub (10 шарів)',
      aiMapLede: 'AI сидить на Data: шар 1 = цей Mage Gym. Решта — карта напряму, не окремий продукт (поки).',
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
      '13-cloud-storage-de': 'Cloud storage · lake',
      '14-orchestration-de': 'Orchestration · Airflow + Cron',
      '15-incremental-loads-de': 'Incremental · watermark',
      '16-stream-nosql-de': 'Streaming & NoSQL',
      '17-governance-ops-de': 'Governance & ops',
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
      atlasSigils: 'Сигіли',
      atlasAnchorLabel: 'Якір матчу:',
      atlasDayLabel: 'День DE:',
      atlasScreenLabel: 'Скрінінг:',
      atlasStackLabel: 'Стек:',
      atlasLitToast: 'Атлас запалений — іди на Матч',
      atlasCompleteHint: 'Відкрий усі портали. Гачок + Сигіл = те, що Матч перевірить.',
      matchTipDefault: 'Спочатку клікни ЛІВОРУЧ (тип), потім ПРАВОРУЧ (фокус). Вірна пара — лінія + колір.',
      matchPickRight: 'Тепер обери фокус скрінінгу праворуч →',
      matchPickLeftFirst: 'Спочатку обери тип компанії зліва.',
      matchAllDone: '✅ Усі пари зібрано — лінії показують звʼязки.',
      matchPairOk: (m, total) => `✅ Пара закріплена (${m}/${total}).`,
      matchWrong: '❌ Не та пара. Згадай study / Карту типів — лівий вибір лишається.',
      matchCompleteToast: 'Матч завершено',
      matchStudyIntroDefault: '<strong>Крок 1 · закріпи.</strong> Прочитай кожну пару вголос (тип → фокус). Потім Матч без вгадування.',
      matchStudyCtaDefault: 'Закарбувала · почати Матч зі стрілами',
      matchStudySkip: 'Порада: повернись на вкладку «Карта», якщо рядок не чіпляється.',
      hubEyebrow: 'Підготовка до техспівбесід',
      hubTitle: 'Interview Arena',
      hubLede: 'Усі завдання тут: інтерактив Gym + заглушки Sprint і публічні патерни. Архетипи галузей — без брендів роботодавців.',
      hubTasks: 'завдань',
      hubKindGym: 'інтерактив',
      hubKindStub: 'заглушка',
      hubAll: 'Усі',
      hubSearch: 'Пошук (Enter)…',
      hubAtlasLink: '→ Атлас типів',
      hubBridgeTitle: '↔ DevOps Archer Gym',
      hubBridgeOpsArena: 'Ops Interview Arena',
      hubBridgeOpsProd: 'Prod · R4 incident',
      hubBridgeOpsTf: 'Terraform · T7 output',
      hubBridgeOpsK8s: 'K8s · K0 map',
      hubFooter: 'Заглушки = таймер + вголос + блокнот. Інтерактив = клік і одразу в Gym.',
      hubLoadFail: 'Не вдалось завантажити банк завдань.',
      hubTaskMissing: 'Завдання не знайдено.',
      hubBackList: '← Список Arena',
      hubPrompt: 'Умова / фокус',
      hubSource: 'Джерело',
      hubResources: 'Публічні ресурси',
      hubSprintTip: (day) => `Sprint SQL · день ${day}: таймер, без LLM, 3 речення після.`,
      hubOpenGym: 'Відкрити в Gym →',
      hubMarkDone: 'Позначила (локально)',
      hubMarked: '✓ Позначено',
      btnInterviewHub: '⚔️ Interview Arena',
      btnCheck: 'Перевірити',
      btnReset: 'Скинути',
      btnHint: 'Підказка',
      btnCheckOrder: 'Перевірити порядок',
      btnCheckPipeline: 'Перевірити конвеєр',
      btnCheckPick: 'Перевірити вибір',
      btnCheckBuckets: 'Перевірити кошики',
      bucketPool: 'Перетягни чіпи в сімʼю ↓',
      bucketOk: '✅ Усі на своїх місцях!',
      bucketFail: 'Є помилки або чіпи в пулі — спробуй ще.',
      bucketToast: 'Сімʼї зібрані',
      btnRunSql: 'Run SQL',
      fillTipDefault: 'Спочатку зрозумій місію вище ↑ потім заповни пропуски. Перетягни чіп у ____.',
      fillTipSql: 'Спочатку зрозумій місію вище ↑ потім заповни SQL. Перетягни чіп у ____.',
      fillTipPython: 'Спочатку зрозумій місію вище ↑ потім заповни Python. Перетягни чіп у ____.',
      fillTipHcl: 'Спочатку зрозумій місію вище ↑ потім заповни Terraform (HCL). Перетягни чіп у ____.',
      fillTipShell: 'Спочатку зрозумій місію вище ↑ потім заповни shell. Перетягни чіп у ____.',
      fillTipYaml: 'Спочатку зрозумій місію вище ↑ потім заповни YAML. Перетягни чіп у ____.',
      resultTraceTitle: 'Результат на прикладі',
      resultTraceInput: 'Вхід',
      resultTraceOutput: 'Вихід',
      givenTitle: 'Дано (повна умова)',
      givenExpect: 'Мета:',
      flipOpened: (n, need) => `Відкрито ${n}/${need}`,
      flipToast: 'Картки пройдено',
      pipeTipDefault: 'Перетягни етапи на конвеєр зліва → направо.',
      pipeOkDefault: 'Конвеєр зібрано правильно!',
      pipeFail: '❌ Ще не той порядок / етап. Клік по слоту — очистити.',
      pipeToast: 'Пайплайн ОК',
      scenarioToastOk: 'Сильне рішення',
      scenarioToastPass: 'Можна краще, але зараховано',
      pickHintDefault: 'Клікай рядки, які мають лишитися у відповіді.',
      pickOkDefault: 'Саме ці рядки.',
      pickToast: 'Місія: дані обрані',
      unknownLevel: 'Невідомий тип рівня.',
      fillOk: '✅ Збірка правильна!',
      fillMiss: '❌ Ще не так — спробуй ще або візьми підказку.',
      fillMissReveal: (ans) => `❌ Перевір порядок. Орієнтир: ${ans}`,
      fillCredited: 'Зараховано',
      hintsDone: '💡 Підказки закінчились.',
      hintsNone: '💡 Для цього рівня підказок немає — спробуй Скинути і пройти ще раз.',
      missionDefault: 'Місія',
      theoryMark: 'Зрозуміло — далі ✓',
      theoryMarked: '✓ Зафіксовано в прогресі',
      theorySaved: 'Прогрес збережено',
      textDiagramSummary: 'Текстова схема',
      dragOrderOk: '✅ Порядок вірний!',
      dragOrderFail: '❌ Ще не так — подумай про логіку кроків.',
      dragOrderToast: 'Порядок OK',
      flipHint: 'Клікай картки — відкрий усі сторони.',
      pickRowsMiss: 'Не той набір рядків',
      flipDone: '✅ Усі картки відкриті — блок зараховано!',
      whatsWrongPrompt: 'Що тут не так?',
      explainOkDefault: 'Так!',
      explainFailDefault: 'Не той діагноз.',
      toastDiagOk: 'Діагноз вірний',
      mcOkDefault: 'Вірно!',
      mcFailDefault: 'Невірно.',
      colGlossaryTitle: 'Що означають колонки',
      recallTitle: '📌 Пригадати (перед перевіркою)',
    },
    en: {
      pageTitle: 'DE Lab · Mage Gym',
      headerTitle: '🧙 DE Lab · Mage Gym',
      headerLede: 'Theory / Practice · skill orbs · SQL ____ missions. Mentorship is the SPHERE quest door.',
      navDeMd: 'DE Quest · MD',
      navDevOpsGym: 'DevOps Archer',
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
      aiMapEyebrow: 'Mentorship T1 · AI path',
      aiMapTitle: 'AI map · stub (10 layers)',
      aiMapLede: 'AI sits on Data: layer 1 = this Mage Gym. The rest is a direction map, not a product yet.',
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
      '13-cloud-storage-de': 'Cloud storage · lake',
      '14-orchestration-de': 'Orchestration · Airflow + Cron',
      '15-incremental-loads-de': 'Incremental · watermark',
      '16-stream-nosql-de': 'Streaming & NoSQL',
      '17-governance-ops-de': 'Governance & ops',
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
      atlasSigils: 'Sigils',
      atlasAnchorLabel: 'Match anchor:',
      atlasDayLabel: 'Typical DE day:',
      atlasScreenLabel: 'Screening:',
      atlasStackLabel: 'Stack signals:',
      atlasLitToast: 'Atlas lit — go to Match',
      atlasCompleteHint: 'Open all portals. Hook + Sigil = what Match will test.',
      matchTipDefault: 'Click LEFT (type), then RIGHT (focus). A correct pair draws a colored line.',
      matchPickRight: 'Now pick screening focus on the right →',
      matchPickLeftFirst: 'Pick company type on the left first.',
      matchAllDone: '✅ All pairs locked — lines show the links.',
      matchPairOk: (m, total) => `✅ Pair locked (${m}/${total}).`,
      matchWrong: '❌ Wrong pair. Recall study / type Map — left pick stays.',
      matchCompleteToast: 'Match complete',
      matchStudyIntroDefault: '<strong>Step 1 · lock in.</strong> Read each pair aloud (type → focus). Then Match — no guessing.',
      matchStudyCtaDefault: 'Locked in · start Match with lines',
      matchStudySkip: 'Tip: go back to the Map tab if a row does not stick.',
      hubEyebrow: 'Technical interview prep',
      hubTitle: 'Interview Arena',
      hubLede: 'All tasks here: interactive Gym + Sprint stubs and public patterns. Industry archetypes — no employer brands.',
      hubTasks: 'tasks',
      hubKindGym: 'interactive',
      hubKindStub: 'stub',
      hubAll: 'All',
      hubSearch: 'Search (Enter)…',
      hubAtlasLink: '→ Type atlas',
      hubBridgeTitle: '↔ DevOps Archer Gym',
      hubBridgeOpsArena: 'Ops Interview Arena',
      hubBridgeOpsProd: 'Prod · R4 incident',
      hubBridgeOpsTf: 'Terraform · T7 output',
      hubBridgeOpsK8s: 'K8s · K0 map',
      hubFooter: 'Stubs = timer + out loud + notebook. Interactive = click straight into Gym.',
      hubLoadFail: 'Could not load task bank.',
      hubTaskMissing: 'Task not found.',
      hubBackList: '← Arena list',
      hubPrompt: 'Prompt / focus',
      hubSource: 'Source',
      hubResources: 'Public resources',
      hubSprintTip: (day) => `Sprint SQL · day ${day}: timer, no LLM, 3 sentences after.`,
      hubOpenGym: 'Open in Gym →',
      hubMarkDone: 'Mark done (local)',
      hubMarked: '✓ Marked',
      btnInterviewHub: '⚔️ Interview Arena',
      btnCheck: 'Check',
      btnReset: 'Reset',
      btnHint: 'Hint',
      btnCheckOrder: 'Check order',
      btnCheckPipeline: 'Check pipeline',
      btnCheckPick: 'Check selection',
      btnCheckBuckets: 'Check buckets',
      bucketPool: 'Drag chips into a family ↓',
      bucketOk: '✅ All in the right family!',
      bucketFail: 'Mistakes or chips left in the pool — try again.',
      bucketToast: 'Families sorted',
      btnRunSql: 'Run SQL',
      fillTipDefault: 'Understand the mission above ↑ then fill the blanks. Drag a chip into ____.',
      fillTipSql: 'Understand the mission above ↑ then fill SQL. Drag a chip into ____.',
      fillTipPython: 'Understand the mission above ↑ then fill Python. Drag a chip into ____.',
      fillTipHcl: 'Understand the mission above ↑ then fill Terraform (HCL). Drag a chip into ____.',
      fillTipShell: 'Understand the mission above ↑ then fill shell. Drag a chip into ____.',
      fillTipYaml: 'Understand the mission above ↑ then fill YAML. Drag a chip into ____.',
      resultTraceTitle: 'Worked example',
      resultTraceInput: 'Input',
      resultTraceOutput: 'Output',
      givenTitle: 'Given (full prompt)',
      givenExpect: 'Goal:',
      flipOpened: (n, need) => `Opened ${n}/${need}`,
      flipToast: 'Cards done',
      pipeTipDefault: 'Drag stages onto the conveyor left → right.',
      pipeOkDefault: 'Pipeline assembled correctly!',
      pipeFail: '❌ Wrong stage/order. Click a slot to clear.',
      pipeToast: 'Pipeline OK',
      scenarioToastOk: 'Strong call',
      scenarioToastPass: 'Could be better, but credited',
      pickHintDefault: 'Click rows that should stay in the answer.',
      pickOkDefault: 'Those are the rows.',
      pickToast: 'Mission: rows picked',
      unknownLevel: 'Unknown level type.',
      fillOk: '✅ Correct build!',
      fillMiss: '❌ Not yet — try again or take a hint.',
      fillMissReveal: (ans) => `❌ Check order. Guide: ${ans}`,
      fillCredited: 'Completed',
      hintsDone: '💡 No hints left.',
      hintsNone: '💡 No hints for this level — try Reset and solve again.',
      missionDefault: 'Mission',
      theoryMark: 'Got it — next ✓',
      theoryMarked: '✓ Saved to progress',
      theorySaved: 'Progress saved',
      textDiagramSummary: 'Text diagram',
      dragOrderOk: '✅ Correct order!',
      dragOrderFail: '❌ Not yet — think through the logic.',
      dragOrderToast: 'Order OK',
      flipHint: 'Click cards — open every side.',
      pickRowsMiss: 'Wrong row set',
      flipDone: '✅ All cards open — level complete!',
      whatsWrongPrompt: 'What is wrong here?',
      explainOkDefault: 'Correct!',
      explainFailDefault: 'Wrong diagnosis.',
      toastDiagOk: 'Correct diagnosis',
      mcOkDefault: 'Correct!',
      mcFailDefault: 'Incorrect.',
      colGlossaryTitle: 'Column meanings',
      recallTitle: '📌 Recall (before you check)',
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
