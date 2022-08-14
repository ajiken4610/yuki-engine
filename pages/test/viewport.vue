<template lang="pug">
div
  CoreViewport(
    v-model:loading="loading",
    v-model:suspensing="suspensing",
    :topLevel="true",
    v-model:time="time",
    :camera="camera"
  )
    template(#3d="{ loadings, suspensings }")
      CoreObjectsCube(
        :position="position",
        :rotation="rotation",
        v-model:loading="loadings[0]",
        v-model:suspensing="suspensings[0]"
      )
</template>

<script setup lang="ts">
import { Euler, PerspectiveCamera, Vector3 } from "three";

const loading = ref(false);
const suspensing = ref(false);
const time = ref(0);
const camera = ref(
  new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 10)
);
camera.value.position.set(2, 2, 2);
camera.value.lookAt(0, 0, 0);

const position = new Vector3(0, 0, 0);
const rotation = new Euler(0, 0, 0);
watch(time, () => {
  position.set(Math.sin(time.value), 0, Math.cos(time.value));
  rotation.set(time.value * 1, time.value * 2, time.value * 3);
});
</script>
