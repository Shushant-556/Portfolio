/* ==========================================================================
   CUSTOM GLSL SHADER LIBRARY
   Liquid-Metal Sculptural Core — Simplex 3D Noise + Fresnel Studio Lighting
   ========================================================================== */

window.ShaderLibrary = {
  liquidMetalVertex: `
    uniform float uTime;
    uniform float uMorph;
    uniform float uNoiseScale;
    uniform float uDisplaceAmp;
    uniform vec2 uPointer;

    varying vec3 vNormal;
    varying vec3 vViewPos;
    varying float vDisplacement;

    // Ashima 3D Simplex Noise (Compact GLSL)
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) {
      const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g  = step(x0.yzx, x0.xyz);
      vec3 l  = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ * ns.x + ns.yyyy;
      vec4 y = y_ * ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0) * 2.0 + 1.0;
      vec4 s1 = floor(b1) * 2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    void main() {
      vec3 pos = position;
      float n1 = snoise(pos * uNoiseScale + vec3(uTime * 0.22, uTime * 0.14, uPointer.x * 0.4));
      float n2 = snoise(pos * (uNoiseScale * 2.1) - vec3(uTime * 0.16, uPointer.y * 0.4, uTime * 0.2));
      float disp = (n1 * 0.72 + n2 * 0.28) * uDisplaceAmp * (1.0 + uMorph * 0.55);

      vDisplacement = disp;
      vec3 displacedPos = pos + normal * disp;

      vec4 mvPosition = modelViewMatrix * vec4(displacedPos, 1.0);
      vViewPos = -mvPosition.xyz;
      vNormal = normalize(normalMatrix * normalize(normal + vec3(n1 * 0.18, n2 * 0.18, 0.0)));

      gl_Position = projectionMatrix * mvPosition;
    }
  `,

  liquidMetalFragment: `
    uniform float uTime;
    uniform float uOpacity;
    uniform vec3 uObsidian;
    uniform vec3 uGraphite;
    uniform vec3 uSilver;
    uniform vec3 uPorcelain;

    varying vec3 vNormal;
    varying vec3 vViewPos;
    varying float vDisplacement;

    void main() {
      vec3 N = normalize(vNormal);
      vec3 V = normalize(vViewPos);

      // Studio 3-point monochrome lighting
      vec3 L1 = normalize(vec3(2.4, 3.2, 2.8));
      vec3 L2 = normalize(vec3(-3.0, -1.2, 1.8));
      vec3 L3 = normalize(vec3(0.0, 2.5, -3.0));

      float diff1 = max(dot(N, L1), 0.0);
      float diff2 = max(dot(N, L2), 0.0) * 0.45;
      float diff3 = max(dot(N, L3), 0.0) * 0.35;

      // Specular metallic highlights
      vec3 H1 = normalize(L1 + V);
      float spec1 = pow(max(dot(N, H1), 0.0), 42.0);
      vec3 H2 = normalize(L2 + V);
      float spec2 = pow(max(dot(N, H2), 0.0), 22.0) * 0.5;

      // Fresnel rim reflection
      float fresnel = pow(1.0 - max(dot(N, V), 0.0), 3.2);

      // Anisotropic liquid-metal banding
      float band = sin((vDisplacement * 14.0) + N.y * 4.0 + uTime * 0.4) * 0.5 + 0.5;

      vec3 base = mix(uObsidian, uGraphite, diff1 + diff2 + diff3);
      base = mix(base, uSilver, band * 0.24 + fresnel * 0.62);
      base += uPorcelain * (spec1 * 0.85 + spec2 * 0.35 + fresnel * 0.32);

      gl_FragColor = vec4(base, uOpacity);
    }
  `
};
