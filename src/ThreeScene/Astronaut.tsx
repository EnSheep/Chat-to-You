/* eslint react/no-unknown-property: 0 */


import { useGLTF, Detailed, Environment } from '@react-three/drei';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { EffectComposer, DepthOfField, ToneMapping } from '@react-three/postprocessing';
import { useRef, useState } from 'react';
import * as THREE from 'three';

function Rocket({ index, z, speed }: { index: number, z: number, speed: number }) {
  // const ref = useRef();
  const ref = useRef<any>(null);
  const { viewport, camera } = useThree();
  const { width, height } = viewport.getCurrentViewport(camera, [0, 0, -z]);
  const { nodes, materials } = useGLTF('/model/Astronaut.glb') as any;
  // const { nodes, materials } = useGLTF('/src/model/Star.glb');

  const [data] = useState({
    y: THREE.MathUtils.randFloatSpread(height * 2),
    x: THREE.MathUtils.randFloatSpread(2),
    spin: THREE.MathUtils.randFloat(8, 12),
    rX: Math.random() * Math.PI,
    rZ: Math.random() * Math.PI
  });

  useFrame((state, dt) => {
    if (dt < 0.1) ref.current.position.set(index === 0 ? 0 : data.x * width, (data.y += dt * speed), -z);
    ref.current.rotation.set((data.rX += dt / data.spin), Math.sin(index * 1000 + state.clock.elapsedTime / 10) * Math.PI, (data.rZ += dt / data.spin));
    if (data.y > height * (index === 0 ? 4 : 1)) data.y = -(height * (index === 0 ? 4 : 1));
  });

  return (
    <Detailed ref={ref} distances={[0, 65, 80]}>
      {Object.keys(nodes).map((key) => (
        <mesh key={key} geometry={nodes[key].geometry} material={materials[nodes[key].material?.name]} />
        // <mesh> 测试渲染通道正常的盒子
        //   <boxGeometry args={[1, 1, 1]} />
        //   <meshStandardMaterial color="orange" />
        // </mesh>
      ))}
    </Detailed>
  );
}

export default function Rockets({ speed = 1, count = 15, depth = 40, easing = (x: number) => Math.sqrt(1 - Math.pow(x - 1, 2)) }: { speed?: number, count?: number, depth?: number, easing?: (x: number) => number }) {
  return (
    <Canvas flat gl={{ antialias: false }} dpr={[1, 1.5]} camera={{ position: [0, 0, 10], fov: 20, near: 0.01, far: depth + 15 }}>
      <color attach="background" args={['black']} />
      <spotLight position={[10000, 20000, 100]} penumbra={1} decay={0} intensity={3} color="white" />
      {Array.from({ length: count }, (_, i) => <Rocket key={i} index={i} z={Math.round(easing(i / count) * depth)} speed={speed} /> /* prettier-ignore */)}
      <Environment preset="city" />
      <EffectComposer enableNormalPass  multisampling={0}>
        <DepthOfField target={[0, 0, 60]} focalLength={1} bokehScale={14} height={700} />
        <ToneMapping />
      </EffectComposer>
    </Canvas>
  );
}




