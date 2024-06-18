<template>
    <div class="calendar-container">
        <div id="calendar" ref="calendarRef"></div>
    </div>
</template>

<script setup>
import Calendar from 'tui-calendar';
import "tui-calendar/dist/tui-calendar.css";
import { ref, onMounted, watch } from 'vue';
import moment from 'moment';

const calendarRef = ref(null);
let calendarInstance = null;

const events = ref([]);
const props = defineProps({
    views: Array,
    createNewSchedule: Boolean,
});

const createNewScheduleRef = ref(props.createNewSchedule);
const currentDate = ref('');
const updateCurrentDate = () => {
    if (calendarInstance) {
        const viewName = calendarInstance.getViewName();
        let date = calendarInstance.getDate();

        if (viewName === 'week' || viewName === 'day') {
            currentDate.value = moment(date).format('YYYY.MM.DD');
        } else if (viewName === 'month') {
            currentDate.value = moment(date).format('YYYY.MM');
        }
    }
};

// Handle events loading from database
const loadEvents = async () => {
    const loadedEvents = await window.api.getEvents();
    loadedEvents.forEach(event => {
        calendarInstance.createSchedules([{
            id: event.dataValues?.id,
            calendarId: event.dataValues?.calendarId,
            title: event.dataValues?.title,
            category: 'time',
            start: moment(event.dataValues?.start).toISOString(),
            end: moment(event.dataValues?.end).toISOString(),
        }]);
    });
};

// Handle Schedule Creating
const onBeforeCreateSchedule = async (event) => {
    console.log('Event data received:', event);

    const newEvent = {
        title: event.title,
        start: moment(event.start._date).format('YYYY-MM-DD HH:mm:ss'),
        end: moment(event.end._date).format('YYYY-MM-DD HH:mm:ss'),
        calendarId: '1',
    };

    console.log('Formatted event data:', newEvent);

    const createdEvent = await window.api.addEvent(newEvent);

    // Ajouter l'événement créé au calendrier
    calendarInstance.createSchedules([{
        id: createdEvent.dataValues?.id,
        calendarId: createdEvent.dataValues?.calendarId,
        title: createdEvent.dataValues?.title,
        category: 'time',
        start: moment(createdEvent.dataValues?.start).toISOString(),
        end: moment(createdEvent.dataValues?.end).toISOString(),
    }]);
};

// Handle Schedule Updating
const onBeforeUpdateSchedule = async (event) => {
    console.log('Event data to update:', event);

    const updatedEvent = {
        id: event.changes.id ?? event.schedule.id,
        title: event.changes.title ?? event.schedule.title,
        start: moment(event.start._date).format('YYYY-MM-DD HH:mm:ss'),
        end: moment(event.end._date).format('YYYY-MM-DD HH:mm:ss'),
        calendarId: event.changes.calendarId ?? event.schedule.calendarId,
    };

    console.log('Formatted event data for update:', updatedEvent);

    const result = await window.api.updateEvent(updatedEvent);

    if (result) {
        console.log("result updated:", result);
        calendarInstance.updateSchedule(result.dataValues?.id, result.dataValues?.calendarId, {
            start: moment(result.dataValues?.start).toISOString(),
            end: moment(result.dataValues?.end).toISOString(),
            title: result.dataValues?.title,
        });
    }
};

// Handle Schedule Deleting
const onBeforeDeleteSchedule = async (event) => {
    console.log('Event data to delete:', event);

    const eventId = event.schedule.id;

    const result = await window.api.deleteEvent(eventId);

    if (result) {
        calendarInstance.deleteSchedule(eventId, event.schedule.calendarId);
    }
};

onMounted(() => {
    calendarInstance = new Calendar(calendarRef.value, {
        usageStatistics: false,
        defaultView: 'week',
        isReadOnly: false,
        taskView: false,
        startDayOfWeek: 0,
        narrowWeekend: true,
        workweek: false,
        showNowIndicator: true,
        showTimezoneCollapseButton: true,
        timezonesCollapsed: false,
        hourStart: 0,
        hourEnd: 24,
        eventView: ['time'],
        taskView: false,
        collapseDuplicateEvents: true,
        useCreationPopup: true,
        useDetailPopup: true,
        calendars: props.views,
        week: {
            daynames: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
        },
        template: {
            time: function (schedule) {
                return `<strong>${schedule.title}</strong> <br> ${moment(schedule.start.getTime()).format('HH:mm')} - ${moment(schedule.end.getTime()).format('HH:mm')}`;
            },
            monthDayname: function (model) {
                return '<span class="tui-full-calendar-dayname-name">' + model.monthName + '</span>';
            },
        },
    });
    loadEvents();

    // Listen events for the calendar
    calendarInstance.on('beforeCreateSchedule', onBeforeCreateSchedule);
    calendarInstance.on('beforeUpdateSchedule', onBeforeUpdateSchedule);
    calendarInstance.on('beforeDeleteSchedule', onBeforeDeleteSchedule);

    // Update current date
    updateCurrentDate();
});

// Handle auto new schedule creating
const openCreatePopupAtNow = () => {
    console.log("something happenned");
    if (calendarInstance) {
        const now = new Date();
        calendarInstance.openCreationPopup({
            start: now,
            end: new Date(now.getTime() + 30 * 60 * 1000), // Durée par défaut de 30 minutes
            isAllDay: false
        });
    }
};

watch(createNewScheduleRef,
(newCreateNewEvent, oldCreateNewEvent) => {
    console.log("something happenned");

    if(newCreateNewEvent) {
        openCreatePopupAtNow();
    }
});
</script>

<style scoped>
.calendar-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100%;
}

.calendar-controls {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 10px;
    background: #f9f9f9;
    border-bottom: 1px solid #ddd;
}

.calendar-controls button {
    margin-right: 10px;
    padding: 5px 10px;
    border: none;
    border-radius: 4px;
    background: #e0e0e0;
    cursor: pointer;
}

.calendar-controls .calendar-date {
    font-size: 1.2em;
    font-weight: bold;
}

#calendar {
    flex: 1;
}

#calendar .toastui-calendar-layout {
    display: grid;
    grid-template: 45px minmax(0, 1fr) / minmax(0, 1fr);
}

#calendar .toastui-calendar-panel {
    height: 100% !important;
}

#calendar .toastui-calendar-panel.toastui-calendar-day-view-day-names,
#calendar .toastui-calendar-panel.toastui-calendar-week-view-day-names,
#calendar .toastui-calendar-panel.toastui-calendar-month-view-day-names {
    overflow: auto;
}

#calendar .toastui-calendar-panel.toastui-calendar-time {
    overflow: hidden;
}

#calendar .toastui-calendar-timegrid {
    height: 100%;
    min-height: 540px;
}

#calendar .toastui-calendar-column .toastui-calendar-events {
    margin-right: 0 !important;
}

#calendar .toastui-calendar-column .toastui-calendar-grid-selection {
    box-sizing: border-box;
    width: calc(100% - 2px);
}

.tui-full-calendar-time-guide-creation {
    width: 100% !important;
}

#calendar .tui-full-calendar-time-date-schedule-block-wrap {
    margin-right: 0px !important;
}
</style>