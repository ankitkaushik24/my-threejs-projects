<script setup>
import { RouterView } from "vue-router";
import NavMenu from "./components/NavMenu.vue";
</script>

<template>
  <NavMenu />
  <RouterView />
</template>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: "sans-serif";
}
* {
  box-sizing: border-box;
}
</style>
