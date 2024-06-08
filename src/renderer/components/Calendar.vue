<template>
    <div ref="calendar" style="height: 100%;"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import Calendar from 'tui-calendar';
import 'tui-calendar/dist/tui-calendar.css';

const calendar = ref(null);
const calendarEl = ref(null);

onMounted(() => {
    calendar.value = new Calendar(calendarEl.value, {
        defaultView: 'month',
        taskView: false,
        scheduleView: true,
        useCreationPopup: true,
        useDetailPopup: true,
        template: {
            monthDayname: function (dayname) {
                return '<span class="calendar-week-dayname-name">' + dayname.label + '</span>';
            }
        },
        calendars: [
            {
                id: '1',
                name: 'Calendrier Personnel',
                color: '#ffffff',
                bgColor: '#9e5fff',
                dragBgColor: '#9e5fff',
                borderColor: '#9e5fff'
            }
        ]
    });

    // Ajouter des événements de démonstration
    calendar.value.createSchedules([
        {
            id: '1',
            calendarId: '1',
            title: 'Événement Démonstration',
            category: 'time',
            dueDateClass: '',
            start: '2024-06-08T10:30:00+09:00',
            end: '2024-06-08T12:30:00+09:00'
        }
    ]);
});
</script>

<style scoped>
.calendar-week-dayname-name {
    color: #333;
    font-size: 13px;
    font-weight: bold;
}
</style>