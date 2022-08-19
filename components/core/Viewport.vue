<template lang="pug">
div
  Teleport(:to="element")
    .fullscreen
      slot(
        name="2d",
        :element="element",
        :time="time",
        :loadings="childLoading",
        :suspendings="childSuspending"
      )
  .d-none
    slot(
      name="3d",
      :renderer="renderer",
      :camera="camera",
      :time="time",
      :loadings="childLoading",
      :suspendings="childSuspending"
    )
</template>

<script setup lang="ts">
import { WebGLRenderer, Camera, Clock, LoadingManager } from "three";
const props = withDefaults(
  defineProps<{
    route?: string;
    element?: HTMLElement;
    renderer?: WebGLRenderer;
    camera?: Camera;
    time: number;
    loading?: boolean;
    suspending?: boolean;
    objectCount?: number;
    loadingCount?: number;
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
    objectCount: 0,
    loadingCount: 0,
  }
);
const emit = defineEmits<{
  (e: "update:loading", val: boolean): void;
  (e: "update:suspending", val: boolean): void;
  (e: "update:objectCount", val: number): void;
  (e: "update:loadingCount", val: number): void;
  (e: "update:time", val: number): void;
}>();
provide("element", toRef(props, "element"));
provide("renderer", toRef(props, "renderer"));
provide("camera", toRef(props, "camera"));
provide("time", toRef(props, "time"));
const childSuspending = reactive<boolean[]>([]);
const childLoading = reactive<boolean[]>([]);
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
  childSuspending,
  () => {
    const ret = booleanOr(childSuspending);
    emit("update:suspending", ret);
  },
  { deep: true }
);

watch(
  childLoading,
  () => {
    const ret = booleanOr(childLoading);
    emit("update:loading", ret);
  },
  { deep: true }
);

watch(toRef(props, "suspending"), (value) => {
  if (value) {
    childSuspending.fill(true);
  }
});
watch(toRef(props, "loading"), (value) => {
  if (value) {
    childLoading.fill(true);
  }
});

const objectCounts: number[] = [];
const loadingCounts: number[] = [];
watch(
  [objectCounts, childLoading],
  () => {
    let ret = 0;
    childLoading.forEach(() => ret++);
    objectCounts.forEach((value) => (ret += value));
    emit("update:objectCount", ret);
  },
  { deep: true }
);
watch(
  [loadingCounts, childLoading],
  () => {
    let ret = 0;
    childLoading.forEach((value) => value && ret++);
    loadingCounts.forEach((value) => (ret += value));
    emit("update:loadingCount", ret);
  },
  { deep: true }
);

if (props.topLevel) {
  let unsubscribe: () => void;
  let stopped = false;
  onMounted(() => {
    childLoading.fill(true);
    unsubscribe = useRouter().beforeEach((to, from, next) => {
      childSuspending.fill(true);
      const unWatch = watch(
        childSuspending,
        () => {
          const ret = booleanOr(childSuspending);
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
