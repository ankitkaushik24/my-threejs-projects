<script setup>
import Canvas from "../../components/Canvas.vue";
import init from "./gradientShader";
</script>

<template>
  <Canvas :init="init"></Canvas>
</template>
