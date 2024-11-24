<script setup>
import init from "./materials.js";
import Canvas from "../../components/Canvas.vue";
import { onMounted } from "vue";

onMounted(() => {
  init();
});
</script>

<template>
  <Canvas />
</template>
