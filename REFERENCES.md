# 📚 3D 太陽系、銀河系與黑洞天文模擬系統 — 參考資料與文獻庫 (Astrophysical References & Documentation)

本專案之天體物理常數、軌道動力學方程式、天體測量數據、廣義相對論黑洞光學模型與 3D 視覺著色模型，均嚴格參照各國航太總署（NASA、ESA）、國際天文學聯會（IAU）與頂尖天文學術文獻。

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

## 2. 🕳️ 已知黑洞、廣義相對論重力透鏡與噴流 (General Relativistic Black Holes)

### 🔥 1. 蓋亞 BH1 (Gaia BH1) — 目前已知距離太陽系最近的黑洞
- **發現任務**：歐洲太空總署 ESA Gaia 太空望遠鏡（Data Release 3, 2022）
- **關鍵論文**：
  - *El-Badry, K., et al. (2023). "A Sun-like star orbiting a black hole." Monthly Notices of the Royal Astronomical Society (MNRAS), 518(1), 1057–1085.*
- **天體測量參數**：
  - **距離**：\(1,560 \pm 10\text{ 光年}\)（\(478\text{ pc}\)）
  - **天區**：蛇夫座（Ophiuchus），\(\text{RA } 17^\text{h} 28^\text{m} 41^\text{s}, \text{Dec } -00^\circ 34' 51''\)
  - **黑洞質量**：\(9.62 \pm 0.18\ M_\odot\)
  - **史瓦西半徑**：\(r_s = \frac{2GM}{c^2} \approx 28.4\text{ km}\)
  - **伴星系統**：一顆質量為 \(0.93\ M_\odot\) 的 G 型黃矮星，互繞公轉週期為 \(185.59\text{ 天}\)。
  - **洛希瓣物質轉移**：伴星大氣受黑洞潮汐引力拉扯形成物質吸積流。

### 2. 蓋亞 BH3 (Gaia BH3) — 銀河系已知最大恆星級黑洞
- **發現任務**：ESA Gaia 太空望遠鏡（2024 年 4 月）
- **關鍵論文**：
  - *Gaia Collaboration, et al. (2024). "Discovery of a dormant 33 solar-mass black hole in pre-release Gaia astrometry." Astronomy & Astrophysics (A&A).*
- **天體測量參數**：
  - **距離**：\(1,926\text{ 光年}\)（\(590\text{ pc}\)）
  - **天區**：天鷹座（Aquila）
  - **黑洞質量**：\(32.7 \pm 0.8\ M_\odot\)
  - **史瓦西半徑**：\(r_s \approx 97.4\text{ km}\)

### 3. 人馬座 A* (Sagittarius A*) — 銀河系中心超大質量黑洞
- **關鍵論文**：
  - *The Event Horizon Telescope Collaboration (2022). "First Sagittarius A* Event Horizon Telescope Results." The Astrophysical Journal Letters, 930(2), L12.*
- **天體物理參數**：
  - **距離**：\(26,670 \pm 60\text{ 光年}\)（\(8,178\text{ pc}\)）
  - **質量**：\((4.154 \pm 0.014) \times 10^6\ M_\odot\)（約 415 萬倍太陽質量）
  - **史瓦西半徑**：\(r_s \approx 1.225 \times 10^7\text{ km}\)（約 \(0.082\text{ AU}\)）

### 4. 廣義相對論光學模型 (Kip Thorne Relativistic Optics)
- *James, O., Tunzelmann, E. von, Franklin, P., & Thorne, K. S. (2015). "Gravitational lensing by spinning black holes in astrophysics, and in the movie Interstellar." Classical and Quantum Gravity, 32(6), 065001.*
- **幾何效應**：
  - **光子球 (Photon Sphere)**：\(r_\text{ph} = 1.5 r_s\)
  - **最內側穩定圓軌道 (ISCO)**：\(r_\text{ISCO} = 3.0 r_s\)
  - **重力透鏡垂直光環 (Einstein Ring Halo)**：後方盤面光線受強重力場向上、向下雙向折射形成的雙曲面愛因斯坦光弧。
  - **相對論都卜勒增亮 (Doppler Beaming)**：迎面旋轉電漿朝向觀察者呈現強烈藍移與能量增益。

---

## 3. 🌌 銀河系宏觀結構物理模型 (Milky Way Galactic Structure)

- **文獻依據**：*Bland-Hawthorn, J., & Gerhard, O. (2016). ARA&A, 54, 529-596.*
- **銀河系參數**：
  - 直徑約 100,000 光年，薄盤厚約 1,000 光年。
  - 太陽系銀心距約 2.6 萬光年，以 220 km/s 公轉，銀河年約 2.3 億年。
  - 四大對數螺旋臂：英仙臂 (Perseus)、獵戶座次臂 (Orion)、人馬臂 (Sagittarius)、盾牌-半人馬臂 (Scutum-Centaurus)。

---

## 4. 🎨 視覺貼圖、著色器與圖庫來源 (Visual Textures & Shaders)

1. **NASA Scientific Visualization Studio (SVS)**:
   - [NASA Blue Marble & Black Marble (City Lights)](https://visibleearth.nasa.gov/collection/1484/blue-marble) — 地球 2K 全球日照、夜間城市燈火、高程法線與雲層。
   - [NASA CGI Moon Kit](https://svs.gsfc.nasa.gov/4720) — 月表凹凸貼圖。
2. **Solar System Scope (CC BY 4.0)**:
   - [Solar System Scope Textures](https://www.solarsystemscope.com/textures/) — 太陽、水星、金星、火星、木星、土星、天王星、海王星等角柱投影圖。
3. **GLSL 自定義物理著色器**:
   - 地球晝夜動態混合與夜面城市燈火著色器（GLSL Custom Day/Night & Specular Ocean Glint）。
   - 瑞利散射大氣薄層光暈著色器（Rayleigh Atmospheric Limb Shader）。
   - 太陽日珥耀斑環與黑洞雙曲面重力透鏡吸積盤。

---

## 📄 專案版權
- **開發者**：Grant Chiang ([@grantchiang1983](https://github.com/grantchiang1983))
- **開源許可證**：[MIT License](LICENSE)