<template></template>
<script setup lang="ts">
import { Camera, Scene, WebGLRenderer } from "three";

const props = withDefaults(
  defineProps<{
    renderer: WebGLRenderer;
    camera: Camera;
    scene: Scene;
    time?: number;
    loading?: boolean;
    suspensing?: boolean;
  }>(),
  {
    time: 0,
  }
);
const emit = defineEmits<{
  (e: "update:suspensing", val: boolean);
  (e: "update:loading", val: boolean);
}>();
emit("update:suspensing", false);
emit("update:loading", false);
watch(toRef(props, "loading"), (val) => {
  if (val) {
    emit("update:loading", false);
  }
});
watch(toRef(props, "suspensing"), (val) => {
  if (val) {
    emit("update:suspensing", false);
  }
});

watch(toRef(props, "time"), (time) => {
  props.renderer.render(toRaw(props.scene), props.camera);
});
onMounted(() => {});
onUnmounted(() => {});
</script>
