/**
 * 太陽系物理模擬與軌道計算引擎 (Solar System Simulation Engine)
 * 包含克卜勒軌道計算、動態日心方位角、瞬時公轉速度、日距與時間步進
 */

class SolarSimulation {
  constructor() {
    this.simDays = 0;                     // 累積模擬天數
    this.startDate = new Date();           // 起始模擬日期
    this.speedMultiplier = 5.0;            // 預設速度: 1 秒 = 5 模擬天
    this.isPaused = false;                 // 暫停狀態
    this.scaleMode = 'visual';             // 'visual' (觀測比例) 或 'true' (真實比例)

    // 行星當前運算狀態表
    this.planetStates = new Map();
    this.initPlanetStates();

    // 彗星當前運算狀態表
    this.cometStates = new Map();
    this.initCometStates();
  }

  initCometStates() {
    if (typeof COMETS_DATA === 'undefined') return;
    COMETS_DATA.forEach((comet, idx) => {
      const initialPhase = idx === 0 ? 0.4 : 1.1; // 起始相位
      this.cometStates.set(comet.id, {
        id: comet.id,
        initialPhase: initialPhase,
        orbitAngle: initialPhase,
        azimuthDeg: (initialPhase * 180 / Math.PI) % 360,
        currentDistanceAU: comet.semiMajorAxisAU,
        currentDistanceKm: comet.semiMajorAxisAU * ASTRO_CONSTANTS.AU_IN_KM,
        currentSpeedKmS: 30.0,
        activityFactor: 1.0,
        x: 0,
        y: 0,
        z: 0
      });
    });
  }

  initPlanetStates() {
    PLANETS_DATA.forEach((planet, index) => {
      if (planet.id === 'sun') {
        this.planetStates.set(planet.id, {
          id: planet.id,
          azimuthDeg: 0,
          currentDistanceAU: 0,
          currentDistanceKm: 0,
          currentSpeedKmS: 0,
          rotationAngle: 0,
          orbitAngle: 0,
          x: 0,
          y: 0,
          z: 0
        });
        return;
      }

      // 為每個行星設定起始偏位角，使畫面分佈自然
      const initialPhase = (index * 42.5 * Math.PI) / 180;
      this.planetStates.set(planet.id, {
        id: planet.id,
        initialPhase: initialPhase,
        orbitAngle: initialPhase,
        azimuthDeg: (initialPhase * 180 / Math.PI) % 360,
        currentDistanceAU: planet.semiMajorAxisAU,
        currentDistanceKm: planet.distanceKm,
        currentSpeedKmS: planet.meanSpeedKmS,
        rotationAngle: 0,
        x: 0,
        y: 0,
        z: 0,
        // 月球專用狀態
        moonOrbitAngle: 0
      });
    });
  }

  /**
   * 更新時間步進 (由渲染迴圈每幀調用)
   * @param {number} deltaSeconds - 兩幀之間的時間間隔 (秒)
   */
  update(deltaSeconds) {
    if (this.isPaused) return;

    // 計算當前幀前進的模擬天數
    const daysStep = deltaSeconds * this.speedMultiplier;
    this.simDays += daysStep;

    // 更新各天體位置與數值
    PLANETS_DATA.forEach(planet => {
      if (planet.id === 'sun') {
        // 太陽自轉
        const state = this.planetStates.get('sun');
        const sunRotationPerDay = (2 * Math.PI) / (planet.rotationPeriodHours / 24);
        state.rotationAngle += sunRotationPerDay * daysStep;
        return;
      }

      const state = this.planetStates.get(planet.id);
      const a_AU = planet.semiMajorAxisAU;
      const e = planet.eccentricity;
      const periodDays = planet.orbitPeriodDays;

      // 平均角速度 (Mean angular motion n = 2π / T)
      const n = (2 * Math.PI) / periodDays;
      state.orbitAngle = (state.initialPhase + n * this.simDays) % (Math.PI * 2);
      if (state.orbitAngle < 0) state.orbitAngle += Math.PI * 2;

      // 日心方位角 (Heliocentric Azimuth Angle in Degrees: 0° - 360°)
      // 以 +X 軸 (春分點方向) 為 0°，逆時針 (Counter-Clockwise) 遞增
      let azimuth = (state.orbitAngle * 180 / Math.PI) % 360;
      if (azimuth < 0) azimuth += 360;
      state.azimuthDeg = azimuth;

      // 當前軌道日距 (克卜勒極坐標方程: r = a(1 - e²) / (1 + e * cos(θ)))
      const r_AU = (a_AU * (1 - e * e)) / (1 + e * Math.cos(state.orbitAngle));
      state.currentDistanceAU = r_AU;
      state.currentDistanceKm = r_AU * ASTRO_CONSTANTS.AU_IN_KM;

      // 當前瞬時公轉速度 (Vis-viva 活力公式: v = sqrt(GM * (2/r - 1/a)))
      // 換算精確的 km/s
      const r_km = state.currentDistanceKm;
      const a_km = a_AU * ASTRO_CONSTANTS.AU_IN_KM;
      const v_instant = Math.sqrt(ASTRO_CONSTANTS.GM_SUN * (2.0 / r_km - 1.0 / a_km));
      state.currentSpeedKmS = isNaN(v_instant) ? planet.meanSpeedKmS : v_instant;

      // 自轉角度更新
      if (planet.rotationPeriodDays) {
        const rotSpeedPerDay = (2 * Math.PI) / planet.rotationPeriodDays;
        state.rotationAngle += rotSpeedPerDay * daysStep;
      }

      // 3D 視覺座標計算
      let orbitRadius;
      if (this.scaleMode === 'visual') {
        const baseR = planet.visualOrbitRadius;
        orbitRadius = (baseR * (1 - e * e)) / (1 + e * Math.cos(state.orbitAngle));
      } else {
        // 真實比例模式 (適度放大以在 WebGL 中清晰可見)
        orbitRadius = r_AU * 12.0;
      }

      const incRad = ((planet.inclinationDeg || 0) * Math.PI) / 180;
      state.x = orbitRadius * Math.cos(state.orbitAngle);
      state.z = orbitRadius * Math.sin(state.orbitAngle);
      state.y = orbitRadius * Math.sin(state.orbitAngle) * Math.sin(incRad);

      // 地球月球專用公轉與月相計算
      if (planet.hasMoon) {
        const moonSpeed = (2 * Math.PI) / planet.moon.orbitPeriodDays;
        state.moonOrbitAngle = (this.simDays * moonSpeed) % (Math.PI * 2);
        if (state.moonOrbitAngle < 0) state.moonOrbitAngle += Math.PI * 2;

        let moonAzimuth = (state.moonOrbitAngle * 180 / Math.PI) % 360;
        if (moonAzimuth < 0) moonAzimuth += 360;
        state.moonAzimuthDeg = moonAzimuth;

        // 月相判斷 (根據月球相對於地日連線的角度)
        // 當月球處於地球與太陽之間為新月(朔)，當在地球背向太陽一側為滿月(望)
        const relAngle = ((state.moonOrbitAngle - state.orbitAngle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        const relDeg = relAngle * 180 / Math.PI;
        let phaseName = '新月 (朔)';
        if (relDeg >= 22.5 && relDeg < 67.5) phaseName = '娥眉月 (Waxing Crescent)';
        else if (relDeg >= 67.5 && relDeg < 112.5) phaseName = '上弦月 (First Quarter)';
        else if (relDeg >= 112.5 && relDeg < 157.5) phaseName = '盈凸月 (Waxing Gibbous)';
        else if (relDeg >= 157.5 && relDeg < 202.5) phaseName = '滿月 (望, Full Moon)';
        else if (relDeg >= 202.5 && relDeg < 247.5) phaseName = '虧凸月 (Waning Gibbous)';
        else if (relDeg >= 247.5 && relDeg < 292.5) phaseName = '下弦月 (Third Quarter)';
        else if (relDeg >= 292.5 && relDeg < 337.5) phaseName = '殘月 (Waning Crescent)';
        state.moonPhaseName = phaseName;
        state.moonDistanceKm = 384400 * (1 - 0.0549 * Math.cos(state.moonOrbitAngle)); // 離心率動態日距
        state.moonSpeedKmS = 1.022; // 月球公轉速度
      }
    });

    // 更新彗星軌道物理狀態 (克卜勒超大離心率軌道與近日點彗尾活性計算)
    if (typeof COMETS_DATA !== 'undefined' && this.cometStates) {
      COMETS_DATA.forEach(comet => {
        const cState = this.cometStates.get(comet.id);
        if (!cState) return;

        const a_AU = comet.semiMajorAxisAU;
        const e = comet.eccentricity;
        const periodDays = comet.orbitalPeriodYears * 365.25;

        // 平均角速度 n = 2π / T
        const n = (2 * Math.PI) / periodDays;
        const dir = comet.inclinationDeg > 90 ? -1 : 1; // 逆向軌道 (哈雷為逆行)
        cState.orbitAngle = (cState.initialPhase + dir * n * this.simDays) % (Math.PI * 2);
        if (cState.orbitAngle < 0) cState.orbitAngle += Math.PI * 2;

        let azimuth = (cState.orbitAngle * 180 / Math.PI) % 360;
        if (azimuth < 0) azimuth += 360;
        cState.azimuthDeg = azimuth;

        // 當前日心距 r_AU = a(1 - e²) / (1 + e * cos(θ))
        const r_AU = (a_AU * (1 - e * e)) / (1 + e * Math.cos(cState.orbitAngle));
        cState.currentDistanceAU = Math.max(r_AU, comet.perihelionAU);
        cState.currentDistanceKm = cState.currentDistanceAU * ASTRO_CONSTANTS.AU_IN_KM;

        // 瞬時公轉速度 (Vis-viva 活力公式: v = sqrt(GM * (2/r - 1/a)))
        const r_km = cState.currentDistanceKm;
        const a_km = a_AU * ASTRO_CONSTANTS.AU_IN_KM;
        const v_instant = Math.sqrt(Math.max(0, ASTRO_CONSTANTS.GM_SUN * (2.0 / r_km - 1.0 / a_km)));
        cState.currentSpeedKmS = isNaN(v_instant) ? 35.0 : v_instant;

        // 彗星噴氣與彗尾活性因子 (距離太陽越近，活性與彗尾長度呈 1/r^2 爆發式增強)
        cState.activityFactor = Math.min(Math.max(Math.pow(1.8 / Math.max(cState.currentDistanceAU, 0.4), 1.5), 0.1), 3.5);

        // 3D 視覺座標 (調用統一精確克卜勒軌道空間變換算法)
        const coords = SolarSimulation.getComet3DCoords(comet, cState.orbitAngle);
        cState.x = coords.x;
        cState.y = coords.y;
        cState.z = coords.z;
      });
    }
  }

  /**
   * 統一計算彗星在 3D 空間中的精確克卜勒軌道位置 (保證彗星與軌道虛線 100% 絕對重合)
   */
  static getComet3DCoords(comet, theta) {
    const visualA = comet.orbitVisualA;
    const effectiveE = Math.min(comet.eccentricity, 0.94); // 限制視覺離心率避免遠日點無限發散
    const r = (visualA * (1 - effectiveE * effectiveE)) / (1 + effectiveE * Math.cos(theta));

    const incRad = (comet.inclinationDeg * Math.PI) / 180;
    const nodeRad = (comet.ascendingNodeDeg * Math.PI) / 180;
    const argRad = ((comet.argumentOfPeriapsisDeg || 0) * Math.PI) / 180;

    // 軌道面極座標展開 (True Anomaly + Argument of Periapsis)
    const u = theta + argRad;
    const x_orb = r * Math.cos(u);
    const z_orb = r * Math.sin(u);

    // 升交點經度與軌道傾角之黃道座標系轉換
    const x = x_orb * Math.cos(nodeRad) - z_orb * Math.cos(incRad) * Math.sin(nodeRad);
    const z = x_orb * Math.sin(nodeRad) + z_orb * Math.cos(incRad) * Math.cos(nodeRad);
    const y = z_orb * Math.sin(incRad);

    return { x, y, z, r };
  }

  /**
   * 取得當前模擬日期物件
   */
  getCurrentDate() {
    const currentMs = this.startDate.getTime() + this.simDays * 86400000;
    return new Date(currentMs);
  }

  /**
   * 重設時間回今日
   */
  resetTime() {
    this.simDays = 0;
    this.startDate = new Date();
    this.initPlanetStates();
  }

  /**
   * 設定特定日期
   */
  setDate(targetDate) {
    const diffMs = targetDate.getTime() - this.startDate.getTime();
    this.simDays = diffMs / 86400000;
  }
}
