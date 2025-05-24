import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh } from "three";

interface IModel {
  roll: number;
  pitch: number;
  yaw: number;
}

function Model({ roll, pitch, yaw }: IModel) {
  const meshRef = useRef<Mesh>(null!);
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x = toRad(pitch); // pitch: X
      meshRef.current.rotation.y = toRad(yaw); // yaw: Y
      meshRef.current.rotation.z = roll; // roll: Z
    }
  });
  return (
    <>
      <mesh ref={meshRef}>
        <boxGeometry args={[2, 2, 2]} />
        <meshPhongMaterial />
      </mesh>
      <ambientLight intensity={0.1} />
      <directionalLight position={[0, 0, 5]} color="white" />
    </>
  );
}

export default Model;
