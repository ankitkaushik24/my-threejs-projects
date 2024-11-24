<script setup>
import { RouterView } from "vue-router";
import NavMenu from "./components/NavMenu.vue";
</script>

<template>
  <NavMenu />
  <main>
    <RouterView />
  </main>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}

main {
}
</style>
