"use client"
/* eslint-disable react/no-unknown-property */
import { Canvas, extend } from '@react-three/fiber'
import { Environment, Lightformer, Text } from '@react-three/drei'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import './Lanyard.css'

extend({ MeshLineGeometry, MeshLineMaterial })

type LanyardProps = {
  position?: [number, number, number]
  gravity?: [number, number, number]
  fov?: number
  transparent?: boolean
}

export default function Lanyard({ position = [0, 0, 20], gravity = [0, -40, 0], fov = 20, transparent = true }: LanyardProps) {
  return (
    <div className="lanyard-wrapper">
      <Canvas camera={{ position, fov }} gl={{ alpha: transparent }} onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}>
        <ambientLight intensity={Math.PI} />
        <Band />
        <Environment blur={0.75}>
          <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
    </div>
  )
}

function Band() {
  const band = useRef<any>()
  const cardGroup = useRef<THREE.Group>(null)
  const fixedPoint = useRef(new THREE.Vector3(-1.2, 3.5, 0))
  const midA = useRef(new THREE.Vector3(-0.4, 2.6, 0))
  const midB = useRef(new THREE.Vector3(0.6, 1.6, 0))
  const cardPoint = useRef(new THREE.Vector3(1.6, 0.6, 0))
  const [curve] = useState(() => new THREE.CatmullRomCurve3([fixedPoint.current.clone(), midA.current.clone(), midB.current.clone(), cardPoint.current.clone()]))
  const [dragOffset, setDragOffset] = useState<THREE.Vector3 | null>(null)
  const [hovered, setHovered] = useState(false)
  const [isSmall, setIsSmall] = useState(() => typeof window !== 'undefined' && window.innerWidth < 1024)

  useEffect(() => {
    const onResize = () => setIsSmall(window.innerWidth < 1024)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (!hovered) return
    document.body.style.cursor = dragOffset ? 'grabbing' : 'grab'
    return () => { document.body.style.cursor = 'auto' }
  }, [hovered, dragOffset])

  useFrameTick((state, delta) => {
    // gentle sway
    const t = state.clock.getElapsedTime()
    const sway = Math.sin(t * 0.6) * 0.05
    if (!dragOffset) {
      cardPoint.current.x += (1.6 + sway - cardPoint.current.x) * 0.06
      cardPoint.current.y += (0.6 - Math.abs(sway) - cardPoint.current.y) * 0.06
    }

    // update intermediates for a smooth curve
    midA.current.lerpVectors(fixedPoint.current, cardPoint.current, 0.35)
    midB.current.lerpVectors(fixedPoint.current, cardPoint.current, 0.7)
    midA.current.y += 0.8
    midB.current.y += 0.3

    curve.points[0].copy(fixedPoint.current)
    curve.points[1].copy(midA.current)
    curve.points[2].copy(midB.current)
    curve.points[3].copy(cardPoint.current)
    band.current.geometry.setPoints(curve.getPoints(48))

    if (cardGroup.current) {
      cardGroup.current.position.copy(cardPoint.current)
      cardGroup.current.rotation.z += (sway * 0.5 - cardGroup.current.rotation.z) * 0.08
    }
  })

  // Theme text color for OSSAPCON 2026
  const titleMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#14b8a6') })

  return (
    <>
      <group position={[0, 0, 0]}>
        <group
          ref={cardGroup}
          scale={2.25}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onPointerUp={(e: any) => (e.currentTarget.releasePointerCapture(e.pointerId), setDragOffset(null))}
          onPointerDown={(e: any) => {
            e.currentTarget.setPointerCapture(e.pointerId)
            const worldPoint = new THREE.Vector3(e.point.x, e.point.y, e.point.z)
            setDragOffset(worldPoint.clone().sub(cardPoint.current))
          }}
          onPointerMove={(e: any) => {
            if (!dragOffset) return
            const worldPoint = new THREE.Vector3(e.point.x, e.point.y, e.point.z)
            cardPoint.current.copy(worldPoint.sub(dragOffset))
          }}
        >
          {/* Minimal badge/card */}
          <mesh position={[0, -0.6, -0.05]}>
            <boxGeometry args={[0.8, 1.1, 0.02]} />
            <meshPhysicalMaterial color="#0b1220" clearcoat={1} clearcoatRoughness={0.15} roughness={0.9} metalness={0.2} />
          </mesh>
          {/* Clip */}
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[0.3, 0.05, 0.05]} />
            <meshStandardMaterial color="#aab2c8" />
          </mesh>
          {/* OSSAPCON 2026 title on card */}
          <Text
            position={[0, -0.4, 0.03]}
            fontSize={0.18}
            color={"#14b8a6"}
            anchorX="center"
            anchorY="middle"
            maxWidth={0.7}
          >
            OSSAPCON 2026
          </Text>
        </group>
      </group>
      <mesh ref={band as any}>
        <meshLineGeometry />
        <meshLineMaterial color="#14b8a6" depthTest={false} resolution={isSmall ? [1000, 2000] : [1000, 1000]} lineWidth={1.5} />
      </mesh>
    </>
  )
}

// helper to use frame without importing useFrame in this module scope
function useFrameTick(cb: any) {
  const { useFrame } = require('@react-three/fiber') as typeof import('@react-three/fiber')
  useFrame(cb)
}


