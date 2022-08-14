<template lang="pug">
div
  CoreViewport(v-model:loading="loading" v-model:suspensing="suspensing" :topLevel="true" v-model:time="time")
    template(#3d="{renderer,camera,time,loadings,suspensings}")
      CoreObjectsCube(v-bind="{renderer,camera,time}" v-model:loading="loadings[0]" v-model:suspensing="suspensings[0]")
</template>

<script setup lang="ts">
const loading = ref(false);
const suspensing = ref(false);
const time = ref(0);
</script>
