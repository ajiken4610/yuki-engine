<template lang="pug">
div
  CoreViewport(v-model:suspending="suspending" :topLevel="true")
    template(#2d)
      NuxtLink(to="/") hello
    template(#3d="{renderer,camera,time,suspendings}")
      CoreObject3D(:renderer="renderer" :scene="scene" :camera="camera" :time="time" v-model:suspending="suspendings[0]")
</template>

<script setup lang="ts">
import { Scene } from "three";

const suspending = ref(false);
const scene = ref(new Scene());
</script>
