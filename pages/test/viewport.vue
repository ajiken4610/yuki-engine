<template lang="pug">
div
  CoreViewport(
    v-model:loading="loading",
    v-model:suspending="suspending",
    v-model:objectCount="objectCount",
    :topLevel="true",
    v-model:time="time",
    :camera="camera"
  )
    template(#3d="{ loadings, suspendings, objectCounts }")
      CoreObjectsCube(
        :position="position",
        :rotation="rotation",
        v-model:loading="loadings[0]",
        v-model:suspending="suspendings[0]",
        v-model:objectCount="objectCounts[0]",
        v-model:needsUpdate="needsUpdate"
      )
    template(#2d) Loading:{{ loading }},Suspending:{{ suspending }}/All:{{ objectCount }}
      NuxtLink(to="/") to
</template>

<script setup lang="ts">
import { Euler, PerspectiveCamera, Vector3 } from "three";

const loading = ref(0);
const suspending = ref(0);
const objectCount = ref(0);
const time = ref(0);
const camera = ref(
  new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 10)
);
camera.value.matrixAutoUpdate = true;
camera.value.position.set(2, 2, 2);
camera.value.lookAt(0, 0, 0);

const needsUpdate = ref(false);
const position = new Vector3(0, 0, 0);
const rotation = new Euler(0, 0, 0);
watch(time, () => {
  position.set(Math.sin(time.value), 0, Math.cos(time.value));
  rotation.set(time.value * 1, time.value * 2, time.value * 3);
  needsUpdate.value = true;
});
</script>
