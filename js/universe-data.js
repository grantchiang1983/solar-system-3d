/**
 * 🌐 全宇宙 / 可觀測宇宙完整天文物理數據庫 (Observable Universe Astronomical Database)
 * 包含：宇宙微波背景輻射 (CMB)、宇宙大尺度網狀結構 (Cosmic Web)、
 * 拉尼亞凱亞超星系團、巨引源、本地星系群、極端類星體 TON 618 與韋伯深空場。
 * 尺度單位：1 單位 = 100 萬光年 (1 Mly / 0.306 Mpc)
 * 可觀測宇宙半徑約 465 億光年 (46,500 單位)
 */

const UNIVERSE_DATA = {
  overview: {
    name: "可觀測宇宙 (Observable Universe)",
    diameterLy: "約 930 億光年 (285 億秒差距 / 28.5 Gpc)",
    radiusLy: "約 465 億光年 (受宇宙膨脹與共動距離影響)",
    age: "137.87 ± 0.02 億年 (自宇宙大爆炸 Big Bang 起算)",
    galaxyCount: "約 2 兆 (2 × 10¹²) 個星系",
    starCount: "約 10²⁴ 顆恆星 (1 秭顆)",
    cosmicExpansionH0: "哈伯常數 H₀ ≈ 67.4 km/s/Mpc",
    composition: "暗能量 68.3% · 暗物質 26.8% · 普通重子物質 4.9%",
    cmbTemperature: "2.7255 K (微波背景輻射)"
  },

  // 1. 宇宙巨型超星系團與大尺度纖維結構 (Superclusters & Cosmic Web Nodes)
  superclusters: [
    {
      id: "laniakea",
      name: "拉尼亞凱亞超星系團 (Laniakea Supercluster)",
      category: "supercluster",
      spanLy: "約 5.2 億光年 (160 Mpc)",
      galaxyCount: "約 100,000 個星系",
      mass: "約 10¹⁷ 太陽質量",
      coords: { x: 0, y: 0, z: 0 },
      color: "#f59e0b",
      icon: "🌐",
      description: "我們所在的宇宙家園巨型超星系團，夏威夷語意為「無盡的天堂」。包含室女座超星系團、長蛇-半人馬座超星系團等，所有星系均沿著重力流線向中心「巨引源（Great Attractor）」匯聚。"
    },
    {
      id: "great_attractor",
      name: "巨引源 (The Great Attractor / Norma Cluster)",
      category: "attractor",
      spanLy: "引力中心焦點 (約數千萬光年)",
      distanceSunLy: "約 2.5 億光年 (76 Mpc)",
      coords: { x: 120, y: -45, z: 180 },
      color: "#ec4899",
      icon: "🧲",
      description: "位於拉尼亞凱亞超星系團重力中心的巨型引力異常區，坐落於矩尺座星系團（ACO 3627）附近，正以數百公里/秒的速度牽引著包括銀河系在內的數萬個星系向其墜落。"
    },
    {
      id: "virgo_supercluster",
      name: "室女座超星系團 (Virgo Supercluster)",
      category: "supercluster",
      spanLy: "約 1.1 億光年 (33 Mpc)",
      galaxyCount: "約 2,000 個星系",
      distanceSunLy: "約 5,400 萬光年 (中心室女座星系團 M87)",
      coords: { x: 15, y: 48, z: -20 },
      color: "#38bdf8",
      icon: "🌀",
      description: "拉尼亞凱亞超星系團的一個分支突觸，中心為擁有超大質量黑洞的巨型橢圓星系 M87（EHT 首張黑洞照片所在地）。"
    },
    {
      id: "shapley_supercluster",
      name: "夏普力超星系團 (Shapley Supercluster)",
      category: "supercluster",
      spanLy: "約 6.5 億光年",
      distanceSunLy: "約 6.5 億光年 (200 Mpc)",
      coords: { x: 280, y: -110, z: 420 },
      color: "#a855f7",
      icon: "💎",
      description: "鄰近宇宙中已知質量最大、星系密度最高的超星系團，其強大的重力場與巨引源共同拉動整個本地宇宙空間。"
    },
    {
      id: "coma_supercluster",
      name: "后髮座超星系團 (Coma Supercluster)",
      category: "supercluster",
      spanLy: "約 3.5 億光年",
      distanceSunLy: "約 3.2 億光年 (99 Mpc)",
      coords: { x: -80, y: 260, z: 110 },
      color: "#34d399",
      icon: "✨",
      description: "史隆長城（Sloan Great Wall）的核心樞紐，是宇宙中密度最高的巨型星系群聚之一。"
    },
    {
      id: "perseus_pisces",
      name: "英仙-雙魚座超星系團 (Perseus-Pisces Supercluster)",
      category: "supercluster",
      spanLy: "約 3 億光年",
      distanceSunLy: "約 2.5 億光年",
      coords: { x: -160, y: -90, z: -140 },
      color: "#fbbf24",
      icon: "💫",
      description: "宇宙大尺度纖維結構中的著名長條狀緻密星系鏈，與室女座超星系團之間隔著巨大的本地空洞。"
    },
    {
      id: "bootes_void",
      name: "牧夫座巨洞 (Boötes Void / The Great Nothing)",
      category: "void",
      spanLy: "約 3.3 億光年直徑",
      distanceSunLy: "約 7 億光年",
      coords: { x: 350, y: 450, z: -200 },
      color: "#0f172a",
      icon: "🌑",
      description: "可觀測宇宙中最著名的巨型超空洞之一，在超過 3 億光年的廣袤空間內僅發現了約 60 個星系（按正常密度應有數萬個），被天文學家稱為宇宙中的「大荒漠」。"
    }
  ],

  // 2. 本地星系群主要成員 (Local Group Major Galaxies)
  localGroup: [
    {
      id: "milky_way",
      name: "🌌 銀河系 (Milky Way Galaxy)",
      type: "棒旋星系 (SBbc)",
      diameterLy: "100,000 光年",
      coords: { x: 0, y: 0, z: 0 },
      starCount: "約 2,500 億顆",
      color: "#00f2fe",
      icon: "🌌",
      description: "我們的母星系，擁有五大螺旋臂與中心 415 萬太陽質量的人馬座 A* 黑洞。"
    },
    {
      id: "andromeda_m31",
      name: "🌀 仙女座星系 (Andromeda / M31)",
      type: "巨大螺旋星系 (SA(s)b)",
      diameterLy: "220,000 光年",
      coords: { x: -1.2, y: -0.8, z: 2.2 }, // 約 254 萬光年
      distanceSunLy: "254 萬光年 (0.78 Mpc)",
      starCount: "約 1 兆顆",
      radialSpeed: "以 110 km/s 速度朝向銀河系接近",
      color: "#60a5fa",
      icon: "🌀",
      description: "本地星系群中最大的星系，包含約 1 兆顆恆星，預計在約 45 億年後與銀河系碰撞融合為「銀河仙女星系（Milkomeda）」。"
    },
    {
      id: "triangulum_m33",
      name: "🌀 三角座星系 (Triangulum / M33)",
      type: "螺旋星系 (SA(s)cd)",
      diameterLy: "60,000 光年",
      coords: { x: -1.8, y: -1.2, z: 2.0 },
      distanceSunLy: "約 273 萬光年",
      starCount: "約 400 億顆",
      color: "#a78bfa",
      icon: "🌀",
      description: "本地星系群第三大星系，擁有極其活躍的恆星形成區 NGC 604（宇宙中已知最大的發射星雲之一）。"
    },
    {
      id: "lmc",
      name: "☁️ 大麥哲倫星系 (Large Magellanic Cloud - LMC)",
      type: "麥哲倫型不規則星系",
      diameterLy: "14,000 光年",
      coords: { x: -0.08, y: -0.12, z: 0.09 },
      distanceSunLy: "約 16.3 萬光年",
      starCount: "約 200 億顆",
      color: "#34d399",
      icon: "☁️",
      description: "銀河系最大的伴隨衛星星系，南半球夜空清晰可見，擁有宇宙最著名的恆星育嬰室「蜘蛛星雲（Tarantula Nebula）」。"
    },
    {
      id: "smc",
      name: "☁️ 小麥哲倫星系 (Small Magellanic Cloud - SMC)",
      type: "矮不規則星系",
      diameterLy: "7,000 光年",
      coords: { x: -0.12, y: -0.15, z: 0.05 },
      distanceSunLy: "約 20 萬光年",
      starCount: "約 30 億顆",
      color: "#6ee7b7",
      icon: "☁️",
      description: "銀河系的另一個矮衛星星系，與大麥哲倫星系及銀河系之間存在強大的潮汐重力引力流（麥哲倫星流）。"
    }
  ],

  // 3. 宇宙極端天體與深空觀測場 (Cosmic Extremes & Deep Fields)
  cosmicExtremes: [
    {
      id: "ton_618",
      name: "💥 超巨型類星體 TON 618 (TON 618 Quasar)",
      category: "quasar",
      type: "超亮吸積超大質量黑洞",
      blackHoleMass: "660 億倍太陽質量 (6.6 × 10¹⁰ M☉)",
      luminosity: "太陽的 140 兆倍 (1.4 × 10¹⁴ L☉)",
      distanceSunLy: "約 182 億光年 (共動距離)",
      coords: { x: 1200, y: 1500, z: -800 },
      color: "#f43f5e",
      icon: "💥",
      description: "已知宇宙中質量最大的黑洞之一與最明亮的類星體，其事件視界直徑達 3,900 億公里（相當於海王星軌道半徑的 40 倍以上），其吸積盤光芒壓倒了整個宿主星系。"
    },
    {
      id: "jwst_jades_z14",
      name: "🔭 最遙遠星系 JADES-GS-z14-0",
      category: "deep_field",
      type: "早期宇宙原初星系",
      redshift: "z = 14.32",
      ageAtObs: "大爆炸後僅 2.9 億年",
      distanceSunLy: "約 336 億光年 (共動距離)",
      coords: { x: -2200, y: 1800, z: 2400 },
      color: "#fb7185",
      icon: "🔭",
      description: "韋伯太空望遠鏡 (JWST) 發現的宇宙歷史最古老星系之一，直徑超過 1,600 光年，其驚人的高亮度和重元素含量顛覆了傳統早期星系形成模型。"
    },
    {
      id: "hudf",
      name: "🌌 哈伯極深場 (Hubble Ultra Deep Field - HUDF)",
      category: "deep_field",
      type: "深空長曝光天區",
      galaxyCount: "在滿月 1/10 視角內包含 10,000+ 個星系",
      distanceSunLy: "跨越 130 億光年時空",
      coords: { x: -800, y: -1600, z: 1200 },
      color: "#38bdf8",
      icon: "🌌",
      description: "人類歷史上最著名的深空觀測照片之一，指向天爐座一小片看似空無一物的漆黑天區，揭示了上萬個各個年齡階段的繁星世界。"
    },
    {
      id: "phoenix_a",
      name: "👑 鳳凰座 A 超級黑洞 (Phoenix Cluster A Black Hole)",
      category: "quasar",
      type: "巨型星系團中心核",
      blackHoleMass: "約 1,000 億倍太陽質量 (1 × 10¹¹ M☉)",
      distanceSunLy: "約 58 億光年",
      coords: { x: -600, y: -900, z: -1100 },
      color: "#e879f9",
      icon: "👑",
      description: "位於鳳凰座星系團中心的怪物級超大質量黑洞，每年吞噬數千倍太陽質量的物質並激發強烈的極向冷氣體冷卻流。"
    },
    {
      id: "cmb_boundary",
      name: "🌐 宇宙微波背景輻射 (CMB Horizon)",
      category: "cmb",
      type: "宇宙大爆炸原初餘暉 (最後散射面)",
      ageAtObs: "大爆炸後 38 萬年 (重組時期 Recombination)",
      temperature: "2.7255 K",
      distanceSunLy: "約 465 億光年 (可觀測宇宙最邊緣)",
      coords: { x: 0, y: 0, z: 0 },
      color: "#38bdf8",
      icon: "🌐",
      description: "可觀測宇宙的最外層邊界，光子在宇宙誕生 38 萬年後首次自由傳播的太古印記，記錄了微小到十萬分之一的量子引力擾動，這正是日後所有星系與生命的種子。"
    }
  ]
};

if (typeof window !== 'undefined') {
  window.UNIVERSE_DATA = UNIVERSE_DATA;
}