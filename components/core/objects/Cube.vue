<template lang="pug">
CoreObject3D(
  v-bind="$props",
  v-on="useUpdateExtender($emit, ['loading', 'suspending', 'objectCount', 'needsUpdate'])",
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
    material?: Material;
  }>(),
  {
    material: () => new MeshNormalMaterial(),
  }
);
defineEmits<{
  (e: "update:suspending", val: number);
  (e: "update:loading", val: number);
  (e: "update:objectCount", val: number);
  (e: "update:needsUpdate", val: boolean);
}>();
const o = useGLObjects() as {
  material?: Material;
  geometory?: BoxBufferGeometry;
  mesh?: Mesh;
};
const scene = ref(new Scene());
o.material = props.material;
o.geometory = new BoxBufferGeometry(1, 1, 1);
o.mesh = new Mesh(o.geometory, o.material);
scene.value.add(o.mesh);
onUnmounted(() => {
  finalizeGLObjects(o);
});
watch(toRef(props, "material"), () => {
  o.material = props.material;
  o.mesh.material = o.material;
});
</script>
