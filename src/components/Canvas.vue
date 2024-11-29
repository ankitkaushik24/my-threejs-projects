<script setup>
import { onMounted, onBeforeUnmount } from "vue";
import { coreInit } from "../utils";

let destroy = null;

const props = defineProps({
  init: {
    type: Function,
    required: true,
  },
});

onMounted(() => {
  const { scene, camera, renderer, gui, orbitControls, removeListeners } =
    coreInit();
  const cleanup = props.init({ scene, camera, renderer, gui, orbitControls });

  destroy = () => {
    cleanup?.();
    removeListeners?.();
    orbitControls.dispose();
    gui.destroy();
    renderer.dispose();
    scene.dispose();
    camera.dispose();
  };
});

onBeforeUnmount(() => {
  destroy?.();
});
</script>

<template>
  <canvas id="webgl"></canvas>
  <div id="gui"></div>
</template>

<style scoped>
#gui {
  max-height: 100%;
  position: fixed;
  top: 0;
  right: 15px;
  z-index: 1001;
}
</style>
