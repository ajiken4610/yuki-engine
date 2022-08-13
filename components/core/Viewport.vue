<template lang="pug">
div
  Teleport(:to="element")
    .fullscreen
      slot(name="2d" :element="element" :time="time" :suspendings="childSuspending2D")
  .d-none
    slot(name="3d" :renderer="renderer" :camera="camera" :time="time" :suspendings="childSuspending3D")
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
    suspending: boolean;
    topLevel?: boolean;
  }>(),
  {
    route: "/",
    element: () => document.body,
    renderer: useWebGLRenderer,
    camera: useDefaultCamera,
    time: 0,
    suspending: false,
  }
);
const emit = defineEmits<{
  (e: "update:suspending", val: boolean): void;
  (e: "update:time", val: number): void;
}>();
const childSuspending2D = reactive<boolean[]>([]);
const childSuspending3D = reactive<boolean[]>([]);
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
watch([childSuspending2D, childSuspending3D], () => {
  const ret = booleanOr([...childSuspending2D, ...childSuspending3D]);
  emit("update:suspending", ret);
});

watch(toRef(props, "suspending"), (value) => {
  if (value) {
    childSuspending2D.fill(true);
    childSuspending3D.fill(true);
  }
});
if (props.topLevel) {
  let unsubscribe: () => void;
  let stopped = false;
  onMounted(() => {
    unsubscribe = useRouter().beforeEach((to, from, next) => {
      childSuspending2D.fill(true);
      childSuspending3D.fill(true);
      const unWatch = watch([childSuspending2D, childSuspending3D], () => {
        const ret = booleanOr([...childSuspending2D, ...childSuspending3D]);
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
