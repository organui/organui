"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@workspace/ui/lib/utils"

// The hero's heart: the heart item's model as a point cloud that beats at
// 72 bpm, turns slowly and follows a drag. Three.js and the points
// (public/home/heart.bin, built by scripts/models/home-heart.ts) load once
// the page is idle, so nothing 3D holds up the first paint.

// Structures by their index in the heart item, as stored in heart.bin.
const atria = new Set([0, 1, 8])
const ventricles = new Set([2, 3, 4])

const vertexShader = /* glsl */ `
  attribute vec3 aColor;
  attribute float aChamber;
  attribute float aSeed;
  attribute vec3 aScatter;
  uniform float uTime;
  uniform float uAssemble;
  uniform float uAtria;
  uniform float uVentricles;
  uniform float uScan;
  uniform float uSize;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vScan;

  void main() {
    float squeeze = aChamber > 1.5 ? uVentricles * 0.06 : aChamber > 0.5 ? uAtria * 0.05 : uVentricles * 0.015;
    vec3 p = position * (1.0 - squeeze);
    p += normal * 0.006 * sin(uTime * 1.7 + aSeed * 6.2831);
    // On arrival each point drifts in from a scattered cloud, the later
    // ones a little after the first.
    float gather = smoothstep(aSeed * 0.45, aSeed * 0.45 + 0.55, uAssemble);
    p = mix(aScatter, p, gather * gather * (3.0 - 2.0 * gather));
    vec4 view = modelViewMatrix * vec4(p, 1.0);
    vec3 viewNormal = normalize(normalMatrix * normal);
    float rim = 1.0 - abs(viewNormal.z);
    vScan = smoothstep(0.07, 0.0, abs(p.y - uScan)) * 0.45;
    vColor = aColor;
    vAlpha = mix(0.3, 1.0, rim) * mix(0.2, 1.0, gather);
    gl_PointSize = uSize * (1.0 + vScan) / -view.z;
    gl_Position = projectionMatrix * view;
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uAccent;
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vScan;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float soft = smoothstep(0.5, 0.1, d);
    vec3 color = mix(vColor, uAccent, vScan * 0.85);
    gl_FragColor = vec4(color, soft * min(1.0, vAlpha + vScan) * uOpacity);
  }
`

// Contraction from 0 to 1 within one beat: the atria first, then the
// ventricles, each easing in and out.
function pulse(phase: number, start: number, length: number) {
  const t = (phase - start) / length
  return t <= 0 || t >= 1 ? 0 : Math.sin(Math.PI * t) ** 2
}

export function HomeHeart({
  bpm,
  className,
}: {
  bpm: number
  className?: string
}) {
  const container = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const element = container.current
    if (!element) return
    let disposed = false
    let cleanup = () => {}

    const start = async () => {
      const [THREE, response] = await Promise.all([
        import("three"),
        fetch("/home/heart.bin"),
      ])
      if (disposed || !response.ok) return
      const data = new DataView(await response.arrayBuffer())
      if (disposed) return

      const count = data.getUint32(0, true)
      const structures = data.getUint8(4)
      const palette = Array.from({ length: structures }, (_, index) =>
        new THREE.Color(
          data.getUint8(5 + index * 3) / 255,
          data.getUint8(6 + index * 3) / 255,
          data.getUint8(7 + index * 3) / 255
        ).convertSRGBToLinear()
      )
      const header = 5 + structures * 3
      const position = new Float32Array(count * 3)
      const normal = new Float32Array(count * 3)
      const color = new Float32Array(count * 3)
      const chamber = new Float32Array(count)
      const seed = new Float32Array(count)
      const scatter = new Float32Array(count * 3)
      for (let i = 0; i < count; i++) {
        const offset = header + i * 10
        const structure = data.getUint8(offset + 9)
        for (let axis = 0; axis < 3; axis++) {
          position[i * 3 + axis] =
            data.getInt16(offset + axis * 2, true) / 32767
          normal[i * 3 + axis] = data.getInt8(offset + 6 + axis) / 127
        }
        const tint = palette[structure]!
        color.set([tint.r, tint.g, tint.b], i * 3)
        chamber[i] = ventricles.has(structure)
          ? 2
          : atria.has(structure)
            ? 1
            : 0
        seed[i] = Math.random()
        // A random point in a shell around the heart to gather from.
        const theta = Math.random() * Math.PI * 2
        const z = Math.random() * 2 - 1
        const radius = 1.4 + Math.random() * 1.2
        const ring = Math.sqrt(1 - z * z) * radius
        scatter.set(
          [Math.cos(theta) * ring, z * radius, Math.sin(theta) * ring],
          i * 3
        )
      }

      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute("position", new THREE.BufferAttribute(position, 3))
      geometry.setAttribute("normal", new THREE.BufferAttribute(normal, 3))
      geometry.setAttribute("aColor", new THREE.BufferAttribute(color, 3))
      geometry.setAttribute("aChamber", new THREE.BufferAttribute(chamber, 1))
      geometry.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1))
      geometry.setAttribute("aScatter", new THREE.BufferAttribute(scatter, 3))

      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uAtria: { value: 0 },
          uVentricles: { value: 0 },
          uScan: { value: -2 },
          uAssemble: { value: 0 },
          uSize: { value: 1 },
          uOpacity: { value: 1 },
          uAccent: { value: new THREE.Color() },
        },
      })
      const points = new THREE.Points(geometry, material)
      const scene = new THREE.Scene()
      scene.add(points)
      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 20)
      camera.position.set(0, 0, 4.6)

      let renderer: InstanceType<typeof THREE.WebGLRenderer>
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false })
      } catch {
        return
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.domElement.setAttribute("aria-hidden", "true")
      renderer.domElement.className = "size-full touch-pan-y"
      element.append(renderer.domElement)

      // Colours follow the theme: glowing points on dark, ink on light.
      const theme = () => {
        const dark = document.documentElement.classList.contains("dark")
        material.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending
        material.uniforms.uOpacity!.value = dark ? 0.85 : 0.9
        material.needsUpdate = true
        // The accent is the element's text colour, which may be oklch, so
        // a canvas turns it into RGB.
        const swatch = document.createElement("canvas").getContext("2d")
        if (swatch) {
          swatch.fillStyle = getComputedStyle(element).color
          swatch.fillRect(0, 0, 1, 1)
          const [r, g, b] = swatch.getImageData(0, 0, 1, 1).data
          material.uniforms.uAccent!.value.setRGB(
            r! / 255,
            g! / 255,
            b! / 255,
            THREE.SRGBColorSpace
          )
        }
      }
      theme()
      const themeObserver = new MutationObserver(theme)
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      })

      const resize = () => {
        const { width, height } = element.getBoundingClientRect()
        if (!width || !height) return
        renderer.setSize(width, height, false)
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        material.uniforms.uSize!.value =
          (Math.min(width, height) / 160) * renderer.getPixelRatio() * 4.5
      }
      resize()
      const resizeObserver = new ResizeObserver(resize)
      resizeObserver.observe(element)

      // A horizontal drag spins the heart, which then settles back to its
      // slow turn.
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches
      let angle = -0.5
      let spin = 0
      let dragging: number | null = null
      const down = (event: PointerEvent) => {
        dragging = event.clientX
      }
      // The heart leans a little towards the pointer.
      const lean = { x: 0, y: 0 }
      const tilt = { x: 0, y: 0 }
      const move = (event: PointerEvent) => {
        lean.x = (event.clientX / window.innerWidth) * 2 - 1
        lean.y = (event.clientY / window.innerHeight) * 2 - 1
        if (dragging === null) return
        spin = (event.clientX - dragging) * 0.01
        angle += spin
        dragging = event.clientX
      }
      const up = () => {
        dragging = null
      }
      renderer.domElement.addEventListener("pointerdown", down)
      window.addEventListener("pointermove", move)
      window.addEventListener("pointerup", up)

      let visible = true
      const visibility = new IntersectionObserver(([entry]) => {
        visible = entry?.isIntersecting ?? true
      })
      visibility.observe(element)

      const beat = 60 / bpm
      let frame = 0
      let last = performance.now()
      const render = (now: number) => {
        frame = requestAnimationFrame(render)
        const delta = Math.min((now - last) / 1000, 0.05)
        last = now
        if (!visible || document.hidden) return
        const time = now / 1000
        const phase = (time % beat) / beat
        const uniforms = material.uniforms
        uniforms.uTime!.value = time
        uniforms.uAtria!.value = pulse(phase, 0, 0.18)
        uniforms.uVentricles!.value = pulse(phase, 0.16, 0.36)
        uniforms.uScan!.value = ((time / 4.2) % 1) * 3.2 - 1.6
        uniforms.uAssemble!.value = Math.min(1, (now - born) / 2600)
        tilt.x += (lean.y * 0.18 - tilt.x) * 0.05
        tilt.y += (lean.x * 0.35 - tilt.y) * 0.05
        if (dragging === null) {
          spin *= 0.94
          angle += spin + delta * 0.25
        }
        points.rotation.set(0.12 + tilt.x, angle + tilt.y, 0)
        renderer.render(scene, camera)
      }
      const born = performance.now()
      if (reduced) {
        material.uniforms.uAssemble!.value = 1
        points.rotation.set(0.12, angle, 0)
        renderer.render(scene, camera)
      } else frame = requestAnimationFrame(render)
      setReady(true)

      cleanup = () => {
        cancelAnimationFrame(frame)
        themeObserver.disconnect()
        resizeObserver.disconnect()
        visibility.disconnect()
        window.removeEventListener("pointermove", move)
        window.removeEventListener("pointerup", up)
        geometry.dispose()
        material.dispose()
        renderer.dispose()
        renderer.domElement.remove()
      }
    }

    const idle =
      "requestIdleCallback" in window
        ? requestIdleCallback(() => void start(), { timeout: 1500 })
        : setTimeout(() => void start(), 300)
    return () => {
      disposed = true
      if ("cancelIdleCallback" in window) cancelIdleCallback(idle as number)
      else clearTimeout(idle)
      cleanup()
    }
  }, [bpm])

  return (
    <div
      ref={container}
      className={cn(
        "text-chart-2 transition-opacity duration-1000",
        ready ? "opacity-100" : "opacity-0",
        className
      )}
    />
  )
}
