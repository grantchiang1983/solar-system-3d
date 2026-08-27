/**
 * Three.js 3D 視覺渲染與互動場景 (Solar System 3D Scene)
 * 負責天體網格、動態光影、軌道線、日心方位射線、小行星帶及相機跟隨系統
 */

class SolarScene {
  constructor(containerElement, simulation) {
    this.container = containerElement;
    this.simulation = simulation;

    // Three.js 核心組件
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;

    // 物件字典
    this.planetMeshes = new Map();
    this.orbitLines = new Map();
    this.azimuthLines = new Map();
    this.planetLabels = new Map();
    this.earthClouds = null;
    this.moonMesh = null;
    this.moonOrbitLine = null;
    this.moonLabel = null;
    this.asteroidBelt = null;
    this.kuiperBelt = null;
    this.compassRing = null;
    this.eclipticGrid = null;
    this.milkyWayGroup = null;
    this.blackHoleObjects = new Map();
    this.cometObjects = new Map();

    // 視圖與相機控制
    this.focusedPlanetId = null;       // 當前鎖定跟隨的星球 ID ('sun', 'earth', etc.)
    this.focusedBlackHoleId = null;
    this.focusedCometId = null;
    this.isTopDownView = false;
    this.cameraLerpTarget = null;
    this.controlsTargetLerp = null;

    // 顯示設定開關
    this.layers = {
      orbits: true,
      azimuthRays: true,
      labels: true,
      eclipticGrid: true,
      asteroidBelt: true,
      atmosphereGlow: true,
      moonOrbit: true,
      milkyWay: true,
      blackHoles: true,
      comets: true
    };

    // 射線檢測
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.init();
  }

  init() {
    // 1. 初始化場景
    this.scene = new THREE.Scene();

    // 2. 初始化相機 (支援銀河系宏觀視界 40,000 單位)
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 40000);
    this.camera.position.set(0, 140, 260);

    // 3. 初始化渲染器 (啟用高精度軟陰影與色調映射)
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // 4. 初始化軌道控制器 (支援銀河系大尺度縮放)
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 4;
    this.controls.maxDistance = 8000;
    this.controls.maxPolarAngle = Math.PI - 0.05;

    // 5. 建立深空星空背景
    this.createSkybox();

    // 6. 建立燈光系統 (點光源 + 地月高精度動態陰影陽光)
    this.setupLighting();

    // 7. 建立黃道座標網格與日心方位羅盤
    this.createEclipticCoordinateGrid();

    // 8. 建立太陽系所有天體與光環
    this.createCelestialBodies();

    // 9. 建立小行星帶與柯伊伯帶
    this.createAsteroidBelts();

    // 10. 建立著名彗星 (哈雷彗星 1P/Halley & 海爾-波普彗星 C/1995 O1)
    this.createComets();

    // 11. 建立銀河系 3D 旋臂粒子星盤與核心光核
    this.createMilkyWayGalaxy();

    // 12. 建立已知黑洞 (重點標註最近黑洞 Gaia BH1 與銀心人馬座 A*)
    this.createBlackHoles();

    // 13. 事件監聽
    window.addEventListener('resize', () => this.onWindowResize());
    this.renderer.domElement.addEventListener('pointerdown', (e) => this.onPointerDown(e));
  }

  createSkybox() {
    const starTexture = TextureGenerator.createStarfieldTexture(2048);
    const starGeo = new THREE.SphereGeometry(2500, 32, 32);
    const starMat = new THREE.MeshBasicMaterial({
      map: starTexture,
      side: THREE.BackSide
    });
    const starfield = new THREE.Mesh(starGeo, starMat);
    this.scene.add(starfield);
  }

  setupLighting() {
    // 1. 太陽全向核心光源
    const sunLight = new THREE.PointLight(0xfffaed, 3.8, 4000, 0.3);
    sunLight.position.set(0, 0, 0);
    this.scene.add(sunLight);

    // 2. 地月系統專屬高精度陽光 (負責日食/月食/晨昏線陰影投射)
    this.earthSunLight = new THREE.DirectionalLight(0xfffdf5, 2.5);
    this.earthSunLight.castShadow = true;
    this.earthSunLight.shadow.mapSize.width = 2048;
    this.earthSunLight.shadow.mapSize.height = 2048;
    this.earthSunLight.shadow.camera.near = 0.5;
    this.earthSunLight.shadow.camera.far = 150;
    this.earthSunLight.shadow.camera.left = -12;
    this.earthSunLight.shadow.camera.right = 12;
    this.earthSunLight.shadow.camera.top = 12;
    this.earthSunLight.shadow.camera.bottom = -12;
    this.earthSunLight.shadow.bias = -0.0002;
    this.earthSunLight.shadow.radius = 1.5;
    this.scene.add(this.earthSunLight);
    this.scene.add(this.earthSunLight.target);

    // 3. 柔和深空環境光 (確保背光面地表清晰可辨)
    const ambientLight = new THREE.AmbientLight(0x323f54, 0.75);
    this.scene.add(ambientLight);
  }

  createEclipticCoordinateGrid() {
    this.eclipticGrid = new THREE.Group();

    // 1. 同心距離圓環 (0.5 AU, 1.0 AU, 1.5 AU, 5.2 AU, 9.5 AU 等)
    const ringDistances = [28, 42, 58, 76, 105, 140, 178, 215, 255];
    ringDistances.forEach((r, idx) => {
      const ringGeo = new THREE.RingGeometry(r - 0.08, r + 0.08, 128);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x1f3b58,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.25
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      this.eclipticGrid.add(ringMesh);
    });

    // 2. 日心方位角刻度射線 (每 30° 一條輔助基準線)
    for (let deg = 0; deg < 360; deg += 30) {
      const rad = (deg * Math.PI) / 180;
      const length = 270;
      const points = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(length * Math.cos(rad), 0, length * Math.sin(rad))
      ];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: deg === 0 ? 0x00ffcc : 0x1b354d,
        transparent: true,
        opacity: deg === 0 ? 0.6 : 0.2
      });
      const line = new THREE.Line(lineGeo, lineMat);
      this.eclipticGrid.add(line);
    }

    // 3. 基準 0° (春分點 Vernal Equinox) 標記線
    const vernalArrow = new THREE.ArrowHelper(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 0, 0),
      280,
      0x00ffcc,
      8,
      4
    );
    vernalArrow.line.material.transparent = true;
    vernalArrow.line.material.opacity = 0.7;
    this.eclipticGrid.add(vernalArrow);

    this.scene.add(this.eclipticGrid);
  }

  createCelestialBodies() {
    PLANETS_DATA.forEach(planet => {
      if (planet.id === 'sun') {
        this.createSun(planet);
      } else {
        this.createPlanet(planet);
      }
    });
  }

  createSun(data) {
    const sunGroup = new THREE.Group();
    const texLoader = new THREE.TextureLoader();

    // 1. 太陽球體 (NASA 2K 高解析太陽日冕電漿紋理，清晰純淨無多餘白霧)
    const sunTexture = (typeof NASA_TEXTURES !== 'undefined' && NASA_TEXTURES.sun)
      ? texLoader.load(NASA_TEXTURES.sun)
      : TextureGenerator.createSunTexture(1024, 512);

    const sunGeo = new THREE.SphereGeometry(data.visualRadius, 64, 64);
    const sunMat = new THREE.MeshBasicMaterial({
      map: sunTexture,
      color: 0xffffff
    });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    sunMesh.castShadow = false;
    sunMesh.receiveShadow = false;
    sunMesh.userData = { id: data.id, name: data.zhName };
    sunGroup.add(sunMesh);

    // 2. 微光日冕 (緊貼太陽邊緣的微幅柔和金橙光暈，不遮擋地表與視線)
    const glowGeo = new THREE.SphereGeometry(data.visualRadius * 1.04, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xff8800,
      transparent: true,
      opacity: 0.18,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    sunGroup.add(glowMesh);

    this.scene.add(sunGroup);
    this.planetMeshes.set(data.id, {
      group: sunGroup,
      mesh: sunMesh,
      data: data
    });
  }

  createPlanet(data) {
    const planetGroup = new THREE.Group();
    const texLoader = new THREE.TextureLoader();
    let mat;

    // 專為地球設定極致擬真材質 (NASA 官方 2K 晝夜切換 + 城市燈火 + 法線高程 + 海洋鏡面反光)
    if (data.id === 'earth') {
      const earthDayTex = (typeof NASA_TEXTURES !== 'undefined' && NASA_TEXTURES.earthDay)
        ? texLoader.load(NASA_TEXTURES.earthDay)
        : TextureGenerator.createEarthTexture();

      const earthNightTex = (typeof NASA_TEXTURES !== 'undefined' && NASA_TEXTURES.earthNight)
        ? texLoader.load(NASA_TEXTURES.earthNight)
        : TextureGenerator.createEarthTexture();

      const earthNormalTex = (typeof NASA_TEXTURES !== 'undefined' && NASA_TEXTURES.earthNormal)
        ? texLoader.load(NASA_TEXTURES.earthNormal)
        : null;

      const earthSpecTex = (typeof NASA_TEXTURES !== 'undefined' && NASA_TEXTURES.earthSpec)
        ? texLoader.load(NASA_TEXTURES.earthSpec)
        : null;

      // 使用高階自定義著色器混合 NASA 白晝地表、海洋反射、夜間城市燈火與晨昏金紅霞光
      const customEarthMat = new THREE.ShaderMaterial({
        uniforms: {
          dayTexture: { value: earthDayTex },
          nightTexture: { value: earthNightTex },
          normalTexture: { value: earthNormalTex },
          specularTexture: { value: earthSpecTex }
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vWorldPosition;
          varying vec3 vViewPosition;

          void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vViewPosition = -mvPosition.xyz;
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          uniform sampler2D dayTexture;
          uniform sampler2D nightTexture;
          uniform sampler2D specularTexture;

          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vWorldPosition;
          varying vec3 vViewPosition;

          void main() {
            vec3 norm = normalize(vNormal);
            vec3 lightDir = normalize(-vWorldPosition); // 陽光來自太陽原點 (0,0,0)
            float sunDot = dot(norm, lightDir);

            vec4 dayColor = texture2D(dayTexture, vUv);
            vec4 nightColor = texture2D(nightTexture, vUv);
            vec4 specColor = texture2D(specularTexture, vUv);

            // 鏡面海面高光 (Ocean Glint)
            vec3 viewDir = normalize(vViewPosition);
            vec3 halfVector = normalize(lightDir + viewDir);
            float specFactor = pow(max(dot(norm, halfVector), 0.0), 28.0) * specColor.r * 2.0;
            vec3 oceanGlint = vec3(1.0, 0.96, 0.88) * specFactor * max(sunDot, 0.0);

            // 晨昏線平滑混合 (Terminator blending)
            float dayFactor = smoothstep(-0.12, 0.22, sunDot);
            float twilight = exp(-pow((sunDot - 0.04) / 0.14, 2.0));
            vec3 sunsetColor = vec3(1.0, 0.42, 0.08) * twilight * 0.4;

            // 晝夜混合 (夜面顯示璀璨城市燈火)
            vec3 finalColor = mix(nightColor.rgb * 1.8, dayColor.rgb, dayFactor);
            finalColor += oceanGlint + sunsetColor;

            // 深空環境底色
            finalColor += dayColor.rgb * 0.12;

            gl_FragColor = vec4(finalColor, 1.0);
          }
        `
      });
      mat = customEarthMat;
    } else {
      // 載入 NASA 2K 官方最高等級材質 (含程序化引擎 Fallback)
      let pTex;
      let bumpTex = null;
      let bScale = 0.0;
      let roughnessVal = 0.8;
      let metalnessVal = 0.05;

      switch (data.id) {
        case 'mercury':
          pTex = (typeof NASA_TEXTURES !== 'undefined' && NASA_TEXTURES.mercury)
            ? texLoader.load(NASA_TEXTURES.mercury)
            : TextureGenerator.createMercuryTexture();
          bumpTex = pTex;
          bScale = 0.035;
          roughnessVal = 0.92;
          break;
        case 'venus':
          pTex = (typeof NASA_TEXTURES !== 'undefined' && NASA_TEXTURES.venus)
            ? texLoader.load(NASA_TEXTURES.venus)
            : TextureGenerator.createVenusTexture();
          roughnessVal = 0.85;
          break;
        case 'mars':
          pTex = (typeof NASA_TEXTURES !== 'undefined' && NASA_TEXTURES.mars)
            ? texLoader.load(NASA_TEXTURES.mars)
            : TextureGenerator.createMarsTexture();
          bumpTex = pTex;
          bScale = 0.04;
          roughnessVal = 0.88;
          break;
        case 'jupiter':
          pTex = (typeof NASA_TEXTURES !== 'undefined' && NASA_TEXTURES.jupiter)
            ? texLoader.load(NASA_TEXTURES.jupiter)
            : TextureGenerator.createJupiterTexture();
          roughnessVal = 0.72;
          break;
        case 'saturn':
          pTex = (typeof NASA_TEXTURES !== 'undefined' && NASA_TEXTURES.saturn)
            ? texLoader.load(NASA_TEXTURES.saturn)
            : TextureGenerator.createSaturnTexture();
          roughnessVal = 0.75;
          break;
        case 'uranus':
          pTex = (typeof NASA_TEXTURES !== 'undefined' && NASA_TEXTURES.uranus)
            ? texLoader.load(NASA_TEXTURES.uranus)
            : TextureGenerator.createUranusTexture();
          roughnessVal = 0.65;
          break;
        case 'neptune':
          pTex = (typeof NASA_TEXTURES !== 'undefined' && NASA_TEXTURES.neptune)
            ? texLoader.load(NASA_TEXTURES.neptune)
            : TextureGenerator.createNeptuneTexture();
          roughnessVal = 0.65;
          break;
        case 'pluto':
          pTex = TextureGenerator.createPlutoTexture();
          bumpTex = pTex;
          bScale = 0.025;
          roughnessVal = 0.9;
          break;
        default:
          pTex = TextureGenerator.createMercuryTexture();
      }

      mat = new THREE.MeshStandardMaterial({
        map: pTex,
        bumpMap: bumpTex,
        bumpScale: bScale,
        roughness: roughnessVal,
        metalness: metalnessVal
      });
    }

    // 行星主體網格 (使用 64x64 高多邊形球體)
    const radius = data.visualRadius;
    const geo = new THREE.SphereGeometry(radius, 64, 64);
    const planetMesh = new THREE.Mesh(geo, mat);
    planetMesh.castShadow = true;
    planetMesh.receiveShadow = true;
    planetMesh.userData = { id: data.id, name: data.zhName };

    // 設定自轉軸傾角 (Axial Tilt)
    planetMesh.rotation.z = THREE.MathUtils.degToRad(data.axialTiltDeg || 0);
    planetGroup.add(planetMesh);

    // 各大行星專屬大氣層瑞利散射光暈 (Atmospheric Rayleigh Scattering Halos)
    if (['venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'].includes(data.id)) {
      let atmosColor = 0x88c4ff;
      let atmosScale = 1.08;
      let atmosOpacity = 0.25;

      switch (data.id) {
        case 'venus':
          atmosColor = 0xffc862; // 金黃大氣
          atmosScale = 1.10;
          atmosOpacity = 0.40;
          break;
        case 'mars':
          atmosColor = 0xef9a9a; // 赭紅稀薄塵埃
          atmosScale = 1.05;
          atmosOpacity = 0.22;
          break;
        case 'jupiter':
          atmosColor = 0xe0a96d; // 氣態巨星暖光
          atmosScale = 1.06;
          atmosOpacity = 0.25;
          break;
        case 'saturn':
          atmosColor = 0xf5d491; // 金黃大氣
          atmosScale = 1.06;
          atmosOpacity = 0.25;
          break;
        case 'uranus':
          atmosColor = 0x7be3f6; // 甲烷青碧
          atmosScale = 1.08;
          atmosOpacity = 0.35;
          break;
        case 'neptune':
          atmosColor = 0x4d88ff; // 湛藍深空
          atmosScale = 1.08;
          atmosOpacity = 0.38;
          break;
      }

      const atmosGeo = new THREE.SphereGeometry(radius * atmosScale, 32, 32);
      const atmosMat = new THREE.MeshBasicMaterial({
        color: atmosColor,
        side: THREE.BackSide,
        transparent: true,
        opacity: atmosOpacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
      planetMesh.add(atmosMesh);
    }

    // 地球特有大氣雲層、瑞利散射光暈與月球系統
    if (data.id === 'earth') {
      // 1. 地球大氣雲層 (真實 NASA 雲圖 + 投影陰影，depthWrite: false 杜絕黑斑遮蔽)
      const cloudTex = (typeof NASA_TEXTURES !== 'undefined' && NASA_TEXTURES.earthClouds)
        ? texLoader.load(NASA_TEXTURES.earthClouds)
        : TextureGenerator.createEarthCloudsTexture();

      const cloudGeo = new THREE.SphereGeometry(radius * 1.018, 64, 64);
      const cloudMat = new THREE.MeshStandardMaterial({
        map: cloudTex,
        transparent: true,
        opacity: 0.88,
        depthWrite: false, // 防止遮蔽內部地表
        blending: THREE.NormalBlending,
        roughness: 0.95
      });
      this.earthClouds = new THREE.Mesh(cloudGeo, cloudMat);
      this.earthClouds.castShadow = true;
      this.earthClouds.receiveShadow = false;
      planetMesh.add(this.earthClouds);

      // 2. 瑞利散射大氣發光層 (Atmospheric Rayleigh Scattering Glow)
      const atmosVertexShader = `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `;
      const atmosFragmentShader = `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vec3 viewDir = normalize(-vPosition);
          float intensity = pow(0.65 - dot(vNormal, viewDir), 2.2);
          vec3 glowColor = vec3(0.28, 0.65, 1.0);
          gl_FragColor = vec4(glowColor, clamp(intensity * 0.9, 0.0, 1.0));
        }
      `;
      const atmosGeo = new THREE.SphereGeometry(radius * 1.12, 48, 48);
      const atmosMat = new THREE.ShaderMaterial({
        vertexShader: atmosVertexShader,
        fragmentShader: atmosFragmentShader,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false // 防止遮蔽
      });
      this.earthAtmosphere = new THREE.Mesh(atmosGeo, atmosMat);
      planetMesh.add(this.earthAtmosphere);

      // 3. 月球本體 (真實 NASA 紋理 + 高精度凹凸陰影 + 接收與投射月食/日食陰影)
      const moonData = data.moon;
      const moonTex = (typeof NASA_TEXTURES !== 'undefined' && NASA_TEXTURES.moonDay)
        ? texLoader.load(NASA_TEXTURES.moonDay)
        : TextureGenerator.createMoonTexture();

      const moonGeo = new THREE.SphereGeometry(moonData.visualRadius, 48, 48);
      const moonMat = new THREE.MeshStandardMaterial({
        map: moonTex,
        bumpMap: moonTex,
        bumpScale: 0.035,
        roughness: 0.92,
        metalness: 0.0
      });
      this.moonMesh = new THREE.Mesh(moonGeo, moonMat);
      this.moonMesh.castShadow = true;
      this.moonMesh.receiveShadow = true;
      this.moonMesh.userData = { id: 'moon', name: moonData.zhName };
      planetGroup.add(this.moonMesh);

      // 月球公轉軌道曲線 (Moon Orbit Trail Line)
      const moonSegs = 96;
      const moonPoints = [];
      const mDist = moonData.orbitDistance;
      const moonIncRad = THREE.MathUtils.degToRad(5.14); // 5.14° 白道傾角
      for (let i = 0; i <= moonSegs; i++) {
        const theta = (i / moonSegs) * Math.PI * 2;
        moonPoints.push(new THREE.Vector3(
          mDist * Math.cos(theta),
          mDist * Math.sin(theta) * Math.sin(moonIncRad),
          mDist * Math.sin(theta) * Math.cos(moonIncRad)
        ));
      }
      const moonOrbitGeo = new THREE.BufferGeometry().setFromPoints(moonPoints);
      const moonOrbitMat = new THREE.LineBasicMaterial({
        color: 0x88c4ff,
        transparent: true,
        opacity: 0.65,
        linewidth: 1
      });
      this.moonOrbitLine = new THREE.Line(moonOrbitGeo, moonOrbitMat);
      planetGroup.add(this.moonOrbitLine);

      // 月球浮動標籤
      const moonCanvas = document.createElement('canvas');
      moonCanvas.width = 192;
      moonCanvas.height = 48;
      const mCtx = moonCanvas.getContext('2d');
      mCtx.font = 'bold 20px "Inter", "Segoe UI", sans-serif';
      mCtx.fillStyle = '#b0d4ff';
      mCtx.textAlign = 'center';
      mCtx.shadowColor = 'rgba(0,0,0,0.8)';
      mCtx.shadowBlur = 4;
      mCtx.fillText('月球 (Moon)', 96, 32);

      const mTex = new THREE.CanvasTexture(moonCanvas);
      const mSpriteMat = new THREE.SpriteMaterial({ map: mTex, transparent: true, depthTest: false });
      this.moonLabel = new THREE.Sprite(mSpriteMat);
      this.moonLabel.scale.set(6, 1.5, 1);
      this.moonLabel.position.set(0, moonData.visualRadius + 0.8, 0);
      this.moonMesh.add(this.moonLabel);
    }

    // 土星光環 (NASA 2K 高解析度環帶)
    if (data.hasRings && data.id === 'saturn') {
      const ringTexture = (typeof NASA_TEXTURES !== 'undefined' && NASA_TEXTURES.saturnRing)
        ? texLoader.load(NASA_TEXTURES.saturnRing)
        : TextureGenerator.createSaturnRingTexture(512);

      const ringGeo = new THREE.RingGeometry(data.ringInnerRadius, data.ringOuterRadius, 128);

      // UV 映射修正，使 1D 漸層貼圖沿半徑展開
      const pos = ringGeo.attributes.position;
      const uvs = ringGeo.attributes.uv;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const dist = Math.sqrt(x * x + y * y);
        const u = (dist - data.ringInnerRadius) / (data.ringOuterRadius - data.ringInnerRadius);
        uvs.setXY(i, u, 0.5);
      }
      uvs.needsUpdate = true;

      const ringMat = new THREE.MeshStandardMaterial({
        map: ringTexture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.96,
        roughness: 0.65,
        depthWrite: false
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      planetMesh.add(ringMesh);
    }

    // 天王星暗淡光環
    if (data.hasRings && data.id === 'uranus') {
      const ringGeo = new THREE.RingGeometry(data.ringInnerRadius, data.ringOuterRadius, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x9be8f5,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      planetMesh.add(ringMesh);
    }

    // 建立 3D 軌道曲線
    this.createOrbitPath(data);

    // 建立日心方位角動態指示線 (Sun-to-Planet Ray)
    this.createAzimuthRay(data);

    // 建立 3D 浮動標籤
    this.createPlanetLabel(data, planetGroup);

    this.scene.add(planetGroup);
    this.planetMeshes.set(data.id, {
      group: planetGroup,
      mesh: planetMesh,
      data: data
    });
  }

  createOrbitPath(data) {
    const segments = 256;
    const points = [];
    const a = data.visualOrbitRadius;
    const e = data.eccentricity;
    const incRad = THREE.MathUtils.degToRad(data.inclinationDeg || 0);

    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const r = (a * (1 - e * e)) / (1 + e * Math.cos(theta));
      const x = r * Math.cos(theta);
      const z = r * Math.sin(theta);
      const y = r * Math.sin(theta) * Math.sin(incRad);
      points.push(new THREE.Vector3(x, y, z));
    }

    const orbitGeo = new THREE.BufferGeometry().setFromPoints(points);
    const orbitMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(data.color),
      transparent: true,
      opacity: 0.45,
      linewidth: 1
    });
    const orbitLine = new THREE.Line(orbitGeo, orbitMat);
    this.scene.add(orbitLine);
    this.orbitLines.set(data.id, orbitLine);
  }

  createAzimuthRay(data) {
    // 日心到行星的方位角射線
    const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0)];
    const rayGeo = new THREE.BufferGeometry().setFromPoints(points);
    const rayMat = new THREE.LineDashedMaterial({
      color: new THREE.Color(data.color),
      dashSize: 2,
      gapSize: 1.5,
      transparent: true,
      opacity: 0.75
    });
    const rayLine = new THREE.Line(rayGeo, rayMat);
    rayLine.computeLineDistances();
    this.scene.add(rayLine);
    this.azimuthLines.set(data.id, rayLine);
  }

  createPlanetLabel(data, parentGroup) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    ctx.font = 'bold 24px "Inter", "Segoe UI", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 6;
    ctx.fillText(`${data.zhName}`, 128, 40);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(12, 3, 1);
    sprite.position.set(0, data.visualRadius + 3.0, 0);
    parentGroup.add(sprite);

    this.planetLabels.set(data.id, sprite);
  }

  createAsteroidBelts() {
    // 1. 主要小行星帶 (Main Asteroid Belt)
    const beltCfg = ASTEROID_BELT_CONFIG;
    const beltGeo = new THREE.DodecahedronGeometry(0.2, 0);
    const beltMat = new THREE.MeshStandardMaterial({
      color: 0x8a847e,
      roughness: 0.9
    });
    this.asteroidBelt = new THREE.InstancedMesh(beltGeo, beltMat, beltCfg.count);

    const dummy = new THREE.Object3D();
    for (let i = 0; i < beltCfg.count; i++) {
      const radius = beltCfg.innerRadius + Math.random() * (beltCfg.outerRadius - beltCfg.innerRadius);
      const angle = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 5.0; // 垂直分佈擾動
      const scale = beltCfg.minSize + Math.random() * (beltCfg.maxSize - beltCfg.minSize);

      dummy.position.set(radius * Math.cos(angle), y, radius * Math.sin(angle));
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      this.asteroidBelt.setMatrixAt(i, dummy.matrix);
    }
    this.asteroidBelt.instanceMatrix.needsUpdate = true;
    this.scene.add(this.asteroidBelt);

    // 2. 柯伊伯帶 (Kuiper Belt)
    const kCfg = KUIPER_BELT_CONFIG;
    const kGeo = new THREE.TetrahedronGeometry(0.25, 0);
    const kMat = new THREE.MeshStandardMaterial({
      color: 0xaac7d8,
      roughness: 0.6
    });
    this.kuiperBelt = new THREE.InstancedMesh(kGeo, kMat, kCfg.count);

    for (let i = 0; i < kCfg.count; i++) {
      const radius = kCfg.innerRadius + Math.random() * (kCfg.outerRadius - kCfg.innerRadius);
      const angle = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 12.0;
      const scale = kCfg.minSize + Math.random() * (kCfg.maxSize - kCfg.minSize);

      dummy.position.set(radius * Math.cos(angle), y, radius * Math.sin(angle));
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      this.kuiperBelt.setMatrixAt(i, dummy.matrix);
    }
    this.kuiperBelt.instanceMatrix.needsUpdate = true;
    this.scene.add(this.kuiperBelt);
  }

  /**
   * 建立著名彗星 (哈雷彗星 1P/Halley & 海爾-波普彗星 C/1995 O1)
   * 最高解析度版本：包含高細分碎形雕刻 3D 彗核、多層體積感彗髮、絲狀電漿離子尾 (Ion Tail) 與微米微晶塵埃尾 (Dust Tail)
   */
  createComets() {
    if (typeof COMETS_DATA === 'undefined') return;

    COMETS_DATA.forEach(comet => {
      const cometGroup = new THREE.Group();
      const isHaleBopp = comet.id === 'hale_bopp';

      // 1. 最高解析度碎形地形雕刻 3D 彗核 (Ultra-HD Sculpted Irregular Nucleus)
      const baseRadius = isHaleBopp ? 1.6 : 1.15;
      const nucleusGeo = new THREE.IcosahedronGeometry(baseRadius, 4); // 高細分球體 (2,560 面)
      const posAttr = nucleusGeo.attributes.position;
      
      // 使用多頻率碎形正弦噪聲模擬真實彗星表面撞擊坑、昇華裂谷與尖銳冰脊
      for (let i = 0; i < posAttr.count; i++) {
        const vx = posAttr.getX(i);
        const vy = posAttr.getY(i);
        const vz = posAttr.getZ(i);
        const len = Math.sqrt(vx * vx + vy * vy + vz * vz);
        const nx = vx / len;
        const ny = vy / len;
        const nz = vz / len;

        // 碎形地形起伏擾動 (Fractal Terrain Displacement)
        const d1 = 0.28 * Math.sin(nx * 4.2 + ny * 2.8) * Math.cos(nz * 3.5);
        const d2 = 0.14 * Math.sin(nx * 8.5 + nz * 6.2);
        const d3 = 0.07 * Math.cos(ny * 14.0 + nx * 11.0);
        const scale = 1.0 + d1 + d2 + d3;

        posAttr.setXYZ(i, vx * scale, vy * scale * 0.82, vz * scale); // 略微扁長橢球狀
      }
      nucleusGeo.computeVertexNormals();

      const nucleusMat = new THREE.MeshStandardMaterial({
        color: 0x1c2127,
        roughness: 0.96,
        metalness: 0.05
      });
      const nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
      nucleusMesh.castShadow = false;
      nucleusMesh.receiveShadow = false;
      nucleusMesh.userData = { id: comet.id, name: comet.zhName, isComet: true };
      cometGroup.add(nucleusMesh);

      // 2. 超高解析度多層體積彗髮 (採用 NormalBlending，杜絕在太陽表面產生刺眼光斑)
      // 內層極致熾熱核心 (Dense Inner Coma)
      const innerComaTex = TextureGenerator.createCometComaTexture(1024, '#ffffff', comet.comaColor);
      const innerComaMat = new THREE.SpriteMaterial({
        map: innerComaTex,
        transparent: true,
        opacity: 0.85,
        blending: THREE.NormalBlending,
        depthWrite: false
      });
      const innerComaSprite = new THREE.Sprite(innerComaMat);
      const innerComaSize = isHaleBopp ? 9.0 : 6.5;
      innerComaSprite.scale.set(innerComaSize, innerComaSize, 1);
      cometGroup.add(innerComaSprite);

      // 外層擴展螢光氣體包層 (Outer Swan Band Fluorescent Coma)
      const outerComaGeo = new THREE.SphereGeometry(isHaleBopp ? 4.6 : 3.4, 32, 32);
      const outerComaMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(comet.comaColor),
        transparent: true,
        opacity: 0.30,
        blending: THREE.NormalBlending,
        depthWrite: false
      });
      const outerComaMesh = new THREE.Mesh(outerComaGeo, outerComaMat);
      cometGroup.add(outerComaMesh);

      // 3. 2K 超高解析度絲狀離子尾 (Ultra-HD Filamentary Ion Tail)
      // 採用 3 組交叉多平面與柔和外層圓柱 (Multi-Sheet Volumetric Sheath - NormalBlending)
      const ionTailLen = isHaleBopp ? 65 : 48;
      const ionTex = TextureGenerator.createCometIonTailTexture(512, 1024, isHaleBopp ? false : true);
      const ionTailPivot = new THREE.Group();

      const ionPlaneGeo = new THREE.PlaneGeometry(isHaleBopp ? 7.5 : 5.2, ionTailLen);
      const ionMat = new THREE.MeshBasicMaterial({
        map: ionTex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.80,
        blending: THREE.NormalBlending,
        depthWrite: false
      });

      // 0度、60度、120度三向交叉平面，消除任何角度視覺死角
      for (let ang = 0; ang < 3; ang++) {
        const pMesh = new THREE.Mesh(ionPlaneGeo, ionMat);
        pMesh.position.y = ionTailLen / 2;
        pMesh.rotation.y = (ang * Math.PI) / 3;
        ionTailPivot.add(pMesh);
      }

      // 外層微弱包絡圓柱
      const ionCylGeo = new THREE.CylinderGeometry(0.4, isHaleBopp ? 3.8 : 2.8, ionTailLen, 32, 1, true);
      const ionCylMat = new THREE.MeshBasicMaterial({
        map: ionTex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35,
        blending: THREE.NormalBlending,
        depthWrite: false
      });
      const ionCylMesh = new THREE.Mesh(ionCylGeo, ionCylMat);
      ionCylMesh.position.y = ionTailLen / 2;
      ionTailPivot.add(ionCylMesh);
      cometGroup.add(ionTailPivot);

      // 4. 2K 超高解析度微米微晶塵埃尾 (Ultra-HD Curved Dust Tail - NormalBlending)
      const dustTailLen = isHaleBopp ? 56 : 40;
      const dustTex = TextureGenerator.createCometDustTailTexture(1024, 1024, isHaleBopp ? true : false);
      const dustTailPivot = new THREE.Group();

      const dustPlaneGeo = new THREE.PlaneGeometry(isHaleBopp ? 14 : 10, dustTailLen);
      const dustMat = new THREE.MeshBasicMaterial({
        map: dustTex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.70,
        blending: THREE.NormalBlending,
        depthWrite: false
      });

      for (let ang = 0; ang < 2; ang++) {
        const dMesh = new THREE.Mesh(dustPlaneGeo, dustMat);
        dMesh.position.y = dustTailLen / 2;
        dMesh.rotation.y = (ang * Math.PI) / 2;
        dMesh.rotation.z = 0.22; // 自然軌道運動彎曲角
        dustTailPivot.add(dMesh);
      }
      cometGroup.add(dustTailPivot);

      // 5. 向日面氣體昇華高速噴流 (Sunward Sublimation Jets)
      const jetPivot = new THREE.Group();
      const jetConeGeo = new THREE.ConeGeometry(0.8, 4.0, 16, 1, true);
      const jetMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.45,
        blending: THREE.NormalBlending,
        depthWrite: false
      });
      const jetMesh = new THREE.Mesh(jetConeGeo, jetMat);
      jetMesh.position.y = -2.0;
      jetMesh.rotation.x = Math.PI;
      jetPivot.add(jetMesh);
      cometGroup.add(jetPivot);

      // 6. 3D 浮動標籤 (High-DPI Canvas Sprite)
      const canvas = document.createElement('canvas');
      canvas.width = 420;
      canvas.height = 84;
      const ctx = canvas.getContext('2d');
      ctx.font = 'bold 24px "Inter", "Segoe UI", sans-serif';
      ctx.fillStyle = comet.orbitColor;
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.85)';
      ctx.shadowBlur = 8;
      ctx.fillText(`☄️ ${comet.zhName}`, 210, 48);

      const labelTex = new THREE.CanvasTexture(canvas);
      const labelSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: labelTex, transparent: true, depthTest: false }));
      labelSprite.scale.set(32, 6.4, 1);
      labelSprite.position.set(0, 8, 0);
      cometGroup.add(labelSprite);

      // 7. 彗星 3D 高細分克卜勒大橢圓軌跡線 (調用統一精確算法，確保軌跡線與彗星 100% 絕對重合)
      const orbitPoints = [];
      const numOrbPts = 500; // 500 高細分平滑點

      for (let p = 0; p <= numOrbPts; p++) {
        const theta = (p / numOrbPts) * Math.PI * 2;
        const coords = SolarSimulation.getComet3DCoords(comet, theta);
        orbitPoints.push(new THREE.Vector3(coords.x, coords.y, coords.z));
      }

      const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints);
      const orbitMat = new THREE.LineDashedMaterial({
        color: new THREE.Color(comet.orbitColor),
        dashSize: 5,
        gapSize: 3,
        transparent: true,
        opacity: 0.70
      });
      const orbitLine = new THREE.Line(orbitGeo, orbitMat);
      orbitLine.computeLineDistances();
      this.scene.add(orbitLine);

      this.scene.add(cometGroup);
      this.cometObjects.set(comet.id, {
        group: cometGroup,
        nucleusMesh: nucleusMesh,
        innerComaSprite: innerComaSprite,
        outerComaMesh: outerComaMesh,
        ionTailPivot: ionTailPivot,
        dustTailPivot: dustTailPivot,
        jetPivot: jetPivot,
        orbitLine: orbitLine,
        label: labelSprite,
        data: comet
      });
    });
  }

  /**
   * 建立銀河系宏觀 3D 旋臂粒子系統與銀心核球 (Milky Way Galaxy)
   */
  createMilkyWayGalaxy() {
    this.milkyWayGroup = new THREE.Group();

    // 1. 銀河系 22,000 顆旋臂粒子系統
    const particleCount = 22000;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorCore = new THREE.Color(0xfff5d0);   // 銀心亮金核
    const colorMid = new THREE.Color(0xa855f7);    // 旋臂紫色星雲
    const colorArm = new THREE.Color(0x38bdf8);    // 旋臂藍色恆星帶
    const colorDust = new THREE.Color(0xf43f5e);   // 電離氫氣 HII 區域

    const arms = 4;
    const galaxyRadius = 2200;

    for (let i = 0; i < particleCount; i++) {
      const radius = Math.pow(Math.random(), 1.4) * galaxyRadius;
      const spinAngle = radius * 0.0028;
      const armAngle = ((i % arms) * 2 * Math.PI) / arms;

      // 旋臂幾何擾動
      const spread = (radius / galaxyRadius) * 220 + 30;
      const randomX = (Math.random() - 0.5) * spread;
      const randomY = (Math.random() - 0.5) * (180 * Math.exp(-radius / 600) + 25);
      const randomZ = (Math.random() - 0.5) * spread;

      const x = Math.cos(armAngle + spinAngle) * radius + randomX;
      const y = randomY;
      const z = Math.sin(armAngle + spinAngle) * radius + randomZ;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // 粒子顏色依核心到外緣漸層
      const mixCol = colorCore.clone();
      if (radius < galaxyRadius * 0.25) {
        mixCol.lerp(colorMid, radius / (galaxyRadius * 0.25));
      } else if (radius < galaxyRadius * 0.65) {
        mixCol.lerp(colorArm, (radius - galaxyRadius * 0.25) / (galaxyRadius * 0.4));
      } else {
        mixCol.lerp(colorDust, (radius - galaxyRadius * 0.65) / (galaxyRadius * 0.35));
      }

      colors[i * 3] = mixCol.r;
      colors[i * 3 + 1] = mixCol.g;
      colors[i * 3 + 2] = mixCol.b;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // 使用極致柔和高斯光暈圓形星點貼圖 (Star Sprite)，徹底消除方塊點精靈瑕疵
    const starSpriteTex = TextureGenerator.createStarSpriteTexture();
    const mat = new THREE.PointsMaterial({
      size: 7.5,
      map: starSpriteTex,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      transparent: true,
      opacity: 0.92
    });

    const galaxyPoints = new THREE.Points(geo, mat);
    this.milkyWayGroup.add(galaxyPoints);

    // 2. 4K 超高解析度銀河系棒旋星盤 (Continuous 4K Barred Spiral Galactic Disc)
    const mwDiskTex = TextureGenerator.createMilkyWayDiskTexture(4096);
    const mwDiskGeo = new THREE.PlaneGeometry(galaxyRadius * 2.2, galaxyRadius * 2.2);
    
    // 主盤面 (Primary Disc)
    const mwDiskMat = new THREE.MeshBasicMaterial({
      map: mwDiskTex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.82,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const mwDiskMesh = new THREE.Mesh(mwDiskGeo, mwDiskMat);
    mwDiskMesh.rotation.x = -Math.PI / 2;
    this.milkyWayGroup.add(mwDiskMesh);

    // 上下雙層立體星際雲氣 (Volumetric Upper/Lower Gaseous Halo Discs)
    const upperHaloMat = new THREE.MeshBasicMaterial({
      map: mwDiskTex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const upperHaloMesh = new THREE.Mesh(mwDiskGeo, upperHaloMat);
    upperHaloMesh.rotation.x = -Math.PI / 2;
    upperHaloMesh.position.y = 12;
    upperHaloMesh.scale.set(1.02, 1.02, 1.02);
    this.milkyWayGroup.add(upperHaloMesh);

    const lowerHaloMesh = new THREE.Mesh(mwDiskGeo, upperHaloMat);
    lowerHaloMesh.rotation.x = -Math.PI / 2;
    lowerHaloMesh.position.y = -12;
    lowerHaloMesh.scale.set(1.02, 1.02, 1.02);
    this.milkyWayGroup.add(lowerHaloMesh);

    // 3. 銀心超亮核球 (Galactic Bulge - 位於銀心 (0, 0, 0) 本地座標，即世界座標 z = -1400 人馬座 A* 處)
    const bulgeGeo = new THREE.SphereGeometry(95, 32, 32);
    const bulgeMat = new THREE.MeshBasicMaterial({
      color: 0xffedd5,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const bulge = new THREE.Mesh(bulgeGeo, bulgeMat);
    bulge.position.set(0, 0, 0);
    this.milkyWayGroup.add(bulge);

    // 4. 太陽系在銀河系獵戶臂上的定位圈標記 (位於本地座標 (0, 0, 1400)，即世界座標太陽系 (0,0,0) 處)
    const sunBeaconGeo = new THREE.RingGeometry(24, 30, 48);
    const sunBeaconMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9
    });
    const sunBeacon = new THREE.Mesh(sunBeaconGeo, sunBeaconMat);
    sunBeacon.rotation.x = Math.PI / 2;
    sunBeacon.position.set(0, 0, 1400);
    this.milkyWayGroup.add(sunBeacon);

    // 太陽系位置標籤
    const sunLabelCanvas = document.createElement('canvas');
    sunLabelCanvas.width = 300;
    sunLabelCanvas.height = 64;
    const sCtx = sunLabelCanvas.getContext('2d');
    sCtx.font = 'bold 22px "Inter", "Segoe UI", sans-serif';
    sCtx.fillStyle = '#00f2fe';
    sCtx.textAlign = 'center';
    sCtx.shadowColor = 'rgba(0,0,0,0.8)';
    sCtx.shadowBlur = 6;
    sCtx.fillText('☀️ 太陽系 (獵戶座次臂)', 150, 40);

    const sunLabelTex = new THREE.CanvasTexture(sunLabelCanvas);
    const sunLabelSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: sunLabelTex, transparent: true, depthTest: false }));
    sunLabelSprite.scale.set(36, 8, 1);
    sunLabelSprite.position.set(0, 35, 1400);
    this.milkyWayGroup.add(sunLabelSprite);

    // 將整個銀河系群組的世界中心定位在銀心 (z = -1400 人馬座 A* 超大質量黑洞處)
    // 使得銀河系的自轉完全圍繞銀心旋轉，而非圍繞太陽！
    this.milkyWayGroup.position.set(0, 0, -1400);
    this.scene.add(this.milkyWayGroup);
  }

  /**
   * 建立已知黑洞 (包含目前已知最靠近太陽系的 Gaia BH1 與銀心人馬座 A*)
   */
  createBlackHoles() {
    BLACK_HOLES_DATA.forEach(bh => {
      const bhGroup = new THREE.Group();
      const coords = bh.visualCoords;
      bhGroup.position.set(coords.x, coords.y, coords.z);

      // 1. 黑洞事件視界 (Event Horizon - 絕對純黑吸光球體，完全零反光)
      const horizonRadius = bh.id === 'sgr_a_star' ? 15.0 : 4.8;
      const horizonGeo = new THREE.SphereGeometry(horizonRadius, 48, 48);
      const horizonMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const horizonMesh = new THREE.Mesh(horizonGeo, horizonMat);
      horizonMesh.userData = { id: bh.id, name: bh.zhName, isBlackHole: true };
      bhGroup.add(horizonMesh);

      // 2. 廣義相對論高解析赤道吸積盤 (Equatorial Relativistic Accretion Disk)
      const diskTex = TextureGenerator.createAccretionDiskTexture(bh.glowColor, '#ffffff', bh.color, 1024);
      const diskInner = horizonRadius * 1.35;
      const diskOuter = horizonRadius * 4.6;
      const diskGeo = new THREE.RingGeometry(diskInner, diskOuter, 96);
      const diskMat = new THREE.MeshBasicMaterial({
        map: diskTex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.96,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const diskMesh = new THREE.Mesh(diskGeo, diskMat);
      diskMesh.rotation.x = Math.PI / 3;
      bhGroup.add(diskMesh);

      // 3. 愛因斯坦重力透鏡上彎曲與下彎曲光弧 (Einstein Gravitational Lensing Halo / Arch)
      // 在星際效應 (Interstellar) 模型中，黑洞後方的吸積盤光線受強重力彎折繞過事件視界上下兩側
      const haloGeo = new THREE.RingGeometry(diskInner * 0.98, diskOuter * 0.95, 96);
      const haloMat = new THREE.MeshBasicMaterial({
        map: diskTex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.88,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.rotation.y = Math.PI / 6;
      haloMesh.rotation.x = Math.PI / 2.2;
      bhGroup.add(haloMesh);

      // 4. 光子捕獲球層 (Photon Sphere, r = 1.5 rs)
      const photonGeo = new THREE.RingGeometry(horizonRadius * 1.02, horizonRadius * 1.25, 64);
      const photonMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(bh.glowColor),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.98,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const photonMesh = new THREE.Mesh(photonGeo, photonMat);
      photonMesh.rotation.x = Math.PI / 3;
      bhGroup.add(photonMesh);

      // 5. 相對論雙極高能電漿噴流 (Relativistic Polar Astrophysical Jets)
      const jetTex = TextureGenerator.createRelativisticJetTexture(bh.glowColor);
      const jetHeight = horizonRadius * 10;
      const jetRadius = horizonRadius * 0.7;
      const jetGeo = new THREE.CylinderGeometry(jetRadius * 2.2, jetRadius * 0.1, jetHeight, 32, 1, true);

      const jetMat = new THREE.MeshBasicMaterial({
        map: jetTex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.82,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      // 北極噴流 (+Y)
      const northJet = new THREE.Mesh(jetGeo, jetMat);
      northJet.position.y = jetHeight / 2 + horizonRadius;
      bhGroup.add(northJet);

      // 南極噴流 (-Y)
      const southJet = new THREE.Mesh(jetGeo, jetMat);
      southJet.position.y = -(jetHeight / 2 + horizonRadius);
      southJet.rotation.z = Math.PI;
      bhGroup.add(southJet);

      // 6. 伴星與洛希瓣物質吸積流 (Roche-Lobe Mass Transfer Stream)
      let companionMesh = null;
      let transferStream = null;
      if (bh.companionStar) {
        const starGeo = new THREE.SphereGeometry(1.9, 32, 32);
        const starMat = new THREE.MeshStandardMaterial({
          color: 0xffe88a,
          emissive: 0xffaa22,
          emissiveIntensity: 0.6,
          roughness: 0.3
        });
        companionMesh = new THREE.Mesh(starGeo, starMat);
        companionMesh.position.set(horizonRadius * 4.5, 0, 0);
        bhGroup.add(companionMesh);

        // 物質吸積流曲線
        const streamPoints = [];
        const numStreamPts = 40;
        for (let s = 0; s <= numStreamPts; s++) {
          const t = s / numStreamPts;
          const strR = horizonRadius * 4.5 * (1 - t) + diskInner * t;
          const strAngle = t * Math.PI * 1.5;
          streamPoints.push(new THREE.Vector3(
            strR * Math.cos(strAngle),
            Math.sin(t * Math.PI) * 0.8,
            strR * Math.sin(strAngle)
          ));
        }
        const streamGeo = new THREE.BufferGeometry().setFromPoints(streamPoints);
        const streamMat = new THREE.LineBasicMaterial({
          color: new THREE.Color(bh.glowColor),
          transparent: true,
          opacity: 0.85,
          linewidth: 2
        });
        transferStream = new THREE.Line(streamGeo, streamMat);
        bhGroup.add(transferStream);
      }

      // 7. 太陽系到黑洞的星際距離雷射指引光束 (Interstellar Distance Beam)
      const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(coords.x, coords.y, coords.z)];
      const beamGeo = new THREE.BufferGeometry().setFromPoints(points);
      const beamMat = new THREE.LineDashedMaterial({
        color: new THREE.Color(bh.glowColor),
        dashSize: 12,
        gapSize: 6,
        transparent: true,
        opacity: bh.isClosest ? 0.95 : 0.55
      });
      const beamLine = new THREE.Line(beamGeo, beamMat);
      beamLine.computeLineDistances();
      this.scene.add(beamLine);

      // 8. 3D 浮動標籤 (標示黑洞名稱與光年距離)
      const canvas = document.createElement('canvas');
      canvas.width = 420;
      canvas.height = 90;
      const ctx = canvas.getContext('2d');
      ctx.font = 'bold 24px "Inter", "Segoe UI", sans-serif';
      ctx.fillStyle = bh.isClosest ? '#ec4899' : '#a855f7';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.9)';
      ctx.shadowBlur = 8;
      ctx.fillText(`🕳️ ${bh.zhName}`, 210, 36);
      ctx.font = 'bold 18px "JetBrains Mono", monospace';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`距離太陽系: ${bh.distanceLy.toLocaleString()} 光年`, 210, 72);

      const labelTex = new THREE.CanvasTexture(canvas);
      const labelMat = new THREE.SpriteMaterial({ map: labelTex, transparent: true, depthTest: false });
      const sprite = new THREE.Sprite(labelMat);
      sprite.scale.set(38, 8.5, 1);
      sprite.position.set(0, horizonRadius + 15, 0);
      bhGroup.add(sprite);

      this.scene.add(bhGroup);
      this.blackHoleObjects.set(bh.id, {
        group: bhGroup,
        mesh: horizonMesh,
        diskMesh: diskMesh,
        haloMesh: haloMesh,
        northJet: northJet,
        southJet: southJet,
        companionMesh: companionMesh,
        transferStream: transferStream,
        beamLine: beamLine,
        label: sprite,
        data: bh
      });
    });
  }

  /**
   * 根據模擬狀態更新 3D 場景中所有物件的位置與旋轉
   */
  updateSceneObjects() {
    const states = this.simulation.planetStates;

    // 1. 更新太陽與日珥耀斑動畫
    const sunState = states.get('sun');
    const sunObj = this.planetMeshes.get('sun');
    if (sunObj && sunState) {
      sunObj.mesh.rotation.y = sunState.rotationAngle;
      if (sunObj.group.userData.flareRings) {
        sunObj.group.userData.flareRings.forEach((flare, idx) => {
          flare.rotation.z += 0.003 * (idx + 1);
        });
      }
    }

    // 2. 更新各大行星
    PLANETS_DATA.forEach(planet => {
      if (planet.id === 'sun') return;
      const state = states.get(planet.id);
      const obj = this.planetMeshes.get(planet.id);
      if (!state || !obj) return;

      // 更新行星位置
      obj.group.position.set(state.x, state.y, state.z);

      // 更新行星自轉
      obj.mesh.rotation.y = state.rotationAngle;

      // 地球雲層自轉與月球公轉
      if (planet.id === 'earth') {
        if (this.earthClouds) {
          this.earthClouds.rotation.y = state.rotationAngle * 1.15;
        }
        if (this.moonMesh) {
          const mDist = planet.moon.orbitDistance;
          const mAngle = state.moonOrbitAngle;
          const moonIncRad = THREE.MathUtils.degToRad(5.14);
          this.moonMesh.position.set(
            mDist * Math.cos(mAngle),
            mDist * Math.sin(mAngle) * Math.sin(moonIncRad),
            mDist * Math.sin(mAngle) * Math.cos(moonIncRad)
          );
          this.moonMesh.rotation.y = mAngle;
        }
      }

    // 更新地月系統專屬高精度陰影方向光 (實現真實日食/月食/晨昏線陰影)
    const earthState = states.get('earth');
    if (earthState && this.earthSunLight) {
      const earthPos = new THREE.Vector3(earthState.x, earthState.y, earthState.z);
      this.earthSunLight.target.position.copy(earthPos);
      const dirFromSun = earthPos.clone().normalize();
      this.earthSunLight.position.copy(earthPos).sub(dirFromSun.clone().multiplyScalar(30));
      this.earthSunLight.target.updateMatrixWorld();
    }

      // 更新日心方位角指示射線
      const rayLine = this.azimuthLines.get(planet.id);
      if (rayLine) {
        const positions = rayLine.geometry.attributes.position.array;
        positions[0] = 0;
        positions[1] = 0;
        positions[2] = 0;
        positions[3] = state.x;
        positions[4] = state.y;
        positions[5] = state.z;
        rayLine.geometry.attributes.position.needsUpdate = true;
        rayLine.computeLineDistances();
      }
    });

    // 3. 小行星帶微幅自轉動畫
    if (this.asteroidBelt) {
      this.asteroidBelt.rotation.y += 0.0003;
    }
    if (this.kuiperBelt) {
      this.kuiperBelt.rotation.y += 0.0001;
    }

    // 4. 銀河系宏觀星盤（因 1 個銀河年長達 2.3 億年，在行星模擬時間尺度下作為精確宇宙慣性參考系，保持獵戶座次臂與太陽系精確鎖定）
    // 內部黑洞之廣義相對論極限吸積盤、光弧與噴流則維持高速相對論差動旋轉
    this.blackHoleObjects.forEach(bhObj => {
      if (bhObj.diskMesh) {
        bhObj.diskMesh.rotation.z += 0.025; // 吸積盤高速相對論差動旋轉
      }
      if (bhObj.haloMesh) {
        bhObj.haloMesh.rotation.z += 0.018; // 重力透鏡光弧
      }
      if (bhObj.northJet && bhObj.southJet) {
        bhObj.northJet.rotation.y += 0.04;  // 噴流螺旋磁場旋轉
        bhObj.southJet.rotation.y += 0.04;
      }
      if (bhObj.companionMesh) {
        const time = performance.now() * 0.001;
        const orbitR = bhObj.data.id === 'sgr_a_star' ? 45 : 20;
        bhObj.companionMesh.position.set(
          orbitR * Math.cos(time * 0.6),
          1.5 * Math.sin(time * 0.6),
          orbitR * Math.sin(time * 0.6)
        );
      }
    });

    // 5. 更新彗星位置、彗尾指向與活躍度
    if (this.simulation.cometStates && this.cometObjects) {
      this.cometObjects.forEach((cObj, cometId) => {
        const cState = this.simulation.cometStates.get(cometId);
        if (!cState) return;

        // 更新彗星位置
        cObj.group.position.set(cState.x, cState.y, cState.z);

        // 彗核自轉
        cObj.nucleusMesh.rotation.y += 0.02;
        cObj.nucleusMesh.rotation.x += 0.01;

        // 彗尾動態定向 (永遠背向太陽原點 (0,0,0))
        const cometPos = new THREE.Vector3(cState.x, cState.y, cState.z);
        const sunDir = cometPos.clone().normalize(); // 太陽到彗星方向
        const upVec = new THREE.Vector3(0, 1, 0);

        // 藍色離子尾沿日彗連線背向太陽直刺
        const targetQuat = new THREE.Quaternion().setFromUnitVectors(upVec, sunDir);
        cObj.ionTailPivot.quaternion.copy(targetQuat);

        // 金黃/白色塵埃尾受軌道公轉運動影響產生微幅彎曲偏角
        const dustDir = sunDir.clone().add(new THREE.Vector3(0.12, 0.04, 0.12)).normalize();
        const dustQuat = new THREE.Quaternion().setFromUnitVectors(upVec, dustDir);
        cObj.dustTailPivot.quaternion.copy(dustQuat);

        // 彗尾長度、多層彗髮體積隨近日點活性因子動態縮放
        const act = cState.activityFactor;
        cObj.ionTailPivot.scale.set(act, act, act);
        cObj.dustTailPivot.scale.set(act * 1.1, act * 0.95, act * 1.1);

        if (cObj.innerComaSprite) {
          const isHB = cObj.data.id === 'hale_bopp';
          const baseComa = isHB ? 9.0 : 6.5;
          const currentComa = baseComa * (act * 0.75 + 0.35);
          cObj.innerComaSprite.scale.set(currentComa, currentComa, 1);
        }
        if (cObj.outerComaMesh) {
          cObj.outerComaMesh.scale.set(act * 0.85 + 0.35, act * 0.85 + 0.35, act * 0.85 + 0.35);
        }
        if (cObj.jetPivot) {
          cObj.jetPivot.quaternion.copy(targetQuat);
          cObj.jetPivot.scale.set(act * 0.9, act * 0.9, act * 0.9);
        }
      });
    }

    // 6. 相機跟隨與平滑過渡
    this.updateCameraFollow();
  }

  updateCameraFollow() {
    if (this.cameraLerpTarget && this.controlsTargetLerp) {
      this.camera.position.lerp(this.cameraLerpTarget, 0.08);
      this.controls.target.lerp(this.controlsTargetLerp, 0.08);

      // 當接近目標點時解除過渡動畫
      if (this.camera.position.distanceTo(this.cameraLerpTarget) < 0.3) {
        this.cameraLerpTarget = null;
        this.controlsTargetLerp = null;
      }
    } else if (this.focusedPlanetId) {
      // 正在鎖定跟隨某星球
      const state = this.simulation.planetStates.get(this.focusedPlanetId);
      if (state) {
        const targetPos = new THREE.Vector3(state.x, state.y, state.z);
        const deltaTarget = new THREE.Vector3().subVectors(targetPos, this.controls.target);
        this.camera.position.add(deltaTarget);
        this.controls.target.copy(targetPos);
      }
    } else if (this.focusedCometId) {
      // 正在鎖定跟隨某彗星
      const state = this.simulation.cometStates.get(this.focusedCometId);
      if (state) {
        const targetPos = new THREE.Vector3(state.x, state.y, state.z);
        const deltaTarget = new THREE.Vector3().subVectors(targetPos, this.controls.target);
        this.camera.position.add(deltaTarget);
        this.controls.target.copy(targetPos);
      }
    }
  }

  /**
   * 鏡頭聚焦至特定天體
   */
  focusOnPlanet(planetId) {
    this.focusedPlanetId = planetId;
    this.focusedBlackHoleId = null;
    this.focusedCometId = null;
    const state = this.simulation.planetStates.get(planetId);
    const obj = this.planetMeshes.get(planetId);
    if (!state || !obj) return;

    const pRadius = obj.data.visualRadius;
    const offsetDistance = Math.max(pRadius * 5.0, 8.0);

    const targetPos = new THREE.Vector3(state.x, state.y, state.z);
    const cameraTarget = new THREE.Vector3(
      state.x + offsetDistance * 0.8,
      state.y + offsetDistance * 0.5,
      state.z + offsetDistance * 0.8
    );

    this.controlsTargetLerp = targetPos;
    this.cameraLerpTarget = cameraTarget;
  }

  /**
   * 鏡頭聚焦至特定彗星 (哈雷彗星, 海爾-波普彗星)
   */
  focusOnComet(cometId) {
    this.focusedPlanetId = null;
    this.focusedBlackHoleId = null;
    this.focusedCometId = cometId;
    this.isTopDownView = false;
    const cObj = this.cometObjects.get(cometId);
    if (!cObj) return;

    const cState = this.simulation.cometStates.get(cometId);
    if (!cState) return;

    const targetPos = new THREE.Vector3(cState.x, cState.y, cState.z);
    const cameraTarget = new THREE.Vector3(
      cState.x + 24,
      cState.y + 12,
      cState.z + 24
    );
    this.controlsTargetLerp = targetPos;
    this.cameraLerpTarget = cameraTarget;
  }

  /**
   * 鏡頭聚焦至特定黑洞 (Gaia BH1, Gaia BH3, Sgr A*)
   */
  focusOnBlackHole(bhId) {
    this.focusedPlanetId = null;
    this.focusedCometId = null;
    this.focusedBlackHoleId = bhId;
    this.isTopDownView = false;
    const bhObj = this.blackHoleObjects.get(bhId);
    if (!bhObj) return;

    const coords = bhObj.data.visualCoords;
    const targetPos = new THREE.Vector3(coords.x, coords.y, coords.z);
    const offset = bhId === 'sgr_a_star' ? 65 : 28;
    const cameraTarget = new THREE.Vector3(
      coords.x + offset * 0.8,
      coords.y + offset * 0.45,
      coords.z + offset * 0.8
    );
    this.controlsTargetLerp = targetPos;
    this.cameraLerpTarget = cameraTarget;
  }

  /**
   * 切換銀河系宏觀全景視角 (Milky Way Galaxy View)
   */
  setMilkyWayView() {
    this.focusedPlanetId = null;
    this.focusedBlackHoleId = null;
    this.focusedCometId = null;
    this.isTopDownView = false;
    this.controlsTargetLerp = new THREE.Vector3(0, 0, -700);
    this.cameraLerpTarget = new THREE.Vector3(0, 2400, 1800);
  }

  /**
   * 切換以地球為主體的視角 / 地月系統特寫 (Earth-Centered Geocentric Mode)
   */
  setEarthCenteredView() {
    this.focusedPlanetId = 'earth';
    this.focusedBlackHoleId = null;
    this.focusedCometId = null;
    this.isTopDownView = false;
    const state = this.simulation.planetStates.get('earth');
    if (!state) return;

    const targetPos = new THREE.Vector3(state.x, state.y, state.z);
    const cameraTarget = new THREE.Vector3(
      state.x + 6.8,
      state.y + 4.2,
      state.z + 6.8
    );
    this.controlsTargetLerp = targetPos;
    this.cameraLerpTarget = cameraTarget;
  }

  /**
   * 切換俯瞰視角 (Top-Down Heliocentric View)
   */
  setTopDownView() {
    this.focusedPlanetId = null;
    this.focusedBlackHoleId = null;
    this.focusedCometId = null;
    this.isTopDownView = true;
    this.controlsTargetLerp = new THREE.Vector3(0, 0, 0);
    this.cameraLerpTarget = new THREE.Vector3(0, 360, 0.01);
  }

  /**
   * 重設為太陽系全局 3D 視角
   */
  resetFreeOrbitView() {
    this.focusedPlanetId = null;
    this.focusedBlackHoleId = null;
    this.focusedCometId = null;
    this.isTopDownView = false;
    this.controlsTargetLerp = new THREE.Vector3(0, 0, 0);
    this.cameraLerpTarget = new THREE.Vector3(0, 140, 260);
  }

  /**
   * 切換各圖層可見度
   */
  toggleLayer(layerName, visible) {
    if (this.layers.hasOwnProperty(layerName)) {
      this.layers[layerName] = visible;
    }

    switch (layerName) {
      case 'orbits':
        this.orbitLines.forEach(line => line.visible = visible);
        break;
      case 'azimuthRays':
        this.azimuthLines.forEach(line => line.visible = visible);
        break;
      case 'labels':
        this.planetLabels.forEach(label => label.visible = visible);
        if (this.moonLabel) this.moonLabel.visible = visible;
        this.blackHoleObjects.forEach(b => b.label.visible = visible);
        this.cometObjects.forEach(c => c.label.visible = visible);
        break;
      case 'moonOrbit':
        if (this.moonOrbitLine) this.moonOrbitLine.visible = visible;
        if (this.moonLabel) this.moonLabel.visible = visible;
        break;
      case 'eclipticGrid':
        if (this.eclipticGrid) this.eclipticGrid.visible = visible;
        break;
      case 'asteroidBelt':
        if (this.asteroidBelt) this.asteroidBelt.visible = visible;
        if (this.kuiperBelt) this.kuiperBelt.visible = visible;
        break;
      case 'milkyWay':
        if (this.milkyWayGroup) this.milkyWayGroup.visible = visible;
        break;
      case 'blackHoles':
        this.blackHoleObjects.forEach(b => {
          b.group.visible = visible;
          b.beamLine.visible = visible;
        });
        break;
      case 'comets':
        this.cometObjects.forEach(c => {
          c.group.visible = visible;
          c.orbitLine.visible = visible;
        });
        break;
    }
  }

  onPointerDown(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const meshesToTest = [];
    this.planetMeshes.forEach(p => {
      meshesToTest.push(p.mesh);
    });
    this.blackHoleObjects.forEach(bh => {
      meshesToTest.push(bh.mesh);
    });
    this.cometObjects.forEach(c => {
      meshesToTest.push(c.nucleusMesh);
      meshesToTest.push(c.comaMesh);
    });

    const intersects = this.raycaster.intersectObjects(meshesToTest, true);
    if (intersects.length > 0) {
      let hitMesh = intersects[0].object;
      while (hitMesh && !hitMesh.userData.id && hitMesh.parent) {
        hitMesh = hitMesh.parent;
      }
      if (hitMesh && hitMesh.userData && hitMesh.userData.id) {
        if (hitMesh.userData.isComet && window.onCometSelected) {
          window.onCometSelected(hitMesh.userData.id);
        } else if (hitMesh.userData.isBlackHole && window.onBlackHoleSelected) {
          window.onBlackHoleSelected(hitMesh.userData.id);
        } else if (window.onPlanetSelected) {
          window.onPlanetSelected(hitMesh.userData.id);
        }
      }
    }
  }

  onWindowResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  render() {
    this.controls.update();
    this.updateSceneObjects();
    this.renderer.render(this.scene, this.camera);
  }
}
