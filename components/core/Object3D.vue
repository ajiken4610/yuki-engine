<template></template>
<script setup lang="ts">
import { Camera, Euler, Scene, Vector3, WebGLRenderer } from "three";

const props = withDefaults(
  defineProps<{
    renderer?: WebGLRenderer;
    camera?: Camera;
    scene: Scene;
    position?: Vector3;
    rotation?: Euler;
    scale?: Vector3;
    time?: number | { value: number };
    loading?: boolean;
    suspensing?: boolean;
  }>(),
  {
    renderer: () => inject("renderer"),
    camera: () => inject("camera"),
    time: () => inject("time", 0),
    position: () => new Vector3(0, 0, 0),
    rotation: () => new Euler(0, 0, 0),
    scale: () => new Vector3(1, 1, 1),
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

watch(toRef(props, "time"), () => {
  props.scene.position.set(
    props.position.x,
    props.position.y,
    props.position.z
  );
  props.scene.rotation.set(
    props.rotation.x,
    props.rotation.y,
    props.rotation.z,
    props.rotation.order
  );
  props.scene.scale.set(props.scale.x, props.scale.y, props.scale.z);
  unref(props.renderer).render(toRaw(unref(props.scene)), unref(props.camera));
});
onMounted(() => {});
onUnmounted(() => {});
</script>
