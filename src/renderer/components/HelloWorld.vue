<script setup lang="ts">
import { ref } from 'vue'

defineProps({
  msg: String,
})

const count = ref(0)
</script>

<template>
  <h1 class="text-3xl font-bold underline text-red-500">
    Hello world!
  </h1>
  <p class="text-red-800">Another test - with color</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
