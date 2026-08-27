/**
 * 🌐 全宇宙 / 可觀測宇宙 3D 極致探索平台 (Observable Universe 3D Engine)
 * 搭載：4K 普朗克微波背景輻射 (CMB) + 100,000+ 宇宙大尺度纖維網 (Cosmic Web) +
 * 拉尼亞凱亞金色重力流線 (Laniakea Flow) + 本地星系群 (Local Group) + 類星體 TON 618
 */

class UniverseApp {
  constructor() {
    this.container = document.getElementById('universe-canvas-container');
    this.currentMode = 'all'; // all, cmb, web, laniakea, local_group
    this.cameraLerpTarget = null;
    this.controlsTargetLerp = null;
    this.activeItem = null;
    this.isPaused = false;
    this.flowTime = 0;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.layers = {
      cmb: true,
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
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;

    this.camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 200000);
    this.camera.position.set(0, 1800, 3200);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
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
    const amb = new THREE.AmbientLight(0xffffff, 1.0);
    this.scene.add(amb);

    const centerLight = new THREE.PointLight(0x38bdf8, 2.0, 5000, 1.0);
    centerLight.position.set(0, 0, 0);
    this.scene.add(centerLight);
  }

  // 1. 宇宙微波背景輻射 (CMB) 4K 全天球面 (Planck 2.725K Anisotropy)
  buildCMBSphere() {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // 普朗克全天溫度微小漲落 (紅藍溫差圖，ΔT/T ~ 10^-5)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 2048, 1024);

    const cmbColors = ['#1e3a8a', '#2563eb', '#38bdf8', '#fbbf24', '#f97316', '#ef4444'];
    for (let i = 0; i < 4000; i++) {
      const cx = Math.random() * 2048;
      const cy = Math.random() * 1024;
      const r = Math.random() * 45 + 15;
      const col = cmbColors[Math.floor(Math.random() * cmbColors.length)];

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, col);
      grad.addColorStop(0.5, 'rgba(30, 58, 138, 0.4)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }

    const cmbTex = new THREE.CanvasTexture(canvas);
    const cmbGeo = new THREE.SphereGeometry(15000, 64, 64);
    this.cmbMat = new THREE.MeshBasicMaterial({
      map: cmbTex,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.75,
      depthWrite: false
    });
    this.cmbSphere = new THREE.Mesh(cmbGeo, this.cmbMat);
    this.scene.add(this.cmbSphere);
  }

  // 2. 宇宙大尺度纖維網狀結構 (Cosmic Web - 80,000 星系團粒子)
  buildCosmicWeb() {
    this.cosmicWebGroup = new THREE.Group();
    const particleCount = 80000;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const size = new Float32Array(particleCount);

    const starTex = TextureGenerator.createStarSpriteTexture();

    // 依據宇宙絲狀流結構 (Filaments) 與空洞 (Voids) 分佈
    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const radius = Math.pow(u, 0.75) * 6500;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      // 絲狀擾動調變 (3 階正弦波干涉形成纖維壁面與巨洞)
      const f1 = Math.sin(theta * 4 + phi * 3) * 0.4;
      const f2 = Math.cos(theta * 7 - phi * 5) * 0.25;
      const filamentDensity = Math.abs(f1 + f2);

      const rMod = radius * (1.0 + f1 * 0.3);
      const x = rMod * Math.sin(phi) * Math.cos(theta);
      const y = rMod * Math.cos(phi) * 0.65; // 宏觀微幅扁化
      const z = rMod * Math.sin(phi) * Math.sin(theta);

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      // 顏色依紅移與星系密度：高密度節點呈亮金黃/白，纖維壁呈淺藍/紫色
      if (filamentDensity > 0.45) {
        col[i * 3] = 1.0;
        col[i * 3 + 1] = 0.90;
        col[i * 3 + 2] = 0.70;
        size[i] = Math.random() * 3.5 + 2.0;
      } else if (filamentDensity > 0.25) {
        col[i * 3] = 0.40;
        col[i * 3 + 1] = 0.70;
        col[i * 3 + 2] = 1.0;
        size[i] = Math.random() * 2.5 + 1.2;
      } else {
        col[i * 3] = 0.65;
        col[i * 3 + 1] = 0.35;
        col[i * 3 + 2] = 0.95;
        size[i] = Math.random() * 1.8 + 0.8;
      }
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
          gl_PointSize = size * (220.0 / -mvPosition.z);
          gl_PointSize = clamp(gl_PointSize, 1.0, 6.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D starTexture;
        varying vec3 vColor;
        void main() {
          vec4 texColor = texture2D(starTexture, gl_PointCoord);
          gl_FragColor = vec4(vColor, 0.65) * texColor;
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

  // 3. 拉尼亞凱亞超星系團金色重力流線 (Laniakea Gravitational Streamlines)
  buildLaniakeaFlow() {
    this.laniakeaGroup = new THREE.Group();
    const streamlineCount = 120;
    const gaPos = new THREE.Vector3(120, -45, 180); // 巨引源座標

    const lineMat = new THREE.LineBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.38,
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

      // 產生平滑流向巨引源的三次貝茲曲線 (Bezier Curve)
      const midPt = startPt.clone().lerp(gaPos, 0.5).add(new THREE.Vector3(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 50
      ));

      const curve = new THREE.QuadraticBezierCurve3(startPt, midPt, gaPos);
      const pts = curve.getPoints(32);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const line = new THREE.Line(lineGeo, lineMat);
      this.laniakeaGroup.add(line);
    }

    // 巨引源引力核心光暈
    const gaCoreGeo = new THREE.SphereGeometry(22, 32, 32);
    const gaCoreMat = new THREE.MeshBasicMaterial({
      color: 0xec4899,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const gaCore = new THREE.Mesh(gaCoreGeo, gaCoreMat);
    gaCore.position.copy(gaPos);
    this.laniakeaGroup.add(gaCore);

    this.scene.add(this.laniakeaGroup);
  }

  // 4. 本地星系群 3D 星系模型 (Milky Way, Andromeda M31, Triangulum M33)
  buildLocalGroup() {
    this.localGroupObjects = new THREE.Group();

    // 4a. 銀河系 (Milky Way at 0, 0, 0)
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

    // 4b. 仙女座星系 (Andromeda M31 at x: -12, y: -8, z: 22)
    const m31Geo = new THREE.PlaneGeometry(24, 24);
    const m31Mat = new THREE.MeshBasicMaterial({
      map: TextureGenerator.createMilkyWayDiskTexture(1024),
      color: 0x93c5fd,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.90,
      depthWrite: false
    });
    const m31 = new THREE.Mesh(m31Geo, m31Mat);
    m31.position.set(-12, -8, 22);
    m31.rotation.x = -Math.PI / 2.6;
    m31.rotation.z = Math.PI / 5;
    this.localGroupObjects.add(m31);

    // 4c. 三角座星系 (M33 at x: -18, y: -12, z: 20)
    const m33Geo = new THREE.PlaneGeometry(7, 7);
    const m33Mat = new THREE.MeshBasicMaterial({
      map: TextureGenerator.createMilkyWayDiskTexture(512),
      color: 0xc4b5fd,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
      depthWrite: false
    });
    const m33 = new THREE.Mesh(m33Geo, m33Mat);
    m33.position.set(-18, -12, 20);
    m33.rotation.x = -Math.PI / 2.1;
    this.localGroupObjects.add(m33);

    this.scene.add(this.localGroupObjects);
  }

  // 5. 宇宙極端天體 (TON 618 類星體、韋伯深空場)
  buildCosmicExtremes() {
    this.extremesGroup = new THREE.Group();

    // TON 618 類星體 (極致耀眼藍白吸積盤 + 巨型極向噴流)
    const tonPos = new THREE.Vector3(1200, 1500, -800);
    const tonDiskGeo = new THREE.RingGeometry(8, 65, 48);
    const tonDiskMat = new THREE.MeshBasicMaterial({
      map: TextureGenerator.createAccretionDiskTexture('#38bdf8', '#ffffff', '#6366f1', 1024),
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
      map: TextureGenerator.createRelativisticJetTexture('#38bdf8'),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
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

  // 6. 宇宙距離標尺網格 (Cosmic Scale Spheres: 100 Mly, 1 Gly, 10 Gly, 46.5 Gly)
  buildCosmicScaleGrid() {
    this.gridGroup = new THREE.Group();
    const scales = [
      { r: 100,  label: "1 億光年 (100 Mly - 拉尼亞凱亞尺度)" },
      { r: 500,  label: "5 億光年 (500 Mly - 超星系團網絡)" },
      { r: 2000, label: "20 億光年 (2 Gly - 深空場尺度)" },
      { r: 6000, label: "60 億光年 (6 Gly - 宇宙加速膨脹期)" },
      { r: 12000,label: "120 億光年 (12 Gly - 早期原初星系)" }
    ];

    scales.forEach(s => {
      const ringGeo = new THREE.RingGeometry(s.r - 1.5, s.r + 1.5, 96);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.18,
        depthWrite: false
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      this.gridGroup.add(ring);
    });

    this.scene.add(this.gridGroup);
  }

  // 7. 互動地標標記 (Interactive Landmark Pins)
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

      // 光環標記
      const ringGeo = new THREE.RingGeometry(6, 8, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: item.color || 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      marker.add(ring);

      // 懸浮標籤 Canvas
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 76;
      const ctx = canvas.getContext('2d');
      ctx.font = 'bold 24px "Inter", "Segoe UI", sans-serif';
      ctx.fillStyle = item.color || '#38bdf8';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.95)';
      ctx.shadowBlur = 6;
      ctx.fillText(item.name, 200, 44);

      const labelTex = new THREE.CanvasTexture(canvas);
      const labelSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: labelTex, transparent: true, depthTest: false }));
      labelSprite.scale.set(65, 12.3, 1);
      labelSprite.position.set(0, 16, 0);
      marker.add(labelSprite);

      // 碰撞盒
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
    // 快捷導覽按鈕
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

    // 圖層開關
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

    // 關閉詳情
    const closeBtn = document.getElementById('close-univ-inspector');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        document.getElementById('universe-inspector').classList.add('hidden');
      });
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // 宇宙大尺度緩慢旋轉
    if (!this.isPaused) {
      if (this.cosmicWebGroup) this.cosmicWebGroup.rotation.y += 0.00015;
      if (this.laniakeaGroup) this.laniakeaGroup.rotation.y += 0.0002;
    }

    // 相機平滑插值
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