<template></template>
<script setup lang="ts">
import { Camera, Euler, Scene, Vector3, WebGLRenderer } from "three";

const props = withDefaults(
  defineProps<{
    renderer?: { value: WebGLRenderer };
    camera?: { value: Camera };
    scene: Scene;
    position?: Vector3;
    rotation?: Euler;
    scale?: Vector3;
    time?: { value: number };
    loading?: boolean;
    suspending?: boolean;
    needsUpdate?: boolean;
  }>(),
  {
    renderer: () => inject("renderer"),
    camera: () => inject("camera"),
    time: () => inject("time"),
    position: () => new Vector3(0, 0, 0),
    rotation: () => new Euler(0, 0, 0),
    scale: () => new Vector3(1, 1, 1),
  }
);
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

watch(toRef(props, "time"), () => {
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
  props.renderer.value.render(toRaw(props.scene), props.camera.value);
});
onMounted(() => {});
onUnmounted(() => {});
</script>
