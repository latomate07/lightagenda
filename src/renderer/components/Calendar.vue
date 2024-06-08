<template>
  <tui-calendar
    class="my-calendar"
    ref="calendarRef"
    view="week"
    :use-form-popup="true"
    :use-detail-popup="true"
    :week="options.week"
    :calendars="views"
    @beforeCreateEvent="onBeforeCreateSchedule"
    @beforeUpdateEvent="onBeforeUpdateSchedule"
    @beforeDeleteEvent="onBeforeDeleteSchedule"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import TuiCalendar from 'toast-ui-calendar-vue3';
import 'toast-ui-calendar-vue3/dist/style.css';

const calendarRef = ref(null);

const options = computed(() => ({
  week: {
    dayNames: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    startDayOfWeek: 1,
    narrowWeekend: false,
    workweek: false,
    showNowIndicator: true,
    showTimezoneCollapseButton: false,
    timezonesCollapsed: false,
    hourStart: 0,
    hourEnd: 24,
    eventView: ['time'],
    taskView: false,
    collapseDuplicateEvents: true,
  },
}));

const views = computed(() => ([
  {
    id: 'home',
    name: 'Home',
    backgroundColor: '#69ff7061',
    borderColor: '#69ff7061',
    dragBackgroundColor: '#69ff7061',
  },
  {
    id: 'work',
    name: 'Work',
    backgroundColor: '#2d9fff61',
    borderColor: '#2d9fff61',
    dragBackgroundColor: '#2d9fff61',
  },
]));

const createNewSchedule = () => {
  const calendarInstance = calendarRef.value.getInstance();
  calendarInstance.openCreationPopup({
    start: new Date(),
    end: new Date(new Date().getTime() + 60 * 60 * 1000),
  });
};

const toggleViewAll = () => {
  const calendarInstance = calendarRef.value.getInstance();
  calendarInstance.toggleSchedules(calendarInstance.getOptions().calendars.map(c => c.id), true);
};

onMounted(async () => {
  const calendarInstance = calendarRef.value.getInstance();
  const events = await window.api.getEvents();

  events.forEach(event => {
    calendarInstance.createSchedules([{
      id: event.id,
      calendarId: event.calendarId,
      title: event.title,
      category: 'time',
      start: event.start,
      end: event.end,
    }]);
  });
});

const onBeforeCreateSchedule = async (event) => {
  console.log('something happended');
  
  const newEvent = {
    title: event.title,
    start: event.start,
    end: event.end,
    calendarId: event.calendarId,
  };
  const createdEvent = await window.api.addEvent(newEvent);

  const calendarInstance = calendarRef.value.getInstance();
  calendarInstance.createSchedules([{
    id: createdEvent.id,
    calendarId: createdEvent.calendarId,
    title: createdEvent.title,
    category: 'time',
    start: createdEvent.start,
    end: createdEvent.end,
  }]);
};

const onBeforeUpdateSchedule = async (event) => {
  const updatedEvent = {
    id: event.schedule.id,
    title: event.schedule.title,
    start: event.start,
    end: event.end,
    calendarId: event.schedule.calendarId,
  };
  const eventToUpdate = await window.api.updateEvent(updatedEvent);

  const calendarInstance = calendarRef.value.getInstance();
  calendarInstance.updateSchedule(eventToUpdate.id, eventToUpdate.calendarId, {
    title: eventToUpdate.title,
    start: eventToUpdate.start,
    end: eventToUpdate.end,
  });
};

const onBeforeDeleteSchedule = async (event) => {
  await window.api.deleteEvent(event.schedule.id);

  const calendarInstance = calendarRef.value.getInstance();
  calendarInstance.deleteSchedule(event.schedule.id, event.schedule.calendarId);
};
</script>

<style>
.my-calendar {
  border: solid 1px #eee;
  border-radius: 4px;
  height: 100vh;
}
</style>