<template></template>
<script setup lang="ts">
import { Camera, Euler, Matrix4, Scene, Vector3, WebGLRenderer } from "three";

const props = withDefaults(
  defineProps<{
    scene: Scene;
    position?: Vector3;
    rotation?: Euler;
    scale?: Vector3;
    loading?: number;
    suspending?: number;
    objectCount?: number;
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
  (e: "update:objectCount", val: number);
  (e: "update:needsUpdate", val: boolean);
}>();
emit("update:suspending", 0);
emit("update:loading", 0);
emit("update:objectCount", 1);
watch(toRef(props, "loading"), (val) => {
  if (val === -1) {
    setTimeout(() => {
      emit("update:loading", 0);
    }, 1000);
  }
});
watch(toRef(props, "suspending"), (val) => {
  if (val === -1) {
    setTimeout(() => {
      emit("update:suspending", 0);
    }, 1000);
  }
});
const updateMatrix = () => {
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
  props.scene.matrixWorldNeedsUpdate = true;
  emit("update:needsUpdate", false);
};

watch(time, () => {
  if (props.needsUpdate) {
    updateMatrix();
  }
  renderer.value.render(toRaw(props.scene), camera.value);
});
onMounted(() => {});
onUnmounted(() => {});
</script>
