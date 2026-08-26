/**
 * 程序化紋理生成引擎 (Procedural Texture Engine)
 * 使用 HTML5 Canvas 在本地即時生成高解析度、高細節的星球材質與光環紋理
 * 無需外部圖床載入，離線可用且無跨域安全性限制
 */

class TextureGenerator {
  /**
   * 建立帶有基礎 Perlin/Simplex 風格噪點的輔助函式
   */
  static createNoise(width, height, scale = 1.0) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      const val = Math.floor(Math.random() * 255 * scale);
      data[i] = val;
      data[i + 1] = val;
      data[i + 2] = val;
      data[i + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);
    return canvas;
  }

  /**
   * 太陽紋理 (高溫電漿、太陽黑子、流動光斑)
   */
  static createSunTexture(width = 1024, height = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // 基礎日冕漸層
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#ff4800');
    gradient.addColorStop(0.3, '#ff8000');
    gradient.addColorStop(0.5, '#ffaa00');
    gradient.addColorStop(0.7, '#ff8000');
    gradient.addColorStop(1, '#ff3700');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 電漿對流顆粒斑點
    for (let i = 0; i < 600; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = Math.random() * 18 + 4;
      const radial = ctx.createRadialGradient(x, y, 0, x, y, radius);
      radial.addColorStop(0, 'rgba(255, 255, 180, 0.8)');
      radial.addColorStop(0.5, 'rgba(255, 160, 20, 0.4)');
      radial.addColorStop(1, 'rgba(255, 80, 0, 0)');
      ctx.fillStyle = radial;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // 太陽黑子群
    for (let i = 0; i < 24; i++) {
      const x = Math.random() * width;
      const y = height * 0.3 + Math.random() * (height * 0.4);
      const r = Math.random() * 8 + 3;
      const spotGrad = ctx.createRadialGradient(x, y, 0, x, y, r * 1.8);
      spotGrad.addColorStop(0, 'rgba(90, 15, 0, 0.95)');
      spotGrad.addColorStop(0.6, 'rgba(160, 40, 0, 0.7)');
      spotGrad.addColorStop(1, 'rgba(255, 120, 0, 0)');
      ctx.fillStyle = spotGrad;
      ctx.beginPath();
      ctx.arc(x, y, r * 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
  }

  /**
   * 水星紋理 (灰褐色撞擊坑、玄武岩盆地)
   */
  static createMercuryTexture(width = 1024, height = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // 基礎灰色岩石層
    ctx.fillStyle = '#6f6b64';
    ctx.fillRect(0, 0, width, height);

    // 斑駁暗色區域 (盆地)
    for (let i = 0; i < 150; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const r = Math.random() * 40 + 10;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, 'rgba(70, 66, 60, 0.6)');
      grad.addColorStop(1, 'rgba(111, 107, 100, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // 隕石坑與輻射紋 (Craters & Rays)
    for (let i = 0; i < 350; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const r = Math.random() * 12 + 2;

      // 坑壁亮緣
      ctx.strokeStyle = 'rgba(210, 205, 195, 0.6)';
      ctx.lineWidth = Math.max(1, r * 0.2);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();

      // 坑底暗部
      ctx.fillStyle = 'rgba(45, 42, 38, 0.7)';
      ctx.beginPath();
      ctx.arc(x, y, r * 0.7, 0, Math.PI * 2);
      ctx.fill();

      // 中央峰
      if (r > 6) {
        ctx.fillStyle = 'rgba(220, 215, 205, 0.8)';
        ctx.beginPath();
        ctx.arc(x, y, r * 0.15, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    return new THREE.CanvasTexture(canvas);
  }

  /**
   * 金星紋理 (厚重硫酸雲層、漩渦流紋)
   */
  static createVenusTexture(width = 1024, height = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // 溫暖金黃色調
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#c7a364');
    grad.addColorStop(0.3, '#ebd49d');
    grad.addColorStop(0.5, '#f5e4b8');
    grad.addColorStop(0.7, '#ebd49d');
    grad.addColorStop(1, '#be9859');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // 雲系流線 (大氣帶狀漩渦)
    for (let y = 0; y < height; y += 4) {
      const alpha = Math.sin((y / height) * Math.PI * 12) * 0.15 + 0.15;
      ctx.fillStyle = `rgba(215, 175, 110, ${alpha})`;
      ctx.fillRect(0, y, width, 3);
    }

    // 柔和波動氣流
    for (let i = 0; i < 80; i++) {
      const cx = Math.random() * width;
      const cy = Math.random() * height;
      const rx = Math.random() * 120 + 40;
      const ry = Math.random() * 20 + 8;
      const cloudGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx);
      cloudGrad.addColorStop(0, 'rgba(255, 245, 220, 0.4)');
      cloudGrad.addColorStop(0.6, 'rgba(210, 160, 90, 0.2)');
      cloudGrad.addColorStop(1, 'rgba(190, 140, 70, 0)');
      ctx.fillStyle = cloudGrad;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, Math.random() * 0.2 - 0.1, 0, Math.PI * 2);
      ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
  }

  /**
   * 地球地表紋理 (深藍海洋、綠地、荒漠大陸、極地冰冠)
   */
  static createEarthTexture(width = 2048, height = 1024) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // 1. 深海藍色底
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
    oceanGrad.addColorStop(0, '#103060');
    oceanGrad.addColorStop(0.5, '#0b2347');
    oceanGrad.addColorStop(1, '#103060');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, width, height);

    // 大陸形狀繪製輔助
    function drawContinent(points, fillColor, strokeColor = null) {
      ctx.fillStyle = fillColor;
      ctx.beginPath();
      ctx.moveTo(points[0][0] * width, points[0][1] * height);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0] * width, points[i][1] * height);
      }
      ctx.closePath();
      ctx.fill();
      if (strokeColor) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    // 歐亞非大陸 (Eurasia + Africa)
    const eurasia = [
      [0.45, 0.20], [0.55, 0.18], [0.70, 0.22], [0.85, 0.25], [0.88, 0.40],
      [0.80, 0.45], [0.73, 0.42], [0.68, 0.52], [0.58, 0.45], [0.50, 0.38],
      [0.44, 0.32], [0.42, 0.25]
    ];
    drawContinent(eurasia, '#3d7a46', '#2d5a34');

    // 非洲大陸 (Africa)
    const africa = [
      [0.46, 0.38], [0.58, 0.40], [0.62, 0.52], [0.58, 0.70], [0.52, 0.78],
      [0.48, 0.65], [0.44, 0.48], [0.45, 0.38]
    ];
    drawContinent(africa, '#6e7a3d', '#4d5727');

    // 北美洲 (North America)
    const northAmerica = [
      [0.10, 0.18], [0.25, 0.16], [0.30, 0.32], [0.25, 0.45], [0.20, 0.48],
      [0.14, 0.42], [0.10, 0.32], [0.08, 0.22]
    ];
    drawContinent(northAmerica, '#417d4a', '#2b5c33');

    // 南美洲 (South America)
    const southAmerica = [
      [0.22, 0.50], [0.32, 0.54], [0.34, 0.68], [0.28, 0.84], [0.24, 0.88],
      [0.22, 0.72], [0.20, 0.58]
    ];
    drawContinent(southAmerica, '#2c7337', '#1b4d24');

    // 澳洲 (Australia)
    const australia = [
      [0.78, 0.65], [0.88, 0.63], [0.90, 0.75], [0.82, 0.80], [0.76, 0.72]
    ];
    drawContinent(australia, '#8c6b3f', '#614828');

    // 格陵蘭 (Greenland)
    const greenland = [
      [0.34, 0.12], [0.40, 0.10], [0.42, 0.18], [0.36, 0.22], [0.33, 0.16]
    ];
    drawContinent(greenland, '#e0f0f8', '#b5d5e8');

    // 北極與南極冰冠 (Polar Ice Caps)
    const northIce = ctx.createLinearGradient(0, 0, 0, height * 0.12);
    northIce.addColorStop(0, '#ffffff');
    northIce.addColorStop(0.8, '#e6f3fa');
    northIce.addColorStop(1, 'rgba(230, 243, 250, 0)');
    ctx.fillStyle = northIce;
    ctx.fillRect(0, 0, width, height * 0.12);

    const southIce = ctx.createLinearGradient(0, height * 0.88, 0, height);
    southIce.addColorStop(0, 'rgba(230, 243, 250, 0)');
    southIce.addColorStop(0.2, '#e6f3fa');
    southIce.addColorStop(1, '#ffffff');
    ctx.fillStyle = southIce;
    ctx.fillRect(0, height * 0.88, width, height * 0.12);

    // 撒哈拉與沙漠金黃色彩
    for (let i = 0; i < 40; i++) {
      const x = width * 0.47 + Math.random() * (width * 0.12);
      const y = height * 0.38 + Math.random() * (height * 0.12);
      const r = Math.random() * 35 + 10;
      const dGrad = ctx.createRadialGradient(x, y, 0, x, y, r);
      dGrad.addColorStop(0, 'rgba(180, 145, 80, 0.8)');
      dGrad.addColorStop(1, 'rgba(180, 145, 80, 0)');
      ctx.fillStyle = dGrad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    return texture;
  }

  /**
   * 地球大氣雲層 (動態白色渦流雲與熱帶氣旋)
   */
  static createEarthCloudsTexture(width = 1024, height = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, width, height);

    // 繪製多條帶狀氣旋雲
    for (let i = 0; i < 120; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const rx = Math.random() * 90 + 30;
      const ry = Math.random() * 25 + 6;
      const angle = (Math.random() - 0.5) * 0.4;
      const cloudGrad = ctx.createRadialGradient(x, y, 0, x, y, rx);
      cloudGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
      cloudGrad.addColorStop(0.5, 'rgba(240, 245, 255, 0.45)');
      cloudGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = cloudGrad;
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, angle, 0, Math.PI * 2);
      ctx.fill();
    }

    // 繪製兩個大型熱帶氣旋/颱風螺旋
    for (let k = 0; k < 2; k++) {
      const cx = (0.25 + k * 0.45) * width;
      const cy = (0.35 + (k % 2) * 0.2) * height;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 3;
      for (let a = 0; a < Math.PI * 4; a += 0.1) {
        const r = a * 6;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r * 0.5;
        if (a === 0) ctx.beginPath();
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    return texture;
  }

  /**
   * 月球紋理 (灰白月表、靜海/風暴洋暗斑、環形山)
   */
  static createMoonTexture(width = 512, height = 256) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#8b8d91';
    ctx.fillRect(0, 0, width, height);

    // 月海 (Maria)
    const maria = [
      { x: 0.35, y: 0.35, r: 45 },
      { x: 0.48, y: 0.40, r: 35 },
      { x: 0.30, y: 0.55, r: 40 },
      { x: 0.60, y: 0.38, r: 30 }
    ];
    maria.forEach(m => {
      const grad = ctx.createRadialGradient(m.x * width, m.y * height, 0, m.x * width, m.y * height, m.r);
      grad.addColorStop(0, 'rgba(65, 68, 72, 0.75)');
      grad.addColorStop(1, 'rgba(139, 141, 145, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(m.x * width, m.y * height, m.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // 隕石坑 (Crater rims)
    for (let i = 0; i < 180; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const r = Math.random() * 8 + 1.5;
      ctx.strokeStyle = 'rgba(215, 218, 222, 0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    return new THREE.CanvasTexture(canvas);
  }

  /**
   * 火星紋理 (紅赭色地表、水手號峽谷、極冠)
   */
  static createMarsTexture(width = 1024, height = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // 基礎紅棕色
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#9c3b1a');
    grad.addColorStop(0.5, '#c85a2b');
    grad.addColorStop(1, '#8e3516');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // 火山高原與深色暗區 (如塞耳提斯高地)
    for (let i = 0; i < 90; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const r = Math.random() * 50 + 15;
      const darkGrad = ctx.createRadialGradient(x, y, 0, x, y, r);
      darkGrad.addColorStop(0, 'rgba(75, 30, 15, 0.6)');
      darkGrad.addColorStop(1, 'rgba(200, 90, 43, 0)');
      ctx.fillStyle = darkGrad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // 奧林帕斯巨型火山群 (Olympus Mons)
    const oX = width * 0.3;
    const oY = height * 0.42;
    const oGrad = ctx.createRadialGradient(oX, oY, 0, oX, oY, 25);
    oGrad.addColorStop(0, '#e58e65');
    oGrad.addColorStop(0.4, '#8a3518');
    oGrad.addColorStop(1, 'rgba(200, 90, 43, 0)');
    ctx.fillStyle = oGrad;
    ctx.beginPath();
    ctx.arc(oX, oY, 25, 0, Math.PI * 2);
    ctx.fill();

    // 水手號峽谷 (Valles Marineris)
    ctx.strokeStyle = '#4a1e0f';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(width * 0.35, height * 0.52);
    ctx.quadraticCurveTo(width * 0.48, height * 0.50, width * 0.60, height * 0.55);
    ctx.stroke();

    // 南北極乾冰冠 (Polar Caps)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(width * 0.5, 8, width * 0.15, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(width * 0.5, height - 8, width * 0.12, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
  }

  /**
   * 木星紋理 (交錯大氣雲帶、大紅斑風暴、複雜紊流)
   */
  static createJupiterTexture(width = 1024, height = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // 基礎背景
    ctx.fillStyle = '#cda27a';
    ctx.fillRect(0, 0, width, height);

    // 繪製交錯條紋 (Bands and Belts)
    const bandColors = [
      '#8f5c38', '#dfc4a4', '#a66a42', '#edd9be', '#b5794d',
      '#e3cbb0', '#7a4224', '#f2e2cd', '#9e623b', '#d6b896'
    ];

    for (let y = 0; y < height; y += 8) {
      const idx = Math.floor((y / height) * bandColors.length);
      const color = bandColors[idx % bandColors.length];
      ctx.fillStyle = color;
      ctx.fillRect(0, y, width, 8);
    }

    // 雲帶邊界的剪切紊流 (Turbulence curls)
    for (let i = 0; i < 150; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const rx = Math.random() * 80 + 20;
      const ry = Math.random() * 8 + 3;
      const tGrad = ctx.createRadialGradient(x, y, 0, x, y, rx);
      tGrad.addColorStop(0, 'rgba(255, 240, 220, 0.45)');
      tGrad.addColorStop(1, 'rgba(120, 60, 25, 0)');
      ctx.fillStyle = tGrad;
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // 大紅斑 (Great Red Spot)
    const grsX = width * 0.65;
    const grsY = height * 0.68;
    const grsRadiusX = 42;
    const grsRadiusY = 24;

    const grsGrad = ctx.createRadialGradient(grsX, grsY, 0, grsX, grsY, grsRadiusX);
    grsGrad.addColorStop(0, '#d13a1e');
    grsGrad.addColorStop(0.6, '#b03b22');
    grsGrad.addColorStop(0.9, '#dd9676');
    grsGrad.addColorStop(1, 'rgba(180, 100, 60, 0)');
    ctx.fillStyle = grsGrad;
    ctx.beginPath();
    ctx.ellipse(grsX, grsY, grsRadiusX, grsRadiusY, -0.08, 0, Math.PI * 2);
    ctx.fill();

    // 大紅斑中心白色氣旋眼
    ctx.fillStyle = 'rgba(255, 240, 220, 0.6)';
    ctx.beginPath();
    ctx.ellipse(grsX, grsY, 12, 6, -0.08, 0, Math.PI * 2);
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
  }

  /**
   * 土星紋理 (細膩均勻的金黃淺棕色雲帶)
   */
  static createSaturnTexture(width = 1024, height = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#8f7b57');
    grad.addColorStop(0.2, '#c4b18b');
    grad.addColorStop(0.35, '#dfcca8');
    grad.addColorStop(0.5, '#edd9b5');
    grad.addColorStop(0.65, '#dfcca8');
    grad.addColorStop(0.8, '#c4b18b');
    grad.addColorStop(1, '#8f7b57');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // 細緻平行條紋
    for (let y = 0; y < height; y += 4) {
      const alpha = Math.sin((y / height) * Math.PI * 24) * 0.08 + 0.08;
      ctx.fillStyle = `rgba(130, 105, 65, ${alpha})`;
      ctx.fillRect(0, y, width, 2);
    }

    return new THREE.CanvasTexture(canvas);
  }

  /**
   * 土星光環紋理 (高解析度透明度徑向環帶，含卡西尼縫與恩克環縫)
   */
  static createSaturnRingTexture(size = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = 1; // 1D 徑向貼圖即可映射至圓環
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, size, 0);
    // C 環 (內側暗弱環)
    grad.addColorStop(0.00, 'rgba(120, 100, 70, 0.0)');
    grad.addColorStop(0.08, 'rgba(140, 120, 90, 0.35)');
    grad.addColorStop(0.25, 'rgba(170, 145, 110, 0.55)');

    // B 環 (最寬、最明亮、高密度環)
    grad.addColorStop(0.28, 'rgba(230, 205, 165, 0.95)');
    grad.addColorStop(0.48, 'rgba(245, 225, 185, 1.0)');
    grad.addColorStop(0.62, 'rgba(220, 195, 155, 0.92)');

    // 卡西尼縫 (Cassini Division - 明顯黑色間隙)
    grad.addColorStop(0.63, 'rgba(30, 20, 10, 0.05)');
    grad.addColorStop(0.67, 'rgba(10, 5, 0, 0.0)');
    grad.addColorStop(0.70, 'rgba(40, 25, 15, 0.08)');

    // A 環 (外側中等亮度環)
    grad.addColorStop(0.72, 'rgba(205, 180, 140, 0.85)');
    // 恩克環縫 (Encke Gap)
    grad.addColorStop(0.85, 'rgba(60, 45, 25, 0.1)');
    grad.addColorStop(0.87, 'rgba(200, 175, 135, 0.8)');
    grad.addColorStop(0.96, 'rgba(180, 150, 110, 0.6)');
    // 外邊界漸隱
    grad.addColorStop(1.00, 'rgba(100, 80, 50, 0.0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, 1);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  /**
   * 天王星紋理 (青碧藍色、柔和大氣霧靄)
   */
  static createUranusTexture(width = 512, height = 256) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#5fa7b8');
    grad.addColorStop(0.3, '#7de3f4');
    grad.addColorStop(0.5, '#a4f0fd');
    grad.addColorStop(0.7, '#7de3f4');
    grad.addColorStop(1, '#5fa7b8');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // 極淡的平行帶狀痕跡
    for (let y = 0; y < height; y += 6) {
      const alpha = Math.sin((y / height) * Math.PI * 10) * 0.04 + 0.04;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fillRect(0, y, width, 3);
    }

    return new THREE.CanvasTexture(canvas);
  }

  /**
   * 海王星紋理 (湛藍深邃大氣、白色卷雲、大黑斑)
   */
  static createNeptuneTexture(width = 512, height = 256) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#15317e');
    grad.addColorStop(0.3, '#2554c7');
    grad.addColorStop(0.5, '#2e64e6');
    grad.addColorStop(0.7, '#2554c7');
    grad.addColorStop(1, '#15317e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // 大黑斑 (Great Dark Spot)
    const gdsX = width * 0.4;
    const gdsY = height * 0.45;
    const gdsGrad = ctx.createRadialGradient(gdsX, gdsY, 0, gdsX, gdsY, 28);
    gdsGrad.addColorStop(0, '#091642');
    gdsGrad.addColorStop(0.7, '#112563');
    gdsGrad.addColorStop(1, 'rgba(37, 84, 199, 0)');
    ctx.fillStyle = gdsGrad;
    ctx.beginPath();
    ctx.ellipse(gdsX, gdsY, 28, 14, -0.05, 0, Math.PI * 2);
    ctx.fill();

    // 白色高空甲烷卷雲條 (Cirrus streaks)
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * width;
      const y = height * 0.3 + Math.random() * (height * 0.4);
      const rx = Math.random() * 50 + 15;
      ctx.fillStyle = 'rgba(215, 235, 255, 0.7)';
      ctx.beginPath();
      ctx.ellipse(x, y, rx, 1.8, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
  }

  /**
   * 冥王星紋理 (紅褐色托林有機質、著名心形湯博區)
   */
  static createPlutoTexture(width = 512, height = 256) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // 基礎紅棕與冰層
    ctx.fillStyle = '#8f7b6b';
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < 60; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const r = Math.random() * 30 + 10;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, 'rgba(100, 65, 45, 0.6)');
      grad.addColorStop(1, 'rgba(143, 123, 107, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // 湯博區心形特徵 (Tombaugh Regio / The Heart)
    const hX = width * 0.45;
    const hY = height * 0.52;
    const heartGrad = ctx.createRadialGradient(hX, hY, 0, hX, hY, 40);
    heartGrad.addColorStop(0, 'rgba(245, 235, 225, 0.9)');
    heartGrad.addColorStop(0.7, 'rgba(220, 200, 185, 0.7)');
    heartGrad.addColorStop(1, 'rgba(143, 123, 107, 0)');
    ctx.fillStyle = heartGrad;

    ctx.beginPath();
    ctx.moveTo(hX, hY + 12);
    ctx.bezierCurveTo(hX - 25, hY - 15, hX - 35, hY + 20, hX, hY + 35);
    ctx.bezierCurveTo(hX + 35, hY + 20, hX + 25, hY - 15, hX, hY + 12);
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
  }

  /**
   * 宇宙星空深空全景背景
   */
  static createStarfieldTexture(size = 2048) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#020409';
    ctx.fillRect(0, 0, size, size);

    // 璀璨星點
    for (let i = 0; i < 3000; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = Math.random() * 1.5 + 0.3;
      const brightness = Math.random();

      let color = '255, 255, 255';
      if (brightness > 0.85) color = '180, 220, 255'; // 藍巨星
      else if (brightness > 0.70) color = '255, 220, 160'; // 黃巨星
      else if (brightness > 0.55) color = '255, 170, 170'; // 紅巨星

      ctx.fillStyle = `rgba(${color}, ${Math.random() * 0.8 + 0.2})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // 銀河星雲色彩 (Nebula Clouds)
    for (let i = 0; i < 8; i++) {
      const cx = Math.random() * size;
      const cy = Math.random() * size;
      const radius = Math.random() * 400 + 200;
      const nebGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      const hues = ['30, 80, 160', '80, 30, 120', '120, 50, 80', '20, 90, 110'];
      const hue = hues[i % hues.length];
      nebGrad.addColorStop(0, `rgba(${hue}, 0.12)`);
      nebGrad.addColorStop(0.5, `rgba(${hue}, 0.05)`);
      nebGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = nebGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  /**
   * 建立廣義相對論黑洞吸積盤極致材質 (Relativistic Accretion Disk Map)
   * 包含都卜勒增亮 (Doppler Beaming)、內緣高溫白熾區 (ISCO) 與多重紊流螺旋波
   */
  static createAccretionDiskTexture(glowHex = '#ec4899', coreHex = '#ffffff', outerHex = '#7928ca', size = 1024) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const cx = size / 2;
    const cy = size / 2;

    ctx.clearRect(0, 0, size, size);

    // 1. 同心高能等離子體密度波 (Concentric Density Waves)
    const maxR = size * 0.48;
    const minR = size * 0.16;

    for (let r = minR; r < maxR; r += 1.5) {
      const norm = (r - minR) / (maxR - minR);
      const alpha = Math.sin(norm * Math.PI) * 0.75 * (1.0 - norm * 0.4);

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.15})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // 2. 雙臂相對論對數螺旋衝擊波 (Spiral Shock Waves)
    const arms = 2;
    for (let arm = 0; arm < arms; arm++) {
      const baseTheta = (arm * Math.PI * 2) / arms;
      for (let step = 0; step < 400; step++) {
        const t = step / 400;
        const r = minR + t * (maxR - minR);
        const theta = baseTheta + t * Math.PI * 4.5;
        const x = cx + r * Math.cos(theta);
        const y = cy + r * Math.sin(theta);

        const radGrad = ctx.createRadialGradient(x, y, 0, x, y, 18);
        radGrad.addColorStop(0, glowHex);
        radGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.4)');
        radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(x, y, 18, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 3. 都卜勒不對稱增亮 (Doppler Beaming Asymmetry)
    // 左側 (朝向觀察者運行面) 能量增益
    const dopplerGrad = ctx.createRadialGradient(cx * 0.65, cy, minR, cx, cy, maxR);
    dopplerGrad.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
    dopplerGrad.addColorStop(0.3, glowHex);
    dopplerGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = dopplerGrad;
    ctx.fillRect(0, 0, size, size);

    // 4. 最內側穩定軌道 (ISCO) 高溫白熾光圈
    const iscoGrad = ctx.createRadialGradient(cx, cy, minR * 0.9, cx, cy, minR * 1.35);
    iscoGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    iscoGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.95)');
    iscoGrad.addColorStop(0.8, glowHex);
    iscoGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = iscoGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, minR * 1.35, 0, Math.PI * 2);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  /**
   * 相對論極向噴流高能電漿光束材質 (Relativistic Polar Jet Texture)
   */
  static createRelativisticJetTexture(colorHex = '#a855f7') {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.15, colorHex);
    grad.addColorStop(0.6, 'rgba(168, 85, 247, 0.4)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 512);

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }

  /**
   * 建立極致柔和的高斯光暈圓形星點貼圖 (Star Flare Sprite Texture)
   * 徹底杜絕 WebGL 點精靈在無貼圖時預設繪製的正方形白方塊 (Square Point Artifacts)
   */
  static createStarSpriteTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const cx = 64;
    const cy = 64;

    // 徑向多層高斯柔和漸層
    const radGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 64);
    radGrad.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
    radGrad.addColorStop(0.12, 'rgba(255, 255, 255, 0.95)');
    radGrad.addColorStop(0.28, 'rgba(215, 235, 255, 0.6)');
    radGrad.addColorStop(0.55, 'rgba(160, 195, 255, 0.2)');
    radGrad.addColorStop(0.85, 'rgba(120, 160, 255, 0.05)');
    radGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = radGrad;
    ctx.fillRect(0, 0, 128, 128);

    // 4 向微細天文星芒繞射尖角 (Diffraction Spikes)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(cx - 48, cy); ctx.lineTo(cx + 48, cy);
    ctx.moveTo(cx, cy - 48); ctx.lineTo(cx, cy + 48);
    ctx.stroke();

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }

  /**
   * 建立 4K 超高解析度、極致細膩的銀河系棒旋星系結構貼圖 (Barred Spiral Galaxy Texture, 4096x4096)
   * 包含中心金白核球、棒狀結構、四條主要對數螺旋臂、數萬顆微型恆星群、粉紅 HII 電離星雲與深色星際塵埃裂縫
   */
  static createMilkyWayDiskTexture(size = 4096) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const cx = size / 2;
    const cy = size / 2;

    ctx.clearRect(0, 0, size, size);

    // 1. 銀心核球 (Galactic Bulge & Nuclear Core, 極致金白輝光)
    const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.24);
    coreGrad.addColorStop(0.0, 'rgba(255, 255, 245, 1.0)');
    coreGrad.addColorStop(0.08, 'rgba(255, 248, 210, 0.96)');
    coreGrad.addColorStop(0.20, 'rgba(255, 225, 150, 0.70)');
    coreGrad.addColorStop(0.45, 'rgba(220, 160, 90, 0.35)');
    coreGrad.addColorStop(0.75, 'rgba(150, 100, 60, 0.12)');
    coreGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = coreGrad;
    ctx.fillRect(0, 0, size, size);

    // 棒狀核心結構 (Central Stellar Bar, 旋角 45°)
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(Math.PI / 4.2);
    const barGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 0.20);
    barGrad.addColorStop(0.0, 'rgba(255, 250, 230, 0.92)');
    barGrad.addColorStop(0.35, 'rgba(255, 220, 160, 0.55)');
    barGrad.addColorStop(0.70, 'rgba(230, 170, 110, 0.22)');
    barGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = barGrad;
    ctx.scale(2.6, 0.75);
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.20, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 2. 5 kpc 分子環 (Molecular Gas Ring)
    const molRingGrad = ctx.createRadialGradient(cx, cy, size * 0.10, cx, cy, size * 0.17);
    molRingGrad.addColorStop(0.0, 'rgba(255, 210, 170, 0.0)');
    molRingGrad.addColorStop(0.5, 'rgba(200, 225, 255, 0.28)');
    molRingGrad.addColorStop(1.0, 'rgba(100, 160, 255, 0.0)');
    ctx.fillStyle = molRingGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.17, 0, Math.PI * 2);
    ctx.fill();

    // 3. 四條主要對數螺旋旋臂 (Perseus, Scutum-Centaurus, Sagittarius-Carina, Outer-Norma) + 獵戶座次臂
    const arms = 4;
    const maxR = size * 0.47;
    const minR = size * 0.075;

    // 先繪製外圍廣域瀰漫氣體薄霧 (Diffuse Background Fog)
    for (let a = 0; a < arms; a++) {
      const baseAngle = (a * Math.PI * 2) / arms;
      for (let s = 0; s < 1200; s++) {
        const t = s / 1200;
        const r = minR + Math.pow(t, 0.88) * (maxR - minR);
        const theta = baseAngle + Math.log(r / minR) * 1.88;

        const px = cx + r * Math.cos(theta);
        const py = cy + r * Math.sin(theta);

        const spotRadius = (Math.random() * 45 + 35) * (size / 2048);
        const g = ctx.createRadialGradient(px, py, 0, px, py, spotRadius);
        g.addColorStop(0.0, t < 0.35 ? 'rgba(180, 210, 255, 0.16)' : 'rgba(96, 165, 250, 0.12)');
        g.addColorStop(0.5, 'rgba(147, 197, 253, 0.05)');
        g.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(px, py, spotRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 繪製高密度恆星流與細緻星雲絲狀物 (High-Density Arm Streams & Feathers)
    for (let a = 0; a < arms; a++) {
      const baseAngle = (a * Math.PI * 2) / arms;
      for (let s = 0; s < 2400; s++) {
        const t = s / 2400;
        const r = minR + Math.pow(t, 0.86) * (maxR - minR);
        // 疊加微幅正弦擾動，創造星雲纖維毛刺 (Spurs & Feathers)
        const perturb = Math.sin(s * 0.15) * (18 * (1.0 - t));
        const theta = baseAngle + Math.log(r / minR) * 1.86 + (perturb / r);

        const px = cx + (r + perturb) * Math.cos(theta);
        const py = cy + (r + perturb) * Math.sin(theta);

        // 恆星光流漸層 (內側暖金 -> 中段青藍 -> 外緣冰藍)
        let coreColor = 'rgba(255, 255, 255, 0.45)';
        let haloColor = 'rgba(125, 211, 252, 0.18)';
        if (t < 0.25) {
          coreColor = 'rgba(255, 245, 220, 0.55)';
          haloColor = 'rgba(251, 191, 36, 0.22)';
        } else if (t > 0.7) {
          coreColor = 'rgba(224, 242, 254, 0.35)';
          haloColor = 'rgba(56, 189, 248, 0.14)';
        }

        const spotRadius = (Math.random() * 22 + 10) * (size / 2048);
        const g = ctx.createRadialGradient(px, py, 0, px, py, spotRadius);
        g.addColorStop(0.0, coreColor);
        g.addColorStop(0.4, haloColor);
        g.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(px, py, spotRadius, 0, Math.PI * 2);
        ctx.fill();

        // 4. 粉紅/洋紅色 HII 電離星雲育嬰室 (HII Emission Regions - H-alpha)
        if (Math.random() < 0.35) {
          const hiiR = (Math.random() * 16 + 8) * (size / 2048);
          const offsetX = (Math.random() - 0.5) * 28 * (size / 2048);
          const offsetY = (Math.random() - 0.5) * 28 * (size / 2048);
          const hg = ctx.createRadialGradient(px + offsetX, py + offsetY, 0, px + offsetX, py + offsetY, hiiR);
          hg.addColorStop(0.0, 'rgba(251, 113, 133, 0.75)');
          hg.addColorStop(0.45, 'rgba(244, 63, 94, 0.40)');
          hg.addColorStop(0.80, 'rgba(236, 72, 153, 0.15)');
          hg.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = hg;
          ctx.beginPath();
          ctx.arc(px + offsetX, py + offsetY, hiiR, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // 5. 獵戶座次臂 (Orion Local Spur — 太陽系所在區域)
    const orionBase = (Math.PI * 2 * 0.42);
    for (let s = 0; s < 800; s++) {
      const t = s / 800;
      const r = size * 0.20 + t * (size * 0.15);
      const theta = orionBase + Math.log(r / (size * 0.20)) * 1.55;
      const px = cx + r * Math.cos(theta);
      const py = cy + r * Math.sin(theta);
      const sR = (Math.random() * 18 + 12) * (size / 2048);
      const og = ctx.createRadialGradient(px, py, 0, px, py, sR);
      og.addColorStop(0.0, 'rgba(255, 255, 255, 0.40)');
      og.addColorStop(0.5, 'rgba(56, 189, 248, 0.18)');
      og.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = og;
      ctx.beginPath();
      ctx.arc(px, py, sR, 0, Math.PI * 2);
      ctx.fill();
    }

    // 6. 深色星際塵埃裂縫 (Dark Dust Lanes / Great Rift)
    for (let a = 0; a < arms; a++) {
      const baseAngle = (a * Math.PI * 2) / arms + 0.15;
      ctx.strokeStyle = 'rgba(6, 4, 12, 0.65)';
      ctx.lineWidth = 18 * (size / 2048);
      ctx.beginPath();
      for (let s = 0; s < 600; s++) {
        const t = s / 600;
        const r = minR * 1.25 + Math.pow(t, 0.88) * (maxR * 0.88 - minR);
        const theta = baseAngle + Math.log(r / minR) * 1.84 + (Math.sin(s * 0.1) * 0.02);
        const px = cx + r * Math.cos(theta);
        const py = cy + r * Math.sin(theta);
        if (s === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    // 7. 數千顆微型微晶恆星點 (Diamond Star Dust)
    for (let st = 0; st < 4500; st++) {
      const armIdx = st % arms;
      const t = Math.pow(Math.random(), 0.9);
      const r = minR + t * (maxR - minR);
      const baseAngle = (armIdx * Math.PI * 2) / arms;
      const theta = baseAngle + Math.log(r / minR) * 1.86 + (Math.random() - 0.5) * 0.25;
      const px = cx + r * Math.cos(theta);
      const py = cy + r * Math.sin(theta);

      ctx.fillStyle = Math.random() < 0.25 ? 'rgba(255, 230, 180, 0.95)' : 'rgba(255, 255, 255, 0.95)';
      ctx.beginPath();
      ctx.arc(px, py, Math.random() * 2.0 + 0.6, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }
}
