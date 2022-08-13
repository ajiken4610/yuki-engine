<template lang="pug">
div
  Teleport(:to="element")
    .fullscreen
      slot(name="2d" :element="element" :time="time" :loadings="childLoading2D" :suspensings="childSuspensing2D")
  .d-none
    slot(name="3d" :renderer="renderer" :camera="camera" :time="time" :loadings="childLoading3D" :suspensings="childSuspensing3D")
</template>

<script setup lang="ts">
import { WebGLRenderer, Camera, Clock } from "three";
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
const childSuspensing2D = reactive<boolean[]>(useBooleanArray());
const childSuspensing3D = reactive<boolean[]>(useBooleanArray());
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
watch([childSuspensing2D, childSuspensing3D], () => {
  const ret = booleanOr([...childSuspensing2D, ...childSuspensing3D]);
  emit("update:suspensing", ret);
});

watch([childLoading2D, childLoading3D], () => {
  console.log(childLoading3D);
  const ret = booleanOr([...childLoading2D, ...childLoading3D]);
  emit("update:loading", ret);
});

watch(toRef(props, "suspensing"), (value) => {
  if (value) {
    childSuspensing2D.fill(true);
    childSuspensing3D.fill(true);
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
      childSuspensing2D.fill(true);
      childSuspensing3D.fill(true);
      const unWatch = watch([childSuspensing2D, childSuspensing3D], () => {
        const ret = booleanOr([...childSuspensing2D, ...childSuspensing3D]);
        if (!ret) {
          unWatch();
          next();
        }
      });
    });
    const clock = new Clock();
    const render = () => {
      !stopped && requestAnimationFrame(render);
      //stopped = true;
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
