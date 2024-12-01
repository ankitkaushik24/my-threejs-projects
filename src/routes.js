import HauntedHouse from "./views/haunted-house/HauntedHouse.vue";
import Materials from "./views/materials/Materials.vue";
import ThreeDText from "./views/three-d-text/ThreeDText.vue";
import Lights from "./views/lights/Lights.vue";
import Geometry from "./views/geometry/Geometry.vue";
import Particles from "./views/particles/Particles.vue";
import GalaxyGenerator from "./views/galaxy-generator/GalaxyGenerator.vue";
import ScrollAnimation from "./views/scroll-animation/ScrollAnimation.vue";

export default [
  { path: "/", title: "Home", redirect: "/haunted-house" },
  { path: "/haunted-house", title: "Haunted House", component: HauntedHouse },
  { path: "/3d-text", title: "3D Text", component: ThreeDText },
  { path: "/materials", title: "Materials", component: Materials },
  //   { path: "/lights", title: "Lights", component: Lights },
  //   { path: "/geometry", title: "Geometry", component: Geometry },
  { path: "/particles", title: "Particles", component: Particles },
  {
    path: "/galaxy-generator",
    title: "Galaxy Generator",
    component: GalaxyGenerator,
  },
  {
    path: "/scroll-animation",
    title: "Scroll Animation",
    component: ScrollAnimation,
  },
];
