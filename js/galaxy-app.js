/**
 * 🌌 銀河系 3D 深度探索平台 (Milky Way 3D Galaxy Explorer)
 * 獨立頂級 3D 棒旋星系交互引擎
 */

class GalaxyApp {
  constructor() {
    this.container = document.getElementById('galaxy-canvas-container');
    this.currentWavelength = 'visible';
    this.rotationSpeed = 0.0006;
    this.isPaused = false;
    this.activeLandmark = null;
    this.cameraLerpTarget = null;
    this.controlsTargetLerp = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.layers = {
      stars: true,
      dust: true,
      nebulae: true,
      clusters: true,
      fermiBubbles: true,
      grid: true,
      labels: true,
      disc: true
    };

    this.initScene();
    this.initLighting();
    this.initSkybox();
    this.buildMilkyWaySystem();
    this.buildCoordinateGrid();
    this.buildLandmarkMarkers();
    this.buildFermiBubbles();
    this.initUIEventListeners();
    this.animate();
  }

  initScene() {
    this.scene = new THREE.Scene();
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;

    this.camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 80000);
    this.camera.position.set(0, 950, 450);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.container.appendChild(this.renderer.domElement);

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 20;
    this.controls.maxDistance = 3500;
    this.controls.target.set(0, 0, 0);

    window.addEventListener('resize', () => this.onResize());
    this.renderer.domElement.addEventListener('pointerdown', (e) => this.onPointerDown(e));
  }

  initLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    this.scene.add(ambientLight);

    const coreLight = new THREE.PointLight(0xfff5ea, 2.5, 800, 1.2);
    coreLight.position.set(0, 0, 0);
    this.scene.add(coreLight);
  }

  initSkybox() {
    const starTexture = TextureGenerator.createStarfieldTexture(2048);
    const starGeo = new THREE.SphereGeometry(30000, 32, 32);
    const starMat = new THREE.MeshBasicMaterial({ map: starTexture, side: THREE.BackSide });
    this.skybox = new THREE.Mesh(starGeo, starMat);
    this.scene.add(this.skybox);
  }

  buildMilkyWaySystem() {
    this.galaxyGroup = new THREE.Group();
    const galaxyRadius = 500; // 500 單位 = 50,000 光年半徑 (直徑 100,000 光年)

    // 1. 4K 高解析度高對比棒旋盤面
    const mwDiskTex = TextureGenerator.createMilkyWayDiskTexture(4096);
    const mwDiskGeo = new THREE.PlaneGeometry(galaxyRadius * 2.2, galaxyRadius * 2.2);
    this.mwDiskMat = new THREE.MeshBasicMaterial({
      map: mwDiskTex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.92,
      depthWrite: false
    });
    this.mwDiskMesh = new THREE.Mesh(mwDiskGeo, this.mwDiskMat);
    this.mwDiskMesh.rotation.x = -Math.PI / 2;
    this.galaxyGroup.add(this.mwDiskMesh);

    // 2. 旋臂恆星 (30,000 顆精緻對數密度波微晶恆星)
    const starTex = TextureGenerator.createStarSpriteTexture();
    const armDefs = GALAXY_DATA.spiralArms;
    const starCount = 30000;
    const perArm = Math.floor(starCount / armDefs.length);

    const armGeo = new THREE.BufferGeometry();
    const armPos = new Float32Array(starCount * 3);
    const armCol = new Float32Array(starCount * 3);
    const armSize = new Float32Array(starCount);

    let idx = 0;
    armDefs.forEach((arm) => {
      const armColor = new THREE.Color(arm.color);
      for (let i = 0; i < perArm; i++) {
        const radius = arm.startRadius + Math.pow(Math.random(), 1.2) * (arm.endRadius - arm.startRadius);
        const pitchRad = (arm.pitchDeg * Math.PI) / 180;
        const spinAngle = (radius / galaxyRadius) * (pitchRad * 35);

        const spread = (radius / galaxyRadius) * 26 + 4;
        const rx = (Math.random() - 0.5) * spread;
        const scaleHeight = 22 * Math.exp(-radius / 250) + 4;
        const ry = (Math.random() - 0.5) * scaleHeight;
        const rz = (Math.random() - 0.5) * spread;

        const theta = arm.offsetRad + spinAngle;
        const x = Math.cos(theta) * radius + rx;
        const y = ry;
        const z = Math.sin(theta) * radius + rz;

        armPos[idx * 3] = x;
        armPos[idx * 3 + 1] = y;
        armPos[idx * 3 + 2] = z;

        const t = radius / galaxyRadius;
        const col = armColor.clone().lerp(new THREE.Color(0xfffbeb), 0.35 + Math.random() * 0.4);
        armCol[idx * 3] = col.r;
        armCol[idx * 3 + 1] = col.g;
        armCol[idx * 3 + 2] = col.b;

        armSize[idx] = Math.random() * 2.2 + 1.2;
        idx++;
      }
    });

    armGeo.setAttribute('position', new THREE.BufferAttribute(armPos, 3));
    armGeo.setAttribute('color', new THREE.BufferAttribute(armCol, 3));
    armGeo.setAttribute('size', new THREE.BufferAttribute(armSize, 1));

    this.armShaderMat = new THREE.ShaderMaterial({
      uniforms: { starTexture: { value: starTex } },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (120.0 / -mvPosition.z);
          gl_PointSize = clamp(gl_PointSize, 1.0, 4.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D starTexture;
        varying vec3 vColor;
        void main() {
          vec4 texColor = texture2D(starTexture, gl_PointCoord);
          gl_FragColor = vec4(vColor, 0.75) * texColor;
          if (gl_FragColor.a < 0.01) discard;
        }
      `,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      vertexColors: true
    });
    this.armPointsMesh = new THREE.Points(armGeo, this.armShaderMat);
    this.galaxyGroup.add(this.armPointsMesh);

    // 3. 旋臂內緣暗分子塵埃帶 (Dark Dust Clouds - 6,000 團吸光雲)
    const dustTex = TextureGenerator.createDarkDustSpriteTexture();
    const dustCount = 6000;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    const dustSize = new Float32Array(dustCount);

    for (let d = 0; d < dustCount; d++) {
      const arm = armDefs[d % armDefs.length];
      const radius = 35 + Math.pow(Math.random(), 0.9) * (arm.endRadius * 0.85 - 35);
      const pitchRad = (arm.pitchDeg * Math.PI) / 180;
      const spinAngle = (radius / galaxyRadius) * (pitchRad * 35) + 0.08;

      const pSpread = (radius / galaxyRadius) * 16 + 3;
      const theta = arm.offsetRad + spinAngle;
      dustPos[d * 3] = Math.cos(theta) * radius + (Math.random() - 0.5) * pSpread;
      dustPos[d * 3 + 1] = (Math.random() - 0.5) * 8;
      dustPos[d * 3 + 2] = Math.sin(theta) * radius + (Math.random() - 0.5) * pSpread;

      dustSize[d] = Math.random() * 10 + 5;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    dustGeo.setAttribute('size', new THREE.BufferAttribute(dustSize, 1));

    this.dustShaderMat = new THREE.ShaderMaterial({
      uniforms: { dustTex: { value: dustTex } },
      vertexShader: `
        attribute float size;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (130.0 / -mvPosition.z);
          gl_PointSize = clamp(gl_PointSize, 1.5, 14.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D dustTex;
        void main() {
          vec4 tex = texture2D(dustTex, gl_PointCoord);
          gl_FragColor = vec4(0.01, 0.005, 0.02, tex.a * 0.92);
          if (gl_FragColor.a < 0.01) discard;
        }
      `,
      blending: THREE.NormalBlending,
      depthWrite: false,
      transparent: true
    });
    this.dustPointsMesh = new THREE.Points(dustGeo, this.dustShaderMat);
    this.galaxyGroup.add(this.dustPointsMesh);

    // 4. 發射星雲 HII 育嬰室 (3,000 團洋紅雲氣)
    const hiiTex = TextureGenerator.createHIICloudTexture();
    const hiiCount = 3000;
    const hiiGeo = new THREE.BufferGeometry();
    const hiiPos = new Float32Array(hiiCount * 3);
    const hiiCol = new Float32Array(hiiCount * 3);
    const hiiSize = new Float32Array(hiiCount);

    for (let h = 0; h < hiiCount; h++) {
      const arm = armDefs[h % armDefs.length];
      const radius = 40 + Math.random() * (arm.endRadius * 0.9 - 40);
      const pitchRad = (arm.pitchDeg * Math.PI) / 180;
      const spinAngle = (radius / galaxyRadius) * (pitchRad * 35) + (Math.random() - 0.5) * 0.04;

      const spread = (radius / galaxyRadius) * 18 + 4;
      const theta = arm.offsetRad + spinAngle;
      hiiPos[h * 3] = Math.cos(theta) * radius + (Math.random() - 0.5) * spread;
      hiiPos[h * 3 + 1] = (Math.random() - 0.5) * 10;
      hiiPos[h * 3 + 2] = Math.sin(theta) * radius + (Math.random() - 0.5) * spread;

      hiiCol[h * 3] = 1.0;
      hiiCol[h * 3 + 1] = 0.40 + Math.random() * 0.15;
      hiiCol[h * 3 + 2] = 0.30 + Math.random() * 0.15;
      hiiSize[h] = Math.random() * 8 + 4;
    }
    hiiGeo.setAttribute('position', new THREE.BufferAttribute(hiiPos, 3));
    hiiGeo.setAttribute('color', new THREE.BufferAttribute(hiiCol, 3));
    hiiGeo.setAttribute('size', new THREE.BufferAttribute(hiiSize, 1));

    this.hiiShaderMat = new THREE.ShaderMaterial({
      uniforms: { hiiTex: { value: hiiTex } },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (120.0 / -mvPosition.z);
          gl_PointSize = clamp(gl_PointSize, 1.0, 10.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D hiiTex;
        varying vec3 vColor;
        void main() {
          vec4 tex = texture2D(hiiTex, gl_PointCoord);
          gl_FragColor = vec4(vColor, 0.70) * tex;
          if (gl_FragColor.a < 0.01) discard;
        }
      `,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      vertexColors: true
    });
    this.hiiPointsMesh = new THREE.Points(hiiGeo, this.hiiShaderMat);
    this.galaxyGroup.add(this.hiiPointsMesh);

    // 5. 球狀星團與古老星暈 (6,000 顆球狀星團分佈)
    const haloCount = 6000;
    const haloGeo = new THREE.BufferGeometry();
    const haloPos = new Float32Array(haloCount * 3);
    const haloCol = new Float32Array(haloCount * 3);

    for (let i = 0; i < haloCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.pow(Math.random(), 0.7) * (galaxyRadius * 1.15);
      haloPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      haloPos[i * 3 + 1] = r * Math.cos(phi) * 0.55;
      haloPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      haloCol[i * 3] = 0.98;
      haloCol[i * 3 + 1] = 0.88;
      haloCol[i * 3 + 2] = 0.65;
    }
    haloGeo.setAttribute('position', new THREE.BufferAttribute(haloPos, 3));
    haloGeo.setAttribute('color', new THREE.BufferAttribute(haloCol, 3));
    this.haloPoints = new THREE.Points(haloGeo, new THREE.PointsMaterial({
      size: 1.5,
      map: starTex,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      transparent: true,
      opacity: 0.25
    }));
    this.galaxyGroup.add(this.haloPoints);

    // 6. 人馬座 A* 超大質量黑洞 3D 結構
    this.buildSagittariusAStar();

    this.scene.add(this.galaxyGroup);
  }

  buildSagittariusAStar() {
    const sgrGroup = new THREE.Group();
    sgrGroup.position.set(0, 0, 0);

    // 事件視界 (Event Horizon - 絕對漆黑)
    const horizonGeo = new THREE.SphereGeometry(3.5, 32, 32);
    const horizonMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const horizon = new THREE.Mesh(horizonGeo, horizonMat);
    sgrGroup.add(horizon);

    // 相對論吸積盤 (Relativistic Accretion Disk)
    const diskTex = TextureGenerator.createAccretionDiskTexture('#ec4899', '#ffffff', '#f59e0b', 1024);
    const diskGeo = new THREE.RingGeometry(4.5, 18, 64);
    const diskMat = new THREE.MeshBasicMaterial({
      map: diskTex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const accretionDisk = new THREE.Mesh(diskGeo, diskMat);
    accretionDisk.rotation.x = Math.PI / 2.3;
    sgrGroup.add(accretionDisk);

    // 極向相對論噴流 (Relativistic Jets)
    const jetTex = TextureGenerator.createRelativisticJetTexture('#c084fc');
    const jetGeo = new THREE.CylinderGeometry(0.3, 3.5, 60, 16, 1, true);
    const jetMat = new THREE.MeshBasicMaterial({
      map: jetTex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const northJet = new THREE.Mesh(jetGeo, jetMat);
    northJet.position.y = 30;
    sgrGroup.add(northJet);

    const southJet = new THREE.Mesh(jetGeo, jetMat);
    southJet.position.y = -30;
    southJet.rotation.x = Math.PI;
    sgrGroup.add(southJet);

    this.sgrGroup = sgrGroup;
    this.galaxyGroup.add(sgrGroup);
  }

  buildFermiBubbles() {
    this.fermiGroup = new THREE.Group();

    // 費米氣泡：自銀心上下各延伸 25,000 光年 (250 單位) 的巨型伽瑪射線電漿葉片
    const bubbleGeo = new THREE.SphereGeometry(125, 32, 32);
    const bubbleMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.14,
      blending: THREE.AdditiveBlending,
      wireframe: false,
      depthWrite: false
    });

    const northBubble = new THREE.Mesh(bubbleGeo, bubbleMat);
    northBubble.scale.set(0.65, 1.25, 0.65);
    northBubble.position.set(0, 125, 0);
    this.fermiGroup.add(northBubble);

    const southBubble = new THREE.Mesh(bubbleGeo, bubbleMat);
    southBubble.scale.set(0.65, 1.25, 0.65);
    southBubble.position.set(0, -125, 0);
    this.fermiGroup.add(southBubble);

    // 氣泡輪廓線條 (Wireframe Accents)
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xe879f9,
      transparent: true,
      opacity: 0.08,
      wireframe: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const northWire = new THREE.Mesh(bubbleGeo, wireMat);
    northWire.scale.set(0.65, 1.25, 0.65);
    northWire.position.set(0, 125, 0);
    this.fermiGroup.add(northWire);

    const southWire = new THREE.Mesh(bubbleGeo, wireMat);
    southWire.scale.set(0.65, 1.25, 0.65);
    southWire.position.set(0, -125, 0);
    this.fermiGroup.add(southWire);

    this.galaxyGroup.add(this.fermiGroup);
  }

  buildCoordinateGrid() {
    this.gridGroup = new THREE.Group();

    // 銀道面同心圓 (5 kpc, 8 kpc 太陽位置, 15 kpc 外盤, 20 kpc 銀暈)
    const circles = [
      { r: 50,  label: "5 kpc (16,300 ly)" },
      { r: 80,  label: "8 kpc (26,000 ly 太陽軌道)" },
      { r: 150, label: "15 kpc (48,900 ly 主盤)" },
      { r: 250, label: "25 kpc (81,500 ly 外盤)" }
    ];

    circles.forEach(c => {
      const circleGeo = new THREE.RingGeometry(c.r - 0.3, c.r + 0.3, 96);
      const circleMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.22,
        depthWrite: false
      });
      const circleMesh = new THREE.Mesh(circleGeo, circleMat);
      circleMesh.rotation.x = Math.PI / 2;
      this.gridGroup.add(circleMesh);
    });

    // 銀道經度放射線 (Galactic Longitude 0°, 90°, 180°, 270°)
    const lineMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.18 });
    for (let deg = 0; deg < 360; deg += 30) {
      const rad = (deg * Math.PI) / 180;
      const pts = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(Math.cos(rad) * 260, 0, Math.sin(rad) * 260)
      ];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const line = new THREE.Line(lineGeo, lineMat);
      this.gridGroup.add(line);
    }

    this.galaxyGroup.add(this.gridGroup);
  }

  buildLandmarkMarkers() {
    this.landmarkMarkers = [];
    this.markerGroup = new THREE.Group();

    GALAXY_DATA.landmarks.forEach(lm => {
      const markerGroup = new THREE.Group();
      markerGroup.position.set(lm.coords.x, lm.coords.y, lm.coords.z);

      // 1. 發光光環 (Beacon Ring)
      const ringGeo = new THREE.RingGeometry(3.5, 4.5, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: lm.color || 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      markerGroup.add(ring);

      // 2. 懸浮文字標籤 Canvas
      const canvas = document.createElement('canvas');
      canvas.width = 360;
      canvas.height = 70;
      const ctx = canvas.getContext('2d');
      ctx.font = 'bold 24px "Inter", "Segoe UI", sans-serif';
      ctx.fillStyle = lm.color || '#38bdf8';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.95)';
      ctx.shadowBlur = 6;
      ctx.fillText(lm.name, 180, 42);

      const labelTex = new THREE.CanvasTexture(canvas);
      const labelSprite = new THREE.Sprite(new THREE.SpriteMaterial({
        map: labelTex,
        transparent: true,
        depthTest: false
      }));
      labelSprite.scale.set(38, 7.4, 1);
      labelSprite.position.set(0, 8.5, 0);
      markerGroup.add(labelSprite);

      // 隱形可點擊球體碰撞盒
      const hitGeo = new THREE.SphereGeometry(7, 16, 16);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.userData = { landmark: lm };
      markerGroup.add(hitMesh);

      this.landmarkMarkers.push(hitMesh);
      this.markerGroup.add(markerGroup);
    });

    this.galaxyGroup.add(this.markerGroup);
  }

  setWavelength(wlId) {
    this.currentWavelength = wlId;
    const wl = GALAXY_DATA.wavelengths.find(w => w.id === wlId);
    if (!wl) return;

    // 更新各層著色效果
    if (wlId === 'visible') {
      this.mwDiskMat.color.setHex(0xffffff);
      this.mwDiskMat.opacity = 0.92;
      this.armShaderMat.uniforms.starTexture.value = TextureGenerator.createStarSpriteTexture();
      this.fermiGroup.visible = this.layers.fermiBubbles;
    } else if (wlId === 'infrared') {
      this.mwDiskMat.color.setHex(0xffaa55);
      this.mwDiskMat.opacity = 0.85;
      this.fermiGroup.visible = false;
    } else if (wlId === 'radio_21cm') {
      this.mwDiskMat.color.setHex(0x38bdf8);
      this.mwDiskMat.opacity = 0.75;
      this.fermiGroup.visible = false;
    } else if (wlId === 'fermi_gamma') {
      this.mwDiskMat.color.setHex(0xa855f7);
      this.mwDiskMat.opacity = 0.40;
      this.fermiGroup.visible = true;
    }

    // 更新 UI 狀態與資訊
    document.querySelectorAll('.wl-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.wl === wlId);
    });

    const infoEl = document.getElementById('wavelength-info');
    if (infoEl) {
      infoEl.innerHTML = `
        <div class="font-bold text-sky-400 mb-1">${wl.name} (${wl.spectrum})</div>
        <div class="text-xs text-slate-300 mb-1"><strong>代表性望遠鏡：</strong>${wl.observatories}</div>
        <div class="text-xs text-slate-400">${wl.highlights}</div>
      `;
    }
  }

  flyToLandmark(lmId) {
    const lm = GALAXY_DATA.landmarks.find(l => l.id === lmId);
    if (!lm) return;

    this.activeLandmark = lm;
    this.controlsTargetLerp = new THREE.Vector3(lm.coords.x, lm.coords.y, lm.coords.z);
    
    // 計算相機最佳觀測距離
    const dist = lm.id === 'sol' ? 45 : (lm.id === 'sgr_a_star' ? 35 : 65);
    this.cameraLerpTarget = new THREE.Vector3(lm.coords.x, lm.coords.y + dist * 0.7, lm.coords.z + dist);

    this.showInspectorPanel(lm);
  }

  resetView() {
    this.controlsTargetLerp = new THREE.Vector3(0, 0, 0);
    this.cameraLerpTarget = new THREE.Vector3(0, 950, 450);
    this.activeLandmark = null;
    document.getElementById('inspector-modal').classList.add('hidden');
  }

  showInspectorPanel(lm) {
    const modal = document.getElementById('inspector-modal');
    if (!modal) return;

    modal.classList.remove('hidden');
    document.getElementById('inspector-title').innerHTML = `${lm.icon || '🌌'} ${lm.name}`;
    document.getElementById('inspector-dist-sun').innerText = lm.distanceSunLy;
    document.getElementById('inspector-dist-gc').innerText = lm.distGalacticCenterLy;
    document.getElementById('inspector-arm').innerText = lm.arm || '銀河主體';
    document.getElementById('inspector-desc').innerText = lm.description;
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
        this.flyToLandmark(hit.userData.landmark.id);
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
    // 波段按鈕
    document.querySelectorAll('.wl-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const wl = e.currentTarget.dataset.wl;
        this.setWavelength(wl);
      });
    });

    // 導航導覽按鈕
    document.querySelectorAll('.tour-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget.dataset.target;
        if (target === 'reset') this.resetView();
        else if (target === 'edge_on') {
          this.controlsTargetLerp = new THREE.Vector3(0, 0, 0);
          this.cameraLerpTarget = new THREE.Vector3(0, 15, 850);
        } else {
          this.flyToLandmark(target);
        }
      });
    });

    // 圖層開關
    document.querySelectorAll('.layer-checkbox').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const layer = e.target.dataset.layer;
        const val = e.target.checked;
        this.layers[layer] = val;

        if (layer === 'disc' && this.mwDiskMesh) this.mwDiskMesh.visible = val;
        if (layer === 'stars' && this.armPointsMesh) this.armPointsMesh.visible = val;
        if (layer === 'dust' && this.dustPointsMesh) this.dustPointsMesh.visible = val;
        if (layer === 'nebulae' && this.hiiPointsMesh) this.hiiPointsMesh.visible = val;
        if (layer === 'clusters' && this.haloPoints) this.haloPoints.visible = val;
        if (layer === 'fermiBubbles' && this.fermiGroup) this.fermiGroup.visible = val;
        if (layer === 'grid' && this.gridGroup) this.gridGroup.visible = val;
        if (layer === 'labels' && this.markerGroup) this.markerGroup.visible = val;
      });
    });

    // 旋轉速度滑桿與暫停
    const speedSlider = document.getElementById('rotation-speed-slider');
    if (speedSlider) {
      speedSlider.addEventListener('input', (e) => {
        this.rotationSpeed = parseFloat(e.target.value);
      });
    }
    const pauseBtn = document.getElementById('pause-rotation-btn');
    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => {
        this.isPaused = !this.isPaused;
        pauseBtn.innerText = this.isPaused ? '▶️ 繼續旋轉' : '⏸️ 暫停旋轉';
      });
    }

    // 搜尋功能
    const searchInput = document.getElementById('galaxy-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase().trim();
        const resultsEl = document.getElementById('search-results');
        if (!q) {
          resultsEl.classList.add('hidden');
          return;
        }
        const matches = GALAXY_DATA.landmarks.filter(l => l.name.toLowerCase().includes(q) || l.description.toLowerCase().includes(q));
        if (matches.length > 0) {
          resultsEl.classList.remove('hidden');
          resultsEl.innerHTML = matches.map(m => `
            <div class="search-item p-2 hover:bg-slate-800/80 cursor-pointer rounded text-sm text-sky-300 border-b border-slate-700/40" data-id="${m.id}">
              ${m.icon || '📍'} ${m.name} <span class="text-xs text-slate-400">(${m.arm})</span>
            </div>
          `).join('');
          resultsEl.querySelectorAll('.search-item').forEach(item => {
            item.addEventListener('click', (ev) => {
              const id = ev.currentTarget.dataset.id;
              this.flyToLandmark(id);
              resultsEl.classList.add('hidden');
              searchInput.value = '';
            });
          });
        } else {
          resultsEl.classList.add('hidden');
        }
      });
    }

    // 關閉詳情面板
    const closeBtn = document.getElementById('close-inspector-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        document.getElementById('inspector-modal').classList.add('hidden');
      });
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // 銀河系自轉
    if (!this.isPaused && this.galaxyGroup) {
      this.galaxyGroup.rotation.y += this.rotationSpeed;
    }

    // 相機過渡動畫
    if (this.cameraLerpTarget && this.controlsTargetLerp) {
      this.camera.position.lerp(this.cameraLerpTarget, 0.06);
      this.controls.target.lerp(this.controlsTargetLerp, 0.06);

      if (this.camera.position.distanceTo(this.cameraLerpTarget) < 0.8) {
        this.cameraLerpTarget = null;
        this.controlsTargetLerp = null;
      }
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

// 頁面載入完成後初始化
window.addEventListener('DOMContentLoaded', () => {
  window.galaxyApp = new GalaxyApp();
});
