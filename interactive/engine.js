/* Prep Levels Engine — fill blanks (drag), flip cards, pipeline build, scenario, … */
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

  function toast(root, text, ok = true) {
    const el = document.createElement('div');
    el.className = `pl-toast ${ok ? 'ok' : 'bad'}`;
    el.textContent = text;
    root.appendChild(el);
    setTimeout(() => el.remove(), 2200);
  }

  function mountTheory(root, level, onComplete) {
    const wrap = document.createElement('div');
    wrap.className = 'pl-theory';

    if (level.story) {
      const story = document.createElement('div');
      story.className = 'pl-story';
      story.innerHTML = `<span class="pl-story-emoji">${escapeHtml(level.storyEmoji || '🎭')}</span><p>${escapeHtml(level.story)}</p>`;
      wrap.appendChild(story);
    }

    if (level.diagram) {
      const pre = document.createElement('pre');
      pre.className = 'pl-diagram pl-diagram-alive';
      pre.textContent = level.diagram;
      wrap.appendChild(pre);
    }

    if (level.flow?.length) {
      const flow = document.createElement('div');
      flow.className = 'pl-flow';
      level.flow.forEach((step, i) => {
        const chip = document.createElement('div');
        chip.className = 'pl-flow-step';
        chip.innerHTML = `<strong>${escapeHtml(step.title)}</strong><span>${escapeHtml(step.desc || '')}</span>`;
        flow.appendChild(chip);
        if (i < level.flow.length - 1) {
          const arrow = document.createElement('div');
          arrow.className = 'pl-flow-arrow';
          arrow.textContent = '→';
          flow.appendChild(arrow);
        }
      });
      wrap.appendChild(flow);
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

    const actions = document.createElement('div');
    actions.className = 'pl-actions';
    const mark = document.createElement('button');
    mark.type = 'button';
    mark.textContent = 'Зрозуміло — далі ✓';
    mark.addEventListener('click', () => {
      mark.disabled = true;
      mark.textContent = '✓ Зафіксовано в прогресі';
      mark.classList.add('marked');
      toast(root, 'Прогрес збережено', true);
      if (onComplete) onComplete(level.id);
    });
    actions.appendChild(mark);
    wrap.appendChild(actions);
    root.appendChild(wrap);
  }

  function mountFlipCards(root, level, onComplete) {
    const wrap = document.createElement('div');
    wrap.className = 'pl-flip-grid';
    let opened = 0;
    const need = (level.cards || []).length;
    const feedback = document.createElement('p');
    feedback.className = 'pl-feedback';
    feedback.textContent = 'Клікай картки — відкрий усі сторони.';

    (level.cards || []).forEach((card) => {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'pl-flip-card';
      el.innerHTML = `<span class="front">${escapeHtml(card.front)}</span><span class="back">${escapeHtml(card.back)}</span>`;
      el.addEventListener('click', () => {
        if (el.classList.contains('flipped')) return;
        el.classList.add('flipped');
        opened += 1;
        feedback.textContent = `Відкрито ${opened}/${need}`;
        if (opened === need) {
          feedback.textContent = '✅ Усі картки відкриті — блок зараховано!';
          toast(root, 'Картки пройдено', true);
          if (onComplete) onComplete(level.id);
        }
      });
      wrap.appendChild(el);
    });
    root.append(wrap, feedback);
  }

  function mountPipelineBuild(root, level, onComplete) {
    const stages = level.stages || [];
    const pool = shuffle([...(level.pool || stages.map((s) => s.label))]);
    const placed = stages.map(() => '');

    const board = document.createElement('div');
    board.className = 'pl-pipeline';
    const bank = document.createElement('div');
    bank.className = 'pl-word-bank';
    const feedback = document.createElement('p');
    feedback.className = 'pl-feedback';
    const tip = document.createElement('p');
    tip.className = 'pl-tip';
    tip.textContent = level.instruction || 'Перетягни етапи на конвеєр зліва → направо.';

    function renderBoard() {
      board.innerHTML = '';
      stages.forEach((stage, i) => {
        const slot = document.createElement('div');
        slot.className = `pl-pipe-slot ${placed[i] ? 'filled' : ''}`;
        slot.dataset.i = String(i);
        slot.innerHTML = `<small>${escapeHtml(stage.hint || `Крок ${i + 1}`)}</small><strong>${escapeHtml(placed[i] || '____')}</strong>`;
        slot.addEventListener('dragover', (e) => e.preventDefault());
        slot.addEventListener('drop', (e) => {
          e.preventDefault();
          const word = e.dataTransfer.getData('text/plain');
          if (word) {
            placed[i] = word;
            renderBoard();
          }
        });
        slot.addEventListener('click', () => {
          if (placed[i]) {
            placed[i] = '';
            renderBoard();
          }
        });
        board.appendChild(slot);
        if (i < stages.length - 1) {
          const a = document.createElement('div');
          a.className = 'pl-flow-arrow';
          a.textContent = '→';
          board.appendChild(a);
        }
      });
    }

    bank.innerHTML = '';
    pool.forEach((word) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'pl-chip';
      chip.draggable = true;
      chip.textContent = word;
      chip.addEventListener('dragstart', (e) => e.dataTransfer.setData('text/plain', word));
      chip.addEventListener('click', () => {
        const idx = placed.findIndex((p) => !p);
        if (idx >= 0) {
          placed[idx] = word;
          renderBoard();
        }
      });
      bank.appendChild(chip);
    });

    const check = document.createElement('button');
    check.type = 'button';
    check.textContent = 'Перевірити конвеєр';
    check.addEventListener('click', () => {
      const ok = stages.every((s, i) => placed[i] === s.label);
      feedback.textContent = ok
        ? `✅ ${level.success || 'Конвеєр зібрано правильно!'}`
        : '❌ Ще не той порядок / етап. Клік по слоту — очистити.';
      if (ok) {
        toast(root, 'Пайплайн ОК', true);
        if (onComplete) onComplete(level.id);
      }
    });

    renderBoard();
    root.append(tip, board, bank, check, feedback);
  }

  function mountScenario(root, level, onComplete) {
    const wrap = document.createElement('div');
    wrap.className = 'pl-scenario';
    const scene = document.createElement('div');
    scene.className = 'pl-story';
    scene.innerHTML = `<span class="pl-story-emoji">${escapeHtml(level.emoji || '🧭')}</span><p>${escapeHtml(level.scene)}</p>`;
    const opts = document.createElement('div');
    opts.className = 'pl-options';
    const feedback = document.createElement('p');
    feedback.className = 'pl-feedback';

    (level.choices || []).forEach((choice, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pl-option-btn';
      btn.textContent = choice.label;
      btn.addEventListener('click', () => {
        opts.querySelectorAll('.pl-option-btn').forEach((b) => { b.disabled = true; });
        const best = idx === level.bestIndex;
        btn.classList.add(best ? 'ok' : 'bad');
        feedback.textContent = `${best ? '✅' : '⚠️'} ${choice.feedback}`;
        if (best) {
          toast(root, 'Сильне рішення', true);
          if (onComplete) onComplete(level.id);
        } else if (choice.stillPass) {
          toast(root, 'Можна краще, але зараховано', true);
          if (onComplete) onComplete(level.id);
        }
      });
      opts.appendChild(btn);
    });

    wrap.append(scene, opts, feedback);
    root.appendChild(wrap);
  }

  function mountMissionBrief(root, level) {
    if (!level.mission && !level.sampleTable && !level.why) return;
    const brief = document.createElement('div');
    brief.className = 'pl-mission';
    if (level.mission) {
      brief.innerHTML = `
        <div class="pl-mission-head">
          <span>${escapeHtml(level.mission.emoji || '🎯')}</span>
          <div>
            <strong>${escapeHtml(level.mission.title || 'Місія')}</strong>
            <p>${escapeHtml(level.mission.brief || '')}</p>
          </div>
        </div>`;
      if (level.mission.ask) {
        const ask = document.createElement('p');
        ask.className = 'pl-mission-ask';
        ask.textContent = level.mission.ask;
        brief.appendChild(ask);
      }
    }
    if (level.why) {
      const why = document.createElement('p');
      why.className = 'pl-tip';
      why.textContent = level.why;
      brief.appendChild(why);
    }
    if (level.sampleTable) {
      const table = document.createElement('table');
      table.className = 'pl-mini-table';
      const thead = document.createElement('thead');
      thead.innerHTML = `<tr>${(level.sampleTable.headers || []).map((h) => `<th>${escapeHtml(h)}</th>`).join('')}</tr>`;
      const tbody = document.createElement('tbody');
      (level.sampleTable.rows || []).forEach((row, ri) => {
        const tr = document.createElement('tr');
        if ((level.sampleTable.highlight || []).includes(ri)) tr.classList.add('hl');
        tr.innerHTML = row.map((c) => `<td>${escapeHtml(c)}</td>`).join('');
        tbody.appendChild(tr);
      });
      table.append(thead, tbody);
      brief.appendChild(table);
      if (level.sampleTable.caption) {
        const cap = document.createElement('p');
        cap.className = 'pl-tip';
        cap.textContent = level.sampleTable.caption;
        brief.appendChild(cap);
      }
    }
    root.appendChild(brief);
  }

  function mountPickRows(root, level, onComplete) {
    mountMissionBrief(root, level);
    const selected = new Set();
    const need = (level.rows || []).filter((r) => r.correct).map((r) => String(r.id));
    const feedback = document.createElement('p');
    feedback.className = 'pl-feedback';
    feedback.textContent = level.pickHint || 'Клікай рядки, які мають лишитися у відповіді. Злі/дорожчі — не чіпай.';

    const table = document.createElement('table');
    table.className = 'pl-mini-table pl-pick-table';
    const headers = level.headers || Object.keys(level.rows[0] || {}).filter((k) => k !== 'correct');
    table.innerHTML = `<thead><tr>${headers.map((h) => `<th>${escapeHtml(h)}</th>`).join('')}<th>pick</th></tr></thead>`;
    const tbody = document.createElement('tbody');

    (level.rows || []).forEach((row) => {
      const tr = document.createElement('tr');
      tr.dataset.id = String(row.id);
      tr.innerHTML = `${headers.map((h) => `<td>${escapeHtml(row[h])}</td>`).join('')}<td class="pick-mark">○</td>`;
      tr.addEventListener('click', () => {
        if (selected.has(tr.dataset.id)) {
          selected.delete(tr.dataset.id);
          tr.classList.remove('picked');
          tr.querySelector('.pick-mark').textContent = '○';
        } else {
          selected.add(tr.dataset.id);
          tr.classList.add('picked');
          tr.querySelector('.pick-mark').textContent = '●';
        }
        feedback.textContent = `Обрано ${selected.size} · треба ${need.length}`;
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    const check = document.createElement('button');
    check.type = 'button';
    check.textContent = 'Перевірити вибір';
    check.addEventListener('click', () => {
      const ok = need.length === selected.size && need.every((id) => selected.has(id));
      if (ok) {
        feedback.textContent = `✅ ${level.success || 'Саме ці рядки = rn = 1 після PARTITION!'}`;
        toast(root, 'Місія: дані обрані', true);
        tbody.querySelectorAll('tr').forEach((tr) => {
          const id = tr.dataset.id;
          if (need.includes(id)) tr.classList.add('hl');
          else if (selected.has(id)) tr.classList.add('bad-pick');
        });
        if (onComplete) onComplete(level.id);
      } else {
        feedback.textContent = '❌ Не той набір. Підказка: спочатку відкинь evil, потім найдешевшу в кожній парі (power, age).';
        toast(root, 'Ще не ті палички', false);
      }
    });

    root.append(table, check, feedback);
  }

  function mountFillBlanks(root, level, onComplete) {
    mountMissionBrief(root, level);
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
    tip.textContent = level.controlTip || 'Спочатку зрозумій місію вище ↑ потім заповни SQL. Перетягни чіп у ____.';

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
      if (ok) {
        toast(root, 'Зараховано', true);
        if (onComplete) onComplete(level.id);
      }
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
        feedback.textContent = '💡 Підказки закінчились.';
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
      if (ok) {
        toast(root, 'Порядок OK', true);
        if (onComplete) onComplete(level.id);
      }
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
            toast(root, 'Match complete', true);
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
    prompt.textContent = level.prompt || 'Що тут не так?';
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
        if (ok) {
          toast(root, 'Діагноз вірний', true);
          if (onComplete) onComplete(level.id);
        }
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
        if (ok) {
          toast(root, 'OK', true);
          if (onComplete) onComplete(level.id);
        }
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
        mountTheory(body, level, onComplete);
        break;
      case 'flip_cards':
        mountFlipCards(body, level, onComplete);
        break;
      case 'pipeline_build':
        mountPipelineBuild(body, level, onComplete);
        break;
      case 'scenario':
        mountScenario(body, level, onComplete);
        break;
      case 'pick_rows':
        mountPickRows(body, level, onComplete);
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
  }

  global.PrepLevelsEngine = { renderLevel, escapeHtml };
})(window);
