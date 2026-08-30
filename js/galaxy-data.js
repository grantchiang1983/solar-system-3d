/**
 * 銀河系完整天文物理數據庫 (Milky Way Galaxy Complete Astronomical Database)
 * 包含銀心黑洞、中央棒、五大旋臂、著名星雲、球狀星團、費米氣泡與衛星星系
 * 座標系以銀心為原點 (0, 0, 0)，單位：光年 (1 unit = 100 ly，銀河直徑約 100,000 ly -> 半徑 500 單位)
 * 太陽系位置：(x: 0, y: 2.5, z: 260) -> 距銀心約 26,000 光年 (8.0 kpc)
 */

const GALAXY_DATA = {
  overview: {
    name: "銀河系 (Milky Way Galaxy)",
    type: "棒旋星系 (Barred Spiral Galaxy - SBbc)",
    diameterLy: "100,000 ~ 120,000 光年 (30 ~ 37 kpc)",
    stellarMass: "約 1.5 × 10¹² 太陽質量 (含暗物質暈)",
    starCount: "約 1,000 億 ~ 4,000 億顆恆星",
    age: "約 136 億年 (接近宇宙大爆炸早期)",
    rotationPeriod: "太陽處公轉一圈約 2.3 億年 (銀河年 Galactic Year)",
    orbitalSpeed: "太陽繞銀心速度約 220 ~ 240 km/s",
    centralBlackHole: "人馬座 A* (Sagittarius A*, 415 萬倍太陽質量)"
  },

  // 1. 五大對數螺旋臂與 3 kpc 臂結構定義
  spiralArms: [
    {
      id: "scutum_centaurus",
      name: "盾牌-半人馬臂 (Scutum-Centaurus Arm)",
      type: "主要旋臂 (Major Arm)",
      pitchDeg: 12.0,
      startRadius: 40,
      endRadius: 520,
      offsetRad: 0.0,
      color: "#fde68a",
      spectralType: "Pop I 年輕恆星 + Pop II 老年恆星群",
      description: "銀河系兩大主要恆星密度波旋臂之一，發源自銀棒末端，包含密集的恆星形成區與巨大分子雲複合體。"
    },
    {
      id: "perseus",
      name: "英仙臂 (Perseus Arm)",
      type: "主要旋臂 (Major Arm)",
      pitchDeg: 12.5,
      startRadius: 50,
      endRadius: 540,
      offsetRad: Math.PI,
      color: "#fef3c7",
      spectralType: "高溫藍巨星 (O/B) + 巨型電離氫 HII 區",
      description: "銀河系另一大主要旋臂，位於太陽系外側，擁有極其活躍的新生恆星育嬰室（如著名的雙星團 NGC 869/884）。"
    },
    {
      id: "sagittarius_carina",
      name: "人馬-船底臂 (Sagittarius-Carina Arm)",
      type: "次要旋臂 (Minor Arm)",
      pitchDeg: 11.8,
      startRadius: 45,
      endRadius: 480,
      offsetRad: Math.PI * 0.55,
      color: "#fed7aa",
      spectralType: "密集氣體塵埃 + 巨大發射星雲",
      description: "位於太陽系與銀心之間，富含星際氣體與壯麗發射星雲，包括著名的船底座大星雲、礁湖星雲與鷹星雲。"
    },
    {
      id: "norma_outer",
      name: "矩尺-外臂 (Norma-Outer Arm)",
      type: "次要旋臂 (Minor Arm)",
      pitchDeg: 12.2,
      startRadius: 35,
      endRadius: 560,
      offsetRad: Math.PI * 1.55,
      color: "#fde68a",
      spectralType: "稀薄中性氫氣體 + 外緣恆星流",
      description: "內側為矩尺臂，延伸至外盤成為外臂（Outer Arm），是銀河系可觀測最外側的連續螺旋結構。"
    },
    {
      id: "orion_spur",
      name: "獵戶座次臂 / 本地臂 (Orion Spur / Local Arm)",
      type: "支臂 / 次臂 (Spur / Minor Arm)",
      pitchDeg: 10.5,
      startRadius: 180,
      endRadius: 330,
      offsetRad: Math.PI * 0.82,
      color: "#bae6fd",
      spectralType: "年輕星團 + 古爾德帶 (Gould Belt)",
      description: "位於人馬臂與英仙臂之間的橋樑支臂，我們的太陽系與獵戶座大星雲均位於這條次臂上。"
    },
    {
      id: "near_3kpc",
      name: "近 3 kpc 臂 (Near 3-kpc Arm)",
      type: "內側擴展環 (Inner Expanding Arm)",
      pitchDeg: 8.0,
      startRadius: 25,
      endRadius: 45,
      offsetRad: 0.8,
      color: "#fdba74",
      spectralType: "高速徑向膨脹分子氣體",
      description: "緊鄰銀河中央棒的高速膨脹氣體結構，以每秒超過 50 公里的速度向外擴展。"
    }
  ],

  // 2. 重要深空天體與著名地標 (Landmarks & Deep-Sky Objects)
  landmarks: [
    {
      id: "sol",
      name: "☀️ 太陽系 (Solar System / Sol)",
      category: "home",
      coords: { x: 0, y: 2.5, z: 260 },
      distanceSunLy: "0 光年",
      distGalacticCenterLy: "約 26,000 光年 (8.0 kpc)",
      arm: "獵戶座次臂 (Orion Spur)",
      icon: "☀️",
      color: "#00f2fe",
      description: "我們微小而溫暖的宇宙家園，圍繞銀河系中心以 230 km/s 的速度公轉，公轉週期約 2.3 億年。"
    },
    {
      id: "sgr_a_star",
      name: "⚫ 人馬座 A* (Sagittarius A*)",
      category: "black_hole",
      coords: { x: 0, y: 0, z: 0 },
      distanceSunLy: "26,670 光年",
      distGalacticCenterLy: "0 光年 (銀河核心)",
      arm: "銀河核球 (Galactic Bulge)",
      icon: "⚫",
      color: "#ec4899",
      description: "銀河系中心的超大質量黑洞，質量約為太陽的 415 萬倍，擁有強大的重力場與高能相對論吸積盤。"
    },
    {
      id: "m42_orion",
      name: "🌸 獵戶座大星雲 (M42 / NGC 1976)",
      category: "nebula",
      coords: { x: 5, y: -2, z: 246 },
      distanceSunLy: "1,344 光年",
      distGalacticCenterLy: "約 25,000 光年",
      arm: "獵戶座次臂 (Orion Spur)",
      icon: "🌸",
      color: "#f43f5e",
      description: "肉眼可見的最著名恆星育嬰室，由梯形四邊形星團（Trapezium）激發發光，正在誕生數百顆新恆星與行星系統。"
    },
    {
      id: "ngc3372_carina",
      name: "🌺 船底座大星雲 (NGC 3372 / Carina Nebula)",
      category: "nebula",
      coords: { x: 65, y: -1.5, z: 220 },
      distanceSunLy: "7,500 光年",
      distGalacticCenterLy: "約 23,000 光年",
      arm: "人馬-船底臂 (Sagittarius-Carina Arm)",
      icon: "🌺",
      color: "#fb7185",
      description: "南半球夜空最壯麗的巨大恆星形成區，體積是獵戶星雲的 4 倍以上，內部孕育著瀕臨超新星爆發的高光度藍變星「海山二（Eta Carinae）」。"
    },
    {
      id: "m16_eagle",
      name: "🦅 鷹星雲 / 創世之柱 (M16 / Eagle Nebula)",
      category: "nebula",
      coords: { x: -45, y: 1.8, z: 195 },
      distanceSunLy: "7,000 光年",
      distGalacticCenterLy: "約 19,500 光年",
      arm: "人馬-船底臂 (Sagittarius-Carina Arm)",
      icon: "🦅",
      color: "#f97316",
      description: "哈伯望遠鏡經典名作「創世之柱（Pillars of Creation）」所在地，長達數光年的冷分子氣體柱正在被年輕恆星的紫外線光致蒸發。"
    },
    {
      id: "m8_lagoon",
      name: "🌊 礁湖星雲 (M8 / Lagoon Nebula)",
      category: "nebula",
      coords: { x: -35, y: -1.2, z: 215 },
      distanceSunLy: "4,100 光年",
      distGalacticCenterLy: "約 22,000 光年",
      arm: "人馬-船底臂 (Sagittarius-Carina Arm)",
      icon: "🌊",
      color: "#e11d48",
      description: "人馬座內的巨型電離氫 HII 發射星雲與年輕疏散星團 NGC 6530，內部有劇烈的漏斗狀雲氣湍流。"
    },
    {
      id: "m1_crab",
      name: "🦀 蟹狀星雲 (M1 / Crab Nebula)",
      category: "remnant",
      coords: { x: -55, y: -4.5, z: 325 },
      distanceSunLy: "6,500 光年",
      distGalacticCenterLy: "約 32,500 光年",
      arm: "英仙臂 (Perseus Arm)",
      icon: "🦀",
      color: "#38bdf8",
      description: "西元 1054 年宋朝天文官記錄之超新星爆發（SN 1054）殘骸，中心有一顆每秒自轉 30 次的高能脈衝星（PSR B0531+21）。"
    },
    {
      id: "omega_centauri",
      name: "✨ 半人馬座 ω 球狀星團 (NGC 5139)",
      category: "cluster",
      coords: { x: 120, y: 35, z: 180 },
      distanceSunLy: "15,800 光年",
      distGalacticCenterLy: "約 21,000 光年",
      arm: "銀暈 (Galactic Halo)",
      icon: "✨",
      color: "#facc15",
      description: "銀河系中質量最大、最明亮的球狀星團，包含約 1,000 萬顆恆星，被推測為遠古被銀河系吞噬的矮星系殘餘核心。"
    },
    {
      id: "tucanae_47",
      name: "💎 杜鵑座 47 球狀星團 (NGC 104)",
      category: "cluster",
      coords: { x: -80, y: -90, z: 230 },
      distanceSunLy: "13,000 光年",
      distGalacticCenterLy: "約 24,000 光年",
      arm: "銀暈 (Galactic Halo)",
      icon: "💎",
      color: "#fbbf24",
      description: "全天第二明亮的球狀星團，核心極其緻密，包含大量罕見的毫秒脈衝星與藍掉隊星（Blue Stragglers）。"
    },
    {
      id: "fermi_bubbles",
      name: "🟣 費米高能伽瑪射線氣泡 (Fermi Bubbles)",
      category: "high_energy",
      coords: { x: 0, y: 125, z: 0 },
      distanceSunLy: "約 26,000 光年",
      distGalacticCenterLy: "上下延伸 25,000 光年",
      arm: "銀心極向軸 (Galactic Polar Axis)",
      icon: "🟣",
      color: "#c084fc",
      description: "由費米伽瑪射線望遠鏡發現的兩個垂直貫穿銀道面的巨大沙漏狀電漿氣泡，推測是數百萬年前銀心黑洞爆發或劇烈星暴活動所吹出的宇宙射線衝擊波。"
    }
  ],

  // 3. 多波段觀測光譜特性 (Multi-Wavelength Astronomy)
  wavelengths: [
    {
      id: "visible",
      name: "👁️ 可見光 (Visible / Optical)",
      spectrum: "380 ~ 750 nm",
      observatories: "哈伯望遠鏡 (HST), 甚大望遠鏡 (VLT), 蓋亞 (Gaia)",
      highlights: "展現由高溫恆星群勾勒出的明亮旋臂，以及顯著的星際大裂谷暗塵埃帶吸光現象。"
    },
    {
      id: "infrared",
      name: "🔴 紅外線 (Infrared)",
      spectrum: "1 ~ 500 μm",
      observatories: "韋伯望遠鏡 (JWST), 史匹哲 (Spitzer), 2MASS",
      highlights: "穿透星際厚重塵埃障壁，清晰揭示銀河系中央三軸棒狀結構與深埋於分子雲中的新生恆星。"
    },
    {
      id: "radio_21cm",
      name: "📻 電波中性氫 (Radio / HI 21cm)",
      spectrum: "1420.4 MHz (21 cm)",
      observatories: "FAST (中國天眼), ALMA, VLA, MeerKAT",
      highlights: "精確描繪銀河系最外緣中性氫氣體盤的旋臂延伸與銀盤翹曲（Galactic Warp）。"
    },
    {
      id: "fermi_gamma",
      name: "🟣 高能伽瑪射線 / X射線 (Fermi Gamma & X-Ray)",
      spectrum: "> 100 MeV / 0.1 ~ 10 keV",
      observatories: "費米望遠鏡 (Fermi-LAT), 錢卓拉 (Chandra), eROSITA",
      highlights: "揭示自銀心向上下延伸 25,000 光年的費米氣泡與黑洞相對論極向高能電漿衝擊波。"
    }
  ]
};

if (typeof window !== 'undefined') {
  window.GALAXY_DATA = GALAXY_DATA;
}
