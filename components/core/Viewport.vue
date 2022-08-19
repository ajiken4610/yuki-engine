<template lang="pug">
div
  Teleport(:to="element")
    .fullscreen
      slot(
        name="2d",
        :element="element",
        :time="time",
        :loadings="loadings",
        :suspendings="suspendings",
        :objectCounts="objectCounts"
      )
  .d-none
    slot(
      name="3d",
      :time="time",
      :loadings="loadings",
      :suspendings="suspendings",
      :objectCounts="objectCounts"
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
    loading?: number;
    suspending?: number;
    topLevel?: boolean;
  }>(),
  {
    route: "/",
    element: () => document.body,
    renderer: useWebGLRenderer,
    camera: useDefaultCamera,
    time: 0,
    loading: 0,
    suspending: 0,
    objectCount: 0,
  }
);
const emit = defineEmits<{
  (e: "update:loading", val: number): void;
  (e: "update:suspending", val: number): void;
  (e: "update:objectCount", val: number): void;
  (e: "update:time", val: number): void;
}>();
provide("element", toRef(props, "element"));
provide("renderer", toRef(props, "renderer"));
provide("camera", toRef(props, "camera"));
provide("time", toRef(props, "time"));

const objectCounts = reactive<number[]>([]);
const loadings = reactive<number[]>([]);
const suspendings = reactive<number[]>([]);
watch(toRef(props, "suspending"), (value) => {
  if (value) {
    suspendings.fill(-1);
  }
});
watch(toRef(props, "loading"), (value) => {
  if (value) {
    loadings.fill(-1);
  }
});
watch(
  objectCounts,
  () => {
    let ret = 0;
    objectCounts.forEach((value) => (ret += value));
    emit("update:objectCount", ret);
  },
  { deep: true }
);
watch(
  loadings,
  () => {
    let ret = 0;
    loadings.forEach((value) => (ret += value));
    emit("update:loading", ret);
  },
  { deep: true }
);

watch(
  suspendings,
  () => {
    let ret = 0;
    suspendings.forEach((value) => (ret += value));
    emit("update:suspending", ret);
  },
  { deep: true }
);

if (props.topLevel) {
  let unsubscribe: () => void;
  let stopped = false;
  onMounted(() => {
    loadings.fill(-1);
    unsubscribe = useRouter().beforeEach((to, from, next) => {
      suspendings.fill(-1);
      const unWatch = watch(toRef(props, "suspending"), () => {
        const ret = props.suspending;
        if (ret === 0) {
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
