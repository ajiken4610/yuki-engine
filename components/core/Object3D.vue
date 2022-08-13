<template></template>
<script setup lang="ts">
import { Camera, Scene, WebGLRenderer } from "three";

const props = withDefaults(
  defineProps<{
    renderer: WebGLRenderer;
    camera: Camera;
    scene: Scene;
    time?: number;
    suspending: boolean;
  }>(),
  {
    time: 0,
    suspending: false,
  }
);
const emit = defineEmits<{ (e: "update:suspending", val: boolean) }>();
emit("update:suspending", false);
watch(toRef(props, "suspending"), (val) => {
  if (val) {
    emit("update:suspending", false);
  }
});

watch(toRef(props, "time"), (time) => {
  props.renderer.render(toRaw(props.scene), props.camera);
});
onMounted(() => {});
onUnmounted(() => {});
</script>
