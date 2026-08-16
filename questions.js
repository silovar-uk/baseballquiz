window.QUIZ_CATEGORIES = {
  current: { label: "現役NPB", icon: "⚾", description: "所属・ポジション・特徴" },
  mlb: { label: "MLB挑戦組", icon: "🌎", description: "日本人メジャーリーガー" },
  teams: { label: "12球団", icon: "🏟", description: "球団史・特色・変遷" },
  history: { label: "NPB史", icon: "📚", description: "名選手・記録・名場面" },
  stats: { label: "数字で見る野球", icon: "📊", description: "指標・成績の読み方" },
  tactics: { label: "観戦解像度", icon: "🧠", description: "戦術・役割・考え方" }
};

window.QUIZ_QUESTIONS = [
  // 現役NPB
  {id:"c01",category:"current",level:2,type:"choice",q:"佐藤輝明が2026年に所属している球団は？",options:["阪神タイガース","読売ジャイアンツ","広島東洋カープ","横浜DeNAベイスターズ"],answer:0,explanation:"佐藤輝明は阪神の内野手。2020年ドラフト1位で入団し、長打力が大きな武器。",source:"https://npb.jp/bis/players/41045153.html"},
  {id:"c02",category:"current",level:2,type:"choice",q:"髙橋宏斗が所属する球団は？",options:["中日ドラゴンズ","東京ヤクルトスワローズ","オリックス・バファローズ","埼玉西武ライオンズ"],answer:0,explanation:"髙橋宏斗は中日ドラゴンズの右腕。中京大中京高から2020年ドラフト1位で入団。",source:"https://npb.jp/bis/players/61265153.html"},
  {id:"c03",category:"current",level:2,type:"choice",q:"万波中正の所属球団は？",options:["北海道日本ハムファイターズ","千葉ロッテマリーンズ","東北楽天ゴールデンイーグルス","福岡ソフトバンクホークス"],answer:0,explanation:"万波中正は北海道日本ハムの外野手。強肩と長打力が印象的な選手。",source:"https://npb.jp/announcement/2026/registered_f.html"},
  {id:"c04",category:"current",level:2,type:"choice",q:"近藤健介が2026年に所属している球団は？",options:["福岡ソフトバンクホークス","北海道日本ハムファイターズ","オリックス・バファローズ","埼玉西武ライオンズ"],answer:0,explanation:"近藤健介はソフトバンク所属。高い出塁能力と打撃技術で知られる。",source:"https://npb.jp/announcement/2026/registered_h.html"},
  {id:"c05",category:"current",level:2,type:"choice",q:"周東佑京の主な強みとして最もイメージしやすいものは？",options:["走塁・盗塁","本塁打量産","捕手としての配球","先発完投能力"],answer:0,explanation:"周東佑京はトップクラスのスピードを武器にする外野手。代表戦でも走塁が大きな武器になる。",source:"https://npb.jp/announcement/2026/registered_h.html"},
  {id:"c06",category:"current",level:2,type:"choice",q:"清宮幸太郎の2026年の所属球団は？",options:["北海道日本ハムファイターズ","読売ジャイアンツ","東京ヤクルトスワローズ","中日ドラゴンズ"],answer:0,explanation:"清宮幸太郎は北海道日本ハムの内野手。早稲田実業高から入団した左打ちの長距離打者。",source:"https://npb.jp/announcement/2026/registered_f.html"},
  {id:"c07",category:"current",level:2,type:"choice",q:"柳田悠岐が長く所属している球団は？",options:["福岡ソフトバンクホークス","広島東洋カープ","埼玉西武ライオンズ","オリックス・バファローズ"],answer:0,explanation:"柳田悠岐はソフトバンク一筋で活躍してきた外野手。強い打球と高い身体能力で知られる。",source:"https://npb.jp/announcement/2026/registered_h.html"},
  {id:"c08",category:"current",level:2,type:"choice",q:"2026年のオールスターホームランダービー出場者としてNPBが発表した阪神の選手は？",options:["佐藤輝明と森下翔太","近本光司と中野拓夢","大山悠輔と坂本誠志郎","才木浩人と岩崎優"],answer:0,explanation:"2026年のホームランダービーには阪神から佐藤輝明、森下翔太が選出された。",source:"https://npb.jp/news/detail/20260727_02.html"},
  {id:"c09",category:"current",level:2,type:"choice",q:"2026年の北海道日本ハムで外野手登録なのは誰？",options:["万波中正","清宮幸太郎","郡司裕也","上川畑大悟"],answer:0,explanation:"万波中正は外野手登録。清宮は内野手、郡司は捕手、上川畑は内野手。",source:"https://npb.jp/announcement/2026/registered_f.html"},
  {id:"c10",category:"current",level:3,type:"who",clue:"所属：阪神\n投打：右投左打\n2020年ドラフト1位",q:"この選手は誰？",options:["佐藤輝明","森下翔太","近本光司","大山悠輔"],answer:0,explanation:"佐藤輝明。近畿大から2020年ドラフト1位で阪神入りした内野手。",source:"https://npb.jp/bis/players/41045153.html"},
  {id:"c11",category:"current",level:3,type:"who",clue:"所属：中日\nポジション：投手\n中京大中京高出身",q:"この選手は誰？",options:["髙橋宏斗","大野雄大","松山晋也","金丸夢斗"],answer:0,explanation:"髙橋宏斗。2020年ドラフト1位で中日に入団した右腕。",source:"https://npb.jp/bis/players/61265153.html"},
  {id:"c12",category:"current",level:2,type:"truefalse",q:"近藤健介と柳田悠岐は、2026年時点で同じ球団に所属している。",options:["○ 正しい","× 誤り"],answer:0,explanation:"2人とも福岡ソフトバンクホークスに所属している。",source:"https://npb.jp/announcement/2026/registered_h.html"},

  // MLB挑戦組
  {id:"m01",category:"mlb",level:2,type:"choice",q:"2026年の大谷翔平の所属球団は？",options:["ロサンゼルス・ドジャース","ロサンゼルス・エンゼルス","サンディエゴ・パドレス","シカゴ・カブス"],answer:0,explanation:"大谷翔平はロサンゼルス・ドジャース所属。NPBでは北海道日本ハムでプレーした。",source:"https://www.mlb.com/player/shohei-ohtani-660271"},
  {id:"m02",category:"mlb",level:2,type:"choice",q:"山本由伸がMLBで所属する球団は？",options:["ロサンゼルス・ドジャース","ニューヨーク・メッツ","サンディエゴ・パドレス","ヒューストン・アストロズ"],answer:0,explanation:"山本由伸はドジャース所属。NPBではオリックスでエースとして活躍した。",source:"https://www.mlb.com/player/yoshinobu-yamamoto-808967"},
  {id:"m03",category:"mlb",level:2,type:"choice",q:"佐々木朗希がMLBで所属する球団は？",options:["ロサンゼルス・ドジャース","シカゴ・カブス","ボストン・レッドソックス","ニューヨーク・メッツ"],answer:0,explanation:"佐々木朗希はドジャース所属。NPBでは千葉ロッテでプレーした。",source:"https://www.mlb.com/player/roki-sasaki-808963"},
  {id:"m04",category:"mlb",level:2,type:"choice",q:"今永昇太がMLBで所属する球団は？",options:["シカゴ・カブス","トロント・ブルージェイズ","サンディエゴ・パドレス","ボストン・レッドソックス"],answer:0,explanation:"今永昇太はシカゴ・カブス所属。NPBでは横浜DeNAでプレーした。",source:"https://www.mlb.com/player/shota-imanaga-684007"},
  {id:"m05",category:"mlb",level:2,type:"choice",q:"鈴木誠也のMLB所属球団は？",options:["シカゴ・カブス","シカゴ・ホワイトソックス","トロント・ブルージェイズ","ロサンゼルス・ドジャース"],answer:0,explanation:"鈴木誠也はカブス所属。NPB時代は広島東洋カープで中心打者として活躍した。",source:"https://www.mlb.com/player/seiya-suzuki-673548"},
  {id:"m06",category:"mlb",level:2,type:"choice",q:"千賀滉大がMLBで所属する球団は？",options:["ニューヨーク・メッツ","ニューヨーク・ヤンキース","ボストン・レッドソックス","サンディエゴ・パドレス"],answer:0,explanation:"千賀滉大はニューヨーク・メッツ所属。NPBではソフトバンクで育成選手からエース級へ成長した。",source:"https://www.mlb.com/player/kodai-senga-673540"},
  {id:"m07",category:"mlb",level:2,type:"choice",q:"吉田正尚のMLB所属球団は？",options:["ボストン・レッドソックス","シカゴ・カブス","トロント・ブルージェイズ","ヒューストン・アストロズ"],answer:0,explanation:"吉田正尚はボストン・レッドソックス所属。NPBではオリックスでプレーした。",source:"https://www.mlb.com/player/masataka-yoshida-807799"},
  {id:"m08",category:"mlb",level:2,type:"choice",q:"ダルビッシュ有の2026年の所属球団は？",options:["サンディエゴ・パドレス","テキサス・レンジャーズ","シカゴ・カブス","ロサンゼルス・ドジャース"],answer:0,explanation:"ダルビッシュ有はサンディエゴ・パドレス所属。NPBでは北海道日本ハムで活躍した。",source:"https://www.mlb.com/player/yu-darvish-506433"},
  {id:"m09",category:"mlb",level:3,type:"choice",q:"2026年にMLBへ挑戦し、ヒューストン・アストロズ所属となった日本人投手は？",options:["今井達也","宮城大弥","髙橋宏斗","平良海馬"],answer:0,explanation:"今井達也は2026年にアストロズへ。NPBでは埼玉西武ライオンズで先発投手として活躍した。",source:"https://www.mlb.com/player/tatsuya-imai-837227"},
  {id:"m10",category:"mlb",level:3,type:"choice",q:"2026年にシカゴ・ホワイトソックスでプレーしている日本人スラッガーは？",options:["村上宗隆","岡本和真","鈴木誠也","吉田正尚"],answer:0,explanation:"村上宗隆はホワイトソックス所属。NPBではヤクルトで56本塁打を記録した長距離打者。",source:"https://www.mlb.com/player/munetaka-murakami-808959"},
  {id:"m11",category:"mlb",level:3,type:"choice",q:"2026年にトロント・ブルージェイズでプレーしている元巨人の打者は？",options:["岡本和真","坂本勇人","丸佳浩","大城卓三"],answer:0,explanation:"岡本和真は2026年にブルージェイズでプレー。NPBでは読売ジャイアンツの主軸だった。",source:"https://www.mlb.com/player/kazuma-okamoto-672960"},
  {id:"m12",category:"mlb",level:3,type:"choice",q:"2026年のMLB公式ページで、菅野智之の所属先として表示されている球団は？",options:["コロラド・ロッキーズ","ボルチモア・オリオールズ","ニューヨーク・メッツ","サンディエゴ・パドレス"],answer:0,explanation:"MLB公式の2026年ページでは菅野智之はコロラド・ロッキーズ所属として掲載されている。",source:"https://www.mlb.com/player/tomoyuki-sugano-608372"},
  {id:"m13",category:"mlb",level:3,type:"who",clue:"NPB：オリックス\nMLB：ドジャース\n投手",q:"この選手は誰？",options:["山本由伸","佐々木朗希","今永昇太","千賀滉大"],answer:0,explanation:"山本由伸。オリックスからMLBへ移り、ドジャースでプレーしている。",source:"https://www.mlb.com/player/yoshinobu-yamamoto-808967"},
  {id:"m14",category:"mlb",level:3,type:"order",q:"NPBからMLBへの流れとして、古い順に並べてください。",options:["ダルビッシュ有 MLBデビュー","大谷翔平 MLBデビュー","山本由伸 MLBデビュー"],answer:[0,1,2],explanation:"ダルビッシュは2012年、大谷は2018年、山本は2024年にMLBデビュー。日本人選手のMLB挑戦史の時系列として覚えると整理しやすい。",source:"https://www.mlb.com/international/players"},

  // 12球団
  {id:"t01",category:"teams",level:2,type:"choice",q:"オリックス・バファローズの前身の一つで、1991〜2004年に使われた球団名は？",options:["オリックス・ブルーウェーブ","阪急タイガース","大阪バファローズ","神戸マリナーズ"],answer:0,explanation:"オリックスは1991〜2004年に「オリックス・ブルーウェーブ」を名乗った。",source:"https://npb.jp/bis/teams/index_b.html"},
  {id:"t02",category:"teams",level:2,type:"choice",q:"千葉ロッテマリーンズが現在の球団名になったのは？",options:["1992年","1985年","2005年","2011年"],answer:0,explanation:"ロッテ・オリオンズから千葉ロッテマリーンズになったのは1992年。",source:"https://npb.jp/bis/teams/index_m.html"},
  {id:"t03",category:"teams",level:2,type:"choice",q:"阪神タイガースが現在の「阪神タイガース」という名称になったのは？",options:["1961年","1936年","1985年","2003年"],answer:0,explanation:"大阪タイガースなどの名称を経て、1961年から阪神タイガース。",source:"https://npb.jp/bis/teams/index_t.html"},
  {id:"t04",category:"teams",level:2,type:"choice",q:"北海道日本ハムファイターズが「北海道」を球団名に冠したのは？",options:["2004年","1998年","2006年","2016年"],answer:0,explanation:"2004年から北海道日本ハムファイターズとなった。",source:"https://npb.jp/bis/teams/index_f.html"},
  {id:"t05",category:"teams",level:3,type:"choice",q:"中日ドラゴンズが過去に名乗ったことがある球団名は？",options:["名古屋ドラゴンズ","東海ホエールズ","中部タイガース","名古屋オリオンズ"],answer:0,explanation:"1951〜1953年は「名古屋ドラゴンズ」。1954年から再び中日ドラゴンズ。",source:"https://npb.jp/bis/teams/index_d.html"},
  {id:"t06",category:"teams",level:3,type:"choice",q:"読売ジャイアンツの前身名としてNPB公式に載っているのは？",options:["東京巨人","東京ジャイアンツ","大日本巨人","読売巨人軍"],answer:0,explanation:"NPB公式の球団名変遷では1936〜1946年が「東京巨人」、1947年から読売ジャイアンツ。",source:"https://npb.jp/bis/teams/index_g.html"},
  {id:"t07",category:"teams",level:3,type:"truefalse",q:"千葉ロッテマリーンズは、過去に「東京オリオンズ」という球団名だった時期がある。",options:["○ 正しい","× 誤り"],answer:0,explanation:"1964〜1968年は東京オリオンズ。のちロッテ・オリオンズを経て現在名になった。",source:"https://npb.jp/bis/teams/index_m.html"},
  {id:"t08",category:"teams",level:3,type:"choice",q:"1950年に山口県下関市でチームを結成した、現在の球団は？",options:["横浜DeNAベイスターズ","広島東洋カープ","福岡ソフトバンクホークス","埼玉西武ライオンズ"],answer:0,explanation:"大洋（現DeNA）は1950年に下関でチームを結成した。NPBのキャンプ地史にも記録が残る。",source:"https://npb.jp/news/detail/20240130_02.html"},
  {id:"t09",category:"teams",level:3,type:"order",q:"ロッテ球団の名称を古い順に並べてください。",options:["毎日オリオンズ","東京オリオンズ","ロッテ・オリオンズ","千葉ロッテマリーンズ"],answer:[0,1,2,3],explanation:"毎日オリオンズ→（毎日大映）→東京オリオンズ→ロッテ・オリオンズ→千葉ロッテマリーンズという流れ。",source:"https://npb.jp/bis/teams/index_m.html"},
  {id:"t10",category:"teams",level:3,type:"order",q:"オリックス系球団の名称を古い順に並べてください。",options:["阪急ブレーブス","オリックス・ブレーブス","オリックス・ブルーウェーブ","オリックス・バファローズ"],answer:[0,1,2,3],explanation:"阪急ブレーブス→オリックス・ブレーブス→ブルーウェーブ→バファローズの順。",source:"https://npb.jp/bis/teams/index_b.html"},

  // 歴史
  {id:"h01",category:"history",level:2,type:"choice",q:"NPB通算本塁打記録の1位は誰？",options:["王貞治","野村克也","門田博光","落合博満"],answer:0,explanation:"王貞治の868本がNPB通算最多本塁打記録。",source:"https://npb.jp/bis/history/ltb_hr.html"},
  {id:"h02",category:"history",level:2,type:"choice",q:"NPB通算盗塁記録の1位は誰？",options:["福本豊","赤星憲広","イチロー","柴田勲"],answer:0,explanation:"福本豊の通算1065盗塁がNPB歴代最多。",source:"https://npb.jp/bis/history/"},
  {id:"h03",category:"history",level:2,type:"choice",q:"NPB通算安打記録の1位は誰？",options:["張本勲","野村克也","王貞治","立浪和義"],answer:0,explanation:"張本勲の3085安打がNPB通算最多。",source:"https://npb.jp/bis/history/"},
  {id:"h04",category:"history",level:2,type:"choice",q:"NPB通算試合出場記録の1位は誰？",options:["谷繁元信","野村克也","王貞治","衣笠祥雄"],answer:0,explanation:"谷繁元信の3021試合がNPB通算最多。捕手として長く現役を続けた。",source:"https://npb.jp/bis/history/"},
  {id:"h05",category:"history",level:3,type:"choice",q:"NPB通算二塁打記録の1位は誰？",options:["立浪和義","福本豊","張本勲","山本浩二"],answer:0,explanation:"立浪和義の487二塁打が歴代最多。",source:"https://npb.jp/bis/history/"},
  {id:"h06",category:"history",level:3,type:"choice",q:"通算犠打（送りバント）記録の1位は誰？",options:["川相昌弘","宮本慎也","井端弘和","平野謙"],answer:0,explanation:"川相昌弘が通算533犠打で歴代最多。",source:"https://npb.jp/bis/history/"},
  {id:"h07",category:"history",level:2,type:"truefalse",q:"王貞治はNPB通算本塁打だけでなく、通算打点の歴代1位でもある。",options:["○ 正しい","× 誤り"],answer:0,explanation:"王貞治は868本塁打に加え、2170打点も歴代1位。",source:"https://npb.jp/bis/history/"},
  {id:"h08",category:"history",level:3,type:"choice",q:"阪神タイガースの日本シリーズ優勝年として正しい組み合わせは？",options:["1985年・2023年","1964年・2005年","2003年・2025年","1985年・2003年"],answer:0,explanation:"NPB公式では阪神の日本シリーズ優勝は1985年と2023年。リーグ優勝とは別なので注意。",source:"https://npb.jp/bis/teams/index_t.html"},
  {id:"h09",category:"history",level:3,type:"choice",q:"オリックス・バファローズ系球団の日本シリーズ優勝回数は、NPB公式でいくつ？",options:["5回","3回","8回","12回"],answer:0,explanation:"阪急・オリックス系の日本シリーズ優勝は5回（1975、76、77、96、2022）。",source:"https://npb.jp/bis/teams/index_b.html"},
  {id:"h10",category:"history",level:3,type:"order",q:"NPB歴代本塁打の上位3人を、多い順に並べてください。",options:["王貞治","野村克也","門田博光"],answer:[0,1,2],explanation:"王868本、野村657本、門田567本の順。",source:"https://npb.jp/bis/history/ltb_hr.html"},

  // 数字で見る野球
  {id:"s01",category:"stats",level:2,type:"choice",q:"OPSは、基本的に何と何を足した指標？",options:["出塁率＋長打率","打率＋本塁打率","得点圏打率＋出塁率","長打率＋盗塁成功率"],answer:0,explanation:"OPS = On-base Plus Slugging。出塁率と長打率を足し、打者の出塁と長打を一つの数字でざっくり見る。",source:"https://npb.jp/bis/2026/stats/bat_c.html"},
  {id:"s02",category:"stats",level:2,type:"choice",q:"WHIPが表すものに最も近いのは？",options:["1投球回あたりに許した走者数","9回あたりの奪三振数","被本塁打率","投手の勝率"],answer:0,explanation:"WHIPは Walks plus Hits per Inning Pitched。四球と被安打による走者を1イニングあたりどれだけ出したかを見る。",source:"https://www.mlb.com/glossary/standard-stats/walks-and-hits-per-inning-pitched"},
  {id:"s03",category:"stats",level:2,type:"choice",q:"防御率（ERA）が低い投手ほど、基本的にはどう評価される？",options:["失点を抑えている","奪三振が必ず多い","球速が速い","登板数が多い"],answer:0,explanation:"防御率は9イニングあたりの自責点を表すため、基本的に低いほど失点を抑えている。",source:"https://www.mlb.com/glossary/standard-stats/earned-run-average"},
  {id:"s04",category:"stats",level:2,type:"choice",q:"打率.300は、ざっくりどういう意味？",options:["10打数で3安打程度","10打席で3四球程度","10試合で3本塁打程度","10球で3球ファウル程度"],answer:0,explanation:"打率は安打÷打数。.300なら打数ベースで約30%が安打。",source:"https://www.mlb.com/glossary/standard-stats/batting-average"},
  {id:"s05",category:"stats",level:3,type:"choice",q:"長打率（SLG）の特徴として正しいものは？",options:["単打より二塁打、二塁打より本塁打を重く数える","四球を最も重く評価する","盗塁を含める","守備位置によって補正する"],answer:0,explanation:"長打率は塁打数÷打数。単打=1、二塁打=2、三塁打=3、本塁打=4として長打を反映する。",source:"https://www.mlb.com/glossary/standard-stats/slugging-percentage"},
  {id:"s06",category:"stats",level:3,type:"truefalse",q:"出塁率には、四球による出塁も反映される。",options:["○ 正しい","× 誤り"],answer:0,explanation:"打率と違い、出塁率は四球なども含めて「アウトにならず塁に出る力」を見る。",source:"https://www.mlb.com/glossary/standard-stats/on-base-percentage"},
  {id:"s07",category:"stats",level:3,type:"choice",q:"「ホールド」が主に評価する役割は？",options:["リードを保って救援した中継ぎ投手","完投した先発投手","サヨナラ打を打った打者","盗塁を阻止した捕手"],answer:0,explanation:"ホールドは一定条件でリードを保った救援投手に記録され、中継ぎ投手の働きを見る材料になる。",source:"https://npb.jp/bis/2026/stats/pit_c.html"},
  {id:"s08",category:"stats",level:3,type:"choice",q:"「セーブ」が最も関係するポジションは？",options:["抑え投手（クローザー）","一番打者","代走専門選手","先発捕手"],answer:0,explanation:"セーブは試合終盤のリードを守り切った救援投手に付く記録で、クローザーの代表的指標。",source:"https://npb.jp/bis/2026/stats/pit_c.html"},

  // 観戦解像度
  {id:"a01",category:"tactics",level:2,type:"choice",q:"「セットアッパー」は一般にどの場面を任される投手？",options:["終盤にクローザーへつなぐ重要な中継ぎ","開幕戦だけ先発する投手","大量リード時だけ投げる投手","延長戦専門の野手"],answer:0,explanation:"セットアッパーは主に7〜8回などの重要局面を任され、抑えへつなぐ役割を持つ。",source:"https://www.mlb.com/glossary/positions/setup-man"},
  {id:"a02",category:"tactics",level:2,type:"choice",q:"「プラトーン起用」の考え方として最も近いものは？",options:["相手投手の左右などで起用選手を変える","全選手を必ず1試合ずつ休ませる","先発投手を2人同時に登録する","捕手を毎回代える"],answer:0,explanation:"左右の相性などを利用して、相手に応じて先発メンバーを使い分ける考え方。",source:"https://www.mlb.com/glossary/idioms/platoon"},
  {id:"a03",category:"tactics",level:2,type:"choice",q:"「クリーンアップ」と呼ばれることが多い打順は？",options:["3〜5番","1〜2番","6〜7番","8〜9番"],answer:0,explanation:"日本では一般に3・4・5番をクリーンアップと呼び、得点を返す役割を期待される。",source:"https://npb.jp/"},
  {id:"a04",category:"tactics",level:3,type:"choice",q:"送りバントの主な狙いは？",options:["打者がアウトになる代わりに走者を進める","必ず本塁打を狙う","相手投手を交代させる","盗塁を記録する"],answer:0,explanation:"自分のアウトと引き換えに走者を次の塁へ進め、1点を取りやすくする戦術。犠打として記録されることがある。",source:"https://www.mlb.com/glossary/standard-stats/sacrifice-bunt"},
  {id:"a05",category:"tactics",level:3,type:"choice",q:"内野守備で「ゲッツー」を狙いやすい典型的な状況は？",options:["無死または一死で一塁に走者がいる","二死走者なし","三塁にだけ走者がいる","本塁打の直後"],answer:0,explanation:"一塁走者がいると、ゴロを二塁→一塁などへ送球して2つのアウトを取る併殺を狙える。",source:"https://www.mlb.com/glossary/rules/double-play"},
  {id:"a06",category:"tactics",level:3,type:"choice",q:"左打者に対して左投手を当てる起用が行われる理由の一つは？",options:["一般に同じ利き腕同士では投手側が有利になりやすい傾向があるため","左投手は必ず球速が速いため","左打者は変化球を打てないため","ルールで決まっているため"],answer:0,explanation:"左右の相性には個人差があるが、一般論として同じ側の投打では投手優位になりやすく、継投判断の材料になる。",source:"https://www.mlb.com/glossary/idioms/platoon"},
  {id:"a07",category:"tactics",level:3,type:"truefalse",q:"「守備固め」は、終盤にリードしているときなどに守備力の高い選手へ交代する起用を指す。",options:["○ 正しい","× 誤り"],answer:0,explanation:"得点を追加するより失点を防ぐ価値が高まる終盤に、守備力を重視して選手交代する考え方。",source:"https://npb.jp/"},
  {id:"a08",category:"tactics",level:3,type:"choice",q:"「代走」を出す目的として最も典型的なのは？",options:["走力を上げて得点確率を高める","投手の球速を上げる","守備位置を増やす","打順を飛ばす"],answer:0,explanation:"終盤の重要な走者を俊足選手に替え、進塁や盗塁、本塁生還の可能性を高める。",source:"https://npb.jp/"}
];
