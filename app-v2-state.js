(() => {
  const BQ = window.BQ = window.BQ || {};
  BQ.QUESTIONS = window.QUIZ_QUESTIONS;
  BQ.CATEGORIES = window.QUIZ_CATEGORIES;
  BQ.STORAGE_KEY = "npb-quiz-club:v1";
  BQ.DAY = 24 * 60 * 60 * 1000;
  BQ.REVIEW_INTERVALS = [1, 3, 7, 14, 30];
  BQ.$ = id => document.getElementById(id);

  BQ.freshState = () => ({
    wrong: {},
    stats: { answered: 0, correct: 0 },
    activityDates: []
  });

  BQ.loadState = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(BQ.STORAGE_KEY));
      if (!(parsed && parsed.wrong && parsed.stats)) return BQ.freshState();
      parsed.activityDates ||= [];
      Object.values(parsed.wrong).forEach(item => {
        item.wrongCount ||= 0;
        item.uncertainCount ||= 0;
      });
      return parsed;
    } catch {
      return BQ.freshState();
    }
  };

  BQ.state = BQ.loadState();

  BQ.save = () => {
    localStorage.setItem(BQ.STORAGE_KEY, JSON.stringify(BQ.state));
  };

  BQ.localDateKey = (date = new Date()) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  BQ.touchActivity = () => {
    const key = BQ.localDateKey();
    if (!BQ.state.activityDates.includes(key)) {
      BQ.state.activityDates.push(key);
      BQ.state.activityDates = BQ.state.activityDates.slice(-120);
    }
  };

  BQ.streakCount = () => {
    const set = new Set(BQ.state.activityDates);
    let streak = 0;
    const cursor = new Date();
    if (!set.has(BQ.localDateKey(cursor))) cursor.setDate(cursor.getDate() - 1);
    while (set.has(BQ.localDateKey(cursor))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  };

  BQ.reviewEntries = () => Object.entries(BQ.state.wrong);
  BQ.isMastered = item => item.stage >= BQ.REVIEW_INTERVALS.length;
  BQ.isDue = item => !BQ.isMastered(item) && Number(item.dueAt || 0) <= Date.now();

  BQ.updateReview = (id, correct) => {
    const existing = BQ.state.wrong[id];

    if (!correct) {
      BQ.state.wrong[id] = {
        ...(existing || {}),
        wrongCount: (existing?.wrongCount || 0) + 1,
        uncertainCount: existing?.uncertainCount || 0,
        stage: 0,
        dueAt: Date.now() + BQ.REVIEW_INTERVALS[0] * BQ.DAY,
        lastSeenAt: Date.now(),
        lastWrongAt: Date.now(),
        lastReason: "wrong",
        masteredAt: null
      };
      return;
    }

    if (!existing) return;
    const nextStage = existing.stage + 1;
    existing.stage = nextStage;
    existing.lastSeenAt = Date.now();
    existing.lastReason = "correct-review";

    if (nextStage >= BQ.REVIEW_INTERVALS.length) {
      existing.dueAt = null;
      existing.masteredAt = Date.now();
    } else {
      existing.dueAt = Date.now() + BQ.REVIEW_INTERVALS[nextStage] * BQ.DAY;
      existing.masteredAt = null;
    }
  };

  BQ.addUncertain = id => {
    const existing = BQ.state.wrong[id];
    BQ.state.wrong[id] = {
      ...(existing || {}),
      wrongCount: existing?.wrongCount || 0,
      uncertainCount: (existing?.uncertainCount || 0) + 1,
      stage: 0,
      dueAt: Date.now() + BQ.REVIEW_INTERVALS[0] * BQ.DAY,
      lastSeenAt: Date.now(),
      lastUncertainAt: Date.now(),
      lastReason: "unsure",
      masteredAt: null
    };
  };

  BQ.shuffle = items => {
    const a = [...items];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  BQ.formatDate = ts => {
    if (!ts) return "—";
    return new Intl.DateTimeFormat("ja-JP", { month: "numeric", day: "numeric" }).format(new Date(ts));
  };

  BQ.escapeHtml = str => {
    const d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  };
})();