(function () {
  if (typeof THREE === "undefined") return;

  const canvas = document.getElementById("webgl-canvas");
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 7.2);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const sculptureGroup = new THREE.Group();
  sculptureGroup.position.set(2.35, 0.1, 0);
  scene.add(sculptureGroup);

  // Custom GLSL Vertex & Fragment Shader for morphing obsidian core with sharp crimson Fresnel rim
  const vertexShader = `
    uniform float uTime;
    uniform float uScroll;
    uniform vec2 uPointer;
    varying vec3 vNormal;
    varying vec3 vViewDir;
    varying float vDisplacement;

    // Compact 3D harmonic wave displacement for clean architectural facets
    float waveField(vec3 p, float t) {
      float w1 = sin(p.x * 2.2 + t * 0.9) * cos(p.y * 2.0 - t * 0.7);
      float w2 = sin(p.z * 2.6 + t * 1.1) * 0.5;
      return (w1 + w2) * 0.14;
    }

    void main() {
      vec3 pos = position;
      float disp = waveField(pos, uTime + uScroll * 2.5);
      pos += normal * disp;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      vNormal = normalize(normalMatrix * normal);
      vViewDir = normalize(-mvPosition.xyz);
      vDisplacement = disp;

      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    uniform vec3 uBaseColor;
    uniform vec3 uAccentColor;
    varying vec3 vNormal;
    varying vec3 vViewDir;
    varying float vDisplacement;

    void main() {
      float ndotv = max(dot(normalize(vNormal), normalize(vViewDir)), 0.0);
      float fresnel = pow(1.0 - ndotv, 2.8);
      float ridge = smoothstep(0.05, 0.18, vDisplacement);

      vec3 col = mix(uBaseColor, uAccentColor, clamp(fresnel * 1.35 + ridge * 0.35, 0.0, 1.0));
      gl_FragColor = vec4(col, 1.0);
    }
  `;

  const coreUniforms = {
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uPointer: { value: new THREE.Vector2(0, 0) },
    uBaseColor: { value: new THREE.Color(0x0B0B0E) },
    uAccentColor: { value: new THREE.Color(0xE11D48) }
  };

  const coreGeo = new THREE.IcosahedronGeometry(1.45, 5);
  const coreMat = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: coreUniforms
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  sculptureGroup.add(coreMesh);

  // Outer Precision Crimson Wireframe Cage
  const cageGeo = new THREE.IcosahedronGeometry(2.15, 1);
  const cageMat = new THREE.MeshBasicMaterial({
    color: 0xE11D48,
    wireframe: true
  });
  const cageMesh = new THREE.Mesh(cageGeo, cageMat);
  sculptureGroup.add(cageMesh);

  // Secondary Counter-Rotating Architectural Ring
  const ringGeo = new THREE.TorusGeometry(2.85, 0.012, 8, 64);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x3F3F46
  });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.rotation.x = Math.PI * 0.38;
  sculptureGroup.add(ringMesh);

  // Floating Geometric Satellites
  const satellites = new THREE.Group();
  const satGeo = new THREE.OctahedronGeometry(0.11, 0);
  const satMatRed = new THREE.MeshBasicMaterial({ color: 0xE11D48, wireframe: true });
  const satMatWhite = new THREE.MeshBasicMaterial({ color: 0xFAF8F5, wireframe: true });

  const satCoords = [
    [-2.4, 1.6, -0.5],
    [2.6, -1.5, 0.4],
    [-1.8, -2.1, 0.8],
    [1.9, 2.2, -0.6]
  ];

  satCoords.forEach((coord, idx) => {
    const m = new THREE.Mesh(satGeo, idx % 2 === 0 ? satMatRed : satMatWhite);
    m.position.set(coord[0], coord[1], coord[2]);
    satellites.add(m);
  });
  sculptureGroup.add(satellites);

  let pointerX = 0;
  let pointerY = 0;
  let smoothX = 0;
  let smoothY = 0;

  window.addEventListener("mousemove", (e) => {
    pointerX = (e.clientX / window.innerWidth - 0.5) * 2;
    pointerY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerWidth < 900) {
      sculptureGroup.position.set(0, 0.6, -1.8);
      sculptureGroup.scale.set(0.75, 0.75, 0.75);
    } else {
      sculptureGroup.position.set(2.35, 0.1, 0);
      sculptureGroup.scale.set(1, 1, 1);
    }
  }

  handleResize();
  window.addEventListener("resize", handleResize);

  const clock = new THREE.Clock();

  function renderLoop() {
    const t = clock.getElapsedTime();
    const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
    const scrollProgress = window.scrollY / maxScroll;

    smoothX += (pointerX - smoothX) * 0.05;
    smoothY += (pointerY - smoothY) * 0.05;

    coreUniforms.uTime.value = t;
    coreUniforms.uScroll.value = scrollProgress;
    coreUniforms.uPointer.value.set(smoothX, smoothY);

    coreMesh.rotation.y = t * 0.22 + scrollProgress * 3.14;
    coreMesh.rotation.x = smoothY * 0.35 + scrollProgress * 1.2;

    cageMesh.rotation.y = -t * 0.16 - scrollProgress * 2.4;
    cageMesh.rotation.z = t * 0.08 + smoothX * 0.4;

    ringMesh.rotation.z = t * 0.14 + scrollProgress * 2.0;
    ringMesh.rotation.y = smoothX * 0.3;

    satellites.rotation.y = t * 0.25;
    satellites.children.forEach((sat, i) => {
      sat.rotation.x = t * (0.6 + i * 0.15);
      sat.rotation.y = t * (0.5 + i * 0.1);
    });

    // Subtle vertical drift as user scrolls
    sculptureGroup.position.y = 0.1 + Math.sin(t * 0.9) * 0.12 - scrollProgress * 0.4;

    renderer.render(scene, camera);
    requestAnimationFrame(renderLoop);
  }

  renderLoop();
})();
