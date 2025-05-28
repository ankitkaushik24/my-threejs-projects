import FlagShaders from "./views/flag-shaders/FlagShaders.vue";
import GalaxyGenerator from "./views/galaxy-generator/GalaxyGenerator.vue";
import HauntedHouse from "./views/haunted-house/HauntedHouse.vue";
import Materials from "./views/materials/Materials.vue";
import Particles from "./views/particles/Particles.vue";
import Physics from "./views/physics/Physics.vue";
import ScrollAnimation from "./views/scroll-animation/ScrollAnimation.vue";
import ThreeDText from "./views/three-d-text/ThreeDText.vue";

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
  {
    path: "/physics",
    title: "Physics",
    component: Physics,
  },
  {
    path: "/flag-shaders",
    title: "Flag Shaders",
    component: FlagShaders,
  },
  {
    path: "/gradient-shader",
    title: "Gradient Shader",
    component: () => import("./views/gradient-shader/GradientShader.vue"),
  },
  {
    path: "/sea",
    title: "Sea",
    component: () => import("./views/sea-shader/Sea.vue"),
  },
];
