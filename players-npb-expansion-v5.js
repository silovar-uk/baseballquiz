(() => {
  const list = window.QUIZ_PLAYER_FILES = window.QUIZ_PLAYER_FILES || [];
  const TARGET = 10;
  const VERIFIED_AT = "2026-08-17";
  const teams = {
    "阪神タイガース":{code:"t",source:"https://npb.jp/announcement/2026/registered_t.html",index:"https://npb.jp/bis/teams/index_t.html",players:[["岩崎 優","投手"],["大竹 耕太郎","投手"],["伊藤 将司","投手"],["桐敷 拓馬","投手"],["坂本 誠志郎","捕手"],["大山 悠輔","内野手"],["近本 光司","外野手"],["前川 右京","外野手"],["小幡 竜平","内野手"],["湯浅 京己","投手"]]},
    "読売ジャイアンツ":{code:"g",source:"https://npb.jp/announcement/2026/registered_g.html",index:"https://npb.jp/bis/teams/index_g.html",players:[["田中 将大","投手"],["大勢","投手"],["山﨑 伊織","投手"],["戸郷 翔征","投手"],["甲斐 拓也","捕手"],["大城 卓三","捕手"],["吉川 尚輝","内野手"],["坂本 勇人","内野手"],["門脇 誠","内野手"],["泉口 友汰","内野手"]]},
    "横浜DeNAベイスターズ":{code:"db",source:"https://npb.jp/announcement/2026/registered_db.html",index:"https://npb.jp/bis/teams/index_db.html",players:[["東 克樹","投手"],["伊勢 大夢","投手"],["山﨑 康晃","投手"],["入江 大生","投手"],["松尾 汐恩","捕手"],["山本 祐大","捕手"],["牧 秀悟","内野手"],["筒香 嘉智","内野手"],["京田 陽太","内野手"],["三森 大貴","内野手"]]},
    "広島東洋カープ":{code:"c",source:"https://npb.jp/announcement/2026/registered_c.html",index:"https://npb.jp/bis/teams/index_c.html",players:[["大瀬良 大地","投手"],["森下 暢仁","投手"],["床田 寛樹","投手"],["栗林 良吏","投手"],["森浦 大輔","投手"],["坂倉 将吾","捕手"],["小園 海斗","内野手"],["矢野 雅哉","内野手"],["菊池 涼介","内野手"],["堂林 翔太","内野手"]]},
    "中日ドラゴンズ":{code:"d",source:"https://npb.jp/announcement/2026/registered_d.html",index:"https://npb.jp/bis/teams/index_d.html",players:[["柳 裕也","投手"],["髙橋 宏斗","投手"],["金丸 夢斗","投手"],["大野 雄大","投手"],["松山 晋也","投手"],["木下 拓哉","捕手"],["田中 幹也","内野手"],["高橋 周平","内野手"],["石川 昂弥","内野手"],["村松 開人","内野手"]]},
    "東京ヤクルトスワローズ":{code:"s",source:"https://npb.jp/announcement/2026/registered_s.html",index:"https://npb.jp/bis/teams/index_s.html",players:[["石川 雅規","投手"],["奥川 恭伸","投手"],["吉村 貢司郎","投手"],["小川 泰弘","投手"],["青柳 晃洋","投手"],["中村 悠平","捕手"],["山田 哲人","内野手"],["長岡 秀樹","内野手"],["Ｊ．オスナ","内野手"],["内山 壮真","内野手"]]},
    "福岡ソフトバンクホークス":{code:"h",source:"https://npb.jp/announcement/2026/registered_h.html",index:"https://npb.jp/bis/teams/index_h.html",players:[["上沢 直之","投手"],["東浜 巨","投手"],["大津 亮介","投手"],["松本 裕樹","投手"],["海野 隆司","捕手"],["山川 穂高","内野手"],["今宮 健太","内野手"],["中村 晃","内野手"],["牧原 大成","内野手"],["栗原 陵矢","内野手"]]},
    "北海道日本ハムファイターズ":{code:"f",source:"https://npb.jp/announcement/2026/registered_f.html",index:"https://npb.jp/bis/teams/index_f.html",players:[["加藤 貴之","投手"],["北山 亘基","投手"],["伊藤 大海","投手"],["山﨑 福也","投手"],["宮西 尚生","投手"],["郡司 裕也","捕手"],["田宮 裕涼","捕手"],["清宮 幸太郎","内野手"],["水野 達稀","内野手"],["野村 佑希","内野手"]]},
    "オリックス・バファローズ":{code:"b",source:"https://npb.jp/announcement/2026/registered_b.html",index:"https://npb.jp/bis/teams/index_b.html",players:[["山下 舜平大","投手"],["曽谷 龍平","投手"],["宮城 大弥","投手"],["山岡 泰輔","投手"],["九里 亜蓮","投手"],["若月 健矢","捕手"],["森 友哉","捕手"],["頓宮 裕真","捕手"],["太田 椋","内野手"],["西野 真弘","内野手"]]},
    "東北楽天ゴールデンイーグルス":{code:"e",source:"https://npb.jp/announcement/2026/registered_e.html",index:"https://npb.jp/bis/teams/index_e.html",players:[["岸 孝之","投手"],["前田 健太","投手"],["荘司 康誠","投手"],["早川 隆久","投手"],["藤平 尚真","投手"],["太田 光","捕手"],["小深田 大翔","内野手"],["宗山 塁","内野手"],["浅村 栄斗","内野手"],["村林 一輝","内野手"]]},
    "埼玉西武ライオンズ":{code:"l",source:"https://npb.jp/announcement/2026/registered_l.html",index:"https://npb.jp/bis/teams/index_l.html",players:[["渡邉 勇太朗","投手"],["隅田 知一郎","投手"],["武内 夏暉","投手"],["古賀 悠斗","捕手"],["炭谷 銀仁朗","捕手"],["石井 一成","内野手"],["外崎 修汰","内野手"],["源田 壮亮","内野手"],["山村 崇嘉","内野手"],["平沢 大河","内野手"]]},
    "千葉ロッテマリーンズ":{code:"m",source:"https://npb.jp/announcement/2026/registered_m.html",index:"https://npb.jp/bis/teams/index_m.html",players:[["小島 和哉","投手"],["種市 篤暉","投手"],["石川 柊太","投手"],["田中 晴也","投手"],["鈴木 昭汰","投手"],["佐藤 都志也","捕手"],["寺地 隆成","捕手"],["安田 尚憲","内野手"],["藤岡 裕大","内野手"],["中村 奨吾","内野手"]]}
  };

  window.BQ_DATA_VERIFICATION = {
    version: "v5",
    verifiedAt: VERIFIED_AT,
    targetNpbPerTeam: TARGET,
    sourceType: "NPB公式 2026年度支配下選手登録",
    teamSources: Object.fromEntries(Object.entries(teams).map(([team, cfg]) => [team, cfg.source]))
  };

  const normalize = value => String(value || "").replace(/[\s　・.]/g, "").toLowerCase();
  const known = new Set(list.map(p => `${p.team}|${normalize(p.name)}`));
  const roleHook = role => role === "投手" ? "投手陣を覚える一人。"
    : role === "捕手" ? "バッテリーを支える捕手として覚える。"
    : role === "内野手" ? "内野陣の一人として所属を固定。"
    : "外野陣の一人として所属を固定。";

  for (const [team, cfg] of Object.entries(teams)) {
    let count = list.filter(p => p.league === "NPB" && p.team === team).length;
    for (let i = 0; i < cfg.players.length && count < TARGET; i++) {
      const [name, role] = cfg.players[i];
      const key = `${team}|${normalize(name)}`;
      if (known.has(key)) continue;
      const id = `v5-${cfg.code}-${String(i + 1).padStart(2, "0")}`;
      const searchUrl = `https://npb.jp/bis/players/search/result?search_keyword=${encodeURIComponent(name)}`;
      list.push({
        id,
        name,
        team,
        role,
        meta: "2026 支配下登録",
        hook: roleHook(role),
        remember: `まず「${team}・${role}」を結び、同じ球団の選手と並べて覚える。`,
        focus2026: `2026年度の支配下選手として${team}に登録。起用や役割の変化を追いながら覚える。`,
        achievements: "所属の土台をNPB公式で確認し、年度別成績やプロフィールは選手検索から掘り下げられる。",
        timeline: [`2026｜${team}の支配下選手として登録`],
        quizId: `pf-${id}`,
        source: cfg.source,
        league: "NPB",
        tags: [role, "2026支配下", "ROSTER+"],
        officialLinks: [
          {label:"NPB公式｜2026支配下登録", url:cfg.source},
          {label:"NPB公式｜選手検索", url:searchUrl},
          {label:"NPB公式｜球団成績", url:cfg.index}
        ],
        updatedAt: VERIFIED_AT,
        dataTier: "roster-plus"
      });
      known.add(key);
      count++;
    }
  }
})();
