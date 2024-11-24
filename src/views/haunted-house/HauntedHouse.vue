<script setup>
import init from "./haunted-house.js";
import Canvas from "../../components/Canvas.vue";
import { onMounted } from "vue";

onMounted(() => {
  init();
});
</script>

<template>
  <Canvas />
</template>
