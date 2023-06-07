import "./styles.css";
import { useMemo, useRef, Suspense, useEffect } from "react";
import {
  MathUtils,
  RepeatWrapping,
  Object3D,
  Box3,
  Box3Helper,
  Vector2,
  Vector3
} from "three";
import {
  Circle,
  Environment,
  OrbitControls,
  PerspectiveCamera,
  Plane,
  SpotLight,
  SpotLightShadow,
  useDepthBuffer,
  MeshReflectorMaterial,
  useTexture,
  useGLTF
} from "@react-three/drei";
import { Canvas, Props as CanvasProps, useThree } from "@react-three/fiber";
import { onModelLoaded } from "./modelLoader";

const MODEL =
  "https://dimensions-art.cloudinary.net/image/upload/v1685515753/dimensions-app/3dmodels/GW4581-R_bylmo1.glb";

const Model = () => {
  // const group = useRef();
  const { scene } = useThree();
  const gltf = useGLTF(MODEL);

  // const gltfScene = await modelLoader(MODEL);
  const res = onModelLoaded(gltf);
  // const model = res.model;

  console.log("model = ", gltf);

  let model = new Object3D();
  const box = new Box3().setFromObject(gltf.scene);
  const boxHelper = new Box3Helper(box, 0xffff00);
  scene.add(boxHelper);

  const c = box.getCenter(new Vector3());
  const size = box.getSize(new Vector3());

  console.log("!!! ", { c, size });

  gltf.scene.position.set(-c.x, size.y / 2 - c.y, -c.z);

  model.add(gltf.scene);

  // useEffect(() => {
  //   window._stage.current.geometry.computeBoundingBox();

  //   var boundingBox = window._stage.current.geometry.boundingBox;

  //   var position = new Vector3();
  //   position.subVectors(boundingBox.max, boundingBox.min);
  //   position.multiplyScalar(0.5);
  //   position.add(boundingBox.min);

  //   //position.applyMatrix4( objMesh.matrixWorld );
  //   // res.model.position.set(position);
  // }, [res]);

  return (
    <primitive object={model} />
    // <mesh geometry={gltf.nodes[0]} material={gltf.materials["Material.001"]} />
  );
};

const DimensionsDemo = () => {
  const normalScale = 0;
  const roughness = useTexture("roughness_floor.jpeg");
  const normal = useTexture("NORM.jpg");
  const distortionMap = useTexture("dist_map.jpeg");
  const _normalScale = useMemo(() => new Vector2(normalScale || 0), [
    normalScale
  ]);

  const stageRef = (window._stage = useRef());

  // const texs = useTexture([
  //   "/textures/grassy_cobble/grassy_cobblestone_diff_2k.jpg",
  //   "/textures/grassy_cobble/grassy_cobblestone_nor_gl_2k.jpg", //
  //   "/textures/grassy_cobble/grassy_cobblestone_rough_2k.jpg",
  //   "/textures/grassy_cobble/grassy_cobblestone_ao_2k.jpg"
  // ]);
  // const depthBuffer = useDepthBuffer({ size: 256 });

  return (
    <>
      {/* <SpotLight
        penumbra={0.5}
        depthBuffer={depthBuffer}
        position={[4, 2, 0]}
        intensity={0.5}
        angle={0.5}
        color="#ff005b"
        castShadow
      />
      <SpotLight
        penumbra={0.5}
        depthBuffer={depthBuffer}
        position={[-6, 2, 0]}
        intensity={0.5}
        angle={0.5}
        color="#0EEC82"
        castShadow
      /> */}
      <OrbitControls
        makeDefault //
        autoRotate={false}
        autoRotateSpeed={0.5}
        minDistance={2}
        maxDistance={100}
      />
      <PerspectiveCamera
        near={0.01} //
        far={50}
        position={[4, 10, 20]}
        makeDefault
        fov={200}
      />

      <Environment preset="sunset" />

      <hemisphereLight args={[0xffffbb, 0x080820, 1]} />

      <Circle
        receiveShadow
        args={[5, 64, 64]}
        rotation-x={[-Math.PI / 2, 0, Math.PI / 2]}
        ref={stageRef}
      >
        <MeshReflectorMaterial
          resolution={1024}
          mirror={0.75}
          mixBlur={10}
          mixStrength={2}
          blur={[500, 500]}
          minDepthThreshold={0.8}
          maxDepthThreshold={1.2}
          depthScale={0}
          depthToBlurRatioBias={0.2}
          debug={0}
          distortion={0}
          distortionMap={distortionMap}
          color="#a0a0a0"
          metalness={0.5}
          roughnessMap={roughness}
          roughness={1}
          normalMap={normal}
          normalScale={_normalScale}
          reflectorOffset={0}
        />

        <Suspense fallback={null}>
          <Model />
        </Suspense>
      </Circle>
    </>
  );
};

const Scene = ({
  children,
  cameraFov = 500,
  cameraPosition = new Vector3(-5, 10, 5),
  controls = true,
  lights = true,
  ...restProps
}) => (
  <Canvas
    shadows
    camera={{ position: cameraPosition, fov: cameraFov }}
    {...restProps}
  >
    {children}
    {lights && (
      <>
        <ambientLight intensity={0.8} />
        <pointLight intensity={1} position={[0, 6, 0]} />
      </>
    )}
    {controls && <OrbitControls makeDefault />}
  </Canvas>
);

export default function App() {
  return (
    <div className="App">
      <Scene lights={false}>
        <DimensionsDemo />
      </Scene>
    </div>
  );
}
