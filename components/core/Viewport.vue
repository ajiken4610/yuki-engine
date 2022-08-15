<template lang="pug">
div
  Teleport(:to="element")
    .fullscreen
      slot(
        name="2d",
        :element="element",
        :time="time",
        :loadings="childLoading2D",
        :suspendings="childSuspending2D"
      )
  .d-none
    slot(
      name="3d",
      :renderer="renderer",
      :camera="camera",
      :time="time",
      :loadings="childLoading3D",
      :suspendings="childSuspending3D"
    )
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
    loading?: boolean;
    suspending?: boolean;
    topLevel?: boolean;
  }>(),
  {
    route: "/",
    element: () => document.body,
    renderer: useWebGLRenderer,
    camera: useDefaultCamera,
    time: 0,
    loading: false,
    suspending: false,
  }
);
const emit = defineEmits<{
  (e: "update:loading", val: boolean): void;
  (e: "update:suspending", val: boolean): void;
  (e: "update:time", val: number): void;
}>();
provide("element", toRef(props, "element"));
provide("renderer", toRef(props, "renderer"));
provide("camera", toRef(props, "camera"));
provide("time", toRef(props, "time"));
const childSuspending2D = reactive<boolean[]>([]);
const childSuspending3D = reactive<boolean[]>([]);
const childLoading2D = reactive<boolean[]>([]);
const childLoading3D = reactive<boolean[]>([]);
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
watch(
  [childSuspending2D, childSuspending3D],
  () => {
    const ret = booleanOr([...childSuspending2D, ...childSuspending3D]);
    emit("update:suspending", ret);
  },
  { deep: true }
);

watch(
  [childLoading2D, childLoading3D],
  () => {
    const ret = booleanOr([...childLoading2D, ...childLoading3D]);
    emit("update:loading", ret);
  },
  { deep: true }
);

watch(toRef(props, "suspending"), (value) => {
  if (value) {
    childSuspending2D.fill(true);
    childSuspending3D.fill(true);
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
      childSuspending2D.fill(true);
      childSuspending3D.fill(true);
      const unWatch = watch(
        [childSuspending2D, childSuspending3D],
        () => {
          const ret = booleanOr([...childSuspending2D, ...childSuspending3D]);
          if (!ret) {
            unWatch();
            next();
          }
        },
        { deep: true }
      );
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
