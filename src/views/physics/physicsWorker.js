import * as CANNON from "cannon-es";

let world;
let objectsToUpdate = [];

self.onmessage = function (e) {
  const { type, data } = e.data;

  switch (type) {
    case "init":
      initPhysicsWorld();
      break;
    case "step":
      stepPhysics(data.deltaTime);
      break;
    case "addSphere":
      addSphere(data);
      break;
    case "addBox":
      addBox(data);
      break;
    case "addPlane":
      addPlane(data);
      break;
    case "reset":
      reset();
      break;
  }
};

function initPhysicsWorld() {
  world = new CANNON.World();
  world.gravity.set(0, -9.82, 0);
  world.broadphase = new CANNON.SAPBroadphase(world);
  world.allowSleep = true;

  const defaultMaterial = new CANNON.Material("default");
  const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
      friction: 1,
      restitution: 0.7,
    }
  );
  world.defaultContactMaterial = defaultContactMaterial;

  // Add plane
  // const planeBody = new CANNON.Body({ mass: 0 });
  // planeBody.addShape(new CANNON.Plane());
  // planeBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  // world.addBody(planeBody);
}

function stepPhysics(deltaTime) {
  world.step(1 / 60, deltaTime, 3);

  const bodies = objectsToUpdate.map((obj) => ({
    id: obj.id,
    position: obj.body.position,
    quaternion: obj.body.quaternion,
  }));

  self.postMessage({
    type: "frame",
    data: { bodies },
  });
}

function onBodyCollision(collisionEvent) {
  const impactStrength = collisionEvent.contact.getImpactVelocityAlongNormal();
  self.postMessage({
    type: "collision",
    data: { impactStrength },
  });
}

function addSphere({ radius, position, id }) {
  const body = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Sphere(radius),
    position: new CANNON.Vec3(position.x, position.y, position.z),
  });
  body.addEventListener("collide", onBodyCollision);

  world.addBody(body);
  objectsToUpdate.push({ id, body });
}

function addPlane({ position, size }) {
  const body = new CANNON.Body({ mass: 0 });
  body.addShape(new CANNON.Box(new CANNON.Vec3(size / 2, size / 2, 0.01)));
  body.position.set(position.x, position.y, position.z);
  body.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

  world.addBody(body);
}

function addBox({ width, height, depth, position, id }) {
  const body = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2)),
    position: new CANNON.Vec3(position.x, position.y, position.z),
  });
  body.addEventListener("collide", onBodyCollision);
  world.addBody(body);
  objectsToUpdate.push({ id, body });
}

function reset() {
  objectsToUpdate.forEach(({ body }) => {
    body.removeEventListener("collide", onBodyCollision);
    world.removeBody(body);
  });
  objectsToUpdate = [];
}
