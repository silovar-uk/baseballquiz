(() => {
  const BQ = window.BQ;
  const PLAYERS = window.QUIZ_PLAYER_FILES || [];
  if (!BQ || !PLAYERS.length) return;

  // ---- Genre levels -------------------------------------------------------
  const previousFreshState = BQ.freshState;
  BQ.freshState = () => {
    const state = previousFreshState();
    state.progress ||= {};
    state.progress.categoryXp = {};
    return state;
  };
  BQ.state.progress ||= {};
  BQ.state.progress.categoryXp ||= {};

  const CATEGORY_STEP = 80;
  const categoryLevel = key => {
    const xp = Number(BQ.state.progress.categoryXp[key] || 0);
    return { xp, level: Math.floor(xp / CATEGORY_STEP) + 1, progress: (xp % CATEGORY_STEP) / CATEGORY_STEP };
  };

  function addCategoryXp(key, amount) {
    if (!key || !BQ.CATEGORIES[key]) return;
    BQ.state.progress.categoryXp[key] = Number(BQ.state.progress.categoryXp[key] || 0) + amount;
    BQ.save();
    renderCategoryLevels();
  }

  function injectCategoryLevels() {
    const categorySection = document.querySelector(".section-block:has(#category-grid)");
    if (!categorySection || document.getElementById("category-levels")) return;
    const section = document.createElement("section");
    section.id = "category-levels";
    section.className = "section-block category-level-section";
    section.innerHTML = `
      <div class="section-heading">
        <div><p class="eyebrow">GENRE LEVEL</p><h2>ジャンル別レベル</h2></div>
        <span class="count-pill">80 XP = +1 LV</span>
      </div>
      <div id="category-level-grid" class="category-level-grid"></div>`;
    categorySection.insertAdjacentElement("afterend", section);
    renderCategoryLevels();
  }

  function renderCategoryLevels() {
    const grid = document.getElementById("category-level-grid");
    if (!grid) return;
    grid.innerHTML = Object.entries(BQ.CATEGORIES).map(([key, cat]) => {
      const info = categoryLevel(key);
      return `
        <article class="category-level-card">
          <div class="category-level-top"><span>${cat.icon}</span><small>LV ${info.level}</small></div>
          <strong>${BQ.escapeHtml(cat.label)}</strong>
          <div class="category-level-track"><i style="width:${Math.round(info.progress * 100)}%"></i></div>
          <span>${info.xp} XP</span>
        </article>`;
    }).join("");
  }

  function awardFromNormalFeedback() {
    const feedback = document.getElementById("feedback");
    if (!feedback || feedback.hidden || !BQ.session) return;
    const stamp = String(BQ.state.stats.answered);
    if (feedback.dataset.categoryXpStamp === stamp) return;
    const q = BQ.session.qs?.[BQ.session.index];
    if (!q) return;
    const correct = (document.getElementById("feedback-title")?.textContent || "").startsWith("正解");
    feedback.dataset.categoryXpStamp = stamp;
    addCategoryXp(q.category, correct ? 10 : 4);
  }

  function awardFromFiveFeedback() {
    const host = document.getElementById("five-quiz");
    const feedback = host?.querySelector(".five-feedback:not([hidden])");
    if (!feedback) return;
    const stamp = String(BQ.state.stats.answered);
    if (feedback.dataset.categoryXpStamp === stamp) return;
    const questionText = host.querySelector("h2")?.textContent || "";
    const q = BQ.QUESTIONS.find(item => item.q === questionText);
    if (!q) return;
    const correct = (host.querySelector("#five-feedback-title")?.textContent || "").startsWith("正解");
    feedback.dataset.categoryXpStamp = stamp;
    addCategoryXp(q.category, correct ? 12 : 5);
  }

  const normalFeedback = document.getElementById("feedback");
  if (normalFeedback) {
    new MutationObserver(awardFromNormalFeedback)
      .observe(normalFeedback, { attributes: true, attributeFilter: ["hidden"] });
  }

  // ---- Daily learning workflow -------------------------------------------
  function reorderDailyAction() {
    const grid = document.querySelector(".action-grid");
    const learn = grid?.querySelector(".learn-five");
    if (!grid || !learn) return;
    learn.querySelector(".action-kicker").textContent = "TODAY'S LEARNING";
    learn.querySelector("strong").textContent = "今日の学習";
    learn.querySelector("small").textContent = "5人を読む → 5問 → 期限が来た復習";
    grid.prepend(learn);
  }

  function injectWorkflowStepper() {
    const view = document.getElementById("players-view");
    const head = view?.querySelector(".player-study-head");
    if (!view || !head || document.getElementById("daily-workflow")) return;
    const flow = document.createElement("div");
    flow.id = "daily-workflow";
    flow.className = "daily-workflow";
    flow.innerHTML = `
      <div class="workflow-step active" data-step="1"><b>01</b><span>5人を読む</span></div>
      <div class="workflow-line"></div>
      <div class="workflow-step" data-step="2"><b>02</b><span>5問で思い出す</span></div>
      <div class="workflow-line"></div>
      <div class="workflow-step" data-step="3"><b>03</b><span>期限が来た復習</span></div>`;
    head.insertAdjacentElement("afterend", flow);

    document.getElementById("start-five-quiz")?.addEventListener("click", () => setWorkflowStep(2));
  }

  function setWorkflowStep(step) {
    document.querySelectorAll("#daily-workflow .workflow-step").forEach(el => {
      const n = Number(el.dataset.step);
      el.classList.toggle("active", n === step);
      el.classList.toggle("done", n < step);
    });
  }

  function enhanceFiveResult() {
    awardFromFiveFeedback();
    const host = document.getElementById("five-quiz");
    const result = host?.querySelector(".five-result");
    if (!result || result.dataset.workflowEnhanced) return;
    result.dataset.workflowEnhanced = "1";
    setWorkflowStep(3);

    const due = BQ.reviewEntries().filter(([, item]) => BQ.isDue(item)).length;
    const home = result.querySelector("#five-home");
    if (due > 0) {
      const review = document.createElement("button");
      review.type = "button";
      review.className = "next-button workflow-review-button";
      review.textContent = `今日の復習へ（${due}問）`;
      review.addEventListener("click", () => BQ.startQuiz("review"));
      home?.insertAdjacentElement("beforebegin", review);
      const note = document.createElement("p");
      note.className = "workflow-note";
      note.textContent = "最後に、復習期限が来た問題だけ解けば今日の1セット完了。";
      review.insertAdjacentElement("beforebegin", note);
    } else {
      const complete = document.createElement("p");
      complete.className = "workflow-complete";
      complete.textContent = "今日が期限の復習は0問。今日の学習セットは完了。";
      home?.insertAdjacentElement("beforebegin", complete);
      setWorkflowStep(4);
    }
  }

  const fiveHost = document.getElementById("five-quiz");
  if (fiveHost) {
    new MutationObserver(() => {
      awardFromFiveFeedback();
      enhanceFiveResult();
    }).observe(fiveHost, { childList: true, subtree: true, attributes: true, attributeFilter: ["hidden"] });
  }

  // ---- Rich player cards --------------------------------------------------
  function profileExtra(player) {
    const timeline = (player.timeline || []).map(item => `<li>${BQ.escapeHtml(item)}</li>`).join("");
    const tags = (player.tags || []).map(tag => `<span>${BQ.escapeHtml(tag)}</span>`).join("");
    const links = (player.officialLinks || [{label:"公式情報", url:player.source}])
      .map(link => `<a href="${link.url}" target="_blank" rel="noopener">${BQ.escapeHtml(link.label)} ↗</a>`).join("");
    return `
      <div class="profile-rich">
        ${tags ? `<div class="player-tags">${tags}</div>` : ""}
        <div class="profile-point"><small>2026 VIEW</small><p>${BQ.escapeHtml(player.focus2026 || "")}</p></div>
        <div class="profile-point"><small>CAREER / TITLES</small><p>${BQ.escapeHtml(player.achievements || "")}</p></div>
        ${timeline ? `<div class="career-timeline"><small>CAREER LINE</small><ol>${timeline}</ol></div>` : ""}
        <div class="official-link-group">${links}</div>
        <span class="profile-updated">情報確認：${BQ.escapeHtml(player.updatedAt || "2026-08-17")}</span>
      </div>`;
  }

  function enhanceDailyCards() {
    document.querySelectorAll(".player-file-card:not([data-rich])").forEach(card => {
      const name = card.querySelector("h2")?.textContent.trim();
      const player = PLAYERS.find(p => p.name === name);
      if (!player) return;
      card.dataset.rich = "1";
      card.querySelector(".source-link")?.remove();
      card.insertAdjacentHTML("beforeend", profileExtra(player));
    });
  }

  const studyGrid = document.getElementById("player-study-grid");
  if (studyGrid) new MutationObserver(enhanceDailyCards).observe(studyGrid, { childList:true });

  // ---- Full player library ------------------------------------------------
  function injectPlayerLibrary() {
    if (document.getElementById("player-library-view")) return;
    const view = document.createElement("section");
    view.id = "player-library-view";
    view.className = "view";
    view.innerHTML = `
      <div class="player-library-shell">
        <div class="subpage-head player-library-head">
          <button id="library-home" class="back-button" type="button">← ホーム</button>
          <div><p class="eyebrow">PLAYER DIRECTORY / 2026</p><h1>選手名鑑</h1><p>${PLAYERS.length}人を収録。所属・特徴・キャリア・公式情報から探せる。</p></div>
        </div>
        <div class="library-controls">
          <label class="library-search">検索<input id="player-search" type="search" placeholder="選手名・球団・特徴で検索"></label>
          <label>リーグ<select id="player-league"><option value="">すべて</option><option value="NPB">NPB</option><option value="MLB">MLB</option></select></label>
          <label>チーム<select id="player-team"><option value="">すべて</option></select></label>
          <strong id="player-library-count">${PLAYERS.length}人</strong>
        </div>
        <div id="player-library-grid" class="player-library-grid"></div>
      </div>`;
    document.querySelector("main.shell").appendChild(view);

    const teams = [...new Set(PLAYERS.map(p => p.team))].sort((a,b) => a.localeCompare(b, "ja"));
    document.getElementById("player-team").insertAdjacentHTML("beforeend",
      teams.map(team => `<option value="${BQ.escapeHtml(team)}">${BQ.escapeHtml(team)}</option>`).join(""));

    document.getElementById("library-home").addEventListener("click", () => showView("home-view"));
    ["player-search","player-league","player-team"].forEach(id => document.getElementById(id).addEventListener("input", renderLibrary));
    renderLibrary();
  }

  function playerLibraryCard(player) {
    const tags = (player.tags || []).map(tag => `<span>${BQ.escapeHtml(tag)}</span>`).join("");
    const timeline = (player.timeline || []).map(item => `<li>${BQ.escapeHtml(item)}</li>`).join("");
    const links = (player.officialLinks || [{label:"公式情報", url:player.source}])
      .map(link => `<a href="${link.url}" target="_blank" rel="noopener">${BQ.escapeHtml(link.label)} ↗</a>`).join("");
    return `
      <article class="directory-card">
        <div class="directory-meta"><span>${player.league}</span><small>${BQ.escapeHtml(player.role)}</small></div>
        <h2>${BQ.escapeHtml(player.name)}</h2>
        <strong class="directory-team">${BQ.escapeHtml(player.team)}</strong>
        <p class="directory-hook">${BQ.escapeHtml(player.hook)}</p>
        <p>${BQ.escapeHtml(player.remember)}</p>
        <div class="player-tags">${tags}</div>
        <div class="directory-focus"><small>2026 VIEW</small>${BQ.escapeHtml(player.focus2026 || "")}</div>
        <details>
          <summary>キャリア・実績・公式情報</summary>
          <p>${BQ.escapeHtml(player.achievements || "")}</p>
          <ol>${timeline}</ol>
          <div class="official-link-group">${links}</div>
          <span class="profile-updated">情報確認：${BQ.escapeHtml(player.updatedAt || "2026-08-17")}</span>
        </details>
      </article>`;
  }

  function renderLibrary() {
    const grid = document.getElementById("player-library-grid");
    if (!grid) return;
    const q = (document.getElementById("player-search")?.value || "").trim().toLowerCase();
    const league = document.getElementById("player-league")?.value || "";
    const team = document.getElementById("player-team")?.value || "";
    const filtered = PLAYERS.filter(player => {
      if (league && player.league !== league) return false;
      if (team && player.team !== team) return false;
      if (!q) return true;
      const hay = [
        player.name, player.team, player.role, player.meta, player.hook,
        player.remember, player.focus2026, player.achievements, ...(player.tags || [])
      ].join(" ").toLowerCase();
      return hay.includes(q);
    });
    document.getElementById("player-library-count").textContent = `${filtered.length}人`;
    grid.innerHTML = filtered.length
      ? filtered.map(playerLibraryCard).join("")
      : `<div class="empty-state">該当する選手が見つからへんかった。検索条件を少し広げてみて。</div>`;
  }

  function showView(id) {
    document.querySelectorAll("main.shell > .view").forEach(v => v.classList.remove("active"));
    document.getElementById(id)?.classList.add("active");
    window.scrollTo({top:0, behavior:"smooth"});
  }

  function injectLibraryEntrances() {
    const previewHeading = document.querySelector(".player-files-preview .section-heading");
    if (previewHeading && !document.getElementById("open-player-library")) {
      const existing = previewHeading.querySelector("#open-player-files");
      const actions = document.createElement("div");
      actions.className = "player-heading-actions";
      const library = document.createElement("button");
      library.id = "open-player-library";
      library.className = "text-button";
      library.type = "button";
      library.textContent = `全${PLAYERS.length}人を見る →`;
      library.addEventListener("click", () => showView("player-library-view"));
      if (existing) {
        existing.replaceWith(actions);
        actions.append(existing, library);
      } else {
        actions.append(library);
        previewHeading.append(actions);
      }
    }

    const playerHead = document.querySelector("#players-view .player-study-head");
    if (playerHead && !document.getElementById("players-open-library")) {
      const btn = document.createElement("button");
      btn.id = "players-open-library";
      btn.className = "text-button player-library-jump";
      btn.type = "button";
      btn.textContent = `全${PLAYERS.length}人の名鑑`;
      btn.addEventListener("click", () => showView("player-library-view"));
      playerHead.appendChild(btn);
    }
  }

  reorderDailyAction();
  injectWorkflowStepper();
  injectPlayerLibrary();
  injectLibraryEntrances();
  injectCategoryLevels();
  enhanceDailyCards();
  renderCategoryLevels();
})();
