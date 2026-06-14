import * as THREE from "three";
import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Html, Float } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import {
  BallCollider,
  Physics,
  RigidBody,
  CylinderCollider,
  RapierRigidBody,
} from "@react-three/rapier";
import "./styles/TechStack.css";

/* ── Tech data (3D spheres) ──────────────────────────── */
const techItems = [
  { name: "React", image: "/images/react2.webp", color: "#61DAFB" },
  { name: "Next.js", image: "/images/next2.webp", color: "#ffffff" },
  { name: "Node.js", image: "/images/node2.webp", color: "#68A063" },
  { name: "Express", image: "/images/express.webp", color: "#dadada" },
  { name: "MongoDB", image: "/images/mongo.webp", color: "#4DB33D" },
  { name: "MySQL", image: "/images/mysql.webp", color: "#00a2d2" },
  { name: "TypeScript", image: "/images/typescript.webp", color: "#3178C6" },
  { name: "JavaScript", image: "/images/javascript.webp", color: "#F7DF1E" },
];

/* ── Full skill categories ───────────────────────────── */
const skillCategories = [
  {
    title: "Frontend",
    color: "#61DAFB",
    skills: [
      "React.js", "Angular", "Next.js", "TypeScript", "JavaScript",
      "Flutter", "HTML5", "CSS3", "GSAP", "Three.js", "Tailwind CSS",
    ],
  },
  {
    title: "Backend",
    color: "#68A063",
    skills: [
      "Node.js", "Express", "Java", "Spring Boot", "Python",
      "REST APIs", "Microservices",
    ],
  },
  {
    title: "Databases",
    color: "#00a2d2",
    skills: ["MongoDB", "MySQL", "PostgreSQL", "Supabase"],
  },
  {
    title: "Tools & DevOps",
    color: "#F7DF1E",
    skills: [
      "Git", "Docker", "AWS", "Vercel", "Vite",
      "Linux", "Postman", "Figma",
    ],
  },
];

const textureLoader = new THREE.TextureLoader();
const textures = techItems.map((item) => textureLoader.load(item.image));
const sphereGeometry = new THREE.SphereGeometry(1, 28, 28);
const sphereScales = [1.0, 0.9, 0.95, 0.85, 0.9, 0.85, 0.88, 0.95];

/* ── Grid target positions (2 rows × 4 cols, centered) ── */
function getGridPositions(vw: number): THREE.Vector3[] {
  const xGap = Math.min(vw * 0.11, 3.2);
  const yGap = 2.8;
  const positions: THREE.Vector3[] = [];

  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 4; col++) {
      positions.push(
        new THREE.Vector3(
          (col - 1.5) * xGap,
          (0.5 - row) * yGap,
          0
        )
      );
    }
  }
  return positions;
}

/* ── Viewport-aware target positions ──────────────── */
function TargetUpdater({
  onTargets,
}: {
  onTargets: (t: THREE.Vector3[]) => void;
}) {
  const { viewport } = useThree();
  useEffect(() => {
    onTargets(getGridPositions(viewport.width));
  }, [viewport.width, onTargets]);
  return null;
}

/* ── Single sphere with physics + label ────────────── */
type SphereProps = {
  vec?: THREE.Vector3;
  scale: number;
  r?: typeof THREE.MathUtils.randFloatSpread;
  material: THREE.MeshPhysicalMaterial;
  isActive: boolean;
  isSettled: boolean;
  targetPosition: THREE.Vector3;
  techName: string;
  techColor: string;
};

function SphereGeo({
  vec = new THREE.Vector3(),
  scale,
  r = THREE.MathUtils.randFloatSpread,
  material,
  isActive,
  isSettled,
  targetPosition,
  techName,
  techColor,
}: SphereProps) {
  const api = useRef<RapierRigidBody | null>(null);
  const [showLabel, setShowLabel] = useState(false);

  useEffect(() => {
    if (isSettled) {
      const t = setTimeout(() => setShowLabel(true), 900);
      return () => clearTimeout(t);
    }
    setShowLabel(false);
  }, [isSettled]);

  useFrame((_state, delta) => {
    if (!isActive || !api.current) return;
    delta = Math.min(0.1, delta);

    if (isSettled) {
      const pos = api.current.translation();
      const dx = targetPosition.x - pos.x;
      const dy = targetPosition.y - pos.y;
      const dz = targetPosition.z - pos.z;
      const k = 120 * delta * scale;

      api.current.applyImpulse({ x: dx * k, y: dy * k, z: dz * k }, true);

      // velocity damping
      const v = api.current.linvel();
      const d = 8 * delta;
      api.current.applyImpulse(
        { x: -v.x * d, y: -v.y * d, z: -v.z * d },
        true
      );

      // angular damping to stop spinning
      const av = api.current.angvel();
      api.current.applyTorqueImpulse(
        { x: -av.x * d * 0.5, y: -av.y * d * 0.5, z: -av.z * d * 0.5 },
        true
      );
    } else {
      // Chaos mode — push toward center
      const impulse = vec
        .copy(api.current.translation() as unknown as THREE.Vector3)
        .normalize()
        .multiply(
          new THREE.Vector3(
            -50 * delta * scale,
            -150 * delta * scale,
            -50 * delta * scale
          )
        );
      api.current.applyImpulse(impulse, true);
    }
  });

  return (
    <RigidBody
      linearDamping={isSettled ? 5 : 0.75}
      angularDamping={isSettled ? 3 : 0.15}
      friction={0.2}
      position={[r(20), r(20) - 25, r(20) - 10]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />
      <mesh
        castShadow
        receiveShadow
        scale={scale}
        geometry={sphereGeometry}
        material={material}
        rotation={[0.3, 1, 1]}
      />
      <Html
        position={[0, -(scale + 0.35), 0]}
        center
        distanceFactor={10}
        style={{
          opacity: showLabel ? 1 : 0,
          transition: "opacity 0.5s ease",
          pointerEvents: "none",
        }}
      >
        <div className="tech-label" style={{ color: techColor }}>
          {techName}
        </div>
      </Html>
    </RigidBody>
  );
}

/* ── Pointer (cursor collider) ─────────────────────── */
type PointerProps = {
  vec?: THREE.Vector3;
  isActive: boolean;
  isSettled: boolean;
};

function Pointer({
  vec = new THREE.Vector3(),
  isActive,
  isSettled,
}: PointerProps) {
  const ref = useRef<RapierRigidBody>(null);

  useFrame(({ pointer, viewport }) => {
    if (!isActive || !ref.current) return;
    if (isSettled) {
      ref.current.setNextKinematicTranslation({ x: 100, y: 100, z: 100 });
      return;
    }
    const target = vec.lerp(
      new THREE.Vector3(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        0
      ),
      0.2
    );
    ref.current.setNextKinematicTranslation(target);
  });

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

/* ── Skill Grid (categorized chips below the 3D canvas) ── */
function SkillGrid({ isActive }: { isActive: boolean }) {
  return (
    <div className={`skill-grid ${isActive ? "active" : ""}`}>
      {skillCategories.map((category, catIndex) => (
        <div 
          className="skill-category" 
          key={category.title}
          style={{ transitionDelay: `${catIndex * 0.15}s` }}
        >
          <div
            className="skill-category-header"
            style={{ "--cat-color": category.color } as React.CSSProperties}
          >
            <span className="skill-category-dot" />
            <h3>{category.title}</h3>
            <span className="skill-category-count">
              {category.skills.length}
            </span>
          </div>
          <div className="skill-chips">
            {category.skills.map((skill, chipIndex) => (
              <div
                className="skill-chip"
                key={skill}
                style={{ 
                  "--chip-color": category.color,
                  transitionDelay: isActive ? `${(catIndex * 0.15) + (chipIndex * 0.04)}s` : "0s"
                } as React.CSSProperties}
              >
                {skill}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Main TechStack component ──────────────────────── */
const TechStack = () => {
  const [isActive, setIsActive] = useState(false);
  const [isSettled, setIsSettled] = useState(false);
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [targetPositions, setTargetPositions] = useState<THREE.Vector3[]>(
    () => getGridPositions(12)
  );

  const handleTargets = useMemo(
    () => (t: THREE.Vector3[]) => setTargetPositions(t),
    []
  );

  // Activate on scroll — using rAF poll for GSAP ScrollSmoother compatibility
  useEffect(() => {
    let rafId: number;
    const checkVisibility = () => {
      const techEl = document.querySelector(".techstack");
      if (techEl) {
        const rect = techEl.getBoundingClientRect();
        const inView =
          rect.top < window.innerHeight * 0.75 && rect.bottom > 0;
        setIsActive(inView);
      }
      rafId = requestAnimationFrame(checkVisibility);
    };
    rafId = requestAnimationFrame(checkVisibility);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Auto-settle 3s after becoming active
  useEffect(() => {
    if (isActive && !isSettled) {
      settleTimerRef.current = setTimeout(() => setIsSettled(true), 3000);
    }
    return () => {
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    };
  }, [isActive, isSettled]);

  // Click to toggle chaos ↔ settled
  const handleCanvasClick = () => {
    setIsSettled((prev) => !prev);
  };

  const materials = useMemo(
    () =>
      textures.map(
        (texture) =>
          new THREE.MeshPhysicalMaterial({
            map: texture,
            emissive: "#ffffff",
            emissiveMap: texture,
            emissiveIntensity: 0.35,
            metalness: 0.4,
            roughness: 0.9,
            clearcoat: 0.15,
          })
      ),
    []
  );

  return (
    <div className="techstack" id="techstack">
      <div className="techstack-header">
        <h2>
          My <span>Techstack</span>
        </h2>
        <p className="techstack-subtitle">Technologies I work with</p>
      </div>

      <div className="techstack-canvas-wrapper">
        <Canvas
          shadows
          gl={{ alpha: true, stencil: false, depth: false, antialias: false }}
          camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
          onCreated={(state) => (state.gl.toneMappingExposure = 1.5)}
          className="tech-canvas"
          onClick={handleCanvasClick}
        >
          <TargetUpdater onTargets={handleTargets} />
          <ambientLight intensity={1} />
          <spotLight
            position={[20, 20, 25]}
            penumbra={1}
            angle={0.2}
            color="white"
            castShadow
            shadow-mapSize={[512, 512]}
          />
          <directionalLight position={[0, 5, -4]} intensity={2} />
          <Physics gravity={[0, 0, 0]}>
            <Pointer isActive={isActive} isSettled={isSettled} />
            {techItems.map((tech, i) => (
              <SphereGeo
                key={i}
                scale={sphereScales[i]}
                material={materials[i]}
                isActive={isActive}
                isSettled={isSettled}
                targetPosition={targetPositions[i]}
                techName={tech.name}
                techColor={tech.color}
              />
            ))}
          </Physics>
          <Environment
            files="/models/char_enviorment.hdr"
            environmentIntensity={0.5}
            environmentRotation={[0, 4, 2]}
          />
          <EffectComposer enableNormalPass={false}>
            <N8AO color="#0f002c" aoRadius={2} intensity={1.15} />
          </EffectComposer>
        </Canvas>
      </div>

      <div className={`tech-hint ${isSettled ? "visible" : ""}`}>
        {isSettled ? "click to play" : ""}
      </div>

      <SkillGrid isActive={isActive} />
    </div>
  );
};

export default TechStack;

