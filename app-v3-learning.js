(() => {
  const BQ = window.BQ;
  if (!BQ) return;

  const PLAYERS = window.QUIZ_PLAYER_FILES || [];
  const LEVELS = [
    { min:0, title:"ルーキー" },
    { min:120, title:"ベンチ入り" },
    { min:300, title:"一軍定着" },
    { min:600, title:"主力" },
    { min:1000, title:"オールスター" },
    { min:1600, title:"タイトルホルダー" },
    { min:2400, title:"球界通" }
  ];

  const baseFreshState = BQ.freshState;
  BQ.freshState = () => {
    const state = baseFreshState();
    state.progress = { xp: 0, dailyFiveCompleted: [], playerSeen: {} };
    return state;
  };

  BQ.state.progress ||= { xp: 0, dailyFiveCompleted: [], playerSeen: {} };
  BQ.state.progress.dailyFiveCompleted ||= [];
  BQ.state.progress.playerSeen ||= {};
  BQ.state.progress.xp ||= 0;

  function levelInfo(xp = BQ.state.progress.xp) {
    let index = 0;
    for (let i = 0; i < LEVELS.length; i++) if (xp >= LEVELS[i].min) index = i;
    const current = LEVELS[index];
    const next = LEVELS[index + 1] || null;
    const span = next ? next.min - current.min : 1;
    const progress = next ? Math.min(1, (xp - current.min) / span) : 1;
    return { number: index + 1, title: current.title, next, progress };
  }

  function addXp(amount) {
    const before = levelInfo();
    BQ.state.progress.xp += amount;
    BQ.save();
    const after = levelInfo();
    renderProgress();
    if (after.number > before.number) showLevelToast(after);
  }

  function showLevelToast(info) {
    const toast = document.getElementById("level-toast");
    if (!toast) return;
    toast.textContent = `LEVEL ${info.number}｜${info.title}`;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 1800);
  }

  function seededShuffle(items, seedText) {
    let seed = 2166136261;
    for (const ch of seedText) {
      seed ^= ch.charCodeAt(0);
      seed = Math.imul(seed, 16777619);
    }
    const a = [...items];
    const rnd = () => {
      seed += 0x6D2B79F5;
      let t = seed;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function todaysPlayers() {
    const key = BQ.localDateKey();
    const npb = seededShuffle(PLAYERS.filter(p => p.league === "NPB"), `${key}:npb`).slice(0, 3);
    const mlb = seededShuffle(PLAYERS.filter(p => p.league === "MLB"), `${key}:mlb`).slice(0, 2);
    return seededShuffle([...npb, ...mlb], `${key}:mix`);
  }

  function injectHomeUI() {
    const topbar = document.querySelector(".topbar");
    const recordButton = document.getElementById("open-stats");
    const progress = document.createElement("div");
    progress.className = "progress-head";
    progress.innerHTML = `
      <div class="progress-head-line"><span id="header-level">LEVEL 1</span><strong id="header-xp">0 XP</strong></div>
      <div class="xp-track"><div id="header-xp-fill" class="xp-fill"></div></div>`;
    topbar.insertBefore(progress, recordButton);

    const actionGrid = document.querySelector(".action-grid");
    actionGrid.classList.add("is-three");
    const learn = document.createElement("button");
    learn.className = "action-card learn-five";
    learn.type = "button";
    learn.innerHTML = `<span class="action-kicker">PLAYER FILES</span><strong>今日覚える5人</strong><small>先に読んでから、5問で思い出す</small>`;
    learn.addEventListener("click", openPlayerFiles);
    actionGrid.appendChild(learn);

    const strip = document.createElement("section");
    strip.className = "progress-strip";
    strip.innerHTML = `
      <div class="progress-main"><small>PLAYER LEVEL</small><strong id="home-level">LEVEL 1｜ルーキー</strong><div class="xp-track mini-xp"><div id="home-xp-fill" class="xp-fill"></div></div></div>
      <div><small>XP</small><strong id="home-xp">0</strong></div>
      <div><small>STREAK</small><strong id="home-streak">0 DAYS</strong></div>`;
    actionGrid.insertAdjacentElement("afterend", strip);

    const preview = document.createElement("section");
    preview.className = "section-block player-files-preview";
    preview.innerHTML = `
      <div class="section-heading">
        <div><p class="eyebrow">TODAY'S PLAYER FILES</p><h2>今日の5人</h2></div>
        <button id="open-player-files" class="text-button" type="button">名鑑を開く →</button>
      </div>
      <div id="player-files-rail" class="player-files-rail"></div>`;
    strip.insertAdjacentElement("afterend", preview);
    document.getElementById("open-player-files").addEventListener("click", openPlayerFiles);

    const toast = document.createElement("div");
    toast.id = "level-toast";
    toast.className = "level-toast";
    document.body.appendChild(toast);

    renderPlayerPreview();
  }

  function injectPlayerView() {
    const view = document.createElement("section");
    view.id = "players-view";
    view.className = "view";
    view.innerHTML = `
      <div class="player-study-shell">
        <div class="player-study-head">
          <div><button id="players-home" class="back-button" type="button">← ホーム</button><p class="eyebrow">PLAYER FILES / DAILY FIVE</p><h1>今日覚える5人</h1></div>
          <div class="issue"><span id="players-date"></span><br>3 NPB + 2 MLB</div>
        </div>
        <div id="player-study-content">
          <div id="player-study-grid" class="player-study-grid"></div>
          <div class="player-study-actions">
            <p>先に5人の「覚えどころ」を読む。そのあと5問だけ解く。正解することより、名前と特徴を一度つなぐのが目的。</p>
            <button id="start-five-quiz" class="next-button" type="button">5人の確認クイズへ</button>
          </div>
        </div>
        <div id="five-quiz" class="five-quiz" hidden></div>
      </div>`;
    document.querySelector("main.shell").appendChild(view);
    document.getElementById("players-home").addEventListener("click", () => showOnly("home-view"));
    document.getElementById("start-five-quiz").addEventListener("click", startFiveQuiz);
  }

  function showOnly(id) {
    document.querySelectorAll("main.shell > .view").forEach(v => v.classList.remove("active"));
    document.getElementById(id)?.classList.add("active");
    window.scrollTo({ top:0, behavior:"smooth" });
  }

  function openPlayerFiles() {
    renderPlayerStudy();
    showOnly("players-view");
  }

  function renderPlayerPreview() {
    const rail = document.getElementById("player-files-rail");
    if (!rail) return;
    rail.innerHTML = todaysPlayers().map((p, i) => `
      <div class="player-mini">
        <span class="no">0${i + 1}</span>
        <strong>${BQ.escapeHtml(p.name)}</strong>
        <span>${BQ.escapeHtml(p.team)}<br>${BQ.escapeHtml(p.role)}</span>
      </div>`).join("");
  }

  function renderPlayerStudy() {
    const players = todaysPlayers();
    document.getElementById("players-date").textContent = BQ.localDateKey().replaceAll("-", ".");
    const grid = document.getElementById("player-study-grid");
    grid.innerHTML = players.map((p, i) => `
      <article class="player-file-card">
        <span class="file-no">FILE 0${i + 1}</span>
        <span class="league">${p.league}</span>
        <h2>${BQ.escapeHtml(p.name)}</h2>
        <div class="team">${BQ.escapeHtml(p.team)}</div>
        <div class="role">${BQ.escapeHtml(p.role)}｜${BQ.escapeHtml(p.meta)}</div>
        <p class="hook">${BQ.escapeHtml(p.hook)}</p>
        <p class="remember">${BQ.escapeHtml(p.remember)}</p>
        <a class="source-link" href="${p.source}" target="_blank" rel="noopener">公式情報 ↗</a>
      </article>`).join("");

    players.forEach(p => {
      if (!BQ.state.progress.playerSeen[p.id]) {
        BQ.state.progress.playerSeen[p.id] = Date.now();
        addXp(2);
      }
    });
    BQ.save();

    document.getElementById("player-study-content").hidden = false;
    document.getElementById("five-quiz").hidden = true;
  }

  let fiveSession = null;

  function startFiveQuiz() {
    const players = todaysPlayers();
    const questions = players.map(p => BQ.QUESTIONS.find(q => q.id === p.quizId)).filter(Boolean);
    fiveSession = { players, questions, index:0, correct:0, xp:0, answered:false, unsure:false };
    document.getElementById("player-study-content").hidden = true;
    document.getElementById("five-quiz").hidden = false;
    renderFiveQuestion();
  }

  function renderFiveQuestion() {
    const host = document.getElementById("five-quiz");
    if (!fiveSession || fiveSession.index >= fiveSession.questions.length) return finishFiveQuiz();
    const q = fiveSession.questions[fiveSession.index];
    fiveSession.answered = false;
    fiveSession.unsure = false;
    const options = BQ.shuffle(q.options.map((label, index) => ({ label, index })));
    host.innerHTML = `
      <p class="five-kicker">CHECK ${fiveSession.index + 1} / ${fiveSession.questions.length} · ${BQ.CATEGORIES[q.category].label}</p>
      <h2>${BQ.escapeHtml(q.q)}</h2>
      <div class="five-options">${options.map(o => `<button class="five-option" type="button" data-index="${o.index}">${BQ.escapeHtml(o.label)}</button>`).join("")}</div>
      <div id="five-feedback" class="five-feedback" hidden>
        <strong id="five-feedback-title"></strong>
        <p>${BQ.escapeHtml(q.explanation)}</p>
        <a class="source-link" href="${q.source}" target="_blank" rel="noopener">出典を確認 ↗</a>
        <div class="five-feedback-actions">
          <button id="five-unsure" class="unsure-button" type="button" hidden>正解したけど、自信なし</button>
          <button id="five-next" class="next-button" type="button">次へ</button>
        </div>
      </div>`;
    host.querySelectorAll(".five-option").forEach(btn => btn.addEventListener("click", () => answerFive(q, btn)));
  }

  function answerFive(q, clicked) {
    if (fiveSession.answered) return;
    fiveSession.answered = true;
    const chosen = Number(clicked.dataset.index);
    const correct = chosen === q.answer;
    const options = document.querySelectorAll(".five-option");
    options.forEach(btn => {
      btn.disabled = true;
      if (Number(btn.dataset.index) === q.answer) btn.classList.add("correct");
    });
    if (!correct) clicked.classList.add("wrong");

    BQ.state.stats.answered += 1;
    if (correct) {
      BQ.state.stats.correct += 1;
      fiveSession.correct += 1;
      fiveSession.xp += 12;
      BQ.updateReview(q.id, true);
    } else {
      fiveSession.xp += 5;
      BQ.updateReview(q.id, false);
    }
    BQ.touchActivity();
    BQ.save();

    document.getElementById("five-feedback-title").textContent = correct ? "正解。名前と特徴がつながった。" : "ここをもう一度つなごう。";
    document.getElementById("five-feedback").hidden = false;
    const unsure = document.getElementById("five-unsure");
    if (correct) unsure.hidden = false;
    unsure?.addEventListener("click", () => {
      if (fiveSession.unsure) return;
      fiveSession.unsure = true;
      BQ.addUncertain(q.id);
      BQ.save();
      unsure.disabled = true;
      unsure.textContent = "復習に追加した";
    });
    document.getElementById("five-next").addEventListener("click", () => {
      fiveSession.index += 1;
      renderFiveQuestion();
    });
    BQ.renderDashboard?.();
  }

  function finishFiveQuiz() {
    const key = BQ.localDateKey();
    if (!BQ.state.progress.dailyFiveCompleted.includes(key)) {
      BQ.state.progress.dailyFiveCompleted.push(key);
      BQ.state.progress.dailyFiveCompleted = BQ.state.progress.dailyFiveCompleted.slice(-120);
      fiveSession.xp += 20;
    }
    addXp(fiveSession.xp);
    const host = document.getElementById("five-quiz");
    host.innerHTML = `
      <div class="five-result">
        <p class="eyebrow">DAILY FIVE COMPLETE</p>
        <strong>${fiveSession.correct} / ${fiveSession.questions.length}</strong>
        <p>今日の5人、ひとまず顔と特徴をつないだ。</p>
        <p class="xp-pop">+${fiveSession.xp} XP</p>
        <button id="five-home" class="next-button" type="button">ホームへ戻る</button>
      </div>`;
    document.getElementById("five-home").addEventListener("click", () => {
      renderPlayerPreview();
      renderProgress();
      showOnly("home-view");
    });
  }

  function renderProgress() {
    const info = levelInfo();
    const xp = BQ.state.progress.xp;
    const setText = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
    const setWidth = (id, value) => { const el = document.getElementById(id); if (el) el.style.width = `${value * 100}%`; };
    setText("header-level", `LEVEL ${info.number} · ${info.title}`);
    setText("header-xp", `${xp} XP`);
    setWidth("header-xp-fill", info.progress);
    setText("home-level", `LEVEL ${info.number}｜${info.title}`);
    setText("home-xp", xp);
    setText("home-streak", `${BQ.streakCount()} DAYS`);
    setWidth("home-xp-fill", info.progress);
  }

  function watchMainQuiz() {
    const feedback = document.getElementById("feedback");
    if (!feedback) return;
    const observer = new MutationObserver(() => {
      if (feedback.hidden || !BQ.session?.answered) return;
      BQ.session._xpAwarded ||= new Set();
      const key = `${BQ.session.index}:${BQ.session.qs[BQ.session.index]?.id}`;
      if (BQ.session._xpAwarded.has(key)) return;
      BQ.session._xpAwarded.add(key);
      const q = BQ.session.qs[BQ.session.index];
      const wrong = BQ.session.wrongIds.includes(q.id);
      addXp(wrong ? 4 : 10);
    });
    observer.observe(feedback, { attributes:true, attributeFilter:["hidden"] });
  }

  const baseShowView = BQ.showView;
  BQ.showView = name => {
    document.getElementById("players-view")?.classList.remove("active");
    baseShowView(name);
    if (name === "home") renderProgress();
  };

  injectHomeUI();
  injectPlayerView();
  watchMainQuiz();
  renderProgress();
  BQ.save();
})();
