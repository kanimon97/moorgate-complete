import React, { useEffect, useMemo, useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any
      circleGeometry: any
      shaderMaterial: any
    }
  }
}

export type AgentState = null | "thinking" | "listening" | "talking"

export interface OrbProps {
  colors?: [string, string]
  agentState?: AgentState
  inputVolumeRef?: React.MutableRefObject<number>
  outputVolumeRef?: React.MutableRefObject<number>
  className?: string
  resizeDebounce?: number
}

export function Orb({
  colors = ["#CADCFC", "#A0B9D1"],
  agentState = null,
  inputVolumeRef,
  outputVolumeRef,
  className,
  resizeDebounce = 100,
}: OrbProps) {
  return (
    <div className={className ?? "relative h-full w-full"}>
      <Canvas
        resize={{ debounce: resizeDebounce }}
        gl={{
          alpha: true,
          antialias: true,
          premultipliedAlpha: true,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5], fov: 75 }}
      >
        <Scene
          colors={colors}
          agentState={agentState}
          inputVolumeRef={inputVolumeRef}
          outputVolumeRef={outputVolumeRef}
        />
      </Canvas>
    </div>
  )
}

function Scene({
  colors,
  agentState,
  inputVolumeRef,
  outputVolumeRef,
}: {
  colors: [string, string]
  agentState: AgentState
  inputVolumeRef?: React.MutableRefObject<number>
  outputVolumeRef?: React.MutableRefObject<number>
}) {
  const { gl } = useThree()
  const circleRef = useRef<THREE.Mesh<THREE.CircleGeometry, THREE.ShaderMaterial>>(null)
  
  // State refs for animation
  const initialColors = useRef(colors) // Capture initial colors to avoid re-init of uniforms
  const targetColor1Ref = useRef(new THREE.Color(colors[0]))
  const targetColor2Ref = useRef(new THREE.Color(colors[1]))
  const curInRef = useRef(0)
  const curOutRef = useRef(0)
  const animSpeedRef = useRef(0.1)
  
  // Generate Noise Texture
  const noiseTexture = useMemo(() => {
    const size = 256;
    const data = new Uint8Array(size * size * 4);
    for (let i = 0; i < size * size * 4; i++) {
        data[i] = Math.random() * 255;
    }
    const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Update target colors when props change - this triggers the LERP in useFrame
  useEffect(() => {
    targetColor1Ref.current.set(colors[0])
    targetColor2Ref.current.set(colors[1])
  }, [colors])

  // Handle Dark Mode
  useEffect(() => {
    const apply = () => {
      if (!circleRef.current?.material?.uniforms) return
      const isDark = document.documentElement.classList.contains("dark")
      circleRef.current.material.uniforms.uInverted.value = isDark ? 1 : 0
    }
    apply()
    const observer = new MutationObserver(apply)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  // Animation Loop
  useFrame((_, delta) => {
    const mat = circleRef.current?.material
    if (!mat || !mat.uniforms) return

    const u = mat.uniforms
    u.uTime.value += delta * 0.5
    
    // Fade in
    if (u.uOpacity.value < 1) {
      u.uOpacity.value = Math.min(1, u.uOpacity.value + delta * 2)
    }

    let targetIn = 0
    let targetOut = 0.3
    
    // 1. Get real volume data
    const realInput = inputVolumeRef?.current ?? 0
    const realOutput = outputVolumeRef?.current ?? 0

    // 2. Determine target states based on Agent State
    if (agentState === "listening") {
        // When listening, the orb pulses gently, reacting strongly to input
        const t = u.uTime.value * 2
        targetIn = Math.max(0.2, realInput * 1.5) 
        targetOut = 0.3 + 0.1 * Math.sin(t)
    } else if (agentState === "talking") {
        // When talking, react to output
        targetIn = 0.2
        targetOut = Math.max(0.4, realOutput * 2.0)
    } else if (agentState === "thinking") {
        // Fast pulse
        const t = u.uTime.value * 10
        targetIn = 0.3 + 0.1 * Math.sin(t)
        targetOut = 0.3 + 0.1 * Math.cos(t)
    } else {
        // Idle
        const t = u.uTime.value
        targetIn = 0.15 + 0.05 * Math.sin(t)
        targetOut = 0.15 + 0.05 * Math.cos(t + 1)
    }

    // 3. Smooth interpolation
    curInRef.current += (targetIn - curInRef.current) * 0.1
    curOutRef.current += (targetOut - curOutRef.current) * 0.1

    // 4. Update Uniforms
    u.uAnimation.value += delta * (0.2 + (curInRef.current + curOutRef.current));
    u.uInputVolume.value = curInRef.current
    u.uOutputVolume.value = curOutRef.current
    
    // Smooth color transition
    u.uColor1.value.lerp(targetColor1Ref.current, 0.05)
    u.uColor2.value.lerp(targetColor2Ref.current, 0.05)
  })

  // Uniforms Init - REMOVE colors from dependency to allow LERPing
  const uniforms = useMemo(() => {
    const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark")
    return {
      uColor1: { value: new THREE.Color(initialColors.current[0]) },
      uColor2: { value: new THREE.Color(initialColors.current[1]) },
      uOffsets: { value: new Float32Array(Array.from({ length: 7 }, () => Math.random() * Math.PI * 2)) },
      uPerlinTexture: { value: noiseTexture },
      uTime: { value: 0 },
      uAnimation: { value: 0.1 },
      uInverted: { value: isDark ? 1 : 0 },
      uInputVolume: { value: 0 },
      uOutputVolume: { value: 0 },
      uOpacity: { value: 0 },
    }
  }, [noiseTexture])

  return (
    <mesh ref={circleRef}>
      <circleGeometry args={[3.5, 64]} />
      <shaderMaterial
        uniforms={uniforms}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        transparent={true}
      />
    </mesh>
  )
}

// Shaders
const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
uniform float uTime;
uniform float uAnimation;
uniform float uInverted;
uniform float uOffsets[7];
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uInputVolume;
uniform float uOutputVolume;
uniform float uOpacity;
uniform sampler2D uPerlinTexture;
varying vec2 vUv;

const float PI = 3.14159265358979323846;

bool drawOval(vec2 polarUv, vec2 polarCenter, float a, float b, bool reverseGradient, float softness, out vec4 color) {
    vec2 p = polarUv - polarCenter;
    float oval = (p.x * p.x) / (a * a) + (p.y * p.y) / (b * b);
    float edge = smoothstep(1.0, 1.0 - softness, oval);
    if (edge > 0.0) {
        float gradient = reverseGradient ? (1.0 - (p.x / a + 1.0) / 2.0) : ((p.x / a + 1.0) / 2.0);
        gradient = mix(0.5, gradient, 0.1);
        color = vec4(vec3(gradient), 0.85 * edge);
        return true;
    }
    return false;
}

vec3 colorRamp(float grayscale, vec3 color1, vec3 color2, vec3 color3, vec3 color4) {
    if (grayscale < 0.33) return mix(color1, color2, grayscale * 3.0);
    else if (grayscale < 0.66) return mix(color2, color3, (grayscale - 0.33) * 3.0);
    else return mix(color3, color4, (grayscale - 0.66) * 3.0);
}

void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    float radius = length(uv);
    float theta = atan(uv.y, uv.x);
    if (theta < 0.0) theta += 2.0 * PI;

    float noiseVal = texture(uPerlinTexture, vec2(theta / (2.0 * PI) + uAnimation * 0.1, radius * 0.5 - uAnimation * 0.2)).r;
    theta += (noiseVal - 0.5) * uOutputVolume * 0.5;

    vec4 color = vec4(1.0);
    float centers[7];
    for(int i=0; i<7; i++) centers[i] = float(i) * 0.5 * PI + 0.5 * sin(uTime * 0.05 + uOffsets[i]);

    vec4 ovalColor;
    for (int i = 0; i < 7; i++) {
        float n = texture(uPerlinTexture, vec2(mod(centers[i], 1.0), 0.5)).r;
        float a = 0.5 + n * 0.3; 
        float b = n * mix(3.5, 2.5 + uInputVolume, 0.5); 
        
        float distTheta = min(abs(theta - centers[i]), min(abs(theta + 2.0 * PI - centers[i]), abs(theta - 2.0 * PI - centers[i])));
        if (drawOval(vec2(distTheta, radius), vec2(0.0), a, b, i%2==1, 0.6, ovalColor)) {
            color.rgb = mix(color.rgb, ovalColor.rgb, ovalColor.a);
            color.a = max(color.a, ovalColor.a);
        }
    }

    vec3 c1 = vec3(0.0);
    vec3 c2 = uColor1;
    vec3 c3 = uColor2;
    vec3 c4 = vec3(1.0);
    
    float lum = mix(color.r, 1.0 - color.r, uInverted);
    color.rgb = colorRamp(lum, c1, c2, c3, c4);
    color.a *= uOpacity;

    gl_FragColor = color;
}
`