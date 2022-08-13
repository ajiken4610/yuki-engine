<template lang="pug">
div
  CoreViewport(v-model:suspending="suspending")
    template(#2d)
      div hello
    template(#3d="{renderer,camera,time}")
      div {{time}}
</template>

<script setup lang="ts">
const suspending = ref(false);
</script>
