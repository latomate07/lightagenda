<template>
  <div class="app-container">
    <Sidebar @create-schedule="handleCreateSchedule" @toggle-view-all="handleToggleViewAll" />
    <Calendar ref="calendarComponent" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Sidebar from './components/Sidebar.vue';
import Calendar from './components/Calendar.vue';

const calendarComponent = ref(null);

const handleCreateSchedule = () => {
  calendarComponent.value.createNewSchedule();
};

const handleToggleViewAll = () => {
  calendarComponent.value.toggleViewAll();
};
</script>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
}
</style>