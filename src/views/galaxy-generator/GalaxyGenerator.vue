<script setup>
import { onMounted } from "vue";
import init from "./galaxy-generator.js";
import Canvas from "../../components/Canvas.vue";

onMounted(() => {
  init();
});
</script>

<template>
  <Canvas />
</template>
