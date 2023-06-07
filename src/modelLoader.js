import { Box3, Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

const getMetrics = (object) => {
  const boundingBox = new Box3();
  boundingBox.setFromObject(object);
  const center = new Vector3();
  boundingBox.getCenter(center);
  const size = new Vector3();
  boundingBox.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z);

  return { maxDim, boundingBox, center };
};

const adjustSize = (object, maxDimension) => {
  // Too large or too small models may not be visible so we scale them to a reasonable size
  let scaleFactor = 8 / maxDimension;

  object.scale.set(scaleFactor, scaleFactor, scaleFactor);
};

const alignModelPosition = (object) => {
  object.scale.set(1, 1, 1);
  const { maxDim } = getMetrics(object);
  adjustSize(object, maxDim);
  // centerModel(object); todo: doesn't work well when the object contains lights or camera

  // need to recalculate after scale
  // const { boundingBox } = getMetrics(object);
  // object.position.set(
  //   boundingBox.min.x < 0 ? boundingBox.min.x * -1 : 0,
  //   boundingBox.min.y < 0 ? boundingBox.min.y * -1 : 0,
  //   boundingBox.min.z < 0 ? boundingBox.min.z * -1 : 0
  // );
};

// export const modelLoader = async (modelUrl) =>
//   new Promise((resolve, reject) => {
//     const loader = new GLTFLoader();
//     const dracoLoader = new DRACOLoader();
//     // dracoLoader.setDecoderPath("../draco");
//     loader.setDRACOLoader(dracoLoader);
//     loader.load(modelUrl, resolve, () => {}, reject);
//   });

export const onModelLoaded = (gltfScene) => {
  console.info("GLB loaded");
  let modelCamera = null;
  let modelLight = null;
  const model = gltfScene.scene;
	//
  // model.traverse(function (child) {
  //   if (child.isMesh) {
  //     child.castShadow = true;
  //   } else if (child.isCamera && modelCamera === null) {
  //     modelCamera = child;
  //   } else if (child.isLight && modelLight === null) {
  //     child.castShadow = true;
  //     modelLight = child;
  //   }
  // });

  alignModelPosition(model);

  return { model, modelCamera, modelLight };
};

export const onModelLoadedError = (error) => {
  console.error(error);
};
