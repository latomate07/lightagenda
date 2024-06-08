import {app, BrowserWindow, ipcMain, session} from 'electron';
import {join} from 'path';
import { Event } from './database';

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 800,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  if (process.env.NODE_ENV === 'development') {
    const rendererPort = process.argv[2];
    mainWindow.loadURL(`http://localhost:${rendererPort}`);
  }
  else {
    mainWindow.loadFile(join(app.getAppPath(), 'renderer', 'index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ['script-src \'self\'']
      }
    })
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

ipcMain.handle('add-event', async (event, eventData) => {
  const newEvent = await Event.create(eventData);
  return newEvent;
});

ipcMain.handle('get-events', async () => {
  const events = await Event.findAll();
  return events;
});

ipcMain.handle('update-event', async (event, updatedEventData) => {
  const eventToUpdate = await Event.findByPk(updatedEventData.id);
  if (eventToUpdate) {
    await eventToUpdate.update(updatedEventData);
    return eventToUpdate;
  }
  return null;
});

ipcMain.handle('delete-event', async (event, eventId) => {
  const eventToDelete = await Event.findByPk(eventId);
  if (eventToDelete) {
    await eventToDelete.destroy();
    return true;
  }
  return false;
});