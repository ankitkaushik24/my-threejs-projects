<script setup>
import Canvas from "../../components/Canvas.vue";
import init from "./lights";
import { onMounted } from "vue";

onMounted(() => {
  init();
});
</script>

<template>
  <Canvas />
</template>
