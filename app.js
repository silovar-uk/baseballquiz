(() => {
  const QUESTIONS = window.QUIZ_QUESTIONS;
  const CATEGORIES = window.QUIZ_CATEGORIES;
  const STORAGE_KEY = "npb-quiz-club:v1";
  const DAY = 24 * 60 * 60 * 1000;
  const REVIEW_INTERVALS = [1, 3, 7, 14, 30];

  const freshState = () => ({
    wrong: {},
    stats: { answered: 0, correct: 0 },
    activityDates: []
  });

  let state = loadState();
  let session = null;

  const $ = (id) => document.getElementById(id);
  const els = {
    home: $("home-view"), quiz: $("quiz-view"), result: $("result-view"), notebook: $("notebook-view"),
    dueCount: $("due-count"), reviewCardCount: $("review-card-count"), questionTotal: $("question-total"), categoryGrid: $("category-grid"),
    wrongTotal: $("wrong-total"), masteredTotal: $("mastered-total"), streakTotal: $("streak-total"),
    modeLabel: $("quiz-mode-label"), progressLabel: $("quiz-progress-label"), progressBar: $("quiz-progress-bar"),
    category: $("question-category"), level: $("question-level"), clue: $("question-clue"), question: $("question-text"), answerArea: $("answer-area"),
    feedback: $("feedback"), feedbackTitle: $("feedback-title"), feedbackBadge: $("feedback-badge"), feedbackExplanation: $("feedback-explanation"), feedbackSource: $("feedback-source"), next: $("next-question"),
    resultCorrect: $("result-correct"), resultTotal: $("result-total"), resultMessage: $("result-message"), resultWrongs: $("result-wrongs"),
    notebookList: $("notebook-list"), notebookFilter: $("notebook-filter"),
    statsDialog: $("stats-dialog"), statAnswered: $("stat-answered"), statAccuracy: $("stat-accuracy"), statWrong: $("stat-wrong"), statDue: $("stat-due")
  };

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return parsed && parsed.wrong && parsed.stats ? parsed : freshState();
    } catch { return freshState(); }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    renderDashboard();
  }

  function localDateKey(date = new Date()) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function touchActivity() {
    const key = localDateKey();
    if (!state.activityDates.includes(key)) {
      state.activityDates.push(key);
      state.activityDates = state.activityDates.slice(-120);
    }
  }

  function streakCount() {
    const set = new Set(state.activityDates);
    let streak = 0;
    const cursor = new Date();
    if (!set.has(localDateKey(cursor))) cursor.setDate(cursor.getDate() - 1);
    while (set.has(localDateKey(cursor))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  }

  function wrongEntries() { return Object.entries(state.wrong); }
  function isMastered(item) { return item.stage >= REVIEW_INTERVALS.length; }
  function isDue(item) { return !isMastered(item) && Number(item.dueAt || 0) <= Date.now(); }

  function renderDashboard() {
    const entries = wrongEntries();
    const due = entries.filter(([, item]) => isDue(item));
    const mastered = entries.filter(([, item]) => isMastered(item));
    els.dueCount.textContent = due.length;
    els.reviewCardCount.textContent = due.length;
    els.questionTotal.textContent = `${QUESTIONS.length}問`;
    els.wrongTotal.textContent = entries.length;
    els.masteredTotal.textContent = mastered.length;
    els.streakTotal.textContent = streakCount();
    els.statAnswered.textContent = state.stats.answered;
    els.statAccuracy.textContent = state.stats.answered ? `${Math.round(state.stats.correct / state.stats.answered * 100)}%` : "—";
    els.statWrong.textContent = entries.length;
    els.statDue.textContent = due.length;
  }

  function renderCategories() {
    els.categoryGrid.innerHTML = "";
    Object.entries(CATEGORIES).forEach(([key, cat]) => {
      const count = QUESTIONS.filter(q => q.category === key).length;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "category-card";
      btn.innerHTML = `<span class="category-icon" aria-hidden="true">${cat.icon}</span><strong>${cat.label}</strong><small>${cat.description} · ${count}問</small>`;
      btn.addEventListener("click", () => startQuiz("category", key));
      els.categoryGrid.appendChild(btn);
    });
  }

  function showView(name) {
    [els.home, els.quiz, els.result, els.notebook].forEach(v => v.classList.remove("active"));
    els[name].classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function shuffle(items) {
    const a = [...items];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function dailySet() {
    const current = QUESTIONS.filter(q => ["current", "mlb", "stats", "tactics"].includes(q.category));
    const history = QUESTIONS.filter(q => ["history", "teams"].includes(q.category));
    return shuffle(current).slice(0, 7).concat(shuffle(history).slice(0, 3)).sort(() => Math.random() - .5);
  }

  function reviewSet() {
    const ids = wrongEntries().filter(([, item]) => isDue(item)).map(([id]) => id);
    return shuffle(QUESTIONS.filter(q => ids.includes(q.id)));
  }

  function startQuiz(mode, category = null) {
    let qs = [];
    let label = "";
    if (mode === "daily") { qs = dailySet(); label = "今日の10問"; }
    if (mode === "review") { qs = reviewSet(); label = "復習"; }
    if (mode === "category") { qs = shuffle(QUESTIONS.filter(q => q.category === category)).slice(0, 12); label = CATEGORIES[category].label; }
    if (!qs.length) {
      alert(mode === "review" ? "今日が復習日の問題はまだないで。新しい問題を解いて、間違いノートを育てよう。" : "問題がありません。");
      return;
    }
    session = { mode, label, qs, index: 0, correct: 0, wrongIds: [], answered: false };
    showView("quiz");
    renderQuestion();
  }

  function renderQuestion() {
    const q = session.qs[session.index];
    session.answered = false;
    els.feedback.hidden = true;
    els.modeLabel.textContent = session.label;
    els.progressLabel.textContent = `${session.index + 1} / ${session.qs.length}`;
    els.progressBar.style.width = `${(session.index / session.qs.length) * 100}%`;
    els.category.textContent = CATEGORIES[q.category].label;
    els.level.textContent = `LEVEL ${q.level}`;
    els.clue.textContent = q.clue || "";
    els.clue.hidden = !q.clue;
    els.question.textContent = q.q;
    els.answerArea.innerHTML = "";
    if (q.type === "order") renderOrder(q); else renderOptions(q);
  }

  function renderOptions(q) {
    const order = shuffle(q.options.map((_, index) => index));
    order.forEach((originalIndex) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "answer-button";
      btn.dataset.originalIndex = String(originalIndex);
      btn.textContent = q.options[originalIndex];
      btn.addEventListener("click", () => answerQuestion(originalIndex, btn));
      els.answerArea.appendChild(btn);
    });
  }

  function renderOrder(q) {
    const help = document.createElement("p");
    help.className = "order-help";
    help.textContent = "古い順に、1つずつタップ。選び直すときは選択欄をタップ。";
    const selection = document.createElement("button");
    selection.type = "button";
    selection.className = "order-selection";
    selection.textContent = "まだ選択されていません";
    const chosen = [];
    const buttons = [];
    const presentedOrder = shuffle(q.options.map((_, index) => index));
    presentedOrder.forEach((originalIndex) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "answer-button";
      btn.textContent = q.options[originalIndex];
      btn.addEventListener("click", () => {
        if (chosen.includes(originalIndex) || session.answered) return;
        chosen.push(originalIndex); btn.disabled = true; btn.classList.add("selected");
        selection.textContent = chosen.map((i, n) => `${n + 1}. ${q.options[i]}`).join(" → ");
        submit.disabled = chosen.length !== q.options.length;
      });
      buttons.push(btn);
    });
    selection.addEventListener("click", () => {
      if (session.answered) return;
      chosen.splice(0); buttons.forEach(b => { b.disabled = false; b.classList.remove("selected"); });
      selection.textContent = "まだ選択されていません"; submit.disabled = true;
    });
    const submit = document.createElement("button");
    submit.type = "button"; submit.className = "order-submit"; submit.textContent = "この順番で回答"; submit.disabled = true;
    submit.addEventListener("click", () => answerOrder(chosen));
    els.answerArea.append(help, selection, ...buttons, submit);
  }

  function answerOrder(chosen) {
    if (session.answered) return;
    const q = session.qs[session.index];
    const correct = chosen.length === q.answer.length && chosen.every((v, i) => v === q.answer[i]);
    finishAnswer(correct, q);
  }

  function answerQuestion(index, clicked) {
    if (session.answered) return;
    const q = session.qs[session.index];
    const correct = index === q.answer;
    els.answerArea.querySelectorAll(".answer-button").forEach((btn) => {
      btn.disabled = true;
      if (Number(btn.dataset.originalIndex) === q.answer) btn.classList.add("correct");
    });
    if (!correct) clicked.classList.add("wrong");
    finishAnswer(correct, q);
  }

  function finishAnswer(correct, q) {
    session.answered = true;
    state.stats.answered += 1;
    if (correct) { state.stats.correct += 1; session.correct += 1; } else { session.wrongIds.push(q.id); }
    touchActivity();
    updateReview(q.id, correct);
    els.feedbackTitle.textContent = correct ? "正解！" : "ここ、覚えどころ。";
    els.feedbackBadge.textContent = correct ? "GOOD" : "間違いノートへ保存";
    els.feedbackExplanation.textContent = q.explanation;
    els.feedbackSource.href = q.source;
    els.feedback.hidden = false;
    els.progressBar.style.width = `${((session.index + 1) / session.qs.length) * 100}%`;
    els.next.textContent = session.index === session.qs.length - 1 ? "結果を見る" : "次の問題へ";
    saveState();
  }

  function updateReview(id, correct) {
    const existing = state.wrong[id];
    if (!correct) {
      const wrongCount = (existing?.wrongCount || 0) + 1;
      state.wrong[id] = {
        wrongCount,
        stage: 0,
        dueAt: Date.now() + REVIEW_INTERVALS[0] * DAY,
        lastSeenAt: Date.now(),
        lastWrongAt: Date.now()
      };
      return;
    }
    if (!existing) return;
    const nextStage = existing.stage + 1;
    existing.stage = nextStage;
    existing.lastSeenAt = Date.now();
    if (nextStage >= REVIEW_INTERVALS.length) {
      existing.dueAt = null;
      existing.masteredAt = Date.now();
    } else {
      existing.dueAt = Date.now() + REVIEW_INTERVALS[nextStage] * DAY;
    }
  }

  function nextQuestion() {
    if (!session?.answered) return;
    session.index += 1;
    if (session.index >= session.qs.length) renderResult(); else renderQuestion();
  }

  function renderResult() {
    showView("result");
    els.resultCorrect.textContent = session.correct;
    els.resultTotal.textContent = session.qs.length;
    const rate = session.correct / session.qs.length;
    els.resultMessage.textContent = rate >= .9 ? "かなり入ってる。次は別ジャンルも混ぜて、知識同士をつなげよう。" : rate >= .7 ? "ええ感じ。間違えたところだけ、後日もう一度出てくるで。" : "ここから伸びるやつ。間違えた問題がそのまま自分専用の復習教材になる。";
    els.resultWrongs.innerHTML = "";
    session.wrongIds.forEach(id => {
      const q = QUESTIONS.find(x => x.id === id);
      const div = document.createElement("div"); div.className = "result-wrong-item"; div.textContent = `復習入り：${q.q}`; els.resultWrongs.appendChild(div);
    });
  }

  function renderNotebook() {
    const filter = els.notebookFilter.value;
    const entries = wrongEntries().map(([id, item]) => ({ q: QUESTIONS.find(q => q.id === id), item })).filter(x => x.q);
    const filtered = entries.filter(({ item }) => {
      if (filter === "due") return isDue(item);
      if (filter === "learning") return !isMastered(item);
      if (filter === "mastered") return isMastered(item);
      return true;
    }).sort((a, b) => (a.item.dueAt || Infinity) - (b.item.dueAt || Infinity));
    els.notebookList.innerHTML = "";
    if (!filtered.length) {
      els.notebookList.innerHTML = `<div class="empty-state">まだ該当する問題はなし。<br>間違えるたびに、ここが自分専用の野球ノートになっていく。</div>`;
      return;
    }
    filtered.forEach(({ q, item }) => {
      const card = document.createElement("article"); card.className = "note-card";
      const mastered = isMastered(item); const due = isDue(item);
      const status = mastered ? "卒業済み" : due ? "復習しよう" : `STEP ${item.stage + 1}/${REVIEW_INTERVALS.length}`;
      const dueText = mastered ? "復習完了" : `次回：${formatDate(item.dueAt)}`;
      card.innerHTML = `<div class="note-card-top"><div><span class="category-chip">${CATEGORIES[q.category].label}</span><h3>${escapeHtml(q.q)}</h3></div><span class="note-status ${mastered ? "mastered" : due ? "due" : ""}">${status}</span></div><p>${escapeHtml(q.explanation)}</p><div class="note-meta"><span>間違い ${item.wrongCount}回</span><span>${dueText}</span><a class="source-link" href="${q.source}" target="_blank" rel="noopener">出典 ↗</a></div>`;
      els.notebookList.appendChild(card);
    });
  }

  function formatDate(ts) {
    if (!ts) return "—";
    return new Intl.DateTimeFormat("ja-JP", { month: "numeric", day: "numeric" }).format(new Date(ts));
  }
  function escapeHtml(str) { const d = document.createElement("div"); d.textContent = str; return d.innerHTML; }

  document.querySelectorAll("[data-start]").forEach(btn => btn.addEventListener("click", () => startQuiz(btn.dataset.start)));
  document.querySelectorAll("[data-home]").forEach(btn => btn.addEventListener("click", () => showView("home")));
  $("quit-quiz").addEventListener("click", () => showView("home"));
  els.next.addEventListener("click", nextQuestion);
  $("back-home").addEventListener("click", () => showView("home"));
  $("open-notebook").addEventListener("click", () => { renderNotebook(); showView("notebook"); });
  els.notebookFilter.addEventListener("change", renderNotebook);
  $("reset-progress").addEventListener("click", () => {
    if (!confirm("間違いノート・回答数・連続学習日をすべて消します。よろしいですか？")) return;
    state = freshState(); saveState(); renderNotebook();
  });
  $("open-stats").addEventListener("click", () => { renderDashboard(); els.statsDialog.showModal(); });
  $("close-stats").addEventListener("click", () => els.statsDialog.close());
  els.statsDialog.addEventListener("click", (e) => { if (e.target === els.statsDialog) els.statsDialog.close(); });

  renderCategories();
  renderDashboard();
})();
