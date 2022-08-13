<template lang="pug">
div
</template>

<script setup lang="ts">
import { WebGLRenderer, Camera } from "three";
const props = withDefaults(
  defineProps<{
    route?: string;
    element?: HTMLElement;
    renderer?: WebGLRenderer;
    camera?: Camera;
    time?: number;
    suspending: boolean;
  }>(),
  {
    route: "/",
    element: () => document.body,
    renderer: () => useWebGLRenderer(),
    camera: () => new Camera(),
    time: 0,
    suspending: false,
  }
);
const emit = defineEmits<{ (e: "update:suspending", val: boolean): void }>();
</script>
