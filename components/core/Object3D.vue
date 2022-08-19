<template></template>
<script setup lang="ts">
import { Camera, Euler, Scene, Vector3, WebGLRenderer } from "three";

const props = withDefaults(
  defineProps<{
    scene: Scene;
    position?: Vector3;
    rotation?: Euler;
    scale?: Vector3;
    loading?: boolean;
    suspending?: boolean;
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
  (e: "update:suspending", val: boolean);
  (e: "update:loading", val: boolean);
  (e: "update:needsUpdate", val: boolean);
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
