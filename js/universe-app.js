/**
 * 🌐 全宇宙 / 可觀測宇宙 3D 極致探索平台 (Observable Universe 3D Engine)
 * 物理真實深空色調重構 (True-Color Deep Space Astrophotography)：
 *   - 徹底杜絕人造霓虹藍光與刺眼假色
 *   - 宇宙深空背景採用極致純黑 (#000000 / #020204)
 *   - 100,000+ 星系團採用真實恆星黑體輻射光譜 (自然白光 6000K、溫潤金黃 4500K、柔和暖琥珀 3500K)
 *   - 普朗克 CMB 餘暉微弱深空色調對應
 *   - 拉尼亞凱亞重力流線採用典雅香檳星光絲線
 */

class UniverseApp {
  constructor() {
    this.container = document.getElementById('universe-canvas-container');
    this.cameraLerpTarget = null;
    this.controlsTargetLerp = null;
    this.activeItem = null;
    this.isPaused = false;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.layers = {
      cmb: false,            // 預設關閉人造假色 CMB，呈現純淨真實深空
      cosmicWeb: true,
      laniakeaFlow: true,
      superclusters: true,
      localGroup: true,
      extremes: true,
      grid: true,
      labels: true
    };

    this.initScene();
    this.initLighting();
    this.buildCMBSphere();
    this.buildCosmicWeb();
    this.buildLaniakeaFlow();
    this.buildLocalGroup();
    this.buildCosmicExtremes();
    this.buildCosmicScaleGrid();
    this.buildInteractiveLandmarks();
    this.initUIEventListeners();
    this.animate();
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x010204); // 極致深空純黑

    const w = this.container.clientWidth;
    const h = this.container.clientHeight;

    this.camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 200000);
    this.camera.position.set(0, 1800, 3200);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.container.appendChild(this.renderer.domElement);

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 5;
    this.controls.maxDistance = 50000;
    this.controls.target.set(0, 0, 0);

    window.addEventListener('resize', () => this.onResize());
    this.renderer.domElement.addEventListener('pointerdown', (e) => this.onPointerDown(e));
  }

  initLighting() {
    // 自然中性白光，杜絕人造藍色點光源
    const amb = new THREE.AmbientLight(0xffffff, 0.85);
    this.scene.add(amb);

    const centerLight = new THREE.PointLight(0xfffaed, 1.8, 6000, 1.2);
    centerLight.position.set(0, 0, 0);
    this.scene.add(centerLight);
  }

  // 1. 宇宙微波背景輻射 (CMB) — 自然柔和深空微波映射 (預設可選疊加)
  buildCMBSphere() {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#020204';
    ctx.fillRect(0, 0, 2048, 1024);

    // 柔和低飽和度溫度微小漲落
    const cmbColors = ['#1e293b', '#334155', '#475569', '#78716c', '#b45309', '#991b1b'];
    for (let i = 0; i < 3500; i++) {
      const cx = Math.random() * 2048;
      const cy = Math.random() * 1024;
      const r = Math.random() * 40 + 10;
      const col = cmbColors[Math.floor(Math.random() * cmbColors.length)];

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, col);
      grad.addColorStop(0.6, 'rgba(15, 23, 42, 0.15)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }

    const cmbTex = new THREE.CanvasTexture(canvas);
    const cmbGeo = new THREE.SphereGeometry(16000, 64, 64);
    this.cmbMat = new THREE.MeshBasicMaterial({
      map: cmbTex,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.35,
      depthWrite: false
    });
    this.cmbSphere = new THREE.Mesh(cmbGeo, this.cmbMat);
    this.cmbSphere.visible = this.layers.cmb;
    this.scene.add(this.cmbSphere);
  }

  // 2. 宇宙大尺度纖維網 (Cosmic Web - 80,000 真實恆星光譜星系粒子)
  buildCosmicWeb() {
    this.cosmicWebGroup = new THREE.Group();
    const particleCount = 80000;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const size = new Float32Array(particleCount);

    const starTex = TextureGenerator.createStarSpriteTexture();

    // 真實恆星與星系光譜色彩表 (黑體輻射：純白、溫潤金黃、象牙白、琥珀橙)
    const starlightPalette = [
      [1.00, 1.00, 1.00], // 10000K 鑽石白
      [0.98, 0.95, 0.88], // 6500K 太陽型自然白
      [1.00, 0.90, 0.72], // 5000K 溫潤金黃
      [0.95, 0.80, 0.60], // 4000K 老年恆星群
      [0.90, 0.65, 0.45]  // 3200K 紅巨星群
    ];

    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const radius = Math.pow(u, 0.75) * 6500;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      // 絲狀流結構 (Filaments) 與巨洞 (Voids)
      const f1 = Math.sin(theta * 4 + phi * 3) * 0.4;
      const f2 = Math.cos(theta * 7 - phi * 5) * 0.25;
      const filamentDensity = Math.abs(f1 + f2);

      const rMod = radius * (1.0 + f1 * 0.3);
      const x = rMod * Math.sin(phi) * Math.cos(theta);
      const y = rMod * Math.cos(phi) * 0.65;
      const z = rMod * Math.sin(phi) * Math.sin(theta);

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      // 自然星光物理色彩
      let colorSample;
      if (filamentDensity > 0.45) {
        colorSample = starlightPalette[Math.floor(Math.random() * 2)]; // 緻密節點：純白/亮白
        size[i] = Math.random() * 2.8 + 1.8;
      } else if (filamentDensity > 0.22) {
        colorSample = starlightPalette[Math.floor(Math.random() * 3 + 1)]; // 纖維壁：溫金/象牙
        size[i] = Math.random() * 2.0 + 1.0;
      } else {
        colorSample = starlightPalette[4]; // 稀疏邊界：暗琥珀
        size[i] = Math.random() * 1.5 + 0.6;
      }

      col[i * 3] = colorSample[0];
      col[i * 3 + 1] = colorSample[1];
      col[i * 3 + 2] = colorSample[2];
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(size, 1));

    this.webShaderMat = new THREE.ShaderMaterial({
      uniforms: { starTexture: { value: starTex } },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (180.0 / -mvPosition.z);
          gl_PointSize = clamp(gl_PointSize, 1.0, 5.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D starTexture;
        varying vec3 vColor;
        void main() {
          vec4 texColor = texture2D(starTexture, gl_PointCoord);
          gl_FragColor = vec4(vColor * 0.85, 0.55) * texColor;
          if (gl_FragColor.a < 0.01) discard;
        }
      `,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      vertexColors: true
    });

    this.webPoints = new THREE.Points(geo, this.webShaderMat);
    this.cosmicWebGroup.add(this.webPoints);
    this.scene.add(this.cosmicWebGroup);
  }

  // 3. 拉尼亞凱亞重力流線 (Laniakea Flow - 典雅香檳金星光絲線)
  buildLaniakeaFlow() {
    this.laniakeaGroup = new THREE.Group();
    const streamlineCount = 120;
    const gaPos = new THREE.Vector3(120, -45, 180);

    const lineMat = new THREE.LineBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending
    });

    for (let s = 0; s < streamlineCount; s++) {
      const u = Math.random();
      const r = Math.pow(u, 0.7) * 450 + 60;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const startPt = new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi) * 0.4,
        r * Math.sin(phi) * Math.sin(theta)
      );

      const midPt = startPt.clone().lerp(gaPos, 0.5).add(new THREE.Vector3(
        (Math.random() - 0.5) * 45,
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 45
      ));

      const curve = new THREE.QuadraticBezierCurve3(startPt, midPt, gaPos);
      const pts = curve.getPoints(32);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const line = new THREE.Line(lineGeo, lineMat);
      this.laniakeaGroup.add(line);
    }

    // 巨引源核心引力樞紐 (柔和琥珀光核)
    const gaCoreGeo = new THREE.SphereGeometry(18, 32, 32);
    const gaCoreMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const gaCore = new THREE.Mesh(gaCoreGeo, gaCoreMat);
    gaCore.position.copy(gaPos);
    this.laniakeaGroup.add(gaCore);

    this.scene.add(this.laniakeaGroup);
  }

  // 4. 本地星系群 3D 星系模型 (真實自然色調)
  buildLocalGroup() {
    this.localGroupObjects = new THREE.Group();

    // 銀河系 (Milky Way at 0, 0, 0)
    const mwGeo = new THREE.PlaneGeometry(12, 12);
    const mwMat = new THREE.MeshBasicMaterial({
      map: TextureGenerator.createMilkyWayDiskTexture(1024),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95,
      depthWrite: false
    });
    const mw = new THREE.Mesh(mwGeo, mwMat);
    mw.rotation.x = -Math.PI / 2.2;
    this.localGroupObjects.add(mw);

    // 仙女座星系 (Andromeda M31 at x: -12, y: -8, z: 22 - 自然金白/溫潤螺旋)
    const m31Geo = new THREE.PlaneGeometry(24, 24);
    const m31Mat = new THREE.MeshBasicMaterial({
      map: TextureGenerator.createMilkyWayDiskTexture(1024),
      color: 0xfffbeb,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.92,
      depthWrite: false
    });
    const m31 = new THREE.Mesh(m31Geo, m31Mat);
    m31.position.set(-12, -8, 22);
    m31.rotation.x = -Math.PI / 2.6;
    m31.rotation.z = Math.PI / 5;
    this.localGroupObjects.add(m31);

    // 三角座星系 (M33 at x: -18, y: -12, z: 20)
    const m33Geo = new THREE.PlaneGeometry(7, 7);
    const m33Mat = new THREE.MeshBasicMaterial({
      map: TextureGenerator.createMilkyWayDiskTexture(512),
      color: 0xfef3c7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.88,
      depthWrite: false
    });
    const m33 = new THREE.Mesh(m33Geo, m33Mat);
    m33.position.set(-18, -12, 20);
    m33.rotation.x = -Math.PI / 2.1;
    this.localGroupObjects.add(m33);

    this.scene.add(this.localGroupObjects);
  }

  // 5. 宇宙極端天體 (TON 618 類星體 - 極致耀眼金白高能核心)
  buildCosmicExtremes() {
    this.extremesGroup = new THREE.Group();

    const tonPos = new THREE.Vector3(1200, 1500, -800);
    const tonDiskGeo = new THREE.RingGeometry(8, 65, 48);
    const tonDiskMat = new THREE.MeshBasicMaterial({
      map: TextureGenerator.createAccretionDiskTexture('#f59e0b', '#ffffff', '#dc2626', 1024),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const tonDisk = new THREE.Mesh(tonDiskGeo, tonDiskMat);
    tonDisk.position.copy(tonPos);
    tonDisk.rotation.x = Math.PI / 3;
    this.extremesGroup.add(tonDisk);

    // TON 618 極向噴流
    const jetGeo = new THREE.CylinderGeometry(1.5, 18, 320, 16, 1, true);
    const jetMat = new THREE.MeshBasicMaterial({
      map: TextureGenerator.createRelativisticJetTexture('#fef08a'),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.70,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const tonJetN = new THREE.Mesh(jetGeo, jetMat);
    tonJetN.position.set(tonPos.x, tonPos.y + 160, tonPos.z);
    this.extremesGroup.add(tonJetN);

    const tonJetS = new THREE.Mesh(jetGeo, jetMat);
    tonJetS.position.set(tonPos.x, tonPos.y - 160, tonPos.z);
    tonJetS.rotation.x = Math.PI;
    this.extremesGroup.add(tonJetS);

    this.scene.add(this.extremesGroup);
  }

  // 6. 宇宙距離標尺網格 (鈦灰/極細深空刻度，絕不喧賓奪主)
  buildCosmicScaleGrid() {
    this.gridGroup = new THREE.Group();
    const scales = [
      { r: 100,  label: "1 億光年 (100 Mly)" },
      { r: 500,  label: "5 億光年 (500 Mly)" },
      { r: 2000, label: "20 億光年 (2 Gly)" },
      { r: 6000, label: "60 億光年 (6 Gly)" },
      { r: 12000,label: "120 億光年 (12 Gly)" }
    ];

    scales.forEach(s => {
      const ringGeo = new THREE.RingGeometry(s.r - 1.2, s.r + 1.2, 96);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x64748b,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.14,
        depthWrite: false
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      this.gridGroup.add(ring);
    });

    this.scene.add(this.gridGroup);
  }

  // 7. 互動地標標記 (簡約典雅星光標記)
  buildInteractiveLandmarks() {
    this.landmarkMarkers = [];
    this.markerGroup = new THREE.Group();

    const allItems = [
      ...UNIVERSE_DATA.superclusters,
      ...UNIVERSE_DATA.localGroup,
      ...UNIVERSE_DATA.cosmicExtremes
    ];

    allItems.forEach(item => {
      const marker = new THREE.Group();
      marker.position.set(item.coords.x, item.coords.y, item.coords.z);

      // 典雅星光光環
      const ringGeo = new THREE.RingGeometry(5, 6.5, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xfef3c7,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      marker.add(ring);

      // 懸浮文字標籤
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 76;
      const ctx = canvas.getContext('2d');
      ctx.font = 'bold 22px "Inter", "Segoe UI", sans-serif';
      ctx.fillStyle = '#fef3c7';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.95)';
      ctx.shadowBlur = 6;
      ctx.fillText(item.name, 200, 44);

      const labelTex = new THREE.CanvasTexture(canvas);
      const labelSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: labelTex, transparent: true, depthTest: false }));
      labelSprite.scale.set(60, 11.4, 1);
      labelSprite.position.set(0, 14, 0);
      marker.add(labelSprite);

      const hitGeo = new THREE.SphereGeometry(14, 16, 16);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hit = new THREE.Mesh(hitGeo, hitMat);
      hit.userData = { landmark: item };
      marker.add(hit);

      this.landmarkMarkers.push(hit);
      this.markerGroup.add(marker);
    });

    this.scene.add(this.markerGroup);
  }

  flyTo(item) {
    this.activeItem = item;
    this.controlsTargetLerp = new THREE.Vector3(item.coords.x, item.coords.y, item.coords.z);

    const dist = item.category === 'supercluster' ? 260 : (item.id === 'milky_way' ? 25 : (item.category === 'quasar' ? 180 : 80));
    this.cameraLerpTarget = new THREE.Vector3(item.coords.x, item.coords.y + dist * 0.7, item.coords.z + dist);

    this.showInspector(item);
  }

  showInspector(item) {
    const modal = document.getElementById('universe-inspector');
    if (!modal) return;

    modal.classList.remove('hidden');
    document.getElementById('univ-title').innerHTML = `${item.icon || '🌐'} ${item.name}`;
    document.getElementById('univ-type').innerText = item.type || item.category || '宇宙結構';
    document.getElementById('univ-span').innerText = item.spanLy || item.diameterLy || item.distanceSunLy || '跨越數億光年';
    document.getElementById('univ-desc').innerText = item.description;
  }

  resetView() {
    this.controlsTargetLerp = new THREE.Vector3(0, 0, 0);
    this.cameraLerpTarget = new THREE.Vector3(0, 1800, 3200);
    this.activeItem = null;
    document.getElementById('universe-inspector').classList.add('hidden');
  }

  onPointerDown(e) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.landmarkMarkers, true);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      if (hit.userData && hit.userData.landmark) {
        this.flyTo(hit.userData.landmark);
      }
    }
  }

  onResize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  initUIEventListeners() {
    document.querySelectorAll('.univ-tour-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        if (id === 'reset') this.resetView();
        else {
          const allItems = [
            ...UNIVERSE_DATA.superclusters,
            ...UNIVERSE_DATA.localGroup,
            ...UNIVERSE_DATA.cosmicExtremes
          ];
          const found = allItems.find(it => it.id === id);
          if (found) this.flyTo(found);
        }
      });
    });

    document.querySelectorAll('.univ-layer-cb').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const layer = e.target.dataset.layer;
        const val = e.target.checked;
        this.layers[layer] = val;

        if (layer === 'cmb' && this.cmbSphere) this.cmbSphere.visible = val;
        if (layer === 'cosmicWeb' && this.cosmicWebGroup) this.cosmicWebGroup.visible = val;
        if (layer === 'laniakeaFlow' && this.laniakeaGroup) this.laniakeaGroup.visible = val;
        if (layer === 'localGroup' && this.localGroupObjects) this.localGroupObjects.visible = val;
        if (layer === 'extremes' && this.extremesGroup) this.extremesGroup.visible = val;
        if (layer === 'grid' && this.gridGroup) this.gridGroup.visible = val;
        if (layer === 'labels' && this.markerGroup) this.markerGroup.visible = val;
      });
    });

    const closeBtn = document.getElementById('close-univ-inspector');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        document.getElementById('universe-inspector').classList.add('hidden');
      });
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    if (!this.isPaused) {
      if (this.cosmicWebGroup) this.cosmicWebGroup.rotation.y += 0.00015;
      if (this.laniakeaGroup) this.laniakeaGroup.rotation.y += 0.0002;
    }

    if (this.cameraLerpTarget && this.controlsTargetLerp) {
      this.camera.position.lerp(this.cameraLerpTarget, 0.06);
      this.controls.target.lerp(this.controlsTargetLerp, 0.06);

      if (this.camera.position.distanceTo(this.cameraLerpTarget) < 1.0) {
        this.cameraLerpTarget = null;
        this.controlsTargetLerp = null;
      }
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.universeApp = new UniverseApp();
});