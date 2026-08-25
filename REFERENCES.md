# 📚 3D 太陽系、銀河系與黑洞天文模擬系統 — 參考資料與文獻庫 (Astrophysical References & Documentation)

本專案之天體物理常數、軌道動力學方程式、天體測量數據與 3D 視覺著色模型，均嚴格參照各國航太總署（NASA、ESA）、國際天文學聯會（IAU）與頂尖天文學術文獻。

---

## 1. 🪐 太陽系天體物理常數與克卜勒軌道數據 (Solar System Fact Sheet)

- **數據來源**：[NASA Goddard Space Flight Center - Planetary Fact Sheet - Metric](https://nssdc.gsfc.nasa.gov/planetary/factsheet/)
- **太陽常數**：
  - 太陽半徑：\(R_\odot = 696,340\text{ km}\)
  - 太陽引力常數：\(GM_\odot = 1.32712440018 \times 10^{11}\text{ km}^3/\text{s}^2\)
  - 太陽質量：\(M_\odot = 1.9885 \times 10^{30}\text{ kg}\)（佔太陽系總質量 99.86%）
- **行星軌道與物理參數**：
  | 行星 | 半長軸 \(a\) (AU) | 離心率 \(e\) | 軌道傾角 \(i\) (°) | 公轉週期 (天) | 平均速度 (km/s) | 自轉軸傾角 (°) |
  | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
  | **水星 (Mercury)** | 0.3871 | 0.2056 | 7.00° | 87.97 | 47.36 | 0.03° |
  | **金星 (Venus)** | 0.7233 | 0.0068 | 3.39° | 224.70 | 35.02 | 177.36° (逆向) |
  | **地球 (Earth)** | 1.0000 | 0.0167 | 0.00° (基準) | 365.256 | 29.78 | 23.44° |
  | **火星 (Mars)** | 1.5237 | 0.0934 | 1.85° | 686.98 | 24.07 | 25.19° |
  | **木星 (Jupiter)** | 5.2044 | 0.0489 | 1.30° | 4332.59 | 13.07 | 3.13° |
  | **土星 (Saturn)** | 9.5826 | 0.0565 | 2.49° | 10759.22 | 9.68 | 26.73° |
  | **天王星 (Uranus)** | 19.2184 | 0.0463 | 0.77° | 30685.40 | 6.80 | 97.77° (橫躺) |
  | **海王星 (Neptune)** | 30.1104 | 0.0095 | 1.77° | 60189.00 | 5.43 | 28.32° |
  | **冥王星 (Pluto)** | 39.4820 | 0.2488 | 17.16° | 90560.00 | 4.74 | 122.53° |

---

## 2. 🕳️ 已知黑洞與天體測量學依據 (Black Hole Astrometry)

### 🔥 1. 蓋亞 BH1 (Gaia BH1) — 目前已知距離太陽系最近的黑洞
- **發現任務**：歐洲太空總署 ESA Gaia 太空望遠鏡（Data Release 3, 2022）
- **關鍵論文**：
  - *El-Badry, K., et al. (2023). "A Sun-like star orbiting a black hole." Monthly Notices of the Royal Astronomical Society (MNRAS), 518(1), 1057–1085.*
- **天體測量參數**：
  - **距離**：\(1,560 \pm 10\text{ 光年}\)（\(478\text{ pc}\)）
  - **天區**：蛇夫座（Ophiuchus），\(\text{RA } 17^\text{h} 28^\text{m} 41^\text{s}, \text{Dec } -00^\circ 34' 51''\)
  - **黑洞質量**：\(9.62 \pm 0.18\ M_\odot\)
  - **史瓦西半徑**：\(r_s = \frac{2GM}{c^2} \approx 28.4\text{ km}\)
  - **伴星系統**：一顆質量為 \(0.93\ M_\odot\) 的 G 型黃矮星（光譜型 G 型主序星，極其類似太陽），互繞公轉週期為 \(185.59\text{ 天}\)。

### 2. 蓋亞 BH3 (Gaia BH3) — 銀河系已知最大恆星級黑洞
- **發現任務**：ESA Gaia 太空望遠鏡（2024 年 4 月）
- **關鍵論文**：
  - *Gaia Collaboration, et al. (2024). "Discovery of a dormant 33 solar-mass black hole in pre-release Gaia astrometry." Astronomy & Astrophysics (A&A).*
- **天體測量參數**：
  - **距離**：\(1,926\text{ 光年}\)（\(590\text{ pc}\)）
  - **天區**：天鷹座（Aquila）
  - **黑洞質量**：\(32.7 \pm 0.8\ M_\odot\)（突破過去銀河系恆星黑洞 <20 M☉ 的認知上限）
  - **史瓦西半徑**：\(r_s \approx 97.4\text{ km}\)

### 3. 人馬座 A* (Sagittarius A*) — 銀河系中心超大質量黑洞
- **發現與觀測**：
  - 2020 年諾貝爾物理學獎（Reinhard Genzel & Andrea Ghez）
  - 2022 年事件視界望遠鏡（Event Horizon Telescope, EHT）全球甚長基線干涉陣列（VLBI）首次直接成像
- **關鍵論文**：
  - *The Event Horizon Telescope Collaboration (2022). "First Sagittarius A* Event Horizon Telescope Results." The Astrophysical Journal Letters, 930(2), L12.*
- **天體物理參數**：
  - **距離**：\(26,670 \pm 60\text{ 光年}\)（\(8,178\text{ pc}\)）
  - **質量**：\((4.154 \pm 0.014) \times 10^6\ M_\odot\)（約 415 萬倍太陽質量）
  - **史瓦西半徑**：\(r_s \approx 1.225 \times 10^7\text{ km}\)（約 \(0.082\text{ AU}\)，約 17.7 倍太陽半徑）

---

## 3. 🌌 銀河系宏觀結構物理模型 (Milky Way Galactic Structure)

- **文獻依據**：
  - *Bland-Hawthorn, J., & Gerhard, O. (2016). "The Galaxy in Context: Structural, Kinematic, and Integrated Properties." Annual Review of Astronomy and Astrophysics, 54, 529-596.*
- **銀河系幾何結構**：
  - **銀盤直徑**：約 \(100,000\text{ 光年}\)（\(30\text{ kpc}\)）
  - **銀盤厚度**：薄盤約 \(1,000\text{ 光年}\)；核球厚度約 \(10,000\text{ 光年}\)
  - **太陽系銀心距**：\(R_0 \approx 8.2\text{ kpc}\)（約 26,670 光年）
  - **太陽繞銀心速度**：\(v_\text{circ} \approx 220\text{ km/s}\)
  - **銀河年 (Galactic Year)**：約 \(2.3 \times 10^8\text{ 年}\)（2.3 億年）
  - **旋臂幾何**：四條主要對數螺旋臂（Logarithmic Spiral Arms: 英仙臂 Perseus、獵戶座次臂 Orion、人馬臂 Sagittarius、盾牌-半人馬臂 Scutum-Centaurus）。

---

## 4. 🧮 天文數學公式與物理演算法 (Mathematical & Physical Formulas)

### 1. 克卜勒軌道半徑方程 (Keplerian Orbit)
\[
r(\theta) = \frac{a (1 - e^2)}{1 + e \cos(\theta - \omega)}
\]
- \(a\)：半長軸 (Semi-major axis)
- \(e\)：軌道離心率 (Eccentricity)
- \(\theta\)：真近點角 (True Anomaly)
- \(\omega\)：近日點幅角 (Argument of Periapsis)

### 2. 活力公式 (Vis-viva Equation — 瞬時公轉速度)
\[
v = \sqrt{G M_\odot \left( \frac{2}{r} - \frac{1}{a} \right)}
\]
- 近日點速度：\(v_\text{peri} = \sqrt{\frac{G M_\odot}{a} \frac{1 + e}{1 - e}}\)
- 遠日點速度：\(v_\text{aph} = \sqrt{\frac{G M_\odot}{a} \frac{1 - e}{1 + e}}\)

### 3. 日心黃道座標與方位角 (Heliocentric Azimuth)
\[
\theta_\text{azimuth} = \text{atan2}(z, x) \pmod{360^\circ}
\]
以春分點方向為 \(0^\circ\)，逆時針（公轉方向）從 \(0^\circ\) 到 \(360^\circ\)。

### 4. 史瓦西半徑 (Schwarzschild Radius — 事件視界)
\[
r_s = \frac{2 G M}{c^2} \approx 2.95 \times \left( \frac{M}{M_\odot} \right) \text{ km}
\]

---

## 5. 🎨 視覺貼圖、著色器與圖庫來源 (Visual Textures & Shaders)

1. **NASA Scientific Visualization Studio (SVS)**:
   - [NASA Blue Marble: Next Generation](https://visibleearth.nasa.gov/collection/1484/blue-marble) — 地球 2K 全球地表紋理、地形法線與夜間燈光。
   - [NASA CGI Moon Kit](https://svs.gsfc.nasa.gov/4720) — 月球表面高精度凹凸貼圖與高程數據。
2. **Solar System Scope (CC BY 4.0)**:
   - [Solar System Scope Textures Library](https://www.solarsystemscope.com/textures/) — 太陽、水星、金星、火星、木星、土星及光環、天王星、海王星高解析等角柱投影圖（Equirectangular Maps）。
3. **自定義大氣瑞利散射著色器 (Rayleigh Scattering Shader)**:
   - 基於頂點法線與視線夾角點積 \(\text{pow}(0.65 - \mathbf{N} \cdot \mathbf{V}, 2.2)\)，透過 GLSL 實時計算天體大氣層邊緣散射光暈。

---

## 📄 專案版權與維護
- **開發者**：Grant Chiang ([@grantchiang1983](https://github.com/grantchiang1983))
- **開源許可證**：[MIT License](LICENSE)