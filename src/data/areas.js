export const areaConfig = {
    "ヨーロッパ": {
        id: "europe",
        name: "ヨーロッパ",
        color: "#3b82f6", // Blue
        bgLight: "#eff6ff",
        border: "#bfdbfe",
        textColor: "#1d4ed8"
    },
    "南アメリカ": {
        id: "south",
        name: "南アメリカ",
        color: "#9333ea", // Purple
        bgLight: "#faf5ff",
        border: "#e9d5ff",
        textColor: "#7e22ce"
    },
    "北中米": {
        id: "north",
        name: "北中米",
        color: "#e11d48", // Rose Red
        bgLight: "#fff1f2",
        border: "#fecdd3",
        textColor: "#be123c"
    },
    "アジア・オセアニア": {
        id: "asia",
        name: "アジア・オセアニア",
        color: "#16a34a", // Green
        bgLight: "#f0fdf4",
        border: "#bbf7d0",
        textColor: "#15803d"
    },
    "アフリカ": {
        id: "africa",
        name: "アフリカ",
        color: "#d97706", // Amber / Orange
        bgLight: "#fffbeb",
        border: "#fde68a",
        textColor: "#b45309"
    }
};

export const normalizeArea = (areaRaw) => {
    if (!areaRaw) return "その他";
    const a = areaRaw.trim();
    if (a === "アジア" || a === "オセアニア" || a === "アジア・オセアニア") {
        return "アジア・オセアニア";
    }
    if (areaConfig[a]) {
        return a;
    }
    return a;
};

export const positionConfig = {
    "FW": {
        name: "フォワード",
        color: "#e11d48",
        bgLight: "#ffe4e6",
        border: "#fecdd3"
    },
    "MF": {
        name: "ミッドフィールダー",
        color: "#16a34a",
        bgLight: "#dcfce7",
        border: "#bbf7d0"
    },
    "DF": {
        name: "ディフェンダー",
        color: "#2563eb",
        bgLight: "#dbeafe",
        border: "#bfdbfe"
    },
    "GK": {
        name: "ゴールキーパー",
        color: "#d97706",
        bgLight: "#fef3c7",
        border: "#fde68a"
    },
    "MF/FW": {
        name: "MF/FW",
        color: "#0284c7",
        bgLight: "#f0f9ff",
        border: "#bae6fd"
    }
};

export const countryFlags = {
    "イングランド": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "エクアドル": "🇪🇨",
    "スウェーデン": "🇸🇪",
    "スペイン": "🇪🇸",
    "ドイツ": "🇩🇪",
    "ノルウェー": "🇳🇴",
    "ブラジル": "🇧🇷",
    "フランス": "🇫🇷",
    "ベルギー": "🇧🇪",
    "セネガル": "🇸🇳",
    "オーストリア": "🇦🇹",
    "カナダ": "🇨🇦",
    "クロアチア": "🇭🇷",
    "コロンビア": "🇨🇴",
    "韓国": "🇰🇷",
    "日本": "🇯🇵",
    "アルジェリア": "🇩🇿",
    "ウズベキスタン": "🇺🇿",
    "エジプト": "🇪🇬",
    "オランダ": "🇳🇱",
    "ガーナ": "🇬🇭",
    "ポルトガル": "🇵🇹",
    "チュニジア": "🇹🇳",
    "モロッコ": "🇲🇦",
    "ウルグアイ": "🇺🇾",
    "アルゼンチン": "🇦🇷",
    "コートジボワール": "🇨🇮",
    "スコットランド": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    "トルコ": "🇹🇷",
    "スイス": "🇨🇭",
    "アメリカ": "🇺🇸",
    "パラグアイ": "🇵🇾",
    "コンゴ民主共和国": "🇨🇩",
    "カーボベルデ": "🇨🇻",
    "ボスニア・ヘルツェゴビナ": "🇧🇦",
    "ニュージーランド": "🇳🇿",
    "メキシコ": "🇲🇽",
    "チェコ": "🇨🇿",
    "イラク": "🇮🇶",
    "サウジアラビア": "🇸🇦",
    "ハイチ": "🇭🇹",
    "キュラソー": "🇨🇼",
    "ヨルダン": "🇯🇴",
    "イラン": "🇮🇷",
    "オーストラリア": "🇦🇺",
    "パナマ": "🇵🇦",
    "南アフリカ": "🇿🇦",
    "カタール": "🇶🇦",
    "イタリア": "🇮🇹",
    "デンマーク": "🇩🇰",
    "ポーランド": "🇵🇱",
    "セルビア": "🇷🇸",
    "ウクライナ": "🇺🇦",
    "ウェールズ": "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
    "ナイジェリア": "🇳🇬",
    "カメルーン": "🇨🇲",
    "チリ": "🇨🇱",
    "ペルー": "🇵🇪"
};