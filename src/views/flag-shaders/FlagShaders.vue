<script setup>
import Canvas from "../../components/Canvas.vue";
import init from "./flag-shaders.js";
</script>

<template>
  <Canvas :init="init"></Canvas>
</template>
