<script setup>
import Canvas from "@/components/Canvas.vue";
import init from "./scroll-animation";
</script>

<template>
  <Canvas :init="init" :core-options="{ enableOrbitControls: false }" />
  <main>
    <section>
      <h3>Learn</h3>
    </section>
    <section>
      <h3>Build</h3>
    </section>
    <section>
      <h3>Grow</h3>
    </section>
  </main>
</template>

<style>
:root {
  --foreground: #fff;
  --background: #19171a;
}
html body {
  margin: 0;
  font-family: fantasy, "Poppins", sans-serif;
  background-color: var(--background);
  overflow: auto;
  height: 100vh;
  overflow: auto;
}
</style>

<style scoped>
:deep(canvas) {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
}

main {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
section {
  height: 100vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
section:nth-child(even) {
  align-self: flex-end;
}
section h3 {
  text-transform: uppercase;
  font-size: 15vw;
  font-weight: 700;
  color: var(--foreground);
}
</style>
