/**
 * 太陽系 3D 互動應用主程式 (App Controller)
 * 負責 UI 事件綁定、即時天文儀表板更新、時間流速控制與行星資訊卡片渲染
 */

class SolarApp {
  constructor() {
    this.simulation = new SolarSimulation();
    this.sceneContainer = document.getElementById('canvas-container');
    this.scene = new SolarScene(this.sceneContainer, this.simulation);

    // 狀態追蹤
    this.selectedPlanetId = 'earth';
    this.selectedBlackHoleId = null;
    this.lastTime = performance.now();
    this.soundEnabled = true;
    this.audioCtx = null;

    // 全域選取天體回呼
    window.onPlanetSelected = (planetId) => this.selectPlanet(planetId);
    window.onBlackHoleSelected = (bhId) => this.selectBlackHole(bhId);

    this.initUI();
    this.renderPlanetMatrix();
    this.selectPlanet('earth', false); // 預設選取地球
    this.startAnimationLoop();
  }

  initUI() {
    // 1. 時間控制器事件
    const btnPlayPause = document.getElementById('btn-play-pause');
    btnPlayPause.addEventListener('click', () => {
      this.simulation.isPaused = !this.simulation.isPaused;
      btnPlayPause.innerHTML = this.simulation.isPaused
        ? '<span class="icon">▶</span> 繼續模擬'
        : '<span class="icon">⏸</span> 暫停時間';
      btnPlayPause.classList.toggle('active', !this.simulation.isPaused);
      this.playBeep(440, 0.05);
    });

    const speedButtons = document.querySelectorAll('.speed-btn');
    speedButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        speedButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const speedVal = parseFloat(btn.dataset.speed);
        this.simulation.speedMultiplier = speedVal;
        this.playBeep(520, 0.04);
      });
    });

    const btnResetTime = document.getElementById('btn-reset-time');
    btnResetTime.addEventListener('click', () => {
      this.simulation.resetTime();
      this.playBeep(600, 0.05);
    });

    // 2. 視角控制器
    document.getElementById('btn-view-overview').addEventListener('click', () => {
      this.scene.resetFreeOrbitView();
      this.updateActiveViewButton('btn-view-overview');
      this.playBeep(480, 0.05);
    });

    const btnViewMilkyWay = document.getElementById('btn-view-milkyway');
    if (btnViewMilkyWay) {
      btnViewMilkyWay.addEventListener('click', () => {
        this.scene.setMilkyWayView();
        this.updateActiveViewButton('btn-view-milkyway');
        this.playBeep(680, 0.06);
      });
    }

    const btnViewBh1 = document.getElementById('btn-view-bh1');
    if (btnViewBh1) {
      btnViewBh1.addEventListener('click', () => {
        this.selectBlackHole('gaia_bh1');
        this.updateActiveViewButton('btn-view-bh1');
        this.playBeep(720, 0.06);
      });
    }

    const btnViewEarth = document.getElementById('btn-view-earth');
    if (btnViewEarth) {
      btnViewEarth.addEventListener('click', () => {
        this.selectPlanet('earth', false);
        this.scene.setEarthCenteredView();
        this.updateActiveViewButton('btn-view-earth');
        this.playBeep(620, 0.05);
      });
    }

    document.getElementById('btn-view-topdown').addEventListener('click', () => {
      this.scene.setTopDownView();
      this.updateActiveViewButton('btn-view-topdown');
      this.playBeep(560, 0.05);
    });

    document.getElementById('btn-view-focus').addEventListener('click', () => {
      if (this.selectedBlackHoleId) {
        this.scene.focusOnBlackHole(this.selectedBlackHoleId);
        this.updateActiveViewButton('btn-view-focus');
        this.playBeep(640, 0.05);
      } else if (this.selectedPlanetId) {
        this.scene.focusOnPlanet(this.selectedPlanetId);
        this.updateActiveViewButton('btn-view-focus');
        this.playBeep(640, 0.05);
      }
    });

    // 3. 圖層開關 Checkboxes
    const layerCheckboxes = document.querySelectorAll('.layer-toggle');
    layerCheckboxes.forEach(cb => {
      cb.addEventListener('change', (e) => {
        const layer = e.target.dataset.layer;
        this.scene.toggleLayer(layer, e.target.checked);
        this.playBeep(400, 0.03);
      });
    });

    // 4. 側邊欄切換
    const btnToggleMatrix = document.getElementById('btn-toggle-matrix');
    const panelMatrix = document.getElementById('panel-matrix');
    if (btnToggleMatrix && panelMatrix) {
      btnToggleMatrix.addEventListener('click', () => {
        panelMatrix.classList.toggle('collapsed');
      });
    }

    // 5. 快速天體選取列 (Chips)
    this.renderPlanetChips();
  }

  updateActiveViewButton(activeId) {
    ['btn-view-overview', 'btn-view-milkyway', 'btn-view-bh1', 'btn-view-earth', 'btn-view-topdown', 'btn-view-focus'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.toggle('active', id === activeId);
    });
  }

  renderPlanetChips() {
    const container = document.getElementById('planet-chips-container');
    if (!container) return;

    container.innerHTML = '';

    // 太陽系行星 Chips
    PLANETS_DATA.forEach(p => {
      const chip = document.createElement('button');
      chip.className = `planet-chip ${p.id === this.selectedPlanetId && !this.selectedBlackHoleId ? 'active' : ''}`;
      chip.id = `chip-${p.id}`;
      chip.innerHTML = `
        <span class="chip-color-dot" style="background-color: ${p.color}"></span>
        <span class="chip-name">${p.zhName}</span>
      `;
      chip.addEventListener('click', () => {
        this.selectPlanet(p.id, true);
        this.playBeep(580, 0.04);
      });
      container.appendChild(chip);
    });

    // 分隔線
    const sep = document.createElement('div');
    sep.className = 'chip-separator';
    container.appendChild(sep);

    // 已知黑洞 Chips
    BLACK_HOLES_DATA.forEach(bh => {
      const bhChip = document.createElement('button');
      bhChip.className = `planet-chip black-hole-chip ${bh.id === this.selectedBlackHoleId ? 'active' : ''}`;
      bhChip.id = `chip-${bh.id}`;
      bhChip.innerHTML = `
        <span class="chip-color-dot bh-dot" style="background-color: ${bh.glowColor}"></span>
        <span class="chip-name">${bh.isClosest ? '🔥 ' : ''}🕳️ ${bh.name}</span>
      `;
      bhChip.addEventListener('click', () => {
        this.selectBlackHole(bh.id, true);
        this.playBeep(700, 0.05);
      });
      container.appendChild(bhChip);
    });
  }

  /**
   * 選取黑洞並更新特寫鏡頭與黑洞專屬天體卡
   */
  selectBlackHole(bhId, autoFocus = true) {
    this.selectedBlackHoleId = bhId;
    this.selectedPlanetId = null;

    // 更新 Chips
    document.querySelectorAll('.planet-chip').forEach(chip => {
      chip.classList.toggle('active', chip.id === `chip-${bhId}`);
    });

    // 取消 Matrix 表格高亮
    document.querySelectorAll('.telemetry-row').forEach(row => {
      row.classList.remove('active-row');
    });

    if (autoFocus) {
      this.scene.focusOnBlackHole(bhId);
      this.updateActiveViewButton('btn-view-focus');
    }

    this.renderBlackHoleDetailCard(bhId);
  }

  /**
   * 選取行星並更新資訊卡與相機
   */
  selectPlanet(planetId, autoFocus = true) {
    this.selectedPlanetId = planetId;
    this.selectedBlackHoleId = null;

    // 更新 Chips 選取狀態
    document.querySelectorAll('.planet-chip').forEach(chip => {
      chip.classList.toggle('active', chip.id === `chip-${planetId}`);
    });

    // 更新 Matrix 表格高亮
    document.querySelectorAll('.telemetry-row').forEach(row => {
      row.classList.toggle('active-row', row.dataset.id === planetId);
    });

    if (autoFocus) {
      this.scene.focusOnPlanet(planetId);
      this.updateActiveViewButton('btn-view-focus');
    }

    this.renderPlanetDetailCard(planetId);
  }

  /**
   * 渲染黑洞專屬天體物理卡
   */
  renderBlackHoleDetailCard(bhId) {
    const data = BLACK_HOLES_DATA.find(b => b.id === bhId);
    const card = document.getElementById('planet-detail-card');
    if (!data || !card) return;

    card.innerHTML = `
      <div class="card-header black-hole-header" style="border-left-color: ${data.glowColor}">
        <div class="card-title-group">
          <h2 class="planet-title">${data.zhName} <span class="planet-en-name">${data.name}</span></h2>
          <span class="planet-badge black-hole-badge">${data.isClosest ? '🔥 最近黑洞' : (data.type === 'supermassive_black_hole' ? '銀心超大黑洞' : '恆星黑洞')}</span>
        </div>
        <button class="btn-focus-direct bh-focus-btn" onclick="app.scene.focusOnBlackHole('${data.id}')" title="特寫鏡頭">🔍 鎖定黑洞</button>
      </div>

      <!-- 黑洞核心天文數據 -->
      <div class="telemetry-grid">
        <div class="metric-box highlight-bh-box">
          <div class="metric-label">距離太陽系 (Distance)</div>
          <div class="metric-value" style="color: ${data.glowColor}">${data.distanceLy.toLocaleString()} 光年</div>
          <div class="metric-sub">${data.distancePc} 秒差距 (pc)</div>
        </div>

        <div class="metric-box highlight-bh-box">
          <div class="metric-label">黑洞質量 (Mass)</div>
          <div class="metric-value" style="color: ${data.glowColor}">${data.massSolar.toLocaleString()} M☉</div>
          <div class="metric-sub">太陽質量倍數</div>
        </div>

        <div class="metric-box">
          <div class="metric-label">史瓦西半徑 (Event Horizon)</div>
          <div class="metric-value">${data.schwarzschildRadiusKm < 1000 ? `${data.schwarzschildRadiusKm} km` : `${(data.schwarzschildRadiusKm / 1e6).toFixed(2)} 百萬 km`}</div>
          <div class="metric-sub">事件視界邊界 rs = 2GM/c²</div>
        </div>

        <div class="metric-box">
          <div class="metric-label">所屬天區星座</div>
          <div class="metric-value">${data.constellation}</div>
          <div class="metric-sub">相對方位: ${data.relativeDirectionDeg}°</div>
        </div>
      </div>

      <!-- 黑洞物理規格表 -->
      <div class="specs-section">
        <h4 class="section-title">黑洞天體物理規格</h4>
        <table class="specs-table">
          <tr><td>黑洞分類</td><td>${data.type === 'supermassive_black_hole' ? '超大質量黑洞 (Supermassive Black Hole)' : '恆星級雙星黑洞 (Stellar-mass Black Hole)'}</td></tr>
          <tr><td>伴星系統</td><td>${data.companionStar || '無（獨立中心孤立黑洞）'}</td></tr>
          ${data.orbitalPeriodDays > 0 ? `<tr><td>雙星互繞週期</td><td>${data.orbitalPeriodDays} 天</td></tr>` : ''}
          <tr><td>發現紀錄</td><td>${data.discoveryYear}</td></tr>
          <tr><td>探測技術</td><td>${data.isClosest ? 'ESA Gaia 天體測量微引力擺動法 (Astrometry)' : '事件視界望遠鏡毫米波甚長基線干涉 (VLBI)'}</td></tr>
        </table>
      </div>

      <!-- 科普解說 -->
      <div class="description-section">
        <h4 class="section-title">天體簡介</h4>
        <p class="desc-text">${data.description}</p>
        <div class="fun-fact-box black-hole-fact">
          <span class="fun-fact-icon">💡</span>
          <span class="fun-fact-text"><strong>天文焦點：</strong>${data.funFact}</span>
        </div>
      </div>
    `;
  }

  /**
   * 渲染天體詳細資訊卡
   */
  renderPlanetDetailCard(planetId) {
    const data = PLANETS_DATA.find(p => p.id === planetId);
    const card = document.getElementById('planet-detail-card');
    if (!data || !card) return;

    const isSun = data.id === 'sun';
    const state = this.simulation.planetStates.get(planetId);

    const azimuthText = isSun ? '— (中心基準)' : `${(state?.azimuthDeg || 0).toFixed(1)}°`;
    const speedText = isSun ? '— (中心基準)' : `${(state?.currentSpeedKmS || data.meanSpeedKmS).toFixed(2)} km/s`;
    const distanceAUText = isSun ? '0 AU' : `${(state?.currentDistanceAU || data.semiMajorAxisAU).toFixed(3)} AU`;
    const distanceKmText = isSun ? '0 km' : `${((state?.currentDistanceKm || data.distanceKm) / 1e6).toFixed(2)} 百萬 km`;

    card.innerHTML = `
      <div class="card-header" style="border-left-color: ${data.color}">
        <div class="card-title-group">
          <h2 class="planet-title">${data.zhName} <span class="planet-en-name">${data.name}</span></h2>
          <span class="planet-badge ${data.type}">${data.type === 'star' ? '恆星' : (data.type === 'dwarf' ? '矮行星' : '行星')}</span>
        </div>
        <button class="btn-focus-direct" onclick="app.scene.focusOnPlanet('${data.id}')" title="特寫鏡頭">🔍 鎖定聚焦</button>
      </div>

      <!-- 即時物理與方位數據 -->
      <div class="telemetry-grid">
        <div class="metric-box highlight">
          <div class="metric-label">即時日心方位角 (Azimuth)</div>
          <div class="metric-value" id="card-azimuth">${azimuthText}</div>
          <div class="metric-sub">相對春分點角度 (0° ~ 360°)</div>
        </div>

        <div class="metric-box highlight">
          <div class="metric-label">即時公轉速度 (Velocity)</div>
          <div class="metric-value" id="card-speed">${speedText}</div>
          <div class="metric-sub">平均速度: ${data.meanSpeedKmS || 0} km/s</div>
        </div>

        <div class="metric-box">
          <div class="metric-label">相對太陽距離 (Distance)</div>
          <div class="metric-value" id="card-dist-au">${distanceAUText}</div>
          <div class="metric-sub" id="card-dist-km">${distanceKmText}</div>
        </div>

        <div class="metric-box">
          <div class="metric-label">公轉週期 (Orbit Period)</div>
          <div class="metric-value">${isSun ? '—' : `${data.orbitPeriodDays} 天`}</div>
          <div class="metric-sub">${isSun ? '—' : `約 ${(data.orbitPeriodDays / 365.25).toFixed(2)} 地球年`}</div>
        </div>
      </div>

      <!-- 天文物理規格表 -->
      <div class="specs-section">
        <h4 class="section-title">物理屬性規格</h4>
        <table class="specs-table">
          <tr><td>赤道半徑</td><td>${data.radiusKm.toLocaleString()} km</td></tr>
          <tr><td>表面重力</td><td>${data.gravity}</td></tr>
          <tr><td>表面溫度</td><td>${data.temperature}</td></tr>
          <tr><td>自轉週期</td><td>${data.rotationPeriodHours ? `${data.rotationPeriodHours} 小時` : `${data.rotationPeriodDays} 天`}</td></tr>
          <tr><td>自轉軸傾角</td><td>${data.axialTiltDeg}°</td></tr>
          ${!isSun ? `<tr><td>軌道離心率 (e)</td><td>${data.eccentricity}</td></tr>` : ''}
          ${!isSun ? `<tr><td>軌道傾角 (i)</td><td>${data.inclinationDeg}°</td></tr>` : ''}
          <tr><td>大氣組成</td><td>${data.atmosphere}</td></tr>
        </table>
      </div>

      ${data.id === 'earth' ? `
        <!-- 地月系統專屬即時遙測 -->
        <div class="moon-system-card">
          <div class="moon-header">
            <span class="moon-icon">🌕</span>
            <span class="moon-title">地月系統即時遙測 (Moon Telemetry)</span>
          </div>
          <div class="moon-grid">
            <div class="moon-stat">
              <span class="m-lbl">當前月相</span>
              <span class="m-val" id="card-moon-phase">${state?.moonPhaseName || '盈凸月'}</span>
            </div>
            <div class="moon-stat">
              <span class="m-lbl">繞地方位角</span>
              <span class="m-val" id="card-moon-azimuth">${(state?.moonAzimuthDeg || 0).toFixed(1)}°</span>
            </div>
            <div class="moon-stat">
              <span class="m-lbl">地月距離</span>
              <span class="m-val" id="card-moon-dist">${Math.round(state?.moonDistanceKm || 384400).toLocaleString()} km</span>
            </div>
            <div class="moon-stat">
              <span class="m-lbl">月球公轉速率</span>
              <span class="m-val" id="card-moon-speed">1.02 km/s</span>
            </div>
          </div>
          <button class="btn-earth-view-mode" onclick="app.scene.setEarthCenteredView(); app.updateActiveViewButton('btn-view-earth');">
            🌍 進入以地球為主體視角
          </button>
        </div>
      ` : ''}

      <!-- 天文簡介與趣味冷知識 -->
      <div class="info-section">
        <p class="planet-desc">${data.description}</p>
        <div class="fun-fact-box">
          <span class="fact-icon">💡</span>
          <span class="fact-text">${data.funFact}</span>
        </div>
      </div>
    `;
  }

  /**
   * 渲染左側/側邊即時天體遙測矩陣 (Data Matrix)
   */
  renderPlanetMatrix() {
    const tbody = document.getElementById('telemetry-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    PLANETS_DATA.forEach(p => {
      const isSun = p.id === 'sun';
      const tr = document.createElement('tr');
      tr.className = `telemetry-row ${p.id === this.selectedPlanetId ? 'active-row' : ''}`;
      tr.dataset.id = p.id;
      tr.innerHTML = `
        <td class="col-planet">
          <span class="row-dot" style="background-color: ${p.color}"></span>
          <span class="row-name">${p.zhName}</span>
        </td>
        <td class="col-azimuth" id="matrix-azimuth-${p.id}">${isSun ? '—' : '0.0°'}</td>
        <td class="col-speed" id="matrix-speed-${p.id}">${isSun ? '—' : `${p.meanSpeedKmS} km/s`}</td>
        <td class="col-dist" id="matrix-dist-${p.id}">${isSun ? '0 AU' : `${p.semiMajorAxisAU} AU`}</td>
      `;
      tr.addEventListener('click', () => {
        this.selectPlanet(p.id, true);
        this.playBeep(520, 0.03);
      });
      tbody.appendChild(tr);
    });
  }

  /**
   * 即時更新畫面數據 (每幀刷新)
   */
  updateTelemetryUI() {
    const states = this.simulation.planetStates;

    // 1. 更新頂部時間儀表
    const currentDate = this.simulation.getCurrentDate();
    const dateStr = currentDate.toISOString().split('T')[0];
    const timeDisplay = document.getElementById('current-date-display');
    if (timeDisplay) {
      timeDisplay.textContent = dateStr;
    }

    const simDaysDisplay = document.getElementById('sim-days-display');
    if (simDaysDisplay) {
      simDaysDisplay.textContent = `+${Math.floor(this.simulation.simDays)} 天`;
    }

    // 2. 更新 Matrix 表格數值
    PLANETS_DATA.forEach(p => {
      if (p.id === 'sun') return;
      const state = states.get(p.id);
      if (!state) return;

      const azEl = document.getElementById(`matrix-azimuth-${p.id}`);
      if (azEl) {
        azEl.textContent = `${state.azimuthDeg.toFixed(1)}°`;
      }

      const spEl = document.getElementById(`matrix-speed-${p.id}`);
      if (spEl) {
        spEl.textContent = `${state.currentSpeedKmS.toFixed(1)} km/s`;
      }

      const distEl = document.getElementById(`matrix-dist-${p.id}`);
      if (distEl) {
        distEl.textContent = `${state.currentDistanceAU.toFixed(2)} AU`;
      }
    });

    // 3. 更新當前選定星球卡片數值
    if (this.selectedPlanetId && this.selectedPlanetId !== 'sun') {
      const state = states.get(this.selectedPlanetId);
      if (state) {
        const cardAz = document.getElementById('card-azimuth');
        if (cardAz) cardAz.textContent = `${state.azimuthDeg.toFixed(2)}°`;

        const cardSp = document.getElementById('card-speed');
        if (cardSp) cardSp.textContent = `${state.currentSpeedKmS.toFixed(2)} km/s`;

        const cardDistAU = document.getElementById('card-dist-au');
        if (cardDistAU) cardDistAU.textContent = `${state.currentDistanceAU.toFixed(3)} AU`;

        const cardDistKm = document.getElementById('card-dist-km');
        if (cardDistKm) cardDistKm.textContent = `${(state.currentDistanceKm / 1e6).toFixed(2)} 百萬 km`;

        // 地月系統專屬即時刷新
        if (this.selectedPlanetId === 'earth') {
          const mPhase = document.getElementById('card-moon-phase');
          if (mPhase && state.moonPhaseName) mPhase.textContent = state.moonPhaseName;

          const mAz = document.getElementById('card-moon-azimuth');
          if (mAz && state.moonAzimuthDeg !== undefined) mAz.textContent = `${state.moonAzimuthDeg.toFixed(1)}°`;

          const mDist = document.getElementById('card-moon-dist');
          if (mDist && state.moonDistanceKm) mDist.textContent = `${Math.round(state.moonDistanceKm).toLocaleString()} km`;
        }
      }
    }
  }

  /**
   * 輕量音效產生器 (Web Audio API)
   */
  playBeep(freq = 440, duration = 0.05) {
    if (!this.soundEnabled) return;
    try {
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      // Audio context policy fallback
    }
  }

  /**
   * 主渲染迴圈
   */
  startAnimationLoop() {
    const loop = (time) => {
      const delta = (time - this.lastTime) / 1000;
      this.lastTime = time;

      // 限制最大 delta 防止切換標籤頁面時跳躍
      const clampedDelta = Math.min(delta, 0.1);

      // 物理步進
      this.simulation.update(clampedDelta);

      // 3D 場景渲染
      this.scene.render();

      // UI 數據刷新
      this.updateTelemetryUI();

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }
}

// 應用啟動進入點
window.addEventListener('DOMContentLoaded', () => {
  window.app = new SolarApp();
});
