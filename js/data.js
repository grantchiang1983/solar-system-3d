/**
 * 太陽系天文物理常數與行星資料庫
 * 資料來源: NASA Planetary Fact Sheet
 */

const ASTRO_CONSTANTS = {
  AU_IN_KM: 149597870.7,         // 1 天文單位 (公里)
  GM_SUN: 1.32712440018e11,      // 太陽引力常數 km^3/s^2
  SPEED_OF_LIGHT: 299792.458,    // 光速 km/s
};

const PLANETS_DATA = [
  {
    id: 'sun',
    name: 'Sun',
    zhName: '太陽',
    type: 'star',
    radiusKm: 696340,
    visualRadius: 16.0,
    trueScaleRadius: 4.0,
    color: '#ffaa00',
    emissive: '#ff7700',
    rotationPeriodHours: 609.12, // ~25.4 天
    axialTiltDeg: 7.25,
    distanceAU: 0,
    orbitPeriodDays: 0,
    meanSpeedKmS: 0,
    eccentricity: 0,
    inclinationDeg: 0,
    temperature: '5,500 °C (表面) / 15,000,000 °C (核心)',
    massKg: '1.989 × 10³⁰ kg (佔太陽系 99.86%)',
    gravity: '274 m/s² (28g)',
    atmosphere: '氫 (73.46%), 氦 (24.85%), 氧, 碳',
    description: '太陽是太陽系的中心天體，一顆 G 型主序星（黃矮星），提供整個太陽系光與熱，維持所有行星的軌道運轉。',
    funFact: '太陽每秒鐘透過核融合將 6 億噸氫轉化為氦，釋放出的能量相當於數億顆氫彈。'
  },
  {
    id: 'mercury',
    name: 'Mercury',
    zhName: '水星',
    type: 'planet',
    radiusKm: 2439.7,
    visualRadius: 1.2,
    trueScaleRadius: 0.15,
    visualOrbitRadius: 28,
    color: '#9e9a93',
    semiMajorAxisAU: 0.387098,
    distanceKm: 57909050,
    perihelionAU: 0.3075,
    aphelionAU: 0.4667,
    orbitPeriodDays: 87.969,
    meanSpeedKmS: 47.36,
    rotationPeriodDays: 58.646,
    axialTiltDeg: 0.034,
    eccentricity: 0.20563,
    inclinationDeg: 7.005,
    ascendingNodeDeg: 48.331,       // 升交點黃經 Ω (J2000)
    argumentOfPeriapsisDeg: 29.124, // 近日點幅角 ω (J2000)
    temperature: '-180 °C 至 430 °C',
    massKg: '3.301 × 10²³ kg (地球的 0.055 倍)',
    gravity: '3.7 m/s² (0.38g)',
    atmosphere: '極微薄外逸層 (氧、鈉、氫、氦)',
    description: '太陽系最靠近太陽且最小的行星，軌道離心率在八大行星中最高，公轉速度最快。',
    funFact: '水星上的一天（兩次日出間隔）相當於地球的 176 天，比它的一年（88 天）還要長！'
  },
  {
    id: 'venus',
    name: 'Venus',
    zhName: '金星',
    type: 'planet',
    radiusKm: 6051.8,
    visualRadius: 2.2,
    trueScaleRadius: 0.38,
    visualOrbitRadius: 42,
    color: '#e3bb76',
    semiMajorAxisAU: 0.723332,
    distanceKm: 108208000,
    perihelionAU: 0.7184,
    aphelionAU: 0.7282,
    orbitPeriodDays: 224.701,
    meanSpeedKmS: 35.02,
    rotationPeriodDays: -243.025, // 逆向自轉
    axialTiltDeg: 177.36,
    eccentricity: 0.00677,
    inclinationDeg: 3.394,
    ascendingNodeDeg: 76.680,       // 升交點黃經 Ω (J2000)
    argumentOfPeriapsisDeg: 54.884, // 近日點幅角 ω (J2000)
    temperature: '約 465 °C (極端溫室效應)',
    massKg: '4.867 × 10²⁴ kg (地球的 0.815 倍)',
    gravity: '8.87 m/s² (0.90g)',
    atmosphere: '二氧化碳 (96.5%), 氮氣 (3.5%), 濃硫酸雲',
    description: '太陽系中最熱的行星，常被稱為地球的「姊妹星」，但表面大氣壓力高達地球的 92 倍。',
    funFact: '金星是唯一逆向自轉（太陽從西方升起、東方落下）且自轉比公轉還慢的行星。'
  },
  {
    id: 'earth',
    name: 'Earth',
    zhName: '地球',
    type: 'planet',
    radiusKm: 6371.0,
    visualRadius: 2.4,
    trueScaleRadius: 0.40,
    visualOrbitRadius: 58,
    color: '#3480eb',
    semiMajorAxisAU: 1.000000,
    distanceKm: 149597870,
    perihelionAU: 0.9833,
    aphelionAU: 1.0167,
    orbitPeriodDays: 365.256,
    meanSpeedKmS: 29.78,
    rotationPeriodDays: 0.99727,
    axialTiltDeg: 23.44,
    eccentricity: 0.01671,
    inclinationDeg: 0.000,
    ascendingNodeDeg: 348.739,      // 升交點黃經 Ω (J2000)
    argumentOfPeriapsisDeg: 114.207,// 近日點幅角 ω (J2000)
    temperature: '-89 °C 至 58 °C (平均約 15 °C)',
    massKg: '5.972 × 10²⁴ kg',
    gravity: '9.807 m/s² (1g)',
    atmosphere: '氮氣 (78.08%), 氧氣 (20.95%), 氬氣, 水氣, 二氧化碳',
    description: '目前已知唯一孕育生命的星球，表面約 71% 為液態水海洋所覆蓋，擁有活躍的地質與強大磁場。',
    funFact: '地球並非完美的球體，由於自轉產生的離心力，赤道直徑比兩極直徑長了約 43 公里。',
    hasMoon: true,
    moon: {
      name: 'Moon',
      zhName: '月球',
      radiusKm: 1737.4,
      visualRadius: 0.65,
      orbitDistance: 4.8,
      orbitPeriodDays: 27.322,
      inclinationDeg: 5.145,        // 月球軌道傾角 (相對黃道面)
      color: '#c4c8cb'
    }
  },
  {
    id: 'mars',
    name: 'Mars',
    zhName: '火星',
    type: 'planet',
    radiusKm: 3389.5,
    visualRadius: 1.6,
    trueScaleRadius: 0.21,
    visualOrbitRadius: 76,
    color: '#c85a2b',
    semiMajorAxisAU: 1.523679,
    distanceKm: 227939200,
    perihelionAU: 1.3814,
    aphelionAU: 1.6660,
    orbitPeriodDays: 686.980,
    meanSpeedKmS: 24.07,
    rotationPeriodDays: 1.02596,
    axialTiltDeg: 25.19,
    eccentricity: 0.09340,
    inclinationDeg: 1.850,
    ascendingNodeDeg: 49.558,       // 升交點黃經 Ω (J2000)
    argumentOfPeriapsisDeg: 286.502,// 近日點幅角 ω (J2000)
    temperature: '-140 °C 至 20 °C (平均 -63 °C)',
    massKg: '6.417 × 10²³ kg (地球的 0.107 倍)',
    gravity: '3.72 m/s² (0.38g)',
    atmosphere: '二氧化碳 (95.3%), 氮氣 (2.6%), 氬氣 (1.9%)',
    description: '紅色星球，富含氧化鐵地表，擁有太陽系最大的火山（奧林帕斯山）與巨大峽谷（水手號峽谷）。',
    funFact: '火星上的奧林帕斯山高達 22 公里，高度是地球聖母峰的近 2.5 倍！'
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    zhName: '木星',
    type: 'planet',
    radiusKm: 69911,
    visualRadius: 5.6,
    trueScaleRadius: 1.8,
    visualOrbitRadius: 105,
    color: '#d4a373',
    semiMajorAxisAU: 5.204267,
    distanceKm: 778570000,
    perihelionAU: 4.9504,
    aphelionAU: 5.4581,
    orbitPeriodDays: 4332.589, // ~11.86 年
    meanSpeedKmS: 13.07,
    rotationPeriodDays: 0.41354, // ~9.93 小時 (自轉最快)
    axialTiltDeg: 3.13,
    eccentricity: 0.04849,
    inclinationDeg: 1.303,
    ascendingNodeDeg: 100.464,      // 升交點黃經 Ω (J2000)
    argumentOfPeriapsisDeg: 273.867,// 近日點幅角 ω (J2000)
    temperature: '-110 °C (雲頂溫度)',
    massKg: '1.898 × 10²⁷ kg (其餘行星質量總和的 2.5 倍)',
    gravity: '24.79 m/s² (2.53g)',
    atmosphere: '氫氣 (89.8%), 氦氣 (10.2%), 微量甲烷、氨氣',
    description: '太陽系最大的氣態巨行星，強大的引力如同太陽系的「清道夫」，保護內行星免於大量彗星撞擊。',
    funFact: '木星的大紅斑是一個存在了至少 350 年的巨大反氣旋風暴，尺寸甚至足以裝下整個地球。'
  },
  {
    id: 'saturn',
    name: 'Saturn',
    zhName: '土星',
    type: 'planet',
    radiusKm: 58232,
    visualRadius: 4.8,
    trueScaleRadius: 1.5,
    visualOrbitRadius: 140,
    color: '#e5cf9b',
    semiMajorAxisAU: 9.5826,
    distanceKm: 1433530000,
    perihelionAU: 9.0412,
    aphelionAU: 10.1238,
    orbitPeriodDays: 10759.22, // ~29.46 年
    meanSpeedKmS: 9.69,
    rotationPeriodDays: 0.44401, // ~10.66 小時
    axialTiltDeg: 26.73,
    eccentricity: 0.05555,
    inclinationDeg: 2.485,
    ascendingNodeDeg: 113.665,      // 升交點黃經 Ω (J2000)
    argumentOfPeriapsisDeg: 339.392,// 近日點幅角 ω (J2000)
    temperature: '-140 °C (雲頂溫度)',
    massKg: '5.683 × 10²⁶ kg (地球的 95 倍)',
    gravity: '10.44 m/s² (1.06g)',
    atmosphere: '氫氣 (96.3%), 氦氣 (3.25%), 甲烷',
    description: '以其壯麗無比的行星光環系統聞名，密度極低，如果有一片足夠大的海洋，土星甚至能浮在水面上。',
    funFact: '土星環雖然寬達 28 萬公里，但厚度平均僅有 10 到 100 公尺，主要由數以億計的微小冰晶與岩石碎屑組成。',
    hasRings: true,
    ringInnerRadius: 6.2,
    ringOuterRadius: 11.5
  },
  {
    id: 'uranus',
    name: 'Uranus',
    zhName: '天王星',
    type: 'planet',
    radiusKm: 25362,
    visualRadius: 3.2,
    trueScaleRadius: 0.75,
    visualOrbitRadius: 178,
    color: '#70d6ff',
    semiMajorAxisAU: 19.2012,
    distanceKm: 2872460000,
    perihelionAU: 18.324,
    aphelionAU: 20.078,
    orbitPeriodDays: 30685.4, // ~84.01 年
    meanSpeedKmS: 6.81,
    rotationPeriodDays: -0.71833, // ~17.24 小時 (逆向滾動自轉)
    axialTiltDeg: 97.77,
    eccentricity: 0.04726,
    inclinationDeg: 0.773,
    ascendingNodeDeg: 74.006,       // 升交點黃經 Ω (J2000)
    argumentOfPeriapsisDeg: 96.999, // 近日點幅角 ω (J2000)
    temperature: '-224 °C (太陽系最冷的大氣層)',
    massKg: '8.681 × 10²⁵ kg (地球的 14.5 倍)',
    gravity: '8.69 m/s² (0.89g)',
    atmosphere: '氫氣 (82.5%), 氦氣 (15.2%), 甲烷 (2.3% 使其呈現青藍色)',
    description: '冰巨行星之一，自轉軸傾角高達 97.77 度，幾乎是「橫躺」在黃道面上繞太陽公轉。',
    funFact: '因為天王星橫躺著自轉，它的南北兩極各有 42 年處於連續的白晝或黑夜。',
    hasRings: true,
    ringInnerRadius: 3.8,
    ringOuterRadius: 4.8
  },
  {
    id: 'neptune',
    name: 'Neptune',
    zhName: '海王星',
    type: 'planet',
    radiusKm: 24622,
    visualRadius: 3.1,
    trueScaleRadius: 0.72,
    visualOrbitRadius: 215,
    color: '#2a6fdb',
    semiMajorAxisAU: 30.070,
    distanceKm: 4495060000,
    perihelionAU: 29.810,
    aphelionAU: 30.330,
    orbitPeriodDays: 60189.0, // ~164.79 年
    meanSpeedKmS: 5.43,
    rotationPeriodDays: 0.67125, // ~16.11 小時
    axialTiltDeg: 28.32,
    eccentricity: 0.00860,
    inclinationDeg: 1.769,
    ascendingNodeDeg: 131.784,      // 升交點黃經 Ω (J2000)
    argumentOfPeriapsisDeg: 276.336,// 近日點幅角 ω (J2000)
    temperature: '-218 °C',
    massKg: '1.024 × 10²⁶ kg (地球的 17.1 倍)',
    gravity: '11.15 m/s² (1.14g)',
    atmosphere: '氫氣 (80.0%), 氦氣 (19.0%), 甲烷 (1.5%)',
    description: '距離太陽最遠的八大行星，擁有太陽系中最強烈的風暴，風速可達驚人的超音速 2,100 km/h。',
    funFact: '海王星是人類歷史上第一個純粹透過數學計算（觀察天王星軌道微擾）而非觀測直接預測並發現的行星！'
  },
  {
    id: 'pluto',
    name: 'Pluto',
    zhName: '冥王星 (矮行星)',
    type: 'dwarf',
    radiusKm: 1188.3,
    visualRadius: 0.9,
    trueScaleRadius: 0.1,
    visualOrbitRadius: 255,         // 近日點時會深入海王星軌道 (215) 內側 → 正確的 3:2 共振穿越
    color: '#bfa588',
    semiMajorAxisAU: 39.482,
    distanceKm: 5906380000,
    perihelionAU: 29.658,           // < 海王星 30.07 AU → 近日點在海王星內側
    aphelionAU: 49.305,
    orbitPeriodDays: 90560.0, // ~247.94 年
    meanSpeedKmS: 4.74,
    rotationPeriodDays: -6.3872, // ~153.3 小時
    axialTiltDeg: 122.53,
    eccentricity: 0.24880,          // 高離心率，造成近日點穿越現象
    inclinationDeg: 17.16,          // 高傾角，3:2 共振保護不與海王星相撞
    ascendingNodeDeg: 110.299,      // 升交點黃經 Ω (J2000)
    argumentOfPeriapsisDeg: 113.834,// 近日點幅角 ω (J2000)
    temperature: '-230 °C 至 -240 °C',
    massKg: '1.303 × 10²² kg (月球的 0.18 倍)',
    gravity: '0.62 m/s² (0.063g)',
    atmosphere: '稀薄氮氣、甲烷、一氧化碳',
    description: '柯伊伯帶最大的天體之一，擁有高傾角與大橢圓軌道，2006 年被國際天文學聯會重新分類為矮行星。',
    funFact: '新視野號探測器在 2015 年飛掠時發現冥王星表面有一個巨大的心形氮冰平原（湯博區）。'
  }
];

const ASTEROID_BELT_CONFIG = {
  innerRadius: 80,    // 更貼近火星 (76) 外緣
  outerRadius: 98,
  count: 1600,
  minSize: 0.07,
  maxSize: 0.30
};

const KUIPER_BELT_CONFIG = {
  innerRadius: 235,
  outerRadius: 285,
  count: 1100,        // 降低密度：柯伊伯帶物質稀疏，遠比小行星帶空曠
  minSize: 0.05,
  maxSize: 0.18       // 更小粒子：反映海外天體實際視覺尺寸
};

// 銀河系宏觀結構與太陽系銀心座標
const MILKY_WAY_DATA = {
  name: 'Milky Way Galaxy',
  zhName: '銀河系',
  diameterLy: 100000,              // 直徑 ~100,000 光年
  thicknessLy: 1000,               // 盤面厚度 ~1,000 光年
  sunDistanceToCenterLy: 26670,    // 太陽距銀心 ~26,670 光年
  sunOrbitalVelocityKmS: 220,      // 太陽繞銀心公轉速率 ~220 km/s
  galacticYearYears: 230000000,    // 銀河年 ~2.3 億年
  sunSpiralArm: '獵戶座次臂 (Orion Arm / Local Spur)',
  spiralArms: ['英仙臂 (Perseus)', '獵戶臂 (Orion)', '人馬臂 (Sagittarius)', '盾牌-半人馬臂 (Scutum-Centaurus)'],
  totalStars: '1,000 億 ~ 4,000 億顆恆星',
  totalMass: '約 1.5 兆倍太陽質量 (含暗物質暈)'
};

// 已知重要黑洞目錄 (重點標註最靠近太陽系的黑洞與銀心黑洞)
const BLACK_HOLES_DATA = [
  {
    id: 'gaia_bh1',
    name: 'Gaia BH1',
    zhName: '蓋亞 BH1 (目前已知最近黑洞)',
    type: 'stellar_black_hole',
    isClosest: true,
    distanceLy: 1560,
    distancePc: 478,
    constellation: '蛇夫座 (Ophiuchus)',
    massSolar: 9.62,
    schwarzschildRadiusKm: 28.4,
    companionStar: '類太陽恆星 (G 型主序星，0.93 M☉)',
    orbitalPeriodDays: 185.6,
    discoveryYear: '2022 年 (ESA 蓋亞望遠鏡 DR3)',
    relativeDirectionDeg: 62.4,     // 相對太陽系參考方位
    visualDistance: 380,            // 宏觀視圖半徑
    visualCoords: { x: 340, y: 48, z: 170 },
    color: '#a855f7',
    glowColor: '#ec4899',
    description: '目前已知距離太陽系最近的黑洞！由歐洲太空總署 (ESA) 蓋亞太空望遠鏡透過天體測量法發現，距地球僅約 1,560 光年。',
    funFact: 'Gaia BH1 處於休眠狀態（不主動吸積伴星物質），因此不釋放強烈 X 射線。天文學家是透過伴星在太空中細微的「引力晃動」才奇蹟般發現它！'
  },
  {
    id: 'gaia_bh3',
    name: 'Gaia BH3',
    zhName: '蓋亞 BH3 (銀河系最大恆星級黑洞)',
    type: 'stellar_black_hole',
    isClosest: false,
    distanceLy: 1926,
    distancePc: 590,
    constellation: '天鷹座 (Aquila)',
    massSolar: 33.0,
    schwarzschildRadiusKm: 97.4,
    companionStar: '金屬極貧古老巨星 (0.76 M☉)',
    orbitalPeriodDays: 4250,
    discoveryYear: '2024 年 4 月 (ESA 蓋亞望遠鏡)',
    relativeDirectionDeg: 128.0,
    visualDistance: 460,
    visualCoords: { x: -280, y: -38, z: 360 },
    color: '#8b5cf6',
    glowColor: '#06b6d4',
    description: '2024 年震撼天文界的重大發現！銀河系目前已知質量最大的恆星起源黑洞，質量高達太陽的 33 倍。',
    funFact: '在此之前，天文學家認為銀河系恆星黑洞上限約為 20 倍太陽質量。Gaia BH3 的存在直接證實了極古老貧金屬大質量恆星可塌縮成巨型黑洞！'
  },
  {
    id: 'sgr_a_star',
    name: 'Sagittarius A*',
    zhName: '人馬座 A* (銀河系中心超大質量黑洞)',
    type: 'supermassive_black_hole',
    isClosest: false,
    distanceLy: 26670,
    distancePc: 8178,
    constellation: '人馬座 (Sagittarius)',
    massSolar: 4150000,
    schwarzschildRadiusKm: 12250000, // 約 1,225 萬公里 (~0.082 AU)
    companionStar: 'S2 等多顆高速繞行恆星 (S-stars)',
    orbitalPeriodDays: 0,
    discoveryYear: '1974 年發現 / 2022 年 EHT 事件視界望遠鏡首次拍下黑洞陰影',
    relativeDirectionDeg: 270.0,
    visualDistance: 800,
    visualCoords: { x: 0, y: 0, z: -800 },
    color: '#f97316',
    glowColor: '#facc15',
    description: '銀河系的引力中樞，質量高達 415 萬倍太陽質量的超大質量黑洞，統治著整個銀河系數千億顆恆星的公轉軌道。',
    funFact: '2020年諾貝爾物理學獎正因發現此黑洞而頒發；2022年人類透過跨洲射電望遠鏡陣列，首次親眼目睹了人馬座 A* 的吸積盤光環！'
  }
];

/**
 * 著名彗星資料庫 (Comets Dataset - 1P/Halley & C/1995 O1 Hale-Bopp)
 * 數據來源：NASA JPL Small-Body Database (SBDB) & IAU Minor Planet Center
 */
const COMETS_DATA = [
  {
    id: 'halley',
    name: '1P/Halley',
    zhName: '哈雷彗星 (1P/Halley)',
    type: 'periodic_comet',
    orbitalPeriodYears: 75.32,
    semiMajorAxisAU: 17.834,
    eccentricity: 0.96714,
    inclinationDeg: 162.26,        // 逆向公轉
    perihelionAU: 0.586,           // 近日點 (0.586 AU)
    aphelionAU: 35.08,             // 遠日點 (35.08 AU，海王星軌道外)
    ascendingNodeDeg: 58.42,
    argumentOfPeriapsisDeg: 111.33,
    nucleusSizeKm: '15 × 8 × 8 km',
    nextPerihelionYear: '2061 年 7 月 28 日',
    lastPerihelionYear: '1986 年 2 月 9 日',
    visualScale: 1.1,
    orbitVisualA: 132.0,           // 視覺軌道半長軸
    visualEccentricity: 0.745,     // 視覺離心率 (近日點 = 33.7 位於水星與金星之間，遠離太陽球體)
    orbitColor: '#10b981',         // 綠寶石翡翠彗髮
    comaColor: '#34d399',
    ionTailColor: '#38bdf8',       // 藍色離子尾
    dustTailColor: '#e0f2fe',      // 白色塵埃尾
    description: '人類歷史上最傳奇的週期彗星！由愛德蒙·哈雷（Edmond Halley）於 1705 年首次預測其週期性回歸，是唯一能用肉眼清晰看見且一生中可能目睹兩次的傳奇天體。',
    funFact: '哈雷彗星的彗核極其黑暗（反照率僅 0.04，宛如黑炭），但當它接近太陽時，受太陽輻射強烈昇華，碳分子 C2 與氰基 CN 游離發出標誌性的翡翠綠光！'
  },
  {
    id: 'hale_bopp',
    name: 'C/1995 O1 (Hale-Bopp)',
    zhName: '海爾-波普彗星 (C/1995 O1)',
    type: 'great_comet',
    orbitalPeriodYears: 2533,
    semiMajorAxisAU: 186.0,
    eccentricity: 0.995086,
    inclinationDeg: 89.43,         // 垂直黃道面俯衝軌道
    perihelionAU: 0.914,           // 近日點 (接近地球軌道 0.914 AU)
    aphelionAU: 370.8,             // 遠日點 (奧爾特雲內緣)
    ascendingNodeDeg: 282.47,
    argumentOfPeriapsisDeg: 130.59,
    nucleusSizeKm: '約 40 ~ 60 km (巨無霸彗核)',
    nextPerihelionYear: '約 4385 年',
    lastPerihelionYear: '1997 年 4 月 1 日',
    visualScale: 1.4,
    orbitVisualA: 166.5,           // 視覺軌道半長軸
    visualEccentricity: 0.682,     // 視覺離心率 (近日點 = 53.0 緊鄰地球公轉軌道 58.0，絕不撞入太陽)
    orbitColor: '#f59e0b',         // 金黃大彗星
    comaColor: '#fbbf24',
    ionTailColor: '#2563eb',       // 深邃電藍離子尾
    dustTailColor: '#fef08a',      // 亮金黃彎曲塵埃尾
    description: '20 世紀最壯麗的世紀大彗星！其彗核直徑高達 40~60 公里（為一般彗星的數倍至十倍大），在 1997 年回歸時肉眼可見時間長達破紀錄的 18 個月！',
    funFact: '海爾-波普彗星擁有教科書級別的壯麗雙彗尾：一條筆直深邃的電藍色「CO+ 離子尾」直指太陽反方向，另一條彎曲寬闊的亮金黃色「微米塵埃尾」隨軌道延展達數千萬公里！'
  }
];
