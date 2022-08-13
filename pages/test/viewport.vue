<template lang="pug">
div
  CoreViewport(v-model:suspending="suspending" :topLevel="true" v-model:time="time")
    template(#3d="{renderer,camera,time,suspendings}")
      CoreObjectsCube(:renderer="renderer" :camera="camera" :time="time" v-model:suspending="suspendings[0]")
</template>

<script setup lang="ts">
const suspending = ref(false);
const time = ref(0);
</script>
