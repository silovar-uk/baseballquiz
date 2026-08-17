(() => {
  const BQ = window.BQ;
  const PLAYERS = window.QUIZ_PLAYER_FILES || [];
  if (!BQ || !PLAYERS.length) return;

  const normalize = value => String(value || "").replace(/[\s　・.]/g, "").toLowerCase();

  function openLibraryFor(name) {
    const open = document.getElementById("open-player-library");
    if (!open) return;
    open.click();
    requestAnimationFrame(() => {
      const search = document.getElementById("player-search");
      if (!search) return;
      search.value = name;
      search.dispatchEvent(new Event("input", { bubbles: true }));
      search.focus({ preventScroll: true });
      document.querySelector(".player-library-head")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function relatedFor(player, max = 4) {
    return PLAYERS
      .filter(p => p.team === player.team && p.id !== player.id)
      .sort((a,b) => a.name.localeCompare(b.name, "ja"))
      .slice(0, max);
  }

  function relatedMarkup(player) {
    const related = relatedFor(player);
    if (!related.length) return "";
    return `<div class="related-team-players">
      <small>SAME TEAM / 同じ球団</small>
      <div class="related-player-list">${related.map(p =>
        `<button class="related-player-chip" type="button" data-player-name="${BQ.escapeHtml(p.name)}">${BQ.escapeHtml(p.name)}</button>`
      ).join("")}</div>
    </div>`;
  }

  function bindRelated(root = document) {
    root.querySelectorAll(".related-player-chip:not([data-bound])").forEach(btn => {
      btn.dataset.bound = "1";
      btn.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        openLibraryFor(btn.dataset.playerName);
      });
    });
  }

  function enhanceDirectoryCards() {
    document.querySelectorAll(".directory-card:not([data-v5])").forEach(card => {
      const name = card.querySelector("h2")?.textContent.trim();
      const player = PLAYERS.find(p => normalize(p.name) === normalize(name));
      if (!player) return;
      card.dataset.v5 = "1";
      card.dataset.clickable = "true";
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", `${player.name}の詳細を開く`);
      const details = card.querySelector("details");
      card.insertAdjacentHTML("beforeend", relatedMarkup(player));
      if (details) {
        const hint = document.createElement("span");
        hint.className = "card-open-hint";
        hint.textContent = "カードを押して詳細";
        details.insertAdjacentElement("beforebegin", hint);
      }

      const toggle = () => {
        if (!details) return;
        details.open = !details.open;
        card.setAttribute("aria-expanded", String(details.open));
      };
      card.addEventListener("click", event => {
        if (event.target.closest("a,button,input,select,textarea,summary,details")) return;
        toggle();
      });
      card.addEventListener("keydown", event => {
        if (event.key !== "Enter" && event.key !== " ") return;
        if (event.target !== card) return;
        event.preventDefault();
        toggle();
      });
    });
    bindRelated();
  }

  function enhancePreviewAndStudyCards() {
    document.querySelectorAll(".player-mini:not([data-v5]), .player-file-card:not([data-v5-click])").forEach(card => {
      const name = card.querySelector("strong,h2")?.textContent.trim();
      if (!name) return;
      card.dataset.clickable = "true";
      if (card.matches(".player-mini")) card.dataset.v5 = "1";
      else card.dataset.v5Click = "1";
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", `${name}を選手名鑑で見る`);
      card.addEventListener("click", event => {
        if (event.target.closest("a,button,details,summary")) return;
        openLibraryFor(name);
      });
      card.addEventListener("keydown", event => {
        if ((event.key === "Enter" || event.key === " ") && event.target === card) {
          event.preventDefault();
          openLibraryFor(name);
        }
      });

      if (card.matches(".player-file-card")) {
        const player = PLAYERS.find(p => normalize(p.name) === normalize(name));
        const rich = card.querySelector(".profile-rich");
        if (player && rich && !rich.querySelector(".related-team-players")) {
          rich.insertAdjacentHTML("beforeend", relatedMarkup(player));
        }
      }
    });
    bindRelated();
  }

  function emphasizeToday() {
    const learn = document.querySelector(".action-card.learn-five");
    if (!learn) return;
    learn.classList.add("is-primary-cta");
    learn.setAttribute("aria-label", "今日の学習を始める。5人を読んで、5問解いて、復習へ進む");
  }

  function injectDataHealth() {
    const head = document.querySelector(".player-library-head > div");
    if (!head || head.querySelector(".data-health-v5")) return;
    const npb = PLAYERS.filter(p => p.league === "NPB");
    const mlb = PLAYERS.filter(p => p.league === "MLB");
    const counts = [...new Set(npb.map(p => p.team))].map(team => npb.filter(p => p.team === team).length);
    const target = window.BQ_DATA_VERIFICATION?.targetNpbPerTeam || 10;
    const balanced = counts.length === 12 && counts.every(n => n >= target);
    const row = document.createElement("div");
    row.className = "data-health-v5";
    row.innerHTML = `<strong class="${balanced ? "ok" : ""}">NPB ${npb.length}人 / MLB ${mlb.length}人</strong>
      <span>12球団 × ${target}人</span>
      <span>情報確認 ${window.BQ_DATA_VERIFICATION?.verifiedAt || "2026-08-17"}</span>`;
    head.appendChild(row);
  }

  function refreshLibraryIfOpen() {
    const search = document.getElementById("player-search");
    if (search) search.dispatchEvent(new Event("input", { bubbles:true }));
  }

  emphasizeToday();
  injectDataHealth();
  enhanceDirectoryCards();
  enhancePreviewAndStudyCards();
  refreshLibraryIfOpen();

  const observer = new MutationObserver(() => {
    enhanceDirectoryCards();
    enhancePreviewAndStudyCards();
    injectDataHealth();
    emphasizeToday();
  });
  observer.observe(document.body, { childList:true, subtree:true });
})();
