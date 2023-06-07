import "./styles.css";
import { useMemo, useRef, Suspense, useLayoutEffect } from "react";
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
  useGLTF,
	Box,
	Caustics,
	ContactShadows
} from "@react-three/drei";
import { Canvas, Props as CanvasProps, useThree } from "@react-three/fiber";
import { onModelLoaded } from "./modelLoader";

const MODEL =
  "https://dimensions-art.cloudinary.net/image/upload/v1685515753/dimensions-app/3dmodels/GW4581-R_bylmo1.glb";

const Model = () => {
  // const group = useRef();
  const { scene } = useThree();
  const gltf = useGLTF(MODEL);

	useLayoutEffect(() => {
		scene.traverse(o => o.isMesh && (o.castShadow = o.receiveShadow = true));
	}, [])

	console.log("SCENE = ", { scene });

  // const gltfScene = await modelLoader(MODEL);
  // onModelLoaded(gltf);
  // const model = res.model;

  console.log("model = ", gltf);

  let model = new Object3D();
  const box = new Box3().setFromObject(gltf.scene);
  // const boxHelper = new Box3Helper(box, "#FFFFFF");
  // scene.add(boxHelper);

  const center = box.getCenter(new Vector3());
  const size = box.getSize(new Vector3());

	const modelSize = new Vector3();
	gltf.scene.children[0].geometry.boundingBox.getSize(modelSize);

  console.log("BOX DETAILS !!! ", { center, size, modelSize });

  gltf.scene.position.set(center.x, size.y / 2, center.z);

  model.add(gltf.scene);

  return (
    <primitive
	    object={model}
	    scale={[0.35, 0.35, 0.35]}
	    castShadow
	    receiveShadow
    />
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
  const depthBuffer = useDepthBuffer({ size: 512 });
	const spot1Color = "#e1d4a1";
	const spot2Color = "#8de5a1";

	console.log("rendering demo ", );

  return (
    <>
	    {/*<SpotLight*/}
		  {/*  penumbra={2.8}*/}
		  {/*  depthBuffer={depthBuffer}*/}
		  {/*  position={[1, 6, -4]}*/}
		  {/*  intensity={1.8}*/}
		  {/*  angle={0.8}*/}
		  {/*  color={spot1Color}*/}
		  {/*  castShadow*/}
	    {/*/>*/}
	    {/*<SpotLight*/}
		  {/*  penumbra={3.8}*/}
		  {/*  depthBuffer={depthBuffer}*/}
		  {/*  position={[1, 6, 4]}*/}
		  {/*  intensity={1.8}*/}
		  {/*  angle={0.8}*/}
		  {/*  color={spot2Color}*/}
		  {/*  castShadow*/}
	    {/*/>*/}

      {/*
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
        near={1} //
        far={100}
        position={[-2.8, 1.6, 6]}
        makeDefault
        fov={60}
      />

	    {/*<Environment preset="sunset" />*/}
      {/*
       4, 10, 20

      // */}

      {/*<hemisphereLight args={["#eeeed3", "#ffffff", 5]} />*/}
			{/*<ambientLight args={[0x404040,25]} />*/}
	    <pointLight position={[1, 20, 8]} intensity={1} castShadow />
	    <pointLight position={[-5, 16, 20]} intensity={0.8} castShadow />

      <Circle
        receiveShadow
        args={[8, 64, 64]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        ref={stageRef}
      >
        <MeshReflectorMaterial
	        name={"floor"}
          resolution={5000}
          mirror={0.87}
          mixBlur={10}
          mixStrength={4}
          blur={[400, 400]}
          minDepthThreshold={0.8}
          maxDepthThreshold={1.5}
          depthScale={0.1}
          depthToBlurRatioBias={0.2}
          debug={0}
          distortion={1}
          distortionMap={distortionMap}
          color="#a0a0a0"
          metalness={0.72}
          roughnessMap={roughness}
          roughness={1}
          normalMap={normal}
          normalScale={_normalScale}
          reflectorOffset={0}
	        receiveShadow
	        clipShadows={false}
        />
      </Circle>
	    {/*<ContactShadows*/}
		  {/*  position={[0, 0, 0]}*/}
		  {/*  scale={10}*/}
		  {/*  far={3}*/}
		  {/*  blur={3}*/}
		  {/*  rotation={[Math.PI / 2, 0, 0]}*/}
		  {/*  color={"black"}*/}
	    {/*/>*/}
	    <Suspense fallback={null}>
		    {/*<Caustics debug backside lightSource={[2.5, 5, -2.5]}>*/}
		    <Model />
	    </Suspense>
	    {/*<Box args={[2, 3, 0.2]} position={[0, 1.6, -3]}>*/}
		  {/*  <meshPhysicalMaterial color="hotpink" />*/}
	    {/*</Box>*/}

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
