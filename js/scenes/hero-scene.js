/* ==========================================================================
   CINEMATIC 8-SECTION 3D STORYTELLING ENGINE
   Primary: Three.js + Custom GLSL Liquid-Metal Shader + Instanced Fragments
   Fallback: High-Craft 3D-Projected Canvas 2D Engine (Zero Broken States)
   ========================================================================== */

window.HeroSceneEngine = (function () {
  let canvas = null;
  let mode = 'initializing';
  let rafId = null;
  let isVisible = true;
  let reducedMotion = false;
  let activeSectionIndex = 0;
  let scrollProgress = 0;

  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };

  // Target states for all 8 narrative chapters
  // [coreScale, fragmentSpread, ringTilt, camX, camY, camZ, morphAmp, formationMode]
  const SECTION_STATES = [
    { coreScale: 1.08, spread: 1.0, ringTilt: 0.45, camX: 0.45, camY: 0.05, camZ: 5.4, morph: 0.35, form: 'sculpture' }, // 01 Hero
    { coreScale: 0.68, spread: 2.35, ringTilt: 1.15, camX: -0.7, camY: 0.2, camZ: 6.1, morph: 0.65, form: 'separated' }, // 02 About
    { coreScale: 0.42, spread: 3.1, ringTilt: 0.8, camX: 0.85, camY: -0.15, camZ: 6.6, morph: 0.5, form: 'nodes' },       // 03 Projects
    { coreScale: 0.35, spread: 2.7, ringTilt: 1.5, camX: -0.4, camY: 0.25, camZ: 6.2, morph: 0.4, form: 'network' },      // 04 Skills
    { coreScale: 0.3, spread: 2.5, ringTilt: 0.15, camX: 0.5, camY: 0.0, camZ: 6.5, morph: 0.3, form: 'timeline' },       // 05 Experience
    { coreScale: 0.45, spread: 2.15, ringTilt: 0.0, camX: -0.5, camY: 0.1, camZ: 6.1, morph: 0.2, form: 'lattice' },      // 06 Education
    { coreScale: 0.4, spread: 2.6, ringTilt: 0.65, camX: 0.35, camY: -0.1, camZ: 6.4, morph: 0.28, form: 'gallery' },     // 07 Certifications
    { coreScale: 1.05, spread: 1.05, ringTilt: 0.35, camX: 0.0, camY: 0.0, camZ: 5.3, morph: 0.32, form: 'reassemble' }   // 08 Contact
  ];

  const current = {
    coreScale: 1.08,
    spread: 1.0,
    ringTilt: 0.45,
    camX: 0.45,
    camY: 0.05,
    camZ: 5.4,
    morph: 0.35
  };

  // Three.js resources
  let renderer, scene, camera, coreMesh, coreMat, wireMesh, ringsGroup, fragmentsGroup, particles;
  let fragmentData = [];

  // Fallback 2D resources
  let ctx2d = null;
  let fallbackVertices = [];
  let fallbackParticles = [];

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function updateRenderBadge(label) {
    const el = document.getElementById('render-mode-indicator');
    if (el) el.textContent = label;
  }

  function computeFragmentTarget(i, total, form, spread) {
    const angle = (i / total) * Math.PI * 2;
    if (form === 'sculpture' || form === 'reassemble') {
      const r = 1.65 * spread;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / total);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      return {
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.cos(phi),
        z: r * Math.sin(phi) * Math.sin(theta)
      };
    }
    if (form === 'separated') {
      const r = 1.45 * spread;
      return {
        x: Math.cos(angle) * r,
        y: Math.sin(angle * 2) * 1.1,
        z: Math.sin(angle) * r
      };
    }
    if (form === 'nodes') {
      const cluster = i % 5;
      const cAngle = (cluster / 5) * Math.PI * 2;
      const offset = ((i % 4) - 1.5) * 0.28;
      return {
        x: Math.cos(cAngle) * 2.4 + offset,
        y: Math.sin(cAngle) * 1.45 + Math.cos(i) * 0.25,
        z: Math.sin(cAngle * 1.5) * 1.2
      };
    }
    if (form === 'network') {
      const layer = (i % 3) - 1;
      return {
        x: Math.cos(angle) * (1.8 + Math.abs(layer) * 0.7),
        y: layer * 1.1 + Math.sin(angle * 2) * 0.35,
        z: Math.sin(angle) * 1.6
      };
    }
    if (form === 'timeline') {
      const norm = (i / (total - 1)) * 2 - 1;
      return {
        x: norm * 3.4,
        y: Math.sin(norm * Math.PI * 1.5) * 0.45,
        z: Math.cos(i) * 0.55
      };
    }
    if (form === 'lattice') {
      const cols = 6;
      const row = Math.floor(i / cols) - 1.5;
      const col = (i % cols) - 2.5;
      return {
        x: col * 0.95,
        y: row * 0.85,
        z: ((i % 2) - 0.5) * 0.65
      };
    }
    // gallery
    const row2 = i < total / 2 ? 0.85 : -0.85;
    const col2 = (i % (total / 2)) - total / 4 + 0.5;
    return {
      x: col2 * 0.68,
      y: row2,
      z: Math.sin(col2 * 0.6) * 0.55
    };
  }

  function initThree() {
    if (typeof window.THREE === 'undefined' || !window.ShaderLibrary) {
      return false;
    }

    try {
      const THREE = window.THREE;
      const isMobile = window.innerWidth < 768;
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.75);

      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: !isMobile,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setPixelRatio(dpr);
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      renderer.setClearColor(0x090a0c, 0);

      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x090a0c, 0.065);

      camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.set(0.45, 0.05, 5.4);

      // Studio Monochrome Lights
      const keyLight = new THREE.DirectionalLight(0xf2f3f4, 2.0);
      keyLight.position.set(4, 5, 4);
      scene.add(keyLight);

      const rimLight = new THREE.DirectionalLight(0xc4c9d0, 1.15);
      rimLight.position.set(-5, -2, 3);
      scene.add(rimLight);

      const ambient = new THREE.AmbientLight(0x292d33, 0.9);
      scene.add(ambient);

      // Central Liquid-Metal Sculptural Core
      const detail = isMobile ? 4 : 5;
      const coreGeo = new THREE.IcosahedronGeometry(1.18, detail);
      coreMat = new THREE.ShaderMaterial({
        vertexShader: window.ShaderLibrary.liquidMetalVertex,
        fragmentShader: window.ShaderLibrary.liquidMetalFragment,
        uniforms: {
          uTime: { value: 0 },
          uMorph: { value: 0.35 },
          uNoiseScale: { value: 1.45 },
          uDisplaceAmp: { value: 0.24 },
          uPointer: { value: new THREE.Vector2(0, 0) },
          uOpacity: { value: 0.96 },
          uObsidian: { value: new THREE.Color('#090A0C') },
          uGraphite: { value: new THREE.Color('#17191D') },
          uSilver: { value: new THREE.Color('#C4C9D0') },
          uPorcelain: { value: new THREE.Color('#F2F3F4') }
        },
        transparent: true
      });
      coreMesh = new THREE.Mesh(coreGeo, coreMat);
      scene.add(coreMesh);

      // Architectural Geodesic Outer Cage
      const wireGeo = new THREE.IcosahedronGeometry(1.52, 1);
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0x777e87,
        wireframe: true,
        transparent: true,
        opacity: 0.18
      });
      wireMesh = new THREE.Mesh(wireGeo, wireMat);
      scene.add(wireMesh);

      // Precision Orbital Rings
      ringsGroup = new THREE.Group();
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0xc4c9d0,
        metalness: 0.88,
        roughness: 0.22
      });

      const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.05, 0.008, 12, 96), ringMat);
      ring1.rotation.x = Math.PI * 0.36;
      const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.48, 0.005, 12, 96), ringMat);
      ring2.rotation.y = Math.PI * 0.28;
      ring2.rotation.x = -Math.PI * 0.22;
      ringsGroup.add(ring1, ring2);
      scene.add(ringsGroup);

      // 24 Morphing Sculptural Fragments
      fragmentsGroup = new THREE.Group();
      const fragGeo = new THREE.OctahedronGeometry(0.11, 0);
      const fragMat = new THREE.MeshStandardMaterial({
        color: 0xf2f3f4,
        metalness: 0.9,
        roughness: 0.18
      });
      const fragCount = 24;
      fragmentData = [];
      for (let i = 0; i < fragCount; i++) {
        const mesh = new THREE.Mesh(fragGeo, fragMat);
        const initPos = computeFragmentTarget(i, fragCount, 'sculpture', 1.0);
        mesh.position.set(initPos.x, initPos.y, initPos.z);
        mesh.scale.setScalar(0.65 + (i % 3) * 0.25);
        fragmentsGroup.add(mesh);
        fragmentData.push({ mesh, phase: i * 0.42 });
      }
      scene.add(fragmentsGroup);

      // Subtle Atmospheric Particle Field (Low-overhead count for 8GB laptops)
      const pCount = isMobile ? 160 : 380;
      const pPos = new Float32Array(pCount * 3);
      for (let i = 0; i < pCount; i++) {
        pPos[i * 3] = (Math.random() - 0.5) * 14;
        pPos[i * 3 + 1] = (Math.random() - 0.5) * 10;
        pPos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 1;
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
      const pMat = new THREE.PointsMaterial({
        color: 0xc4c9d0,
        size: 0.025,
        transparent: true,
        opacity: 0.45
      });
      particles = new THREE.Points(pGeo, pMat);
      scene.add(particles);

      mode = 'webgl';
      updateRenderBadge('WEBGL / GLSL ACTIVE');
      return true;
    } catch (err) {
      return false;
    }
  }

  function initFallback2D() {
    ctx2d = canvas.getContext('2d');
    if (!ctx2d) return false;

    // Build icosahedron-like 3D points for procedural projection
    fallbackVertices = [];
    const total = 28;
    for (let i = 0; i < total; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / total);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      fallbackVertices.push({
        bx: Math.sin(phi) * Math.cos(theta),
        by: Math.cos(phi),
        bz: Math.sin(phi) * Math.sin(theta),
        x: 0,
        y: 0,
        z: 0
      });
    }

    fallbackParticles = [];
    for (let i = 0; i < 64; i++) {
      fallbackParticles.push({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.4 + 0.4,
        speed: Math.random() * 0.00018 + 0.00006
      });
    }

    resizeFallback();
    mode = 'canvas2d-fallback';
    updateRenderBadge('2D PROCEDURAL FALLBACK');
    return true;
  }

  function resizeFallback() {
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    if (ctx2d) ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function renderThree(timeSec) {
    const target = SECTION_STATES[activeSectionIndex] || SECTION_STATES[0];
    const smooth = reducedMotion ? 0.2 : 0.045;

    pointer.x = lerp(pointer.x, pointer.targetX, 0.06);
    pointer.y = lerp(pointer.y, pointer.targetY, 0.06);

    current.coreScale = lerp(current.coreScale, target.coreScale, smooth);
    current.spread = lerp(current.spread, target.spread, smooth);
    current.ringTilt = lerp(current.ringTilt, target.ringTilt, smooth);
    current.camX = lerp(current.camX, target.camX, smooth);
    current.camY = lerp(current.camY, target.camY, smooth);
    current.camZ = lerp(current.camZ, target.camZ, smooth);
    current.morph = lerp(current.morph, target.morph, smooth);

    camera.position.x = current.camX + pointer.x * 0.45;
    camera.position.y = current.camY - pointer.y * 0.35;
    camera.position.z = current.camZ;
    camera.lookAt(0, 0, 0);

    coreMat.uniforms.uTime.value = reducedMotion ? 0.5 : timeSec;
    coreMat.uniforms.uMorph.value = current.morph;
    coreMat.uniforms.uPointer.value.set(pointer.x, pointer.y);

    coreMesh.scale.setScalar(current.coreScale);
    coreMesh.rotation.y = timeSec * (reducedMotion ? 0.02 : 0.16) + scrollProgress * 2.4;
    coreMesh.rotation.x = Math.sin(timeSec * 0.25) * 0.18 + pointer.y * 0.25;

    wireMesh.scale.setScalar(current.coreScale * 1.02);
    wireMesh.rotation.y = -timeSec * 0.09 + scrollProgress * 1.5;
    wireMesh.rotation.z = timeSec * 0.05;

    ringsGroup.rotation.x = current.ringTilt + pointer.y * 0.2;
    ringsGroup.rotation.y = timeSec * 0.14 + scrollProgress * 1.8;
    ringsGroup.scale.setScalar(0.85 + current.spread * 0.12);

    const fragCount = fragmentData.length;
    for (let i = 0; i < fragCount; i++) {
      const f = fragmentData[i];
      const goal = computeFragmentTarget(i, fragCount, target.form, current.spread);
      const bob = reducedMotion ? 0 : Math.sin(timeSec * 1.1 + f.phase) * 0.08;
      f.mesh.position.x = lerp(f.mesh.position.x, goal.x, 0.05);
      f.mesh.position.y = lerp(f.mesh.position.y, goal.y + bob, 0.05);
      f.mesh.position.z = lerp(f.mesh.position.z, goal.z, 0.05);
      f.mesh.rotation.x += 0.008;
      f.mesh.rotation.y += 0.011;
    }

    particles.rotation.y = timeSec * 0.025 + pointer.x * 0.08;
    particles.rotation.x = pointer.y * 0.05;

    renderer.render(scene, camera);
  }

  function renderFallback2D(timeSec) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const target = SECTION_STATES[activeSectionIndex] || SECTION_STATES[0];

    pointer.x = lerp(pointer.x, pointer.targetX, 0.06);
    pointer.y = lerp(pointer.y, pointer.targetY, 0.06);
    current.coreScale = lerp(current.coreScale, target.coreScale, 0.05);
    current.spread = lerp(current.spread, target.spread, 0.05);

    ctx2d.clearRect(0, 0, w, h);

    const cx = w * (w > 980 ? 0.64 : 0.5) + pointer.x * 26;
    const cy = h * 0.48 + pointer.y * 18;
    const baseR = Math.min(w, h) * 0.22 * current.coreScale;

    // Atmospheric particles
    ctx2d.fillStyle = 'rgba(196, 201, 208, 0.35)';
    for (let i = 0; i < fallbackParticles.length; i++) {
      const p = fallbackParticles[i];
      if (!reducedMotion) p.y = (p.y - p.speed + 1) % 1;
      ctx2d.beginPath();
      ctx2d.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
      ctx2d.fill();
    }

    // Liquid-metal radial core halo
    const grad = ctx2d.createRadialGradient(
      cx - baseR * 0.32,
      cy - baseR * 0.32,
      baseR * 0.08,
      cx,
      cy,
      baseR * 1.45
    );
    grad.addColorStop(0, 'rgba(242, 243, 244, 0.34)');
    grad.addColorStop(0.35, 'rgba(196, 201, 208, 0.16)');
    grad.addColorStop(0.7, 'rgba(41, 45, 51, 0.24)');
    grad.addColorStop(1, 'rgba(9, 10, 12, 0)');
    ctx2d.fillStyle = grad;
    ctx2d.beginPath();
    ctx2d.arc(cx, cy, baseR * 1.45, 0, Math.PI * 2);
    ctx2d.fill();

    // Precision orbital ellipses
    ctx2d.save();
    ctx2d.translate(cx, cy);
    for (let r = 0; r < 2; r++) {
      ctx2d.save();
      ctx2d.rotate(timeSec * (r === 0 ? 0.12 : -0.09) + scrollProgress * 2 + r * 1.1);
      ctx2d.strokeStyle = r === 0 ? 'rgba(196, 201, 208, 0.26)' : 'rgba(119, 126, 135, 0.2)';
      ctx2d.lineWidth = 1;
      ctx2d.beginPath();
      ctx2d.ellipse(0, 0, baseR * (1.55 + r * 0.35), baseR * (0.48 + r * 0.2), 0, 0, Math.PI * 2);
      ctx2d.stroke();
      ctx2d.restore();
    }
    ctx2d.restore();

    // 3D-projected morphing nodes
    const rotY = timeSec * 0.22 + scrollProgress * 2.5 + pointer.x * 0.5;
    const rotX = 0.35 + pointer.y * 0.4;
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);

    const projected = [];
    const total = fallbackVertices.length;
    for (let i = 0; i < total; i++) {
      const v = fallbackVertices[i];
      const goal = computeFragmentTarget(i, total, target.form, current.spread * 0.72);
      v.x = lerp(v.x, goal.x, 0.06);
      v.y = lerp(v.y, goal.y, 0.06);
      v.z = lerp(v.z, goal.z, 0.06);

      const x1 = v.x * cosY - v.z * sinY;
      const z1 = v.x * sinY + v.z * cosY;
      const y2 = v.y * cosX - z1 * sinX;
      const z2 = v.y * sinX + z1 * cosX;

      const scale = 280 / (4.2 + z2);
      projected.push({
        sx: cx + x1 * scale,
        sy: cy + y2 * scale,
        z: z2
      });
    }

    // Connect nearby projected vertices
    ctx2d.strokeStyle = 'rgba(196, 201, 208, 0.16)';
    ctx2d.lineWidth = 0.85;
    for (let i = 0; i < projected.length; i++) {
      for (let j = i + 1; j < projected.length; j++) {
        const dx = projected[i].sx - projected[j].sx;
        const dy = projected[i].sy - projected[j].sy;
        const d = Math.hypot(dx, dy);
        if (d < 135) {
          ctx2d.beginPath();
          ctx2d.moveTo(projected[i].sx, projected[i].sy);
          ctx2d.lineTo(projected[j].sx, projected[j].sy);
          ctx2d.stroke();
        }
      }
    }

    // Draw sculptural vertices
    for (let i = 0; i < projected.length; i++) {
      const p = projected[i];
      const alpha = Math.max(0.2, Math.min(0.95, 0.65 - p.z * 0.14));
      ctx2d.fillStyle = `rgba(242, 243, 244, ${alpha.toFixed(2)})`;
      ctx2d.beginPath();
      ctx2d.arc(p.sx, p.sy, p.z < 0 ? 2.6 : 1.7, 0, Math.PI * 2);
      ctx2d.fill();
    }
  }

  function tick(now) {
    if (!isVisible) {
      rafId = null;
      return;
    }
    const timeSec = now * 0.001;
    if (mode === 'webgl') {
      renderThree(timeSec);
    } else if (mode === 'canvas2d-fallback') {
      renderFallback2D(timeSec);
    }
    rafId = window.requestAnimationFrame(tick);
  }

  function handleResize() {
    if (mode === 'webgl' && renderer && camera) {
      const isMobile = window.innerWidth < 768;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.75));
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight, false);
    } else if (mode === 'canvas2d-fallback') {
      resizeFallback();
    }
  }

  function handlePointer(e) {
    pointer.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.targetY = (e.clientY / window.innerHeight) * 2 - 1;
  }

  function handleVisibility() {
    isVisible = !document.hidden;
    if (isVisible && !rafId) {
      rafId = window.requestAnimationFrame(tick);
    }
  }

  return {
    init: function () {
      canvas = document.getElementById('scene-canvas');
      if (!canvas) return;
      reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const ok = initThree();
      if (!ok) {
        initFallback2D();
      }

      window.addEventListener('resize', handleResize, { passive: true });
      window.addEventListener('pointermove', handlePointer, { passive: true });
      document.addEventListener('visibilitychange', handleVisibility);

      rafId = window.requestAnimationFrame(tick);
    },
    setSection: function (idx) {
      if (idx >= 0 && idx < SECTION_STATES.length) {
        activeSectionIndex = idx;
      }
    },
    setScrollProgress: function (p) {
      scrollProgress = Math.max(0, Math.min(1, p));
    },
    getMode: function () {
      return mode;
    },
    dispose: function () {
      if (rafId) window.cancelAnimationFrame(rafId);
      if (renderer) renderer.dispose();
    }
  };
})();
