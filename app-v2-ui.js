(() => {
  const BQ = window.BQ;

  BQ.showView = name => {
    ["home-view", "quiz-view", "result-view", "notebook-view"].forEach(id => {
      BQ.$(id).classList.remove("active");
    });
    BQ.$(`${name}-view`).classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  BQ.renderDashboard = () => {
    const entries = BQ.reviewEntries();
    const due = entries.filter(([, item]) => BQ.isDue(item));
    const mastered = entries.filter(([, item]) => BQ.isMastered(item));

    BQ.$("due-count").textContent = due.length;
    BQ.$("review-card-count").textContent = due.length;
    BQ.$("question-total").textContent = `${BQ.QUESTIONS.length}問`;
    BQ.$("wrong-total").textContent = entries.length;
    BQ.$("mastered-total").textContent = mastered.length;
    BQ.$("streak-total").textContent = BQ.streakCount();

    BQ.$("stat-answered").textContent = BQ.state.stats.answered;
    BQ.$("stat-accuracy").textContent = BQ.state.stats.answered
      ? `${Math.round(BQ.state.stats.correct / BQ.state.stats.answered * 100)}%`
      : "—";
    BQ.$("stat-wrong").textContent = entries.length;
    BQ.$("stat-due").textContent = due.length;
  };

  function renderCategories() {
    const grid = BQ.$("category-grid");
    grid.innerHTML = "";

    Object.entries(BQ.CATEGORIES).forEach(([key, cat]) => {
      const count = BQ.QUESTIONS.filter(q => q.category === key).length;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "category-card";
      btn.innerHTML = `<span class="category-icon" aria-hidden="true">${cat.icon}</span><strong>${cat.label}</strong><small>${cat.description} · ${count}問</small>`;
      btn.addEventListener("click", () => BQ.startQuiz("category", key));
      grid.appendChild(btn);
    });
  }

  BQ.renderNotebook = () => {
    const filter = BQ.$("notebook-filter").value;
    const entries = BQ.reviewEntries()
      .map(([id, item]) => ({ q: BQ.QUESTIONS.find(q => q.id === id), item }))
      .filter(x => x.q);

    const filtered = entries
      .filter(({ item }) => {
        if (filter === "due") return BQ.isDue(item);
        if (filter === "learning") return !BQ.isMastered(item);
        if (filter === "mastered") return BQ.isMastered(item);
        return true;
      })
      .sort((a, b) => (a.item.dueAt || Infinity) - (b.item.dueAt || Infinity));

    const list = BQ.$("notebook-list");
    list.innerHTML = "";

    if (!filtered.length) {
      list.innerHTML = `<div class="empty-state">まだ該当する問題はなし。<br>間違いと「自信なし」が、ここで自分専用の野球ノートになる。</div>`;
      return;
    }

    filtered.forEach(({ q, item }) => {
      const mastered = BQ.isMastered(item);
      const due = BQ.isDue(item);
      const status = mastered
        ? "卒業済み"
        : due
          ? "復習しよう"
          : `STEP ${item.stage + 1}/${BQ.REVIEW_INTERVALS.length}`;
      const dueText = mastered ? "復習完了" : `次回：${BQ.formatDate(item.dueAt)}`;
      const origin = item.lastReason === "unsure"
        ? "直近：自信なし"
        : item.lastReason === "wrong"
          ? "直近：不正解"
          : "復習中";

      const card = document.createElement("article");
      card.className = "note-card";
      card.innerHTML = `
        <div class="note-card-top">
          <div>
            <span class="category-chip">${BQ.CATEGORIES[q.category].label}</span>
            <h3>${BQ.escapeHtml(q.q)}</h3>
          </div>
          <span class="note-status ${mastered ? "mastered" : due ? "due" : ""}">${status}</span>
        </div>
        <p>${BQ.escapeHtml(q.explanation)}</p>
        <div class="note-origin">${origin}</div>
        <div class="note-meta">
          <span>間違い ${item.wrongCount || 0}回</span>
          <span>自信なし ${item.uncertainCount || 0}回</span>
          <span>${dueText}</span>
          <a class="source-link" href="${q.source}" target="_blank" rel="noopener">出典 ↗</a>
        </div>`;
      list.appendChild(card);
    });
  };

  document.querySelectorAll("[data-start]").forEach(btn => {
    btn.addEventListener("click", () => BQ.startQuiz(btn.dataset.start));
  });

  document.querySelectorAll("[data-home]").forEach(btn => {
    btn.addEventListener("click", () => BQ.showView("home"));
  });

  BQ.$("quit-quiz").addEventListener("click", () => BQ.showView("home"));
  BQ.$("next-question").addEventListener("click", BQ.nextQuestion);
  BQ.$("mark-unsure").addEventListener("click", BQ.markCurrentUnsure);
  BQ.$("back-home").addEventListener("click", () => BQ.showView("home"));

  BQ.$("open-notebook").addEventListener("click", () => {
    BQ.renderNotebook();
    BQ.showView("notebook");
  });

  BQ.$("notebook-filter").addEventListener("change", BQ.renderNotebook);

  BQ.$("reset-progress").addEventListener("click", () => {
    if (!confirm("復習ノート・回答数・連続学習日をすべて消します。よろしいですか？")) return;
    BQ.state = BQ.freshState();
    BQ.save();
    BQ.renderDashboard();
    BQ.renderNotebook();
  });

  BQ.$("open-stats").addEventListener("click", () => {
    BQ.renderDashboard();
    BQ.$("stats-dialog").showModal();
  });

  BQ.$("close-stats").addEventListener("click", () => BQ.$("stats-dialog").close());

  BQ.$("stats-dialog").addEventListener("click", event => {
    if (event.target === BQ.$("stats-dialog")) BQ.$("stats-dialog").close();
  });

  renderCategories();
  BQ.renderDashboard();
})();