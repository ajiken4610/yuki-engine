<template lang="pug">
div
  NuxtPage
</template>

<script setup lang="ts">
// initCore();
</script>

<style lang="scss">
* {
  margin: 0;
}
body > canvas {
  position: absolute;
  z-index: 0;
}
.fullscreen {
  position: absolute;
  width: 100vw;
  height: 100vh;
  z-index: 1;
}
</style>
