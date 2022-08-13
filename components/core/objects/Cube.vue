<template lang="pug">
CoreObject3D(:renderer="renderer" :camera="camera" :scene="scene" :time="time" :suspending="suspending" @update:suspending="$emit('update:suspending',$event)")
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
    suspending: boolean;
    sizeX?: number;
    sizeY?: number;
    sizeZ?: number;
  }>(),
  {
    time: 0,
    suspending: false,
    sizeX: 1,
    sizeY: 1,
    sizeZ: 1,
  }
);
defineEmits<{ (e: "update:suspending", val: boolean) }>();
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
