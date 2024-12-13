<script setup>
import Canvas from "@/components/Canvas.vue";
import init from "./physics";
</script>

<template>
  <Canvas :init="init" :core-options="{ cameraFar: 100 }" />
</template>
