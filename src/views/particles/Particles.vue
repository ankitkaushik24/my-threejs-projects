<script setup>
import Canvas from "../../components/Canvas.vue";
import init from "./particles.js";
</script>

<template>
  <Canvas :init="init" />
</template>
