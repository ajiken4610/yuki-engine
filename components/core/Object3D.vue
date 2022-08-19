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

const injectedPosition =
  inject<{ value: Vector3 }>("position", null) || ref(new Vector3(0, 0, 0));
const injectedRotation =
  inject<{ value: Euler }>("rotation", null) || ref(new Euler(0, 0, 0));
const injectedScale =
  inject<{ value: Vector3 }>("scale", null) || ref(new Vector3(1, 1, 1));
const injectedNeedsUpdate = inject("needsUpdate", null) || ref(false);
const updateMatrix = () => {
  props.scene.position.set(
    props.position.x + injectedPosition.value.x,
    props.position.y + injectedPosition.value.y,
    props.position.z + injectedPosition.value.z
  );
  props.scene.rotation.set(
    props.rotation.x + injectedRotation.value.x,
    props.rotation.y + injectedRotation.value.y,
    props.rotation.z + injectedRotation.value.z,
    props.rotation.order
  );
  props.scene.scale.set(
    props.scale.x * injectedScale.value.x,
    props.scale.y * injectedScale.value.y,
    props.scale.z * injectedScale.value.z
  );
  emit("update:needsUpdate", false);
  injectedNeedsUpdate.value = false;
};

watch(time, () => {
  if (props.needsUpdate || injectedNeedsUpdate.value) {
    updateMatrix();
  }
  renderer.value.render(toRaw(props.scene), camera.value);
});
onMounted(() => {});
onUnmounted(() => {});
</script>
