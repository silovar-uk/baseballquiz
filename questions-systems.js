// NPB全体を理解するための「制度・大会」セット
window.QUIZ_CATEGORIES.systems = {
  label: "制度・大会",
  icon: "◆",
  description: "FA・ドラフト・CS・日本シリーズ"
};

window.QUIZ_QUESTIONS.push(
  {
    id:"sy01",category:"systems",level:2,type:"choice",
    q:"NPBの『国内FA』と『海外FA』の違いとして正しいものは？",
    options:["国内FAはNPB球団と、海外FAは国内外の球団と契約できる権利","国内FAは同一リーグだけ、海外FAは他リーグだけと契約できる権利","国内FAは移籍できず、海外FAだけ移籍できる権利","どちらも意味は同じ"],
    answer:0,
    explanation:"国内FAはNPB組織の球団と、海外FAは外国のプロ野球組織も含む国内外の球団と契約できる権利。『どこまで選択肢が広がるか』で覚えると整理しやすい。",
    source:"https://npb.jp/announcement/2019/fa_about.html"
  },
  {
    id:"sy02",category:"systems",level:3,type:"choice",
    q:"FA資格の計算で、1シーズンとして数える目安は出場選手登録何日以上？",
    options:["145日","100日","120日","180日"],
    answer:0,
    explanation:"セ・パの年度選手権試合期間中に145日以上出場選手登録されると、FA資格の計算上1シーズンとして数えられる。",
    source:"https://npb.jp/announcement/2019/fa_about.html"
  },
  {
    id:"sy03",category:"systems",level:2,type:"choice",
    q:"クライマックスシリーズのファーストステージで対戦するのは？",
    options:["レギュラーシーズン2位と3位","1位と2位","1位と3位","セ1位とパ1位"],
    answer:0,
    explanation:"ファーストステージはレギュラーシーズン2位と3位が対戦。勝者がファイナルステージへ進む。",
    source:"https://npb.jp/games/2026/schedule_climax_cl.html"
  },
  {
    id:"sy04",category:"systems",level:2,type:"choice",
    q:"クライマックスシリーズのファイナルステージで1位球団と対戦するのは？",
    options:["ファーストステージ勝者","2位球団に固定","3位球団に固定","もう一方のリーグ1位"],
    answer:0,
    explanation:"ファイナルステージはレギュラーシーズン1位球団とファーストステージ勝者が対戦する。",
    source:"https://npb.jp/games/2026/schedule_climax_cl.html"
  },
  {
    id:"sy05",category:"systems",level:3,type:"choice",
    q:"NPB球団が新人選手と契約するために、ドラフト会議でまず獲得するものは？",
    options:["選手契約締結の交渉権","選手の所有権","一軍登録枠","FA権"],
    answer:0,
    explanation:"ドラフト会議で得るのは、その新人選手と契約を交渉する権利。指名された時点で自動的に契約成立、ではない。",
    source:"https://draft.npb.jp/draft/2025/information.html"
  },
  {
    id:"sy06",category:"systems",level:3,type:"truefalse",
    q:"新人選手選択会議の後、条件を満たせば希望球団による『育成選手選択会議』が続けて行われる。",
    options:["○ 正しい","× 誤り"],
    answer:0,
    explanation:"通常の新人選手選択会議終了時点で選択選手が合計120名に達していない場合、希望球団参加による育成選手選択会議が行われる。",
    source:"https://draft.npb.jp/draft/2025/schedule.html"
  }
);
