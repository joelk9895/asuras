"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  MeshTransmissionMaterial,
  Text,
  Float,
  Sparkles,
} from "@react-three/drei";
import { useRef } from "react";
import { Group, Mesh } from "three";
import { Instrument_Serif } from "next/font/google";

type TrophyColor = "gold" | "silver" | "bronze" | string;

interface NumberProps {
  color: TrophyColor;
}

function NumberOne({ color }: NumberProps) {
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[0.5, 2, 0.5]} />
      <MeshTransmissionMaterial
        transmission={0.95}
        thickness={0.5}
        roughness={0.05}
        ior={1.5}
        chromaticAberration={0.06}
        distortion={0.1}
        distortionScale={0.3}
        temporalDistortion={0.1}
        clearcoat={1}
        attenuationDistance={0.5}
        attenuationColor={
          color === "gold"
            ? "#ffdf00"
            : color === "silver"
            ? "#c0c0c0"
            : "#cd7f32"
        }
        color={
          color === "gold"
            ? "#ffdf00"
            : color === "silver"
            ? "#c0c0c0"
            : "#cd7f32"
        }
      />
    </mesh>
  );
}

function NumberTwo({ color }: NumberProps) {
  return (
    <group>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[1, 0.5, 0.5]} />
        <MeshTransmissionMaterial
          transmission={0.95}
          thickness={0.5}
          roughness={0.05}
          ior={1.5}
          chromaticAberration={0.06}
          distortion={0.1}
          distortionScale={0.3}
          temporalDistortion={0.1}
          clearcoat={1}
          attenuationDistance={0.5}
          attenuationColor={
            color === "gold"
              ? "#ffdf00"
              : color === "silver"
              ? "#c0c0c0"
              : "#cd7f32"
          }
          color={
            color === "gold"
              ? "#ffdf00"
              : color === "silver"
              ? "#c0c0c0"
              : "#cd7f32"
          }
        />
      </mesh>
      <mesh position={[0.5, 0.5, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <MeshTransmissionMaterial
          transmission={0.95}
          thickness={0.5}
          roughness={0.05}
          ior={1.5}
          chromaticAberration={0.06}
          distortion={0.1}
          distortionScale={0.3}
          temporalDistortion={0.1}
          clearcoat={1}
          attenuationDistance={0.5}
          attenuationColor={
            color === "gold"
              ? "#ffdf00"
              : color === "silver"
              ? "#c0c0c0"
              : "#cd7f32"
          }
          color={
            color === "gold"
              ? "#ffdf00"
              : color === "silver"
              ? "#c0c0c0"
              : "#cd7f32"
          }
        />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 0.5, 0.5]} />
        <MeshTransmissionMaterial
          transmission={0.95}
          thickness={0.5}
          roughness={0.05}
          ior={1.5}
          chromaticAberration={0.06}
          distortion={0.1}
          distortionScale={0.3}
          temporalDistortion={0.1}
          clearcoat={1}
          attenuationDistance={0.5}
          attenuationColor={
            color === "gold"
              ? "#ffdf00"
              : color === "silver"
              ? "#c0c0c0"
              : "#cd7f32"
          }
          color={
            color === "gold"
              ? "#ffdf00"
              : color === "silver"
              ? "#c0c0c0"
              : "#cd7f32"
          }
        />
      </mesh>
      <mesh position={[-0.5, -0.5, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <MeshTransmissionMaterial
          transmission={0.95}
          thickness={0.5}
          roughness={0.05}
          ior={1.5}
          chromaticAberration={0.06}
          distortion={0.1}
          distortionScale={0.3}
          temporalDistortion={0.1}
          clearcoat={1}
          attenuationDistance={0.5}
          attenuationColor={
            color === "gold"
              ? "#ffdf00"
              : color === "silver"
              ? "#c0c0c0"
              : "#cd7f32"
          }
          color={
            color === "gold"
              ? "#ffdf00"
              : color === "silver"
              ? "#c0c0c0"
              : "#cd7f32"
          }
        />
      </mesh>
      <mesh position={[0, -1, 0]}>
        <boxGeometry args={[1, 0.5, 0.5]} />
        <MeshTransmissionMaterial
          transmission={0.95}
          thickness={0.5}
          roughness={0.05}
          ior={1.5}
          chromaticAberration={0.06}
          distortion={0.1}
          distortionScale={0.3}
          temporalDistortion={0.1}
          clearcoat={1}
          attenuationDistance={0.5}
          attenuationColor={
            color === "gold"
              ? "#ffdf00"
              : color === "silver"
              ? "#c0c0c0"
              : "#cd7f32"
          }
          color={
            color === "gold"
              ? "#ffdf00"
              : color === "silver"
              ? "#c0c0c0"
              : "#cd7f32"
          }
        />
      </mesh>
    </group>
  );
}

function NumberThree({ color }: NumberProps) {
  return (
    <group>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[1, 0.5, 0.5]} />
        <MeshTransmissionMaterial
          transmission={0.95}
          thickness={0.5}
          roughness={0.05}
          ior={1.5}
          chromaticAberration={0.06}
          distortion={0.1}
          distortionScale={0.3}
          temporalDistortion={0.1}
          clearcoat={1}
          attenuationDistance={0.5}
          attenuationColor={
            color === "gold"
              ? "#ffdf00"
              : color === "silver"
              ? "#c0c0c0"
              : "#cd7f32"
          }
          color={
            color === "gold"
              ? "#ffdf00"
              : color === "silver"
              ? "#c0c0c0"
              : "#cd7f32"
          }
        />
      </mesh>
      <mesh position={[0.5, 0.5, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <MeshTransmissionMaterial
          transmission={0.95}
          thickness={0.5}
          roughness={0.05}
          ior={1.5}
          chromaticAberration={0.06}
          distortion={0.1}
          distortionScale={0.3}
          temporalDistortion={0.1}
          clearcoat={1}
          attenuationDistance={0.5}
          attenuationColor={
            color === "gold"
              ? "#ffdf00"
              : color === "silver"
              ? "#c0c0c0"
              : "#cd7f32"
          }
          color={
            color === "gold"
              ? "#ffdf00"
              : color === "silver"
              ? "#c0c0c0"
              : "#cd7f32"
          }
        />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 0.5, 0.5]} />
        <MeshTransmissionMaterial
          transmission={0.95}
          thickness={0.5}
          roughness={0.05}
          ior={1.5}
          chromaticAberration={0.06}
          distortion={0.1}
          distortionScale={0.3}
          temporalDistortion={0.1}
          clearcoat={1}
          attenuationDistance={0.5}
          attenuationColor={
            color === "gold"
              ? "#ffdf00"
              : color === "silver"
              ? "#c0c0c0"
              : "#cd7f32"
          }
          color={
            color === "gold"
              ? "#ffdf00"
              : color === "silver"
              ? "#c0c0c0"
              : "#cd7f32"
          }
        />
      </mesh>
      <mesh position={[0.5, -0.5, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <MeshTransmissionMaterial
          transmission={0.95}
          thickness={0.5}
          roughness={0.05}
          ior={1.5}
          chromaticAberration={0.06}
          distortion={0.1}
          distortionScale={0.3}
          temporalDistortion={0.1}
          clearcoat={1}
          attenuationDistance={0.5}
          attenuationColor={
            color === "gold"
              ? "#ffdf00"
              : color === "silver"
              ? "#c0c0c0"
              : "#cd7f32"
          }
          color={
            color === "gold"
              ? "#ffdf00"
              : color === "silver"
              ? "#c0c0c0"
              : "#cd7f32"
          }
        />
      </mesh>
      <mesh position={[0, -1, 0]}>
        <boxGeometry args={[1, 0.5, 0.5]} />
        <MeshTransmissionMaterial
          transmission={0.95}
          thickness={0.5}
          roughness={0.05}
          ior={1.5}
          chromaticAberration={0.06}
          distortion={0.1}
          distortionScale={0.3}
          temporalDistortion={0.1}
          clearcoat={1}
          attenuationDistance={0.5}
          attenuationColor={
            color === "gold"
              ? "#ffdf00"
              : color === "silver"
              ? "#c0c0c0"
              : "#cd7f32"
          }
          color={
            color === "gold"
              ? "#ffdf00"
              : color === "silver"
              ? "#c0c0c0"
              : "#cd7f32"
          }
        />
      </mesh>
    </group>
  );
}

interface RotatingNumberProps {
  number: string;
  color: TrophyColor;
}

function RotatingNumber({ number, color }: RotatingNumberProps) {
  const meshRef = useRef<Group>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={meshRef} scale={[1, 1, 1]}>
        {number === "1" && <NumberOne color={color} />}
        {number === "2" && <NumberTwo color={color} />}
        {number === "3" && <NumberThree color={color} />}
        <Sparkles
          count={50}
          scale={5}
          size={0.6}
          speed={0.3}
          opacity={0.5}
          color={
            color === "gold"
              ? "#ffdf00"
              : color === "silver"
              ? "#c0c0c0"
              : "#cd7f32"
          }
        />
      </group>
    </Float>
  );
}

interface ModelViewerProps {
  position: number;
  house: string;
}
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

export default function ModelViewer({ position, house }: ModelViewerProps) {
  let number: string;
  let color: TrophyColor;

  switch (position) {
    case 1:
      number = "1";
      color = "gold";
      break;
    case 2:
      number = "2";
      color = "silver";
      break;
    case 3:
      number = "3";
      color = "bronze";
      break;
    default:
      number = "1";
      color = "white";
  }

  // Updated gradient styles for a more modern look
  const bgGradient =
    position === 1
      ? "from-amber-100/20 via-yellow-300/20 to-amber-700/10"
      : position === 2
      ? "from-slate-100/20 via-slate-300/20 to-slate-500/10"
      : "from-amber-500/20 via-amber-700/20 to-amber-950/10";

  return (
    <div
      className={`w-52 h-52 sm:w-56 sm:h-56 md:w-64 md:h-64 bg-black/50 relative rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.2)] 
      overflow-hidden border border-white/10 backdrop-blur-md`}
      style={{
        boxShadow:
          position === 1
            ? "0 8px 30px rgba(234, 179, 8, 0.2), inset 0 0 20px rgba(234, 179, 8, 0.1)"
            : position === 2
            ? "0 8px 30px rgba(148, 163, 184, 0.2), inset 0 0 20px rgba(148, 163, 184, 0.1)"
            : "0 8px 30px rgba(180, 83, 9, 0.2), inset 0 0 20px rgba(180, 83, 9, 0.1)",
      }}
    >
      <div
        className={`w-full h-full absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-60`}
      ></div>
      <div className="absolute top-0 left-0 w-full p-2 sm:p-3 text-center">
        <div
          className={`text-sm sm:text-xl font-semibold tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 ${instrument.className}`}
        >
          {house}
        </div>
      </div>

      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[-10, 10, -10]} intensity={0.6} color="#ffffff" />
        <spotLight
          position={[10, 10, 10]}
          angle={0.25}
          penumbra={1}
          intensity={1.2}
          castShadow
        />
        <directionalLight position={[0, 5, 0]} intensity={0.6} />
        <Environment preset="sunset" blur={0.8} />

        <RotatingNumber number={number} color={color} />

        <Float speed={3} rotationIntensity={0.15} floatIntensity={0.2}>
          <Text
            color="white"
            anchorX="center"
            anchorY="middle"
            fontSize={0.5}
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            material-toneMapped={false}
            fillOpacity={0.85}
          >
            {house.toUpperCase()}
          </Text>
        </Float>
      </Canvas>

      <div className="absolute bottom-0 left-0 w-full p-2 sm:p-3 text-center">
        <div className="text-xs font-medium text-white/80 backdrop-blur-sm py-1 rounded-full">
          {position === 1
            ? "🏆 First Place"
            : position === 2
            ? "🥈 Second Place"
            : "🥉 Third Place"}
        </div>
      </div>
    </div>
  );
}
