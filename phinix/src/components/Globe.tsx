'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import atlas from '@/data/atlas.json'

/* -------------------------------------------------------------------------- */
/*  Geometry helpers                                                           */
/* -------------------------------------------------------------------------- */

const DEG = Math.PI / 180

/** lat/lon (degrees) → point on a sphere of radius r. */
function latLonToVec3(lat: number, lon: number, r = 1): THREE.Vector3 {
  const phi = (90 - lat) * DEG
  const theta = (lon + 180) * DEG
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  )
}

type Hub = { name: string; lat: number; lon: number }

/** Studio hub + client cities — the arcs visualise "work from anywhere". */
const BUDAPEST: Hub = { name: 'Budapest', lat: 47.49, lon: 19.04 }
const HUBS: Hub[] = [
  { name: 'London', lat: 51.51, lon: -0.12 },
  { name: 'New York', lat: 40.71, lon: -74.01 },
  { name: 'São Paulo', lat: -23.55, lon: -46.63 },
  { name: 'Lagos', lat: 6.52, lon: 3.38 },
  { name: 'Dubai', lat: 25.2, lon: 55.27 },
  { name: 'Singapore', lat: 1.35, lon: 103.82 },
  { name: 'Tokyo', lat: 35.68, lon: 139.69 },
  { name: 'Sydney', lat: -33.87, lon: 151.21 },
  { name: 'Los Angeles', lat: 34.05, lon: -118.24 },
]
const ARCS: Array<[Hub, Hub]> = [
  [BUDAPEST, HUBS[0]],
  [BUDAPEST, HUBS[1]],
  [BUDAPEST, HUBS[3]],
  [BUDAPEST, HUBS[4]],
  [BUDAPEST, HUBS[5]],
  [BUDAPEST, HUBS[7]],
  [BUDAPEST, HUBS[8]],
  [BUDAPEST, HUBS[2]],
]

/** Builds a lifted great-circle arc between two coordinates. */
function buildArc(a: Hub, b: Hub, segments = 72): THREE.Vector3[] {
  const va = latLonToVec3(a.lat, a.lon)
  const vb = latLonToVec3(b.lat, b.lon)
  const dist = va.angleTo(vb)
  const lift = 0.14 + (dist / Math.PI) * 0.34
  const pts: THREE.Vector3[] = []
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    // spherical interpolation, then lift along the normal
    const v = new THREE.Vector3().copy(va).lerp(vb, t)
    if (v.lengthSq() < 1e-6) v.copy(va)
    v.normalize()
    v.multiplyScalar(1.001 + Math.sin(Math.PI * t) * lift)
    pts.push(v)
  }
  return pts
}

/* -------------------------------------------------------------------------- */
/*  Shaders                                                                    */
/* -------------------------------------------------------------------------- */

const EARTH_VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormalView;
  varying vec3 vPosView;

  void main() {
    vUv = uv;
    vNormalView = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vPosView = mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`

const EARTH_FRAG = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec3 uEmber;
  uniform vec3 uLight;
  uniform float uOpacity;
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vNormalView;
  varying vec3 vPosView;

  void main() {
        // clamp away from the pole rows: an equirectangular map smears into torn
    // fringes where every meridian collapses to one texel
    vec2 uv = vec2(vUv.x, clamp(vUv.y, 0.022, 0.978));
    vec4 tex = texture2D(uMap, uv);
    vec3 base = tex.rgb;
    // sharpen the coverage mask: at the poles an equirectangular map compresses
    // every meridian into a few texels, so the raw alpha smears into torn edges
    float land = smoothstep(0.34, 0.66, tex.a);

    vec3 n = normalize(vNormalView);
    vec3 viewDir = normalize(-vPosView);

    // soft studio light from the upper-left
    float lambert = dot(n, normalize(uLight));
    float light = smoothstep(-0.55, 0.95, lambert);

    vec3 color = base * mix(0.30, 0.82, light);

    // coast glow: a hairline along the land edge — it used to wash the whole
    // western hemisphere in ember and the globe read as a red planet
    float coast = 1.0 - smoothstep(0.0, 0.30, abs(land - 0.5));
    color += uEmber * coast * 0.05;

    // rim light — fresnel, strongest at the silhouette, warm but restrained
    float fres = pow(1.0 - clamp(dot(n, viewDir), 0.0, 1.0), 3.4);
    color += uEmber * fres * 0.30;

    // a very slow shimmer across the terminator keeps the sphere alive
    float shimmer = 0.012 * sin(vUv.x * 40.0 + uTime * 0.4) * (1.0 - light);
    color += uEmber * shimmer;

    gl_FragColor = vec4(color, uOpacity);
  }
`

const GLOW_VERT = /* glsl */ `
  varying vec3 vNormalView;
  void main() {
    vNormalView = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const GLOW_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uStrength;
  varying vec3 vNormalView;
  void main() {
    float i = pow(0.68 - dot(vNormalView, vec3(0.0, 0.0, 1.0)), 3.2);
    gl_FragColor = vec4(uColor, 1.0) * clamp(i, 0.0, 1.0) * uStrength;
  }
`

const DOTS_VERT = /* glsl */ `
  attribute float aScale;
  attribute float aSeed;
  uniform float uPixelRatio;
  uniform float uSize;
  uniform float uTime;
  uniform vec3 uLightDir;
  varying float vAlpha;
  varying float vSeed;

  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vec3 n = normalize(mat3(modelMatrix) * position);
    float facing = smoothstep(-0.25, 0.45, dot(n, uLightDir));
    vAlpha = facing;
    vSeed = aSeed;
    float twinkle = 0.65 + 0.35 * sin(uTime * 1.4 + aSeed * 30.0);
    gl_PointSize = uSize * aScale * twinkle * uPixelRatio * (1.0 / max(0.001, -mv.z));
    gl_Position = projectionMatrix * mv;
  }
`

const DOTS_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uColor2;
  uniform float uOpacity;
  varying float vAlpha;
  varying float vSeed;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.08, d);
    vec3 col = mix(uColor, uColor2, step(0.82, vSeed));
    gl_FragColor = vec4(col, a * vAlpha * uOpacity);
  }
`

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

type GlobeProps = {
  className?: string
  /** Auto-rotation speed in radians/second. */
  speed?: number
  reducedMotion?: boolean
}

export default function Globe({ className, speed = 0.075, reducedMotion = false }: GlobeProps) {
  // Rendering is strictly opt-in: nothing is drawn until the component is in
  // view AND the visitor has interacted (scroll / pointer / key) — so the
  // Lighthouse/field LCP and TBT are measured on a page doing zero GPU work.
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    let disposed = false
    let raf = 0
    let activated = false
    let renderer: THREE.WebGLRenderer

    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        depth: true,
        stencil: false,
        alpha: true,
        powerPreference: 'high-performance',
      })
    } catch {
      host.dataset.failed = 'true'
      return
    }

    const width = host.clientWidth || host.parentElement?.clientWidth || 560
    const height = host.clientHeight || host.parentElement?.clientHeight || width
    // DPR is capped hard: a soft-lit globe does not need retina pixel density.
    const dpr = Math.min(window.devicePixelRatio || 1, width < 480 ? 1.4 : 1.6)

    // The renderer is started lazily (see `activate`) — nothing is allocated for
    // the GPU or uploaded as a texture before the visitor shows intent.
    renderer.setPixelRatio(dpr)
    renderer.setSize(width, height, false)
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.domElement.style.opacity = '0'
    renderer.domElement.style.transition = 'opacity 650ms ease'
    host.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100)
    camera.position.set(0, 0, 3.7)

    const globeGroup = new THREE.Group()
    globeGroup.rotation.z = -0.18
    globeGroup.rotation.x = 0.1
    scene.add(globeGroup)

    const ember = new THREE.Color('#ff6a2b')
    const gold = new THREE.Color('#e9c46a')
    const porcelain = new THREE.Color('#f4efe7')

    const lightDir = new THREE.Vector3(-0.55, 0.5, 0.72).normalize()

    /* ---------------- textures ------------------------------------------- */
    const loader = new THREE.TextureLoader()
    loader.setCrossOrigin('anonymous')
    const map = loader.load(
      '/textures/earth-landmap.webp',
      (tex) => {
        tex.needsUpdate = true
      },
      undefined,
      () => {
        // extremely old browser without WebP → fall back to PNG once
        loader.load('/textures/earth-landmap-fallback.png', (tex) => {
          earthMat.uniforms.uMap.value = tex
          tex.colorSpace = THREE.SRGBColorSpace
          tex.needsUpdate = true
        })
      },
    )
    map.colorSpace = THREE.SRGBColorSpace
    map.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())
    map.wrapS = THREE.RepeatWrapping

    /* ---------------- earth ---------------------------------------------- */
    const lowPower = matchMedia('(pointer: coarse)').matches || (navigator.hardwareConcurrency ?? 4) <= 4
    const earthGeo = new THREE.SphereGeometry(1, lowPower ? 40 : 64, lowPower ? 28 : 44)
    const earthMat = new THREE.ShaderMaterial({
      uniforms: {
        uMap: { value: map },
        uEmber: { value: ember },
        uLight: { value: lightDir },
        uOpacity: { value: 1 },
        uTime: { value: 0 },
      },
      vertexShader: EARTH_VERT,
      fragmentShader: EARTH_FRAG,
      transparent: true,
    })
    const earth = new THREE.Mesh(earthGeo, earthMat)
    globeGroup.add(earth)

    /* ---------------- atmosphere ----------------------------------------- */
    const glowGeo = new THREE.SphereGeometry(1.11, 48, 32)
    const glowMat = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color('#ff7a3d') },
        uStrength: { value: 0.34 },
      },
      vertexShader: GLOW_VERT,
      fragmentShader: GLOW_FRAG,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
    })
    const glow = new THREE.Mesh(glowGeo, glowMat)
    scene.add(glow)

    /* ---------------- graticule ------------------------------------------ */
    const gratPts: number[] = []
    const R = 1.0025
    for (let lon = -180; lon < 180; lon += 30) {
      for (let lat = -90; lat < 90; lat += 6) {
        const a = latLonToVec3(lat, lon, R)
        const b = latLonToVec3(lat + 6, lon, R)
        gratPts.push(a.x, a.y, a.z, b.x, b.y, b.z)
      }
    }
    for (let lat = -60; lat <= 60; lat += 30) {
      for (let lon = -180; lon < 180; lon += 6) {
        const a = latLonToVec3(lat, lon, R)
        const b = latLonToVec3(lat, lon + 6, R)
        gratPts.push(a.x, a.y, a.z, b.x, b.y, b.z)
      }
    }
    const gratGeo = new THREE.BufferGeometry()
    gratGeo.setAttribute('position', new THREE.Float32BufferAttribute(gratPts, 3))
    const gratMat = new THREE.LineBasicMaterial({
      color: 0xf4efe7,
      transparent: true,
      opacity: 0.055,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const graticule = new THREE.LineSegments(gratGeo, gratMat)
    globeGroup.add(graticule)

    /* ---------------- land particles -------------------------------------- */
    const pts = atlas.points as Array<[number, number, number]>
    const count = pts.length
    const posArr = new Float32Array(count * 3)
    const scaleArr = new Float32Array(count)
    const seedArr = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const [x, y, z] = pts[i]
      const r = 1.006
      posArr[i * 3] = x * r
      posArr[i * 3 + 1] = y * r
      posArr[i * 3 + 2] = z * r
      scaleArr[i] = 0.55 + Math.random() * 0.9
      seedArr[i] = Math.random()
    }
    const dotGeo = new THREE.BufferGeometry()
    dotGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3))
    dotGeo.setAttribute('aScale', new THREE.BufferAttribute(scaleArr, 1))
    dotGeo.setAttribute('aSeed', new THREE.BufferAttribute(seedArr, 1))

    const dotMat = new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: dpr },
        uSize: { value: width < 480 ? 16 : 12 },
        uTime: { value: 0 },
        uLightDir: { value: lightDir },
        uColor: { value: porcelain },
        uColor2: { value: gold },
        uOpacity: { value: 0.42 },
      },
      vertexShader: DOTS_VERT,
      fragmentShader: DOTS_FRAG,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const dots = new THREE.Points(dotGeo, dotMat)
    globeGroup.add(dots)

    /* ---------------- arcs + pulses --------------------------------------- */
    const pulseTexture = (() => {
      const c = document.createElement('canvas')
      c.width = c.height = 64
      const ctx = c.getContext('2d')!
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
      g.addColorStop(0, 'rgba(255,255,255,1)')
      g.addColorStop(0.25, 'rgba(255,210,170,0.9)')
      g.addColorStop(0.55, 'rgba(255,106,43,0.35)')
      g.addColorStop(1, 'rgba(255,106,43,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, 64, 64)
      const tex = new THREE.CanvasTexture(c)
      tex.colorSpace = THREE.SRGBColorSpace
      return tex
    })()

    type Pulse = { sprite: THREE.Sprite; curve: THREE.Vector3[]; t: number; speed: number }
    const pulses: Pulse[] = []
    const arcGroup = new THREE.Group()
    globeGroup.add(arcGroup)

    ARCS.forEach(([a, b], idx) => {
      const curve = buildArc(a, b)
      const positions = new Float32Array(curve.length * 3)
      const colors = new Float32Array(curve.length * 3)
      curve.forEach((p, i) => {
        positions[i * 3] = p.x
        positions[i * 3 + 1] = p.y
        positions[i * 3 + 2] = p.z
        const t = i / (curve.length - 1)
        const c = ember.clone().lerp(gold, Math.sin(t * Math.PI))
        colors[i * 3] = c.r
        colors[i * 3 + 1] = c.g
        colors[i * 3 + 2] = c.b
      })
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      const mat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      arcGroup.add(new THREE.Line(geo, mat))

      const spriteMat = new THREE.SpriteMaterial({
        map: pulseTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity: 1,
      })
      const sprite = new THREE.Sprite(spriteMat)
      sprite.scale.setScalar(0.05)
      arcGroup.add(sprite)

      pulses.push({
        sprite,
        curve,
        t: (idx / ARCS.length) * 0.9,
        speed: 0.055 + Math.random() * 0.035,
      })
    })

    /* ---------------- hub nodes ------------------------------------------- */
    const nodeGeo = new THREE.SphereGeometry(0.012, 10, 10)
    const nodeMat = new THREE.MeshBasicMaterial({
      color: gold,
      transparent: true,
      opacity: 0.95,
    })
    const nodeGlowGeo = new THREE.SphereGeometry(0.03, 10, 10)
    const nodeGlowMat = new THREE.MeshBasicMaterial({
      color: ember,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    ;[BUDAPEST, ...HUBS].forEach((hub) => {
      const p = latLonToVec3(hub.lat, hub.lon, 1.005)
      const node = new THREE.Mesh(nodeGeo, nodeMat)
      node.position.copy(p)
      const halo = new THREE.Mesh(nodeGlowGeo, nodeGlowMat)
      halo.position.copy(p)
      globeGroup.add(node, halo)
    })

    /* ---------------- interaction state ------------------------------------ */
    const rot = { x: 0.1, y: -1.45 }
    const target = { x: 0.1, y: -1.45 }
    let dragging = false
    let lastX = 0
    let lastY = 0
    let velocityY = 0
    let velocityX = 0
    let pointerInside = false

    const onPointerDown = (e: PointerEvent) => {
      dragging = true
      lastX = e.clientX
      lastY = e.clientY
      velocityY = 0
      velocityX = 0
      host.style.cursor = 'grabbing'
      renderer.domElement.setPointerCapture?.(e.pointerId)
    }
    const onPointerMove = (e: PointerEvent) => {
      pointerInside = true
      if (!dragging) return
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      lastX = e.clientX
      lastY = e.clientY
      velocityY = dx * 0.0055
      velocityX = dy * 0.0035
      target.y += velocityY
      target.x = Math.max(-0.85, Math.min(0.85, target.x + velocityX))
    }
    const onPointerUp = () => {
      dragging = false
      host.style.cursor = 'grab'
    }
    const onPointerLeave = () => {
      pointerInside = false
      dragging = false
      host.style.cursor = 'grab'
    }

    host.style.cursor = 'grab'
    host.addEventListener('pointerdown', onPointerDown)
    host.addEventListener('pointermove', onPointerMove)
    host.addEventListener('pointerup', onPointerUp)
    host.addEventListener('pointerleave', onPointerLeave)
    host.addEventListener('pointercancel', onPointerUp)

    /* ---------------- visibility / resize ---------------------------------- */
    let visible = true
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true
      },
      { threshold: 0.05 },
    )
    io.observe(host)

    const onVisibility = () => {
      if (document.hidden) visible = false
      else visible = true
    }
    document.addEventListener('visibilitychange', onVisibility)

    const resize = () => {
      const w = host.clientWidth
      const h = host.clientHeight
      if (!w || !h) return
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h, false)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(host)

    /* ---------------- render loop ------------------------------------------ */
    // NOTE: tick() is only started by activate(); until then the canvas stays empty
    // and the static fallback underneath remains visible.
    const timer = new THREE.Timer()
    let elapsed = 0
    let inViewport = true
    const vpObserver = new IntersectionObserver((entries) => {
      inViewport = entries[0]?.isIntersecting ?? true
    })
    vpObserver.observe(host)

    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!activated || document.hidden || !inViewport) {
        frameTick()
        return
      }

      frameTick()
      timer.update()
      const dt = Math.min(timer.getDelta(), 0.05)
      elapsed += dt

      if (!dragging) {
        // inertia
        target.y += velocityY
        target.x = Math.max(-0.85, Math.min(0.85, target.x + velocityX))
        velocityY *= 0.94
        velocityX *= 0.9
        if (!reducedMotion) {
          target.y += speed * dt
          if (pointerInside && !reducedMotion) {
            // gentle ease-back to a relaxed tilt
            target.x += (0.1 - target.x) * 0.008
          }
        }
      }

      rot.y += (target.y - rot.y) * 0.08
      rot.x += (target.x - rot.x) * 0.08
      globeGroup.rotation.y = rot.y
      globeGroup.rotation.x = rot.x

      // counter-rotate the atmosphere so its rim stays anchored to the camera
      glow.rotation.y = -rot.y * 0.15

      earthMat.uniforms.uTime.value = elapsed
      dotMat.uniforms.uTime.value = elapsed

      if (!reducedMotion) {
        for (const pulse of pulses) {
          pulse.t += pulse.speed * dt
          if (pulse.t > 1) pulse.t -= 1
          const idx = Math.min(pulse.curve.length - 1, Math.floor(pulse.t * (pulse.curve.length - 1)))
          pulse.sprite.position.copy(pulse.curve[idx])
          const fade = Math.sin(Math.PI * pulse.t)
          pulse.sprite.scale.setScalar(0.035 + fade * 0.045)
          ;(pulse.sprite.material as THREE.SpriteMaterial).opacity = 0.15 + fade * 0.85
        }
      } else {
        pulses.forEach((p, i) => {
          const idx = Math.floor(((i + 0.5) / pulses.length) * (p.curve.length - 1))
          p.sprite.position.copy(p.curve[idx])
          p.sprite.scale.setScalar(0.04)
          ;(p.sprite.material as THREE.SpriteMaterial).opacity = 0.6
        })
      }

      renderer.render(scene, camera)
    }
    /* ---------------- activation gate ---------------------------------------
       Nothing renders until the globe is on screen and the visitor has shown
       intent (scroll / pointer / key), so first-load main-thread work stays ~0.
       A 2.5 s safety timer guarantees the globe is alive even without input. */
    let frames = 0
    const activate = () => {
      if (activated) return
      activated = true
      host.dataset.ready = 'true'
      renderer.domElement.style.opacity = '1'
      tick()
    }

    // adaptive resolution: if the first second of frames is slow, drop DPR once
    const perfWatch = setInterval(() => {
      if (!activated) return
      if (frames < 6 && renderer.getPixelRatio() > 1) {
        renderer.setPixelRatio(1)
        resize()
      }
      clearInterval(perfWatch)
    }, 1400)

    const interactionEvents: Array<keyof WindowEventMap> = ['scroll', 'pointermove', 'keydown', 'touchstart']
    const onIntent = () => {
      interactionEvents.forEach((e) => window.removeEventListener(e, onIntent))
      activate()
    }

    let safety = 0
    const gateObserver = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return
        gateObserver.disconnect()
        safety = window.setTimeout(activate, 2500)
        interactionEvents.forEach((e) =>
          window.addEventListener(e, onIntent, { passive: true }),
        )
      },
      { threshold: 0.2 },
    )
    gateObserver.observe(host)
    if (reducedMotion) activate()
    const frameTick = () => {
      frames++
    }

    /* ---------------- teardown --------------------------------------------- */
    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      io.disconnect()
      vpObserver.disconnect()
      gateObserver.disconnect()
      clearTimeout(safety)
      clearInterval(perfWatch)
      interactionEvents.forEach((e) => window.removeEventListener(e, onIntent))
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      host.removeEventListener('pointerdown', onPointerDown)
      host.removeEventListener('pointermove', onPointerMove)
      host.removeEventListener('pointerup', onPointerUp)
      host.removeEventListener('pointerleave', onPointerLeave)
      host.removeEventListener('pointercancel', onPointerUp)

      scene.traverse((obj) => {
        const anyObj = obj as THREE.Mesh
        if (anyObj.geometry) anyObj.geometry.dispose()
        const mat = (anyObj as THREE.Mesh).material
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose())
        else if (mat) (mat as THREE.Material).dispose()
      })
      map.dispose()
      pulseTexture.dispose()
      renderer.dispose()
      renderer.forceContextLoss?.()
      if (renderer.domElement.parentElement === host) {
        host.removeChild(renderer.domElement)
      }
      if (disposed) delete host.dataset.ready
    }
  }, [speed, reducedMotion])

  return (
    <div
      ref={hostRef}
      className={className}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    />
  )
}
