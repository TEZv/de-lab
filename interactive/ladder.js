/**
 * Shared lab model: CareerTier × SkillLayer × HeroTheme
 * Sync contract for de-lab (Mage) and devops-lab (Archer).
 */
(function (global) {
  const CAREER_KEY = 'de-lab-career-tier';

  /** Same 6 rungs across labs; labels differ by lab. */
  const CAREER_TIERS = [
    {
      id: 'intern',
      order: 0,
      deLabel: 'Intern / Apprentice',
      devopsLabel: 'Intern / Apprentice',
      focus: 'Mission → table → SQL ____',
      recommendLayers: [1, 2],
      blurbUa: 'Вчиться ритуалу: місія → таблиця → SQL з ____. Фокус: SQL + 1 теорія.',
      blurbEn: 'Learn the ritual: mission → table → SQL blanks. Focus: SQL + one theory bite.',
    },
    {
      id: 'junior',
      order: 1,
      deLabel: 'Junior',
      devopsLabel: 'Junior',
      focus: 'Drills + one work-sim',
      recommendLayers: [1, 2],
      blurbUa: 'Самостійно закриває drills і 1 work-sim. Фокус: SQL + Python basics.',
      blurbEn: 'Closes drills and one work-sim alone. Focus: SQL + Python basics.',
    },
    {
      id: 'middle',
      order: 2,
      deLabel: 'Middle',
      devopsLabel: 'Middle',
      focus: 'Trade-offs & modeling',
      recommendLayers: [1, 2, 3, 4],
      blurbUa: 'Пояснює trade-offs (Star/Snowflake, SCD, cost). Фокус: modeling + product.',
      blurbEn: 'Explains trade-offs (Star/Snowflake, SCD, cost). Focus: modeling + product.',
    },
    {
      id: 'senior',
      order: 3,
      deLabel: 'Senior',
      devopsLabel: 'Senior',
      focus: 'Pipelines & DQ in prod',
      recommendLayers: [1, 2, 3, 4, 5, 6],
      accentLayers: [5, 6],
      blurbUa: 'Проєктує пайплайн і DQ; ловить «що зламається в проді».',
      blurbEn: 'Designs pipelines & DQ; catches what breaks in prod.',
    },
    {
      id: 'lead',
      order: 4,
      deLabel: 'Team Lead',
      devopsLabel: 'Team Lead',
      focus: 'Mentor / day-1 / evaluate',
      recommendLayers: [1, 2, 3, 4, 5, 6],
      metaFirst: true,
      blurbUa: 'Менторить: пріоритети, day-1, як евалювати інших (Living Lab / company types).',
      blurbEn: 'Mentors: priorities, day-1, how to evaluate others (Living Lab / company types).',
    },
    {
      id: 'head',
      order: 5,
      deLabel: 'Head of Data',
      devopsLabel: 'Head of Platform',
      focus: 'Strategy · hiring bar · roadmap',
      recommendLayers: [1, 2, 3, 4, 5, 6],
      metaFirst: true,
      blurbUa: 'Стратегія стеку, hiring bar, roadmap лаби як продукту. Огляд усієї сходинки.',
      blurbEn: 'Stack strategy, hiring bar, lab-as-product roadmap. Full staircase overview.',
    },
  ];

  /** DE Lab skill staircase — blocks already in Gym. */
  const DE_SKILL_LAYERS = [
    {
      n: 1,
      id: 'sql-cores',
      icon: '🗄️',
      titleUa: 'SQL cores',
      titleEn: 'SQL cores',
      skill: 'sql',
      mode: 'practice',
      blocks: ['01-window-functions', '02-sql-interview-10', '12-sku-minprice-mission'],
    },
    {
      n: 2,
      id: 'python-data',
      icon: '🐍',
      titleUa: 'Python for data',
      titleEn: 'Python for data',
      skill: 'python',
      mode: 'practice',
      blocks: ['03-python-interview-10'],
    },
    {
      n: 3,
      id: 'modeling',
      icon: '📐',
      titleUa: 'Modeling / warehouse',
      titleEn: 'Modeling / warehouse',
      skill: 'modeling',
      mode: 'theory',
      blocks: ['04-theory-data-ae', '05-alive-ae', '11-interview-skills-universal'],
    },
    {
      n: 4,
      id: 'product',
      icon: '📦',
      titleUa: 'Product / analytics judgment',
      titleEn: 'Product / analytics judgment',
      skill: 'product',
      mode: 'both',
      blocks: ['20-sim-product-mobile', '10-interview-company-types', '21-sim-marketplace'],
    },
    {
      n: 5,
      id: 'pipelines',
      icon: '⚙️',
      titleUa: 'Pipelines / ops-lite',
      titleEn: 'Pipelines / ops-lite',
      skill: 'pipeline',
      mode: 'practice',
      blocks: ['30-unique-plays', '23-sim-iot-consulting'],
    },
    {
      n: 6,
      id: 'dq',
      icon: '🛡️',
      titleUa: 'DQ / reliability',
      titleEn: 'DQ / reliability',
      skill: 'dq',
      mode: 'practice',
      blocks: ['22-sim-media', '24-sim-fintech'],
    },
  ];

  /** DevOps Lab stub layers (markdown deep practice later). */
  const DEVOPS_SKILL_LAYERS = [
    { n: 1, id: 'linux', icon: '🐧', title: 'Linux & shell', href: 'https://github.com/TEZv/devops-lab' },
    { n: 2, id: 'git-ci', icon: '🔀', title: 'Git / CI', href: 'https://github.com/TEZv/devops-lab' },
    { n: 3, id: 'docker', icon: '🐳', title: 'Docker', href: 'https://github.com/TEZv/devops-lab' },
    { n: 4, id: 'iac', icon: '🏗️', title: 'IaC (Terraform)', href: 'https://github.com/TEZv/devops-lab' },
    { n: 5, id: 'k8s', icon: '☸️', title: 'K8s-lite', href: 'https://github.com/TEZv/devops-lab' },
    { n: 6, id: 'prod', icon: '🛡️', title: 'Production habits', href: 'https://github.com/TEZv/devops-lab' },
  ];

  const HERO_THEMES = {
    mage: { id: 'mage', lab: 'de-lab', label: 'DE Mage', weapon: 'staff' },
    archer: { id: 'archer', lab: 'devops-lab', label: 'DevOps Archer', weapon: 'bow' },
  };

  /** AI path sits on Data — layer 1 = DE Lab (stub for T1). */
  const AI_SKILL_LAYERS = [
    { n: 1, title: 'Data fundamentals', href: 'https://de-lab-interview-gym.web.app', note: 'DE Lab · Mage Gym' },
    { n: 2, title: 'AI fundamentals', href: null, note: 'soon' },
    { n: 3, title: 'Machine learning', href: null, note: 'soon' },
    { n: 4, title: 'Deep learning', href: null, note: 'soon' },
    { n: 5, title: 'Transformers', href: null, note: 'soon' },
    { n: 6, title: 'LLMs', href: null, note: 'soon' },
    { n: 7, title: 'RAG & knowledge', href: null, note: 'soon' },
    { n: 8, title: 'AI agents', href: null, note: 'soon' },
    { n: 9, title: 'Production AI', href: null, note: 'soon' },
    { n: 10, title: 'AI systems engineer', href: null, note: 'soon' },
  ];

  function getCareerTier(lab) {
    return CAREER_TIERS.map((c) => ({
      ...c,
      label: lab === 'devops' ? c.devopsLabel : c.deLabel,
    }));
  }

  function loadCareerTier() {
    try {
      const id = localStorage.getItem(CAREER_KEY) || 'intern';
      return CAREER_TIERS.find((c) => c.id === id) || CAREER_TIERS[0];
    } catch {
      return CAREER_TIERS[0];
    }
  }

  function saveCareerTier(id) {
    const tier = CAREER_TIERS.find((c) => c.id === id) || CAREER_TIERS[0];
    try { localStorage.setItem(CAREER_KEY, tier.id); } catch { /* */ }
    return tier;
  }

  function isLayerRecommended(layerN, tier) {
    const t = tier || loadCareerTier();
    return (t.recommendLayers || []).includes(layerN);
  }

  function isLayerAccent(layerN, tier) {
    const t = tier || loadCareerTier();
    return (t.accentLayers || []).includes(layerN);
  }

  global.LabLadder = {
    CAREER_KEY,
    CAREER_TIERS,
    DE_SKILL_LAYERS,
    DEVOPS_SKILL_LAYERS,
    AI_SKILL_LAYERS,
    HERO_THEMES,
    getCareerTier,
    loadCareerTier,
    saveCareerTier,
    isLayerRecommended,
    isLayerAccent,
  };
})(window);
