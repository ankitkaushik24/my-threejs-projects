<script setup>
import { onMounted } from "vue";
import Canvas from "../../components/Canvas.vue";
import init from "./geometry";

onMounted(() => {
  init();
});
</script>

<template>
  <Canvas />
</template>
