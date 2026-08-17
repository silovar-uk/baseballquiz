(() => {
  const players = window.QUIZ_PLAYER_FILES || [];
  const questions = window.QUIZ_QUESTIONS || [];
  const byLeague = league => players.filter(p => p.league === league);

  function hash(text) {
    let h = 0;
    for (const ch of text) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    return h;
  }

  function sampleDistinct(list, correct, count, key) {
    const filtered = [...new Set(list)].filter(v => v && v !== correct);
    filtered.sort((a,b) => (hash(key + a) % 100000) - (hash(key + b) % 100000));
    return [correct, ...filtered.slice(0, count)];
  }

  players.forEach(player => {
    if (questions.some(q => q.id === player.quizId)) return;

    const mode = hash(player.id) % (player.league === "MLB" ? 3 : 2);
    let q, options, explanation;

    if (player.league === "MLB" && mode === 2 && player.origin) {
      q = `${player.name}のNPB時代の所属として正しいのは？`;
      const origins = byLeague("MLB").map(p => p.origin).filter(Boolean);
      options = sampleDistinct(origins, player.origin, 3, player.id + ":origin");
      explanation = `${player.name}は${player.origin.replace("NPB：","")}からMLBへ。${player.remember}`;
    } else if (mode === 0) {
      q = `2026年時点で、${player.name}が所属しているチームは？`;
      const teamPool = byLeague(player.league).map(p => p.team);
      options = sampleDistinct(teamPool, player.team, 3, player.id + ":team");
      explanation = `${player.name}は${player.team}でプレー。${player.remember}`;
    } else {
      q = `${player.name}の「まず覚えたい特徴」として最も近いのは？`;
      const hookPool = byLeague(player.league).map(p => p.hook);
      options = sampleDistinct(hookPool, player.hook, 3, player.id + ":hook");
      explanation = `${player.hook} ${player.remember}`;
    }

    questions.push({
      id: player.quizId,
      category: player.league === "MLB" ? "mlb" : "current",
      level: 2,
      type: "choice",
      q,
      options,
      answer: 0,
      explanation,
      source: player.source
    });
  });
})();
