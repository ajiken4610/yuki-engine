<template lang="pug">
CoreObject3D(:renderer="renderer" :camera="camera" :scene="scene" :time="time"
  :suspensing="suspensing" @update:suspensing="$emit('update:suspensing',$event)"
  :loading="loading" @update:loading="$emit('update:loading',$event)"
)
</template>

<script setup lang="ts">
import {
  BoxBufferGeometry,
  Camera,
  Material,
  Mesh,
  MeshNormalMaterial,
  Scene,
  WebGLRenderer,
} from "three";

const props = withDefaults(
  defineProps<{
    renderer: WebGLRenderer;
    camera: Camera;
    time?: number;
    suspensing?: boolean;
    loading?: boolean;
    sizeX?: number;
    sizeY?: number;
    sizeZ?: number;
  }>(),
  {
    time: 0,
    sizeX: 1,
    sizeY: 1,
    sizeZ: 1,
  }
);
const emit = defineEmits<{
  (e: "update:suspensing", val: boolean);
  (e: "update:loading", val: boolean);
}>();
const o = useGLObjects() as {
  material?: Material;
  geometory?: BoxBufferGeometry;
  mesh?: Mesh;
};
const scene = ref(new Scene());
o.material = new MeshNormalMaterial();
o.geometory = new BoxBufferGeometry(props.sizeX, props.sizeY, props.sizeZ);
o.mesh = new Mesh(o.geometory, o.material);
scene.value.add(o.mesh);
onUnmounted(() => {
  finalizeGLObjects(o);
});
</script>
