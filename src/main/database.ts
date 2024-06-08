import { app } from 'electron';
import { Sequelize, DataTypes } from 'sequelize';
import path from 'path';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(app.getPath('userData'), 'database.sqlite')
});

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  start: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end: {
    type: DataTypes.DATE,
    allowNull: false
  },
  calendarId: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

sequelize.sync();

export { Event, sequelize };