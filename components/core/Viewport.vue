<template lang="pug">
div
  Teleport(:to="element")
    .fullscreen
      slot(name="2d" :element="element" :time="time" :loadings="childLoading2D" :suspensings="childsuspensing2D")
  .d-none
    slot(name="3d" :renderer="renderer" :camera="camera" :time="time" :loadings="childLoading3D" :suspensings="childsuspensing3D")
</template>

<script setup lang="ts">
import { WebGLRenderer, Camera, Clock, PerspectiveCamera } from "three";
const props = withDefaults(
  defineProps<{
    route?: string;
    element?: HTMLElement;
    renderer?: WebGLRenderer;
    camera?: Camera;
    time: number;
    loading: boolean;
    suspensing: boolean;
    topLevel?: boolean;
  }>(),
  {
    route: "/",
    element: () => document.body,
    renderer: useWebGLRenderer,
    camera: useDefaultCamera,
    time: 0,
    loading: false,
    suspensing: false,
  }
);
const emit = defineEmits<{
  (e: "update:loading", val: boolean): void;
  (e: "update:suspensing", val: boolean): void;
  (e: "update:time", val: number): void;
}>();
const childsuspensing2D = reactive<boolean[]>(useBooleanArray());
const childsuspensing3D = reactive<boolean[]>(useBooleanArray());
const childLoading2D = reactive<boolean[]>(useBooleanArray());
const childLoading3D = reactive<boolean[]>(useBooleanArray());
const booleanOr = (input: boolean[]) => {
  let ret = false;
  for (const c of input) {
    if (c) {
      ret = true;
      break;
    }
  }
  return ret;
};
watch([childsuspensing2D, childsuspensing3D], () => {
  const ret = booleanOr([...childsuspensing2D, ...childsuspensing3D]);
  emit("update:suspensing", ret);
});

watch([childLoading2D, childLoading3D], () => {
  const ret = booleanOr([...childLoading2D, ...childLoading3D]);
  emit("update:loading", ret);
});

watch(toRef(props, "suspensing"), (value) => {
  if (value) {
    childsuspensing2D.fill(true);
    childsuspensing3D.fill(true);
  }
});
watch(toRef(props, "loading"), (value) => {
  if (value) {
    childLoading2D.fill(true);
    childLoading3D.fill(true);
  }
});
if (props.topLevel) {
  let unsubscribe: () => void;
  let stopped = false;
  onMounted(() => {
    childLoading2D.fill(true);
    childLoading3D.fill(true);
    unsubscribe = useRouter().beforeEach((to, from, next) => {
      childsuspensing2D.fill(true);
      childsuspensing3D.fill(true);
      const unWatch = watch([childsuspensing2D, childsuspensing3D], () => {
        const ret = booleanOr([...childsuspensing2D, ...childsuspensing3D]);
        if (!ret) {
          unWatch();
          next();
        }
      });
    });
    const clock = new Clock();
    const render = () => {
      !stopped && requestAnimationFrame(render);
      props.renderer.clear(true, true, true);
      emit("update:time", clock.getElapsedTime());
    };
    render();
  });
  onUnmounted(() => {
    unsubscribe();
    stopped = true;
  });
}
</script>

<style scoped lang="scss">
.d-none {
  display: none;
}
</style>
