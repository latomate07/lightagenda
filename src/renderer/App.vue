<template>
  <div class="appContainer">
    <h1>LightAgenda</h1>
    <Calendar />
  </div>
</template>

<script setup>
import Calendar from './components/Calendar.vue';
</script>

<style scoped>
.appContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}
</style>