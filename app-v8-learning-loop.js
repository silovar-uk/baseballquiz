(() => {
  const BQ = window.BQ;
  const PLAYERS = window.QUIZ_PLAYER_FILES || [];
  if (!BQ) return;

  const $ = id => document.getElementById(id);
  const todayKey = () => BQ.localDateKey?.() || new Date().toISOString().slice(0, 10);
  const dueCount = () => (BQ.reviewEntries?.() || []).filter(([, item]) => BQ.isDue?.(item)).length;
  const dailyDone = () => Boolean(BQ.state?.progress?.dailyFiveCompleted?.includes(todayKey()));

  const CATEGORY_CONNECTIONS = {
    current: {
      view: "名前だけでなく、役割や得意な形まで意識して見る。",
      why: "この選手が、その役割を任されているのはなぜやろう？"
    },
    mlb: {
      view: "日本との違いだけでなく、環境がプレーや評価をどう変えるかを見る。",
      why: "この選手がMLBで評価されるポイントは、NPBと何が違うやろう？"
    },
    stats: {
      view: "数字そのものより、『なぜこの数字が珍しいか』まで見る。",
      why: "この記録が生まれやすい条件は何やろう？"
    },
    tactics: {
      view: "次の試合で同じ局面が出たとき、選手にどんな選択肢があるかを見る。",
      why: "別の選択をしたら、何が変わるやろう？"
    },
    systems: {
      view: "制度を暗記せず、選手や球団の判断をどう変える仕組みかを見る。",
      why: "この制度がなかったら、球団や選手はどう動くやろう？"
    },
    teams: {
      view: "球団名だけでなく、歴史と今の選手を一本につないで見る。",
      why: "この球団らしさは、今のチームのどこに残っているやろう？"
    },
    history: {
      view: "昔との違いから、今の野球がなぜこの形になったかを見る。",
      why: "何が変わって、何が今も残っているやろう？"
    }
  };

  function tuneHomeCopy() {
    const hero = document.querySelector(".hero-copy");
    if (hero) {
      hero.textContent = "選手を知る。5問で思い出す。解説でつなぐ。忘れかけた頃にもう一度。次の試合で、一つ多く気づけるところまで。";
    }

    const learn = document.querySelector(".action-card.learn-five");
    if (learn) {
      learn.dataset.primaryLoop = "true";
      learn.querySelector(".action-kicker")?.replaceChildren(document.createTextNode("TODAY'S LEARNING"));
      learn.querySelector("strong")?.replaceChildren(document.createTextNode("今日の学習"));
      learn.querySelector("small")?.replaceChildren(document.createTextNode("5人を知る → 思い出す → つなぐ → 復習"));
    }

    const freeQuiz = document.querySelector('.action-card.primary[data-start="daily"]');
    if (freeQuiz) {
      freeQuiz.classList.add("is-secondary-route");
      freeQuiz.querySelector(".action-kicker")?.replaceChildren(document.createTextNode("FREE QUIZ"));
      freeQuiz.querySelector("strong")?.replaceChildren(document.createTextNode("10問で広げる"));
      freeQuiz.querySelector("small")?.replaceChildren(document.createTextNode("選手・球団・歴史・制度を横断"));
    }

    const review = document.querySelector('.action-card.review[data-start="review"]');
    review?.classList.add("is-secondary-route");

    const studyNote = document.querySelector(".player-study-actions p");
    if (studyNote) {
      studyNote.textContent = "5人の覚えどころを読む → 5問で思い出す → 解説で背景までつなぐ。正解数より、次に見たとき一つ気づけることが目的。";
    }
  }

  function injectHomeJourney() {
    const grid = document.querySelector(".action-grid");
    if (!grid || $("learning-loop")) return;

    const section = document.createElement("section");
    section.id = "learning-loop";
    section.className = "learning-loop";
    section.innerHTML = `
      <div class="learning-loop-head">
        <div>
          <p class="eyebrow">TODAY'S LOOP</p>
          <h2>今日の1セット</h2>
        </div>
        <span id="learning-loop-status" class="count-pill">これから</span>
      </div>
      <div class="learning-loop-steps" aria-label="今日の学習の流れ">
        <div class="learning-loop-step" data-loop-step="1"><b>1</b><span><strong>知る</strong><small>5人の覚えどころに触れる</small></span></div>
        <div class="learning-loop-step" data-loop-step="2"><b>2</b><span><strong>思い出す</strong><small>5問で記憶から取り出す</small></span></div>
        <div class="learning-loop-step" data-loop-step="3"><b>3</b><span><strong>つなぐ</strong><small>解説で理由や背景を見る</small></span></div>
        <div class="learning-loop-step" data-loop-step="4"><b>4</b><span><strong>戻る</strong><small>期限が来たら、もう一度</small></span></div>
      </div>
      <p class="learning-loop-goal">正解数より、次の試合で一つ多く気づけたら成功。</p>`;
    grid.insertAdjacentElement("afterend", section);
    renderHomeJourney();
  }

  function renderHomeJourney() {
    const root = $("learning-loop");
    if (!root) return;
    const done = dailyDone();
    const due = dueCount();
    const status = $("learning-loop-status");

    root.querySelectorAll("[data-loop-step]").forEach(step => {
      const n = Number(step.dataset.loopStep);
      step.classList.remove("is-active", "is-done");
      if (!done) {
        if (n === 1) step.classList.add("is-active");
      } else if (due > 0) {
        if (n <= 3) step.classList.add("is-done");
        if (n === 4) step.classList.add("is-active");
      } else {
        step.classList.add("is-done");
      }
    });

    if (!status) return;
    status.textContent = !done ? "今日の学習へ" : due > 0 ? `復習 ${due}問` : "今日の1セット完了";
    status.classList.toggle("is-complete", done && due === 0);
  }

  function connectionFor(q) {
    return CATEGORY_CONNECTIONS[q?.category] || {
      view: "答えだけでなく、この知識が試合のどこに現れるかを見る。",
      why: "この知識は、どんな場面で役に立つやろう？"
    };
  }

  function injectNormalConnection() {
    const feedback = $("feedback");
    if (!feedback || feedback.hidden || !BQ.session) return;
    const q = BQ.session.qs?.[BQ.session.index];
    if (!q) return;
    const stamp = `${BQ.session.index}:${q.id}`;
    if (feedback.dataset.loopStamp === stamp) return;
    feedback.dataset.loopStamp = stamp;

    const correct = ($("feedback-title")?.textContent || "").startsWith("正解");
    if ($("feedback-title")) {
      $("feedback-title").textContent = correct
        ? "正解。ここから一つつなげる。"
        : "ここが、次に気づけるポイント。";
    }

    feedback.querySelector(".connection-panel")?.remove();
    const connection = connectionFor(q);
    const panel = document.createElement("div");
    panel.className = "connection-panel";
    panel.innerHTML = `
      <span class="connection-kicker">つなぐ</span>
      <strong>次の試合で見るなら</strong>
      <p>${BQ.escapeHtml(connection.view)}</p>
      <small>次の「なんで？」：${BQ.escapeHtml(connection.why)}</small>`;
    $("feedback-source")?.insertAdjacentElement("afterend", panel);
  }

  function injectFiveConnection() {
    const host = $("five-quiz");
    const feedback = host?.querySelector(".five-feedback:not([hidden])");
    const questionText = host?.querySelector("h2")?.textContent || "";
    if (!feedback || !questionText) return;

    const q = BQ.QUESTIONS.find(item => item.q === questionText);
    if (!q || feedback.dataset.loopQuestion === q.id) return;
    feedback.dataset.loopQuestion = q.id;
    feedback.querySelector(".connection-panel")?.remove();

    const player = PLAYERS.find(p => p.quizId === q.id);
    const panel = document.createElement("div");
    panel.className = "connection-panel compact";
    panel.innerHTML = player
      ? `<span class="connection-kicker">つなぐ</span><strong>次に${BQ.escapeHtml(player.name)}を見るとき</strong><p>${BQ.escapeHtml(player.role)}として、何をしているかを一つ探す。</p><small>「知ってる選手」から「プレーが見える選手」へ。</small>`
      : `<span class="connection-kicker">つなぐ</span><strong>答えで終わらせない</strong><p>${BQ.escapeHtml(connectionFor(q).view)}</p>`;
    feedback.querySelector(".source-link")?.insertAdjacentElement("afterend", panel);
  }

  function openPlayerLibrary() {
    const trigger = $("open-player-library") || $("players-open-library");
    if (trigger) trigger.click();
  }

  function injectResultBridge() {
    const view = $("result-view");
    if (!view?.classList.contains("active") || !BQ.session) return;
    const s = BQ.session;
    const stamp = `${s.mode}:${s.correct}:${s.qs?.length || 0}:${s.wrongIds?.length || 0}:${s.unsureIds?.length || 0}`;
    if (view.dataset.loopStamp === stamp) return;
    view.dataset.loopStamp = stamp;

    view.querySelector(".result-loop-panel")?.remove();
    const title = view.querySelector(".result-card h2");
    const message = $("result-message");
    const back = $("back-home");
    const due = dueCount();
    const done = dailyDone();

    if (s.mode === "review") {
      if (title) title.textContent = done && due === 0 ? "今日の1セット、完了。" : "忘れかけた知識を、もう一度。";
      if (message) message.textContent = due === 0
        ? "思い出した知識は、また忘れかけた頃に戻ってくる。次は実際の試合で一つ見つける番。"
        : `まだ${due}問が今日の復習対象。無理に詰め込まず、思い出す回数を増やしていこう。`;
    } else if (title) {
      title.textContent = "点数より、何がつながった？";
    }

    const panel = document.createElement("div");
    panel.className = "result-loop-panel";

    if (!done && s.mode !== "review") {
      panel.innerHTML = `<span>次の一手</span><strong>今日の5人を知る</strong><p>クイズで広げたあと、5人だけに絞って「知る → 思い出す → つなぐ」まで一巡する。</p><button class="result-loop-action" type="button">今日の学習へ</button>`;
      panel.querySelector("button").addEventListener("click", () => document.querySelector(".action-card.learn-five")?.click());
    } else if (due > 0 && s.mode !== "review") {
      panel.innerHTML = `<span>次の一手</span><strong>忘れかけた知識へ戻る</strong><p>今日が期限の${due}問だけ、もう一度記憶から取り出す。</p><button class="result-loop-action" type="button">復習へ（${due}問）</button>`;
      panel.querySelector("button").addEventListener("click", () => BQ.startQuiz?.("review"));
    } else {
      panel.innerHTML = `<span>サイトの外へ</span><strong>次の試合で、一つ探す</strong><p>今日覚えた選手・制度・記録のうち一つだけ、試合やニュースの中で見つけてみる。</p><button class="result-loop-action secondary" type="button">選手名鑑を見る</button>`;
      panel.querySelector("button").addEventListener("click", openPlayerLibrary);
    }

    back?.insertAdjacentElement("beforebegin", panel);
    renderHomeJourney();
  }

  function injectFieldTransfer() {
    const result = $("five-quiz")?.querySelector(".five-result");
    if (!result || result.querySelector(".field-transfer")) return;
    const home = result.querySelector("#five-home");
    const note = document.createElement("div");
    note.className = "field-transfer";
    note.innerHTML = `<span>サイトの外へ</span><strong>今日の5人から、1人だけ探す。</strong><p>次の試合、ハイライト、ニュースで見つけたら、今日の学習は画面の外までつながる。</p>`;
    home?.insertAdjacentElement("beforebegin", note);
    renderHomeJourney();
  }

  function initObservers() {
    const normalFeedback = $("feedback");
    if (normalFeedback) {
      new MutationObserver(injectNormalConnection)
        .observe(normalFeedback, { attributes: true, attributeFilter: ["hidden"] });
    }

    const fiveHost = $("five-quiz");
    if (fiveHost) {
      new MutationObserver(() => {
        injectFiveConnection();
        injectFieldTransfer();
      }).observe(fiveHost, { childList: true, subtree: true, attributes: true, attributeFilter: ["hidden"] });
    }

    const resultView = $("result-view");
    if (resultView) {
      new MutationObserver(injectResultBridge)
        .observe(resultView, { attributes: true, attributeFilter: ["class"] });
    }

    const due = $("due-count");
    if (due) {
      new MutationObserver(renderHomeJourney)
        .observe(due, { childList: true, characterData: true, subtree: true });
    }
  }

  function init() {
    tuneHomeCopy();
    injectHomeJourney();
    initObservers();
    renderHomeJourney();
  }

  requestAnimationFrame(init);
})();
