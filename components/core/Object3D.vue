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
    suspending?: boolean;
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
  (e: "update:suspending", val: boolean);
  (e: "update:loading", val: boolean);
}>();
emit("update:suspending", false);
emit("update:loading", false);
watch(toRef(props, "loading"), (val) => {
  if (val) {
    emit("update:loading", false);
  }
});
watch(toRef(props, "suspending"), (val) => {
  if (val) {
    emit("update:suspending", false);
  }
});
const lastPosition = new Vector3(0, 0, 0);
const lastRotation = new Euler(0, 0, 0);
const lastScale = new Vector3(1, 1, 1);
watch(toRef(props, "time"), () => {
  if (!lastPosition.equals(props.position)) {
    props.scene.position.set(
      props.position.x,
      props.position.y,
      props.position.z
    );
    lastPosition.copy(props.position);
  }
  if (!lastRotation.equals(props.rotation)) {
    props.scene.rotation.set(
      props.rotation.x,
      props.rotation.y,
      props.rotation.z,
      props.rotation.order
    );
    lastRotation.copy(props.rotation);
  }
  if (!lastScale.equals(props.scale)) {
    props.scene.scale.set(props.scale.x, props.scale.y, props.scale.z);
    lastScale.copy(props.scale);
  }
  unref(props.renderer).render(toRaw(unref(props.scene)), unref(props.camera));
});
onMounted(() => {});
onUnmounted(() => {});
</script>
