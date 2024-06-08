import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  addEvent: (eventData: any) => ipcRenderer.invoke('add-event', eventData),
  getEvents: () => ipcRenderer.invoke('get-events'),
  updateEvent: (eventData: any) => ipcRenderer.invoke('update-event', eventData),
  deleteEvent: (eventId: number) => ipcRenderer.invoke('delete-event', eventId)
});
