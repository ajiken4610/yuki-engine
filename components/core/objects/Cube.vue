<template lang="pug">
CoreObject3D(
  v-bind="$props",
  v-on="useEmitExtender($emit, ['update:loading', 'update:suspensing'])",
  :scene="scene"
)
</template>

<script setup lang="ts">
import {
  BoxBufferGeometry,
  Material,
  Mesh,
  MeshNormalMaterial,
  Scene,
  Vector3,
} from "three";

const props = withDefaults(
  defineProps<{
    size?: Vector3;
  }>(),
  {
    size: () => new Vector3(1, 1, 1),
  }
);
defineEmits<{
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
o.geometory = new BoxBufferGeometry(props.size.x, props.size.y, props.size.z);
o.mesh = new Mesh(o.geometory, o.material);
scene.value.add(o.mesh);
onUnmounted(() => {
  finalizeGLObjects(o);
});
</script>
