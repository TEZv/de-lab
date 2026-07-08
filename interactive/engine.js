/* Prep Levels Engine — fill blanks (drag), drag-order, match, theory, whats_wrong */
(function initPrepLevelsEngine(global) {
  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function shuffle(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function mountTheory(root, level) {
    const wrap = document.createElement('div');
    wrap.className = 'pl-theory';
    if (level.diagram) {
      const pre = document.createElement('pre');
      pre.className = 'pl-diagram';
      pre.textContent = level.diagram;
      wrap.appendChild(pre);
    }
    if (level.bullets?.length) {
      const ul = document.createElement('ul');
      level.bullets.forEach((b) => {
        const li = document.createElement('li');
        li.textContent = b;
        ul.appendChild(li);
      });
      wrap.appendChild(ul);
    }
    if (level.pairs?.length) {
      level.pairs.forEach((pair) => {
        const [a, b] = Array.isArray(pair) ? pair : [pair.left, pair.right];
        const row = document.createElement('p');
        row.className = 'pl-pair';
        row.innerHTML = `<strong>${escapeHtml(a)}</strong> ↔ ${escapeHtml(b)}`;
        wrap.appendChild(row);
      });
    }
    if (level.note) {
      const note = document.createElement('p');
      note.className = 'pl-note';
      note.textContent = level.note;
      wrap.appendChild(note);
    }
    root.appendChild(wrap);
  }

  function mountFillBlanks(root, level, onComplete) {
    const answers = level.answers || [];
    const filled = answers.map(() => '');
    let activeSlot = 0;
    const bank = shuffle([...(level.wordBank || answers)]);

    const templateEl = document.createElement('div');
    templateEl.className = 'pl-blank-template';
    const feedback = document.createElement('p');
    feedback.className = 'pl-feedback';
    const tip = document.createElement('p');
    tip.className = 'pl-tip';
    tip.textContent = 'Перетягни чіп у ____ або клікни слот → потім слово. Повторний клік по слоту — очистити.';

    function nextEmpty(from = 0) {
      for (let i = from; i < answers.length; i += 1) if (!filled[i]) return i;
      for (let i = 0; i < from; i += 1) if (!filled[i]) return i;
      return -1;
    }

    function placeWord(word, slotIndex) {
      const target = slotIndex >= 0 ? slotIndex : nextEmpty(activeSlot);
      if (target < 0) return;
      filled[target] = word;
      activeSlot = nextEmpty(target + 1);
      if (activeSlot < 0) activeSlot = target;
      renderTemplate();
    }

    function renderTemplate() {
      const parts = level.template.split('____');
      templateEl.innerHTML = parts.map((part, i) => {
        if (i >= answers.length) return escapeHtml(part);
        const val = filled[i];
        const cls = [
          'pl-slot',
          val ? 'filled' : 'empty',
          i === activeSlot ? 'active' : '',
        ].filter(Boolean).join(' ');
        return `${escapeHtml(part)}<span class="${cls}" data-i="${i}" tabindex="0">${escapeHtml(val || '____')}</span>`;
      }).join('');

      templateEl.querySelectorAll('.pl-slot').forEach((el) => {
        const i = Number(el.dataset.i);
        el.addEventListener('click', () => {
          if (filled[i]) {
            filled[i] = '';
            activeSlot = i;
          } else {
            activeSlot = i;
          }
          renderTemplate();
        });
        el.addEventListener('dragover', (e) => {
          e.preventDefault();
          el.classList.add('drop-target');
        });
        el.addEventListener('dragleave', () => el.classList.remove('drop-target'));
        el.addEventListener('drop', (e) => {
          e.preventDefault();
          el.classList.remove('drop-target');
          const word = e.dataTransfer.getData('text/plain');
          if (word) placeWord(word, i);
        });
      });
    }

    const bankEl = document.createElement('div');
    bankEl.className = 'pl-word-bank';
    bank.forEach((word) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'pl-chip';
      chip.textContent = word;
      chip.draggable = true;
      chip.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', word);
        chip.classList.add('dragging');
      });
      chip.addEventListener('dragend', () => chip.classList.remove('dragging'));
      chip.addEventListener('click', () => placeWord(word, activeSlot));
      bankEl.appendChild(chip);
    });

    const actions = document.createElement('div');
    actions.className = 'pl-actions';
    const check = document.createElement('button');
    check.type = 'button';
    check.textContent = 'Перевірити';
    const reset = document.createElement('button');
    reset.type = 'button';
    reset.className = 'ghost';
    reset.textContent = 'Скинути';
    const hint = document.createElement('button');
    hint.type = 'button';
    hint.className = 'ghost';
    hint.textContent = 'Підказка';
    let hintsUsed = 0;
    const hints = level.hints || [];

    check.addEventListener('click', () => {
      const ok = answers.every((a, i) => filled[i] === a);
      feedback.textContent = ok
        ? '✅ Збірка правильна!'
        : (level.revealOnFail === false
          ? '❌ Ще не так — спробуй ще або візьми підказку.'
          : `❌ Перевір порядок. Орієнтир: ${answers.join(', ')}`);
      if (ok && onComplete) onComplete(level.id);
    });
    reset.addEventListener('click', () => {
      filled.fill('');
      activeSlot = 0;
      renderTemplate();
      feedback.textContent = '';
    });
    hint.addEventListener('click', () => {
      if (hints[hintsUsed]) {
        feedback.textContent = `💡 ${hints[hintsUsed]}`;
        hintsUsed += 1;
      } else {
        feedback.textContent = '💡 Підказки закінчились — думай архітектурно.';
      }
    });

    actions.append(check, reset, hint);
    renderTemplate();
    root.append(tip, templateEl, bankEl, actions, feedback);
  }

  function mountDragOrder(root, level, onComplete) {
    const order = shuffle(level.items);
    const list = document.createElement('div');
    list.className = 'pl-drag-list';
    order.forEach((text) => {
      const item = document.createElement('div');
      item.className = 'pl-drag-item';
      item.draggable = true;
      item.textContent = text;
      item.dataset.value = text;
      item.addEventListener('dragstart', () => item.classList.add('dragging'));
      item.addEventListener('dragend', () => item.classList.remove('dragging'));
      item.addEventListener('dragover', (e) => e.preventDefault());
      item.addEventListener('drop', (e) => {
        e.preventDefault();
        const dragging = list.querySelector('.dragging');
        if (!dragging || dragging === item) return;
        const nodes = [...list.children];
        if (nodes.indexOf(dragging) < nodes.indexOf(item)) item.after(dragging);
        else item.before(dragging);
      });
      list.appendChild(item);
    });
    const feedback = document.createElement('p');
    feedback.className = 'pl-feedback';
    const check = document.createElement('button');
    check.type = 'button';
    check.textContent = 'Перевірити порядок';
    check.addEventListener('click', () => {
      const current = [...list.children].map((n) => n.dataset.value);
      const ok = current.every((v, i) => v === level.items[i]);
      feedback.textContent = ok ? '✅ Порядок вірний!' : '❌ Ще не так — подумай про логіку кроків.';
      if (ok && onComplete) onComplete(level.id);
    });
    root.append(list, check, feedback);
  }

  function mountMatch(root, level, onComplete) {
    const leftItems = level.pairs.map((p) => p.left);
    const rightItems = shuffle(level.pairs.map((p) => p.right));
    let selected = null;
    let matched = 0;
    const feedback = document.createElement('p');
    feedback.className = 'pl-feedback';
    const grid = document.createElement('div');
    grid.className = 'pl-match-grid';
    const leftCol = document.createElement('div');
    const rightCol = document.createElement('div');

    leftItems.forEach((text) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pl-match-btn';
      btn.textContent = text;
      btn.addEventListener('click', () => {
        leftCol.querySelectorAll('.pl-match-btn').forEach((b) => b.classList.remove('sel'));
        btn.classList.add('sel');
        selected = text;
      });
      leftCol.appendChild(btn);
    });

    rightItems.forEach((text) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pl-match-btn';
      btn.textContent = text;
      btn.addEventListener('click', () => {
        if (!selected) return;
        const pair = level.pairs.find((p) => p.left === selected && p.right === text);
        if (pair) {
          btn.classList.add('done');
          leftCol.querySelector('.sel')?.classList.add('done');
          selected = null;
          matched += 1;
          if (matched === level.pairs.length) {
            feedback.textContent = '✅ Усі пари зібрано!';
            if (onComplete) onComplete(level.id);
          }
        } else {
          feedback.textContent = '❌ Не та пара.';
          selected = null;
          leftCol.querySelectorAll('.pl-match-btn').forEach((b) => b.classList.remove('sel'));
        }
      });
      rightCol.appendChild(btn);
    });

    grid.append(leftCol, rightCol);
    root.append(grid, feedback);
  }

  function mountWhatsWrong(root, level, onComplete) {
    const wrap = document.createElement('div');
    wrap.className = 'pl-whats-wrong';

    if (level.diagram) {
      const pre = document.createElement('pre');
      pre.className = 'pl-diagram';
      pre.textContent = level.diagram;
      wrap.appendChild(pre);
    }

    const code = document.createElement('pre');
    code.className = 'pl-code-buggy';
    code.textContent = level.buggyCode || '';
    wrap.appendChild(code);

    const prompt = document.createElement('p');
    prompt.className = 'pl-tip';
    prompt.textContent = level.prompt || 'Що тут не так? Обери правильний діагноз.';
    wrap.appendChild(prompt);

    const opts = document.createElement('div');
    opts.className = 'pl-options';
    const feedback = document.createElement('p');
    feedback.className = 'pl-feedback';

    (level.options || []).forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pl-option-btn';
      btn.textContent = opt;
      btn.addEventListener('click', () => {
        const ok = idx === level.correctIndex;
        opts.querySelectorAll('.pl-option-btn').forEach((b) => { b.disabled = true; });
        btn.classList.add(ok ? 'ok' : 'bad');
        feedback.textContent = ok
          ? `✅ ${level.explainOk || 'Так!'}`
          : `❌ ${level.explainFail || 'Не той діагноз.'} ${level.explanation || ''}`;
        if (ok && onComplete) onComplete(level.id);
      });
      opts.appendChild(btn);
    });

    wrap.append(opts, feedback);
    root.appendChild(wrap);
  }

  function mountMultiChoice(root, level, onComplete) {
    const wrap = document.createElement('div');
    wrap.className = 'pl-mc';
    if (level.diagram) {
      const pre = document.createElement('pre');
      pre.className = 'pl-diagram';
      pre.textContent = level.diagram;
      wrap.appendChild(pre);
    }
    const q = document.createElement('p');
    q.textContent = level.question || '';
    const opts = document.createElement('div');
    opts.className = 'pl-options';
    const feedback = document.createElement('p');
    feedback.className = 'pl-feedback';
    (level.options || []).forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pl-option-btn';
      btn.textContent = opt;
      btn.addEventListener('click', () => {
        const ok = idx === level.correctIndex;
        opts.querySelectorAll('.pl-option-btn').forEach((b) => { b.disabled = true; });
        btn.classList.add(ok ? 'ok' : 'bad');
        feedback.textContent = ok
          ? `✅ ${level.explanation || 'Вірно!'}`
          : `❌ ${level.explanation || 'Невірно.'}`;
        if (ok && onComplete) onComplete(level.id);
      });
      opts.appendChild(btn);
    });
    wrap.append(q, opts, feedback);
    root.appendChild(wrap);
  }

  function renderLevel(container, level, onComplete) {
    const head = document.createElement('div');
    head.className = 'pl-level-head';
    const tag = level.tag ? `<span class="pl-tag">${escapeHtml(level.tag)}</span>` : '';
    head.innerHTML = `${tag}<h3>${escapeHtml(level.title)}</h3><p>${escapeHtml(level.instruction || '')}</p>`;
    const body = document.createElement('div');
    container.append(head, body);

    switch (level.type) {
      case 'theory':
        mountTheory(body, level);
        break;
      case 'fill_blanks':
        mountFillBlanks(body, level, onComplete);
        break;
      case 'drag_order':
        mountDragOrder(body, level, onComplete);
        break;
      case 'match_pairs':
        mountMatch(body, level, onComplete);
        break;
      case 'whats_wrong':
        mountWhatsWrong(body, level, onComplete);
        break;
      case 'multi_choice':
        mountMultiChoice(body, level, onComplete);
        break;
      default:
        body.textContent = 'Невідомий тип рівня.';
    }

    if (level.type === 'theory') {
      const mark = document.createElement('button');
      mark.type = 'button';
      mark.textContent = 'Прочитано ✓';
      mark.addEventListener('click', () => onComplete && onComplete(level.id));
      body.appendChild(mark);
    }
  }

  global.PrepLevelsEngine = { renderLevel, escapeHtml };
})(window);
