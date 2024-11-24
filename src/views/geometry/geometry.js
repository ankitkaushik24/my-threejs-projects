import * as THREE from "three";
import { BoxGeometry } from "three";

import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import GUI from "lil-gui";

export default function init() {
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#webgl"),
  });
  const gui = new GUI({
    container: document.querySelector("#gui"),
    width: 300,
    title: "Debug UI",
    closeFolders: true,
  });
  // gui.close()
  // gui.hide();
  // gui.show();
  // gui.show(gui._hidden)

  // const texture = (() => {
  //   const image = new Image();
  //   image.src = "/javascript.svg";
  //   const imageTexture = new THREE.Texture(image);
  //   imageTexture.colorSpace = THREE.SRGBColorSpace;

  //   image.onload = () => {
  //     imageTexture.needsUpdate = true;
  //   };

  //   return imageTexture;
  // })();

  const textureLoader = new THREE.TextureLoader(
    Object.assign(new THREE.LoadingManager(), {
      onStart(...e) {
        console.log("started", e);
      },
      onLoad() {
        console.log("loaded");
      },
      onProgress(...e) {
        console.log("progress", e);
      },
      onError(...e) {
        console.error("error", e);
      },
    })
  );

  const guiProps = {
    color: "red",
    subDivision: 2,
    cubeSize: 2,
  };
  let camera;

  const { dimensions } = (() => {
    let dimensions = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const performSideEffects = () => {
      renderer.setSize(dimensions.width, dimensions.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      if (camera) {
        camera.aspect = dimensions.width / dimensions.height;
        camera.updateProjectionMatrix();
      }
    };

    window.addEventListener("resize", () => {
      dimensions = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      performSideEffects();
    });

    performSideEffects();

    return { dimensions };
  })();

  const scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    60,
    dimensions.width / dimensions.height,
    0.1,
    100
  );

  const orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.enableDamping = true;

  camera.position.set(0, 0, 6);

  const group = (() => {
    const createCube = (size, color) => {
      const cube = (() => {
        const segments = guiProps.subDivision;
        const geo = new BoxGeometry(
          size,
          size,
          size,
          segments,
          segments,
          segments
        );
        const mat = new THREE.MeshBasicMaterial({
          // color,
          map: (() => {
            const texture = textureLoader.load("/javascript.svg");

            return texture;
          })(),
          // wireframe: false,
        });

        return new THREE.Mesh(geo, mat);
      })();

      return cube;
    };

    const cube1 = createCube(guiProps.cubeSize, "red");

    const customGeometry = (() => {
      const numOfTriangles = 100;
      const totalVertices = numOfTriangles * 3;
      const totalCoordinates = totalVertices * 3;
      const coordinatesArray = Array.from({ length: totalCoordinates }).map(
        () => Math.floor((Math.random() - 0.5) * 2)
      );

      const positionsArray = new Float32Array(coordinatesArray);
      const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
      const bufferGeometry = new THREE.BufferGeometry();
      bufferGeometry.setAttribute("position", positionsAttribute);

      return bufferGeometry;
    })();
    // const cube2 = createCube(1, 'yellow');
    // const cube3 = createCube(1, 'green');

    // cube1.position.x = -2;
    // cube3.position.x = 2;

    const triangleGeometry = (() => {
      const positionsArray = new Float32Array([
        0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0,
      ]);
      const positionsBufferAttr = new THREE.BufferAttribute(positionsArray, 3);
      const bufferGeometry = new THREE.BufferGeometry();
      bufferGeometry.setAttribute("position", positionsBufferAttr);

      return bufferGeometry;
    })();
    const triangleMesh = new THREE.Mesh(
      customGeometry,
      new THREE.MeshBasicMaterial({ color: "hotpink", wireframe: true })
    );

    const container = new THREE.Group();
    container.add(cube1);

    return container;
  })();

  gui.add(group, "visible");
  gui.add(group.children[0].material, "wireframe");
  gui.addColor(group.children[0].material, "color");
  guiProps.spinCube = () => {
    gsap.to(group.rotation, {
      y: group.rotation.y + 2 * Math.PI,
      duration: 2,
    });
  };

  gui.add(guiProps, "spinCube");

  gui
    .add(guiProps, "subDivision")
    .min(1)
    .max(100)
    .step(1)
    .onFinishChange((val) => {
      group.children[0].geometry.dispose();

      const size = guiProps.cubeSize;
      group.children[0].geometry = new BoxGeometry(
        size,
        size,
        size,
        val,
        val,
        val
      );
    });

  // cube.rotation.x = 0.15 * Math.PI;
  // cube.rotation.y =  0.25 * Math.PI;

  // cube.position.normalize();

  // console.log(cube.position.length())

  window.addEventListener("dblclick", () => {
    const isFullScreen =
      document.fullscreenElement || document.webkitFullScreenElement;
    const requestFullscreen = () => {
      const domElement = renderer.domElement;
      (domElement.requestFullscreen || domElement.webkitRequestFullScreen).call(
        domElement
      );
    };
    const exitFullscreen = () =>
      (document.exitFullscreen || document.webkitExitFullScreen).call(document);

    if (isFullScreen) {
      exitFullscreen();
    } else {
      requestFullscreen();
    }
  });

  scene.add(group, new THREE.AmbientLight(0xffffff, 1));

  // gsap.to(group.position, {
  //   duration: 1,
  //   delay: 1,
  //   y: 1,
  //   repeat: -1,
  //   yoyo: true,
  //   ease: 'power1'
  // })

  // let startTime = Date.now();
  const clock = new THREE.Clock();

  // const cursor = (() => {
  //   const pointer = {x: 0, y: 0};
  //   window.addEventListener('mousemove', event => {
  //     pointer.x = 2 * (event.clientX / sizes.width) - 1;
  //     pointer.y = 2 * (event.clientY / sizes.height) - 1;
  //   });
  //   return pointer;
  // })();

  function tick() {
    // const currTime =  Date.now();
    // const delta = currTime - startTime; // milliseconds
    // startTime = currTime;
    const elapsed = clock.getElapsedTime();

    // group.children[0].rotation.y = (elapsed) % (2 * Math.PI);

    // camera.lookAt(group.position);

    // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
    // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
    // camera.position.y = -cursor.y * 5;

    // camera.position.y = Math.sin(cursor.y * Math.PI * 2) * 3;
    // camera.position.z = Math.cos(cursor.y * Math.PI * 2) * 3;

    // camera.lookAt(group.position);

    orbitControls.update(); // to support smooth damping

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();
}
