<template></template>
<script setup lang="ts">
import { Camera, Euler, Scene, Vector3, WebGLRenderer } from "three";

const props = withDefaults(
  defineProps<{
    scene: Scene;
    position?: Vector3;
    rotation?: Euler;
    scale?: Vector3;
    loading?: number;
    suspending?: number;
    needsUpdate?: boolean;
  }>(),
  {
    position: () => new Vector3(0, 0, 0),
    rotation: () => new Euler(0, 0, 0),
    scale: () => new Vector3(1, 1, 1),
  }
);
const renderer = inject<{ value: WebGLRenderer }>("renderer");
const camera = inject<{ value: Camera }>("camera");
const time = inject<{ value: number }>("time");
const emit = defineEmits<{
  (e: "update:suspending", val: number);
  (e: "update:loading", val: number);
  (e: "update:needsUpdate", val: boolean);
}>();
emit("update:suspending", 0);
emit("update:loading", 0);
watch(toRef(props, "loading"), (val) => {
  if (val === -1) {
    emit("update:loading", 0);
  }
});
watch(toRef(props, "suspending"), (val) => {
  if (val === -1) {
    emit("update:suspending", 0);
  }
});

watch(time, () => {
  if (props.needsUpdate) {
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
    emit("update:needsUpdate", false);
  }
  renderer.value.render(toRaw(props.scene), camera.value);
});
onMounted(() => {});
onUnmounted(() => {});
</script>
