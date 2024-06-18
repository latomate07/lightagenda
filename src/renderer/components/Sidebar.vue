<template>
  <div class="sidebar">
    <button class="new-schedule" @click="createNewSchedule">New schedule</button>
    <div class="calendar-views">
      <label><input type="checkbox" checked @change="toggleViewAll"> View all</label>
      <ul>
        <li v-for="view in views" :key="view.id">
          <span :style="{ backgroundColor: view.backgroundColor }"></span> {{ view.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits([
  'create-schedule', 
  'toggle-view-all'
]);
const props = defineProps({
  views: Array,
});

const createNewSchedule = () => {
  emit('create-schedule');
};

const toggleViewAll = () => {
  emit('toggle-view-all');
};
</script>

<style scoped>
.sidebar {
  width: 200px;
  padding: 10px;
  background: #f9f9f9;
  border-right: 1px solid #ddd;
  height: 100vh;
  box-sizing: border-box;
}

.new-schedule {
  display: block;
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  background: #ff5722;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.calendar-views {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
}

.calendar-views label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
}

.calendar-views ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.calendar-views li {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.calendar-views span {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 10px;
}
</style>