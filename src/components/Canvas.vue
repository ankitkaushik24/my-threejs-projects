<script setup>
import { onMounted, onBeforeUnmount } from "vue";
import { coreInit } from "../utils";

let destroy = null;

const props = defineProps({
  init: {
    type: Function,
    required: true,
  },
  coreOptions: {
    type: Object,
    default: {},
  },
});

onMounted(() => {
  const core = coreInit(props.coreOptions);
  const cleanup = props.init(core);

  destroy = () => {
    const { scene, renderer, gui, orbitControls, removeListeners } = core;
    cleanup?.();
    removeListeners?.();
    orbitControls?.dispose();
    scene.clear();
    gui.destroy();
    renderer.setRenderTarget(null);
    renderer.dispose();
  };
});

onBeforeUnmount(() => {
  destroy?.();
});
</script>

<template>
  <div>
    <canvas id="webgl"></canvas>
    <div id="gui"></div>
  </div>
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
