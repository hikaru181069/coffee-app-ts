// お試し用アカウントに入れるサンプル記録
// 選択肢は名前で書く（番号は DB ごとに変わるので、入れるときに名前から番号を探す）
// 飲んだ日は「何日前か」で書く（いつ試しても、最近の記録に見えるように）
// 知識グラフでつながりが見えるように、産地・品種・フレーバーを少しずつ重ねている

type DemoRecord = {
  name: string;
  daysAgo: number;
  place: "home" | "cafe";
  rating?: number;
  notes?: string;
  cafeName?: string;
  roasterName?: string;
  origin?: string;
  farmName?: string;
  process?: string;
  roastLevel?: string;
  coffeeGrams?: number;
  waterMl?: number;
  brewSeconds?: number;
  varieties: string[];
  flavors: string[];
};

export const demoRecords: DemoRecord[] = [
  {
    name: "エチオピア イルガチェフェ",
    daysAgo: 1,
    place: "home",
    rating: 9,
    notes: "花のような香りと、ベリーの甘さ。冷めるとさらに甘くなった",
    roasterName: "まちかど焙煎所",
    origin: "エチオピア",
    process: "ウォッシュト",
    roastLevel: "ライトロースト",
    coffeeGrams: 15,
    waterMl: 240,
    brewSeconds: 180,
    varieties: ["エチオピア原種"],
    flavors: ["ジャスミン", "ブルーベリー", "紅茶"],
  },
  {
    name: "エチオピア グジ ナチュラル",
    daysAgo: 4,
    place: "cafe",
    rating: 8,
    notes: "イチゴジャムのような甘さ。少しワインっぽさもある",
    cafeName: "喫茶こもれび",
    origin: "エチオピア",
    process: "ナチュラル",
    roastLevel: "ミディアムロースト",
    varieties: ["エチオピア原種"],
    flavors: ["ストロベリー", "ブルーベリー", "ワイン"],
  },
  {
    name: "ケニア ニエリ",
    daysAgo: 7,
    place: "home",
    rating: 8,
    notes: "はっきりした酸味。グレープフルーツのような後味",
    roasterName: "まちかど焙煎所",
    origin: "ケニア",
    process: "ウォッシュト",
    roastLevel: "ハイロースト",
    coffeeGrams: 15,
    waterMl: 240,
    brewSeconds: 170,
    varieties: ["SL28", "SL34"],
    flavors: ["グレープフルーツ", "ブラックベリー", "紅茶"],
  },
  {
    name: "パナマ ゲイシャ",
    daysAgo: 12,
    place: "cafe",
    rating: 10,
    notes: "香りがとても華やか。特別な日に飲みたい味",
    cafeName: "喫茶こもれび",
    origin: "パナマ",
    process: "ウォッシュト",
    roastLevel: "ライトロースト",
    varieties: ["ゲイシャ"],
    flavors: ["ジャスミン", "モモ", "ハチミツ"],
  },
  {
    name: "コロンビア ウィラ",
    daysAgo: 16,
    place: "home",
    rating: 7,
    notes: "バランスがよく、毎日飲みやすい",
    roasterName: "珈琲ことり舎",
    origin: "コロンビア",
    process: "ウォッシュト",
    roastLevel: "シティロースト",
    coffeeGrams: 16,
    waterMl: 250,
    brewSeconds: 200,
    varieties: ["カトゥーラ", "カスティージョ"],
    flavors: ["オレンジ", "キャラメル", "チョコレート"],
  },
  {
    name: "グアテマラ アンティグア",
    daysAgo: 21,
    place: "home",
    rating: 7,
    notes: "チョコレートのような甘さと、ほどよい苦味",
    roasterName: "珈琲ことり舎",
    origin: "グアテマラ",
    process: "ウォッシュト",
    roastLevel: "フルシティロースト",
    coffeeGrams: 16,
    waterMl: 250,
    brewSeconds: 210,
    varieties: ["ブルボン", "カトゥーラ"],
    flavors: ["チョコレート", "アーモンド", "キャラメル"],
  },
  {
    name: "ブラジル セラード",
    daysAgo: 27,
    place: "cafe",
    rating: 6,
    notes: "ナッツのような香ばしさ。ミルクに合いそう",
    cafeName: "スタンド ほとり",
    origin: "ブラジル",
    process: "パルプドナチュラル",
    roastLevel: "フレンチロースト",
    varieties: ["ムンド・ノーボ", "イエローブルボン"],
    flavors: ["ピーナッツ", "ダークチョコレート", "キャラメル"],
  },
];
