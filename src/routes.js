import HauntedHouse from "./views/haunted-house/HauntedHouse.vue";
import Materials from "./views/materials/Materials.vue";
import ThreeDText from "./views/three-d-text/ThreeDText.vue";
import Lights from "./views/lights/Lights.vue";
import Geometry from "./views/geometry/Geometry.vue";

export default [
  { path: "/", title: "Haunted House", component: HauntedHouse },
  { path: "/3d-text", title: "3D Text", component: ThreeDText },
  { path: "/materials", title: "Materials", component: Materials },
  //   { path: "/lights", title: "Lights", component: Lights },
  //   { path: "/geometry", title: "Geometry", component: Geometry },
];
