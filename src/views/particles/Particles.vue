<script setup>
import { onMounted } from "vue";
import Canvas from "../../components/Canvas.vue";
import init from "./particles.js";

onMounted(() => {
  init();
});
</script>

<template>
  <Canvas />
</template>
