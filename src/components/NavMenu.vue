<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import routes from "../routes";

const isOpen = ref(false);
const router = useRouter();
const route = useRoute();
const menuRef = ref(null);

const currentPath = computed(() => route.path);

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const navigate = (path) => {
  router.push(path);
  isOpen.value = false;
};

const handleClickOutside = (event) => {
  if (menuRef.value && !menuRef.value.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="menu-container" ref="menuRef">
    <button
      class="hamburger"
      :class="{ open: isOpen }"
      @click.stop="toggleMenu"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>

    <nav class="nav-menu" :class="{ open: isOpen }">
      <ul>
        <li
          v-for="route in routes"
          :key="route.path"
          @click="navigate(route.path)"
          :class="{ active: currentPath === route.path }"
        >
          {{ route.title }}
        </li>
      </ul>
    </nav>
  </div>
</template>

<style scoped>
.menu-container {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

.hamburger {
  position: fixed;
  top: 20px;
  left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 2.5rem;
  height: 2.5rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 1001;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.hamburger span {
  width: 100%;
  height: 2px;
  background: #333;
  border-radius: 10px;
  transition: all 0.3s linear;
  position: relative;
  transform-origin: 1px;
}

/* Hamburger Animation */
.hamburger.open span:first-child {
  transform: rotate(45deg);
  translate: 0 -2px;
}

.hamburger.open span:nth-child(2) {
  opacity: 0;
  transform: translateX(-20px);
}

.hamburger.open span:nth-child(3) {
  transform: rotate(-45deg);
  translate: 0 2px;
}

.nav-menu {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 250px;
  background: white;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
}

.nav-menu.open {
  transform: translateX(0);
}

.nav-menu ul {
  list-style: none;
  padding: 0;
  margin: 80px 0 0 0;
}

.nav-menu li {
  padding: 15px 25px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.nav-menu li:hover {
  background-color: #f5f5f5;
}

.nav-menu li.active {
  background-color: #e3f2fd;
  color: #1976d2;
  font-weight: 600;
}

.nav-menu li.active::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: #1976d2;
}
</style>
