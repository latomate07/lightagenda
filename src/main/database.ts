import { Sequelize, DataTypes } from 'sequelize';
import path from 'path';

const databaseDir = path.join(__dirname, '../../sqlite');
const databasePath = path.join(databaseDir, 'database.sqlite');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: databasePath
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