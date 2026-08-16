(() => {
  const BQ = window.BQ;

  function dailySet() {
    const current = BQ.QUESTIONS.filter(q => ["current", "mlb", "stats", "tactics"].includes(q.category));
    const history = BQ.QUESTIONS.filter(q => ["history", "teams", "systems"].includes(q.category));
    return BQ.shuffle(current).slice(0, 7)
      .concat(BQ.shuffle(history).slice(0, 3))
      .sort(() => Math.random() - .5);
  }

  function reviewSet() {
    const ids = BQ.reviewEntries()
      .filter(([, item]) => BQ.isDue(item))
      .map(([id]) => id);
    return BQ.shuffle(BQ.QUESTIONS.filter(q => ids.includes(q.id)));
  }

  BQ.startQuiz = (mode, category = null) => {
    let qs = [];
    let label = "";

    if (mode === "daily") {
      qs = dailySet();
      label = "今日の10問";
    } else if (mode === "review") {
      qs = reviewSet();
      label = "復習";
    } else if (mode === "category") {
      qs = BQ.shuffle(BQ.QUESTIONS.filter(q => q.category === category)).slice(0, 12);
      label = BQ.CATEGORIES[category].label;
    }

    if (!qs.length) {
      alert(mode === "review"
        ? "今日が復習日の問題はまだないで。新しい問題を解いて、復習ノートを育てよう。"
        : "問題がありません。");
      return;
    }

    BQ.session = {
      mode,
      label,
      qs,
      index: 0,
      correct: 0,
      wrongIds: [],
      unsureIds: [],
      answered: false
    };

    BQ.showView("quiz");
    renderQuestion();
  };

  function renderQuestion() {
    const s = BQ.session;
    const q = s.qs[s.index];
    s.answered = false;

    const feedback = BQ.$("feedback");
    const unsure = BQ.$("mark-unsure");
    const unsureNote = BQ.$("unsure-note");

    feedback.hidden = true;
    unsure.hidden = true;
    unsure.disabled = false;
    unsure.textContent = "正解したけど、自信なし";
    unsureNote.hidden = true;
    unsureNote.textContent = "押すと1日後の復習に追加。";

    BQ.$("quiz-mode-label").textContent = s.label;
    BQ.$("quiz-progress-label").textContent = `${s.index + 1} / ${s.qs.length}`;
    BQ.$("quiz-progress-bar").style.width = `${(s.index / s.qs.length) * 100}%`;
    BQ.$("question-category").textContent = BQ.CATEGORIES[q.category].label;
    BQ.$("question-level").textContent = `LEVEL ${q.level}`;
    BQ.$("question-clue").textContent = q.clue || "";
    BQ.$("question-clue").hidden = !q.clue;
    BQ.$("question-text").textContent = q.q;
    BQ.$("answer-area").innerHTML = "";

    if (q.type === "order") renderOrder(q);
    else renderOptions(q);
  }

  function renderOptions(q) {
    const area = BQ.$("answer-area");
    BQ.shuffle(q.options.map((_, i) => i)).forEach(originalIndex => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "answer-button";
      btn.dataset.originalIndex = String(originalIndex);
      btn.textContent = q.options[originalIndex];
      btn.addEventListener("click", () => answerQuestion(originalIndex, btn));
      area.appendChild(btn);
    });
  }

  function renderOrder(q) {
    const area = BQ.$("answer-area");
    const help = document.createElement("p");
    help.className = "order-help";
    help.textContent = "古い順に、1つずつタップ。選び直すときは選択欄をタップ。";

    const selection = document.createElement("button");
    selection.type = "button";
    selection.className = "order-selection";
    selection.textContent = "まだ選択されていません";

    const chosen = [];
    const buttons = [];

    const submit = document.createElement("button");
    submit.type = "button";
    submit.className = "order-submit";
    submit.textContent = "この順番で回答";
    submit.disabled = true;

    BQ.shuffle(q.options.map((_, i) => i)).forEach(originalIndex => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "answer-button";
      btn.textContent = q.options[originalIndex];
      btn.addEventListener("click", () => {
        if (chosen.includes(originalIndex) || BQ.session.answered) return;
        chosen.push(originalIndex);
        btn.disabled = true;
        btn.classList.add("selected");
        selection.textContent = chosen.map((i, n) => `${n + 1}. ${q.options[i]}`).join(" → ");
        submit.disabled = chosen.length !== q.options.length;
      });
      buttons.push(btn);
    });

    selection.addEventListener("click", () => {
      if (BQ.session.answered) return;
      chosen.splice(0);
      buttons.forEach(btn => {
        btn.disabled = false;
        btn.classList.remove("selected");
      });
      selection.textContent = "まだ選択されていません";
      submit.disabled = true;
    });

    submit.addEventListener("click", () => {
      if (BQ.session.answered) return;
      const correct = chosen.length === q.answer.length && chosen.every((v, i) => v === q.answer[i]);
      finishAnswer(correct, q);
    });

    area.append(help, selection, ...buttons, submit);
  }

  function answerQuestion(index, clicked) {
    const s = BQ.session;
    if (s.answered) return;
    const q = s.qs[s.index];
    const correct = index === q.answer;

    BQ.$("answer-area").querySelectorAll(".answer-button").forEach(btn => {
      btn.disabled = true;
      if (Number(btn.dataset.originalIndex) === q.answer) btn.classList.add("correct");
    });

    if (!correct) clicked.classList.add("wrong");
    finishAnswer(correct, q);
  }

  function finishAnswer(correct, q) {
    const s = BQ.session;
    s.answered = true;
    BQ.state.stats.answered += 1;

    if (correct) {
      BQ.state.stats.correct += 1;
      s.correct += 1;
    } else {
      s.wrongIds.push(q.id);
    }

    BQ.touchActivity();
    BQ.updateReview(q.id, correct);

    BQ.$("feedback-title").textContent = correct ? "正解！" : "ここ、覚えどころ。";
    BQ.$("feedback-badge").textContent = correct ? "GOOD" : "復習ノートへ保存";
    BQ.$("feedback-explanation").textContent = q.explanation;
    BQ.$("feedback-source").href = q.source;

    if (correct) {
      BQ.$("mark-unsure").hidden = false;
      BQ.$("unsure-note").hidden = false;
    }

    BQ.$("feedback").hidden = false;
    BQ.$("quiz-progress-bar").style.width = `${((s.index + 1) / s.qs.length) * 100}%`;
    BQ.$("next-question").textContent = s.index === s.qs.length - 1 ? "結果を見る" : "次の問題へ";

    BQ.save();
    BQ.renderDashboard?.();
  }

  BQ.markCurrentUnsure = () => {
    const s = BQ.session;
    const btn = BQ.$("mark-unsure");
    if (!s?.answered || btn.disabled) return;

    const q = s.qs[s.index];
    BQ.addUncertain(q.id);
    if (!s.unsureIds.includes(q.id)) s.unsureIds.push(q.id);

    btn.disabled = true;
    btn.textContent = "復習に追加した";
    BQ.$("unsure-note").textContent = "1日後から復習に出します。";
    BQ.$("feedback-badge").textContent = "自信なし → 復習ノート";

    BQ.save();
    BQ.renderDashboard?.();
  };

  BQ.nextQuestion = () => {
    const s = BQ.session;
    if (!s?.answered) return;
    s.index += 1;
    if (s.index >= s.qs.length) renderResult();
    else renderQuestion();
  };

  function renderResult() {
    const s = BQ.session;
    BQ.showView("result");
    BQ.$("result-correct").textContent = s.correct;
    BQ.$("result-total").textContent = s.qs.length;

    const rate = s.correct / s.qs.length;
    const reviewCount = new Set([...s.wrongIds, ...s.unsureIds]).size;
    BQ.$("result-message").textContent = reviewCount
      ? `${reviewCount}問を復習へ。間違いだけやなく「合ってたけど曖昧」も、後日もう一度出てくるで。`
      : rate >= .9
        ? "かなり入ってる。次は別ジャンルも混ぜて、知識同士をつなげよう。"
        : "ええ感じ。次は別ジャンルも混ぜてみよう。";

    const list = BQ.$("result-wrongs");
    list.innerHTML = "";

    s.wrongIds.forEach(id => addResultItem(list, id, "復習入り（不正解）"));
    s.unsureIds
      .filter(id => !s.wrongIds.includes(id))
      .forEach(id => addResultItem(list, id, "復習入り（自信なし）", true));
  }

  function addResultItem(list, id, prefix, unsure = false) {
    const q = BQ.QUESTIONS.find(item => item.id === id);
    if (!q) return;
    const div = document.createElement("div");
    div.className = `result-wrong-item${unsure ? " unsure" : ""}`;
    div.textContent = `${prefix}：${q.q}`;
    list.appendChild(div);
  }
})();
