<script setup>
import Canvas from "../../components/Canvas.vue";
import init from "./particlesv2.js";
</script>

<template>
  <Canvas :init="init" />
</template>
