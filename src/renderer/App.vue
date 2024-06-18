<template>
  <div class="app-container">
    <Sidebar @create-schedule="handleCreateSchedule" @toggle-view-all="handleToggleViewAll" :views="views" />
    <Calendar :views="views" :createNewSchedule="createNewSchedule" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Sidebar from './components/Sidebar.vue';
import Calendar from './components/Calendar.vue';

const views = computed(() => ([
  {
    id: 'travail',
    name: 'Travail',
    backgroundColor: '#2d9fff61',
    borderColor: '#2d9fff61',
    dragBackgroundColor: '#2d9fff61',
  },
  {
    id: 'famille',
    name: 'Famille',
    backgroundColor: '#ff5583'
  },
  {
    id: 'amis',
    name: 'Amis',
    backgroundColor: '#03bd9e'
  },
  {
    id: 'voyage',
    name: 'Voyage',
    backgroundColor: '#bbdc00'
  },
  {
    id: 'divers',
    name: 'Divers',
    backgroundColor: '#9d9d9d'
  },
  {
    id: 'anniversaires',
    name: 'Anniversaires',
    backgroundColor: '#ffbb3b'
  },
  {
    id: 'joursFeries',
    name: 'Jours Fériés',
    backgroundColor: '#ff4040'
  }
]));
const createNewSchedule = ref(false);

const handleCreateSchedule = () => {
  createNewSchedule.value = true;
};

const handleToggleViewAll = () => {
  createNewSchedule.value = true;
};
</script>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}
</style>