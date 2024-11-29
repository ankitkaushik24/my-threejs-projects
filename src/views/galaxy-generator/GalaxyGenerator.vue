<script setup>
import init from "./galaxy-generator.js";
import Canvas from "../../components/Canvas.vue";
</script>

<template>
  <Canvas :init="init" />
</template>
