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
    r    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(cx - 48, cy); ctx.lineTo(cx + 48, cy);
    ctx.moveTo(cx, cy - 48); ctx.lineTo(cx, cy + 48);
    ctx.stroke();

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }

  /**
   * 建立星際深色分子塵埃團塊貼圖 (Dark Molecular Dust Cloud Sprite)
   * 模擬大裂谷 (Great Rift) 及旋臂內緣暗星雲之立體吸光阻擋效果
   */
  static createDarkDustSpriteTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const cx = 64;
    const cy = 64;

    const radGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 64);
    radGrad.addColorStop(0.0, 'rgba(8, 5, 12, 0.85)');
    radGrad.addColorStop(0.35, 'rgba(14, 9, 18, 0.55)');
    radGrad.addColorStop(0.70, 'rgba(20, 14, 25, 0.20)');
    radGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = radGrad;
    ctx.fillRect(0, 0, 128, 128);

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }

  /**
   * 建立電離氫 HII 恆星育嬰室發射星雲團塊貼圖 (H-alpha Nebular Cloud Sprite)
   */
  static createHIICloudTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const cx = 64;
    const cy = 64;

    const radGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 64);
    radGrad.addColorStop(0.0, 'rgba(255, 110, 150, 0.65)');
    radGrad.addColorStop(0.25, 'rgba(244, 63, 94, 0.40)');
    radGrad.addColorStop(0.60, 'rgba(219, 39, 119, 0.15)');
    radGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = radGrad;
    ctx.fillRect(0, 0, 128, 128);

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }

  /**
   * 建立 4K 極致高對比、超清晰棒旋星系盤面紋理 (Crisp High-Contrast Barred Spiral Galaxy, 4096x4096)
   * 旋臂層次分明、暗帶深邃清晰，徹底消除模糊死白光團
   */
  static createMilkyWayDiskTexture(size = 4096) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const cx = size / 2;
    const cy = size / 2;
    const S = size / 4096;

    ctx.clearRect(0, 0, size, size);

    // ═══════════════════════════════════════════════════════════
    // 1. 銀心微型緊湊核球 (Compact Bulge)
    // ═══════════════════════════════════════════════════════════
    const bulgeR = size * 0.075;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, bulgeR);
    g.addColorStop(0.0, 'rgba(255, 250, 230, 0.95)');
    g.addColorStop(0.2, 'rgba(255, 225, 150, 0.70)');
    g.addColorStop(0.5, 'rgba(220, 150, 60, 0.35)');
    g.addColorStop(0.8, 'rgba(140, 75, 25, 0.10)');
    g.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, bulgeR, 0, Math.PI * 2);
    ctx.fill();

    // ═══════════════════════════════════════════════════════════
    // 2. 清晰中心棒狀結構 (Central Bar, 傾角 44°, 長度 3.2 kpc)
    // ═══════════════════════════════════════════════════════════
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(Math.PI / 4.1);
    const barLen = size * 0.13;
    const bg = ctx.createRadialGradient(0, 0, 0, 0, 0, barLen);
    bg.addColorStop(0.0, 'rgba(255, 240, 190, 0.85)');
    bg.addColorStop(0.35, 'rgba(240, 185, 110, 0.50)');
    bg.addColorStop(0.70, 'rgba(180, 110, 45, 0.20)');
    bg.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = bg;
    ctx.scale(2.6, 0.65);
    ctx.beginPath();
    ctx.arc(0, 0, barLen, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // ═══════════════════════════════════════════════════════════
    // 3. 5 kpc 分子氣體環 (Molecular Ring - 緊湊高對比)
    // ═══════════════════════════════════════════════════════════
    const molG = ctx.createRadialGradient(cx, cy, size * 0.08, cx, cy, size * 0.14);
    molG.addColorStop(0.0, 'rgba(140, 180, 255, 0)');
    molG.addColorStop(0.5, 'rgba(130, 175, 250, 0.35)');
    molG.addColorStop(1.0, 'rgba(60, 100, 220, 0)');
    ctx.fillStyle = molG;
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.14, 0, Math.PI * 2);
    ctx.fill();

    // ═══════════════════════════════════════════════════════════
    // 4. 4 條清晰對數螺旋臂 + 獵戶座次臂 (嚴格緊湊清晰螺線)
    // ═══════════════════════════════════════════════════════════
    const armDefs = [
      { name: 'Scutum-Centaurus', offset: 0,             pitch: 1.78, width: 1.0,  hue: [255, 225, 180], starHue: [255, 245, 220] },
      { name: 'Perseus',          offset: Math.PI / 2,    pitch: 1.82, width: 0.95, hue: [150, 195, 255], starHue: [200, 230, 255] },
      { name: 'Sagittarius',      offset: Math.PI,        pitch: 1.76, width: 0.88, hue: [180, 210, 255], starHue: [220, 235, 255] },
      { name: 'Norma-Outer',      offset: Math.PI * 1.5,  pitch: 1.84, width: 0.80, hue: [140, 185, 250], starHue: [180, 215, 255] },
      { name: 'Orion Spur',       offset: Math.PI * 0.84, pitch: 1.55, width: 0.55, hue: [190, 220, 255], starHue: [225, 240, 255] }
    ];

    const maxR = size * 0.46;
    const minR = size * 0.085;

    // 4a. 旋臂主要星雲光帶 (緊密聚合，留下臂間深黑空隙)
    armDefs.forEach(arm => {
      const stepCount = arm.name === 'Orion Spur' ? 500 : 1200;
      for (let s = 0; s < stepCount; s++) {
        const t = s / stepCount;
        const r = minR + Math.pow(t, 0.85) * (maxR * arm.width - minR);
        const theta = arm.offset + Math.log(r / minR) * arm.pitch;
        
        // 緊湊寬度 (臂寬僅隨半徑微幅擴散，絕不蔓延至臂間)
        const armW = (28 + t * 45) * S;
        const px = cx + r * Math.cos(theta);
        const py = cy + r * Math.sin(theta);

        const op = t < 0.25 ? 0.35 : (t < 0.7 ? 0.25 : 0.15);
        const ag = ctx.createRadialGradient(px, py, 0, px, py, armW);
        ag.addColorStop(0.0, `rgba(${arm.hue[0]}, ${arm.hue[1]}, ${arm.hue[2]}, ${op})`);
        ag.addColorStop(0.5, `rgba(${arm.hue[0]}, ${arm.hue[1]}, ${arm.hue[2]}, ${op * 0.4})`);
        ag.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = ag;
        ctx.beginPath();
        ctx.arc(px, py, armW, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // 4b. 旋臂骨幹高密度恆星核心 (Crisp High-Density Star Spine)
    armDefs.forEach(arm => {
      const stepCount = arm.name === 'Orion Spur' ? 700 : 1800;
      for (let s = 0; s < stepCount; s++) {
        const t = s / stepCount;
        const r = minR + Math.pow(t, 0.84) * (maxR * arm.width - minR);
        const theta = arm.offset + Math.log(r / minR) * arm.pitch;
        
        const offsetDist = (Math.random() - 0.5) * (14 + t * 18) * S;
        const px = cx + (r + offsetDist) * Math.cos(theta);
        const py = cy + (r + offsetDist) * Math.sin(theta);

        const spotR = (Math.random() * 8 + 3) * S;
        const op = (0.55 - t * 0.25);
        const ag = ctx.createRadialGradient(px, py, 0, px, py, spotR);
        ag.addColorStop(0.0, `rgba(255, 255, 255, ${op})`);
        ag.addColorStop(0.4, `rgba(${arm.starHue[0]}, ${arm.starHue[1]}, ${arm.starHue[2]}, ${op * 0.5})`);
        ag.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = ag;
        ctx.beginPath();
        ctx.arc(px, py, spotR, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // ═══════════════════════════════════════════════════════════
    // 5. 旋臂內緣星際暗帶 (Sharp Dark Dust Lanes - 刀刻般立體剪影)
    // ═══════════════════════════════════════════════════════════
    armDefs.slice(0, 4).forEach(arm => {
      const dustOffset = 0.085;
      ctx.strokeStyle = 'rgba(2, 1, 4, 0.96)';
      ctx.lineWidth = 14 * S;
      ctx.lineCap = 'round';
      ctx.beginPath();
      for (let s = 0; s < 800; s++) {
        const t = s / 800;
        const r = minR * 1.15 + Math.pow(t, 0.86) * (maxR * arm.width * 0.94 - minR);
        const theta = arm.offset + dustOffset + Math.log(r / minR) * arm.pitch;
        const px = cx + r * Math.cos(theta);
        const py = cy + r * Math.sin(theta);
        if (s === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // 二級暗塵埃分支
      ctx.strokeStyle = 'rgba(5, 3, 8, 0.70)';
      ctx.lineWidth = 7 * S;
      ctx.beginPath();
      for (let s = 0; s < 500; s++) {
        const t = s / 500;
        const r = minR * 1.4 + Math.pow(t, 0.88) * (maxR * arm.width * 0.86 - minR);
        const theta = arm.offset + dustOffset + 0.06 + Math.log(r / minR) * arm.pitch;
        const px = cx + r * Math.cos(theta) + Math.sin(s * 0.2) * 8 * S;
        const py = cy + r * Math.sin(theta) + Math.cos(s * 0.15) * 8 * S;
        if (s === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    });

    // ═══════════════════════════════════════════════════════════
    // 6. 電離氫 HII 紅色發射星雲結 (Bright H-alpha Nebular Knots)
    // ═══════════════════════════════════════════════════════════
    armDefs.forEach(arm => {
      const hiiCount = arm.name === 'Orion Spur' ? 45 : 90;
      for (let h = 0; h < hiiCount; h++) {
        const t = Math.random();
        const r = minR + Math.pow(t, 0.8) * (maxR * arm.width * 0.92 - minR);
        const theta = arm.offset + Math.log(r / minR) * arm.pitch + (Math.random() - 0.5) * 0.06;
        const px = cx + r * Math.cos(theta) + (Math.random() - 0.5) * 14 * S;
        const py = cy + r * Math.sin(theta) + (Math.random() - 0.5) * 14 * S;
        const hiiR = (Math.random() * 12 + 4) * S;

        const hg = ctx.createRadialGradient(px, py, 0, px, py, hiiR);
        hg.addColorStop(0.0, 'rgba(255, 100, 140, 0.85)');
        hg.addColorStop(0.4, 'rgba(240, 50, 100, 0.45)');
        hg.addColorStop(1.0, 'rgba(160, 20, 70, 0)');
        ctx.fillStyle = hg;
        ctx.beginPath();
        ctx.arc(px, py, hiiR, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // ═══════════════════════════════════════════════════════════
    // 7. 針尖微晶恆星 (Crisp Pinpoint Stars)
    // ═══════════════════════════════════════════════════════════
    const starColors = ['#ffffff', '#bae6fd', '#fef08a', '#fdba74'];
    for (let st = 0; st < 3000; st++) {
      const armIdx = st % armDefs.length;
      const arm = armDefs[armIdx];
      const t = Math.pow(Math.random(), 0.85);
      const r = minR + t * (maxR * arm.width - minR);
      const theta = arm.offset + Math.log(r / minR) * arm.pitch + (Math.random() - 0.5) * 0.08;
      const px = cx + r * Math.cos(theta) + (Math.random() - 0.5) * 12 * S;
      const py = cy + r * Math.sin(theta) + (Math.random() - 0.5) * 12 * S;

      ctx.fillStyle = starColors[Math.floor(Math.random() * starColors.length)];
      ctx.beginPath();
      ctx.arc(px, py, (Math.random() * 1.2 + 0.5) * S, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }
  /**
   * 建立高解析度彗星離子氣體尾 (Ion Tail) 絲狀電漿紋理
   * 模擬 CO+ / N2+ 離子在太陽風磁場中的絲狀流動 (Streamlines & Filaments)
   */
  static createCometIonTailTexture(width = 512, height = 1024, isBlue = true) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, width, height);

    // 主離子束縱向漸層 (核心亮白 -> 中段湛藍 -> 遠端微弱淡出)
    const cx = width / 2;
    const mainGrad = ctx.createLinearGradient(0, 0, 0, height);
    mainGrad.addColorStop(0.0, 'rgba(255, 255, 255, 0.95)');
    mainGrad.addColorStop(0.08, isBlue ? 'rgba(56, 189, 248, 0.85)' : 'rgba(96, 165, 250, 0.85)');
    mainGrad.addColorStop(0.45, isBlue ? 'rgba(37, 99, 235, 0.55)' : 'rgba(59, 130, 246, 0.55)');
    mainGrad.addColorStop(0.85, 'rgba(29, 78, 216, 0.20)');
    mainGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

    // 繪製多道超細緻電漿磁力絲 (Magnetic Plasma Filaments)
    for (let f = 0; f < 32; f++) {
      const offsetX = (Math.random() - 0.5) * (width * 0.45);
      const startWidth = Math.random() * 4 + 2;
      const endWidth = Math.random() * 18 + 8;
      
      const fGrad = ctx.createLinearGradient(0, 0, 0, height);
      fGrad.addColorStop(0.0, 'rgba(255, 255, 255, 0.8)');
      fGrad.addColorStop(0.15, isBlue ? 'rgba(125, 211, 252, 0.7)' : 'rgba(147, 197, 253, 0.7)');
      fGrad.addColorStop(0.6, isBlue ? 'rgba(14, 165, 233, 0.35)' : 'rgba(37, 99, 235, 0.35)');
      fGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

      ctx.strokeStyle = fGrad;
      ctx.lineWidth = startWidth;
      ctx.beginPath();
      ctx.moveTo(cx, 0);

      // 疊加微幅正弦波動 (波度模擬太陽風震波)
      const waveFreq = Math.random() * 0.02 + 0.01;
      const waveAmp = Math.random() * 14 + 6;
      for (let y = 0; y <= height; y += 16) {
        const t = y / height;
        const wx = cx + offsetX * t + Math.sin(y * waveFreq) * waveAmp * t;
        ctx.lineTo(wx, y);
      }
      ctx.stroke();
    }

    // 中軸超高亮線束
    const centerGrad = ctx.createLinearGradient(0, 0, 0, height);
    centerGrad.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
    centerGrad.addColorStop(0.2, 'rgba(186, 230, 253, 0.8)');
    centerGrad.addColorStop(0.7, 'rgba(56, 189, 248, 0.3)');
    centerGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

    ctx.strokeStyle = centerGrad;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, height);
    ctx.stroke();

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  /**
   * 建立高解析度彗星塵埃尾 (Dust Tail) 柔和微米顆粒光幕紋理
   * 模擬受太陽光輻射壓推斥的微米冰晶與塵埃雲 (Striae & Syndynes)
   */
  static createCometDustTailTexture(width = 1024, height = 1024, isGolden = false) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, width, height);

    // 放射狀塵埃扇形漸層
    const cx = width * 0.5;
    const cy = 0;

    // 寬闊塵埃羽流
    for (let i = 0; i < 48; i++) {
      const angle = (Math.random() - 0.5) * 0.45 + (Math.PI * 0.5);
      const rayLen = height * (0.6 + Math.random() * 0.4);
      const endX = cx + Math.cos(angle) * rayLen;
      const endY = cy + Math.sin(angle) * rayLen;

      const rGrad = ctx.createLinearGradient(cx, cy, endX, endY);
      if (isGolden) {
        rGrad.addColorStop(0.0, 'rgba(255, 255, 240, 0.85)');
        rGrad.addColorStop(0.12, 'rgba(254, 240, 138, 0.70)');
        rGrad.addColorStop(0.45, 'rgba(250, 204, 21, 0.35)');
        rGrad.addColorStop(0.8, 'rgba(245, 158, 11, 0.12)');
        rGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
      } else {
        rGrad.addColorStop(0.0, 'rgba(255, 255, 255, 0.85)');
        rGrad.addColorStop(0.15, 'rgba(224, 242, 254, 0.65)');
        rGrad.addColorStop(0.5, 'rgba(186, 230, 253, 0.30)');
        rGrad.addColorStop(0.85, 'rgba(125, 211, 252, 0.10)');
        rGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
      }

      ctx.fillStyle = rGrad;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(endX - (Math.random() * 40 + 20), endY);
      ctx.lineTo(endX + (Math.random() * 40 + 20), endY);
      ctx.closePath();
      ctx.fill();
    }

    // 數千顆微晶塵埃粒子
    for (let p = 0; p < 2500; p++) {
      const t = Math.pow(Math.random(), 1.2);
      const angle = (Math.random() - 0.5) * 0.42 + (Math.PI * 0.5);
      const r = t * height;
      const px = cx + Math.cos(angle) * r + (Math.random() - 0.5) * 30 * t;
      const py = cy + Math.sin(angle) * r;

      const alpha = (1.0 - t * 0.85) * (Math.random() * 0.6 + 0.3);
      ctx.fillStyle = isGolden ? `rgba(254, 240, 138, ${alpha})` : `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(px, py, Math.random() * 2.2 + 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }

  /**
   * 建立高解析度彗髮氣體包層 (Coma) 柔和發光星雲貼圖
   */
  static createCometComaTexture(size = 1024, coreCol = '#ffffff', haloCol = '#34d399') {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2;

    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
    g.addColorStop(0.12, 'rgba(255, 255, 255, 0.85)');
    g.addColorStop(0.35, haloCol);
    g.addColorStop(0.70, 'rgba(16, 185, 129, 0.25)');
    g.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }
}

