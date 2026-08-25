# 🌌 3D 太陽系與銀河系全景天文觀測系統 (Solar System & Milky Way 3D)

> **Heliocentric Orbital Telemetry, Milky Way Galaxy & Nearest Black Hole Observatory**  
> 一個基於 Three.js 與真實 NASA 天文數據開發的次世代 3D 太陽系、銀河系宏觀星盤與已知黑洞即時觀測模擬系統。

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=flat-square&logo=three.js&logoColor=white)
![NASA Data](https://img.shields.io/badge/NASA-Data-0B3D91?style=flat-square)

---

## 🌟 核心特色 (Key Features)

### 1. 🪐 精確太陽系克卜勒軌道動力學
- **即時日心方位角 (Heliocentric Azimuth)**：以春分點（Vernal Equinox）為基準（0° ~ 360°），即時動態追蹤各大行星黃道方位與指示射線。
- **瞬時公轉速度計算 (Instantaneous Velocity)**：依據克卜勒第二定律與 Vis-viva 活力公式，精確呈現行星在近日點與遠日點的變速運動。
- **相對太陽距離 (AU / 百萬公里)**：雙單位即時距離遙測。
- **自轉軸傾角 (Axial Tilt)** 與 **軌道傾角 (Orbital Inclination)**：包含天王星近 98° 橫躺自轉與水星、冥王星高傾角軌道。

### 2. 🌍 NASA 2K 官方極致擬真天體渲染
- **地球多層高解析度材質**：
  - **NASA 2K Blue Marble 日照紋理**：各大洲水文、雨林與冰川。
  - **高程法線貼圖 (Normal Map)**：喜馬拉雅山等山脈在晨昏交界處呈現立體深邃陰影。
  - **海洋鏡面高光貼圖 (Specular Map)**：陽光直射海洋呈現真實波光粼粼（Ocean Glint）。
  - **動態大氣雲層**：獨立旋轉氣旋雲系，在地表投射即時陰影。
  - **自定義瑞利散射光暈 (Rayleigh Atmosphere Shader)**：太空人視角薄層湛藍大氣光圈。
- **月球真實光影與地月陰影投射 (PCFSoftShadowMap)**：
  - **NASA 官方月表凹凸貼圖**：隕石坑與月海邊緣立體光影。
  - **真實日食與月食 (Solar & Lunar Eclipses)**：地月系統專屬高精度方向光，實現天文級相互陰影投射。
  - **地月即時遙測**：動態計算八大月相（朔、娥眉、弦、望、殘月）、繞地方位角與地月距離。
- **全天體 2K 最高畫質升級**：
  - 太陽（日冕電漿）、水星、金星、火星（水手號峽谷、極冠）、木星（大紅斑風暴帶）、土星（卡西尼環縫立體光環）、天王星、海王星與冥王星（湯博區心形冰原）。
- **小行星帶與柯伊伯帶**：包含 1,800+ 顆主小行星帶與 2,200+ 顆柯伊伯帶冰石顆粒。

### 3. 🌌 銀河系 3D 宏觀星盤與已知黑洞標註
- **銀河系對數螺旋星盤 (Milky Way Galaxy)**：
  - **22,000+ 顆旋臂粒子系統**：精確呈現四大旋臂（英仙臂、獵戶臂、人馬臂、盾牌-半人馬臂）與電離氫氣區。
  - **銀心超亮核球 (Galactic Bulge)**。
  - **太陽系在銀河系中的定位**：標示位於獵戶座次臂（Orion Arm），距銀心約 2.6 萬光年，以 220 km/s 繞銀心公轉。
- **已知黑洞 3D 標註與星際距離雷射指引**：
  - **🔥 蓋亞 BH1 (Gaia BH1 - 目前已知距離太陽系最近的黑洞)**：
    - 距離太陽系僅 **1,560 光年**（478 pc），位於蛇夫座。
    - 質量 9.62 M☉，史瓦西半徑 28.4 km，伴星為 0.93 M☉ 類太陽恆星。
    - 具備純黑事件視界、相對論吸積盤、光子球光暈、雙星互繞動畫與太陽系直指 Gaia BH1 的高亮脈衝指引雷射！
  - **蓋亞 BH3 (Gaia BH3)**：距離 **1,926 光年**，天鷹座，銀河系已知最大恆星級黑洞（33.0 M☉）。
  - **人馬座 A* (Sagittarius A*)**：距離 **26,670 光年**，銀河系核心超大質量黑洞（415 萬倍太陽質量）。

### 4. 🎮 多維度互動操控與儀表板
- **視角模式**：
  - 🌐 太陽系全景視角
  - 🌌 銀河系宏觀視角
  - 🕳️ 最近黑洞 (Gaia BH1) 特寫聚焦
  - 🌍 地球主體視角 (近地軌道仰望)
  - 📐 俯瞰黃道面
  - 🎯 天體鎖定追蹤
- **時間控制器**：支援暫停/播放、多段流速（0.2x、1x、5x、30x、1年/秒）與重設至今日。
- **100% 離線支援**：內建所有 NASA 貼圖 Base64 離線資料庫與 Three.js 核心庫，零網路依賴、無 CORS 限制。

---

## 🚀 快速開始 (Quick Start)

### 直接開啟
1. 雙擊執行 `start_app.bat`，或在任何瀏覽器中直接開啟 `index.html`。
2. 無需安裝任何 Node.js、Python 或外部伺服器環境。

---

## 📁 專案結構 (Project Architecture)

```
solar-system-3d/
├── index.html                  # 主頁面與 3D 畫布容器
├── start_app.bat               # Windows 一鍵啟動腳本
├── README.md                   # 專案詳細說明文件
├── css/
│   └── styles.css              # 科幻太空航電 UI 與響應式排版樣式
├── js/
│   ├── libs/
│   │   ├── three.min.js        # Three.js 3D 引擎 (離線版)
│   │   └── OrbitControls.js    # 軌道控制器 (離線版)
│   ├── data.js                 # NASA 行星、銀河系與已知黑洞天文物理資料庫
│   ├── nasa-textures-data.js   # NASA 官方 2K 貼圖 Base64 離線資料庫 (免 CORS)
│   ├── textures.js             # 程序化紋理生成引擎 (Canvas Procedural Fallback)
│   ├── simulation.js           # 克卜勒天體運動、地月月相與日心座標計算引擎
│   ├── scene.js                # Three.js 3D 場景、大氣著色器、銀河星盤與黑洞渲染
│   └── app.js                  # 互動主控制器、即時儀表板與天體資訊卡渲染
└── textures/                   # 原始 NASA / Solar System Scope 高解析貼圖
```

---

## 📜 天文數據來源 (Data Sources)
- NASA Planetary Fact Sheet
- NASA Scientific Visualization Studio (SVS)
- ESA Gaia Mission (Data Release 3 & 4)
- Event Horizon Telescope (EHT) Collaboration
- Solar System Scope Textures (CC BY 4.0)

---

## 📄 授權條款 (License)
MIT License.