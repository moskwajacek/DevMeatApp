import { AsyncStorage, } from 'react-native';

import EE from 'eventemitter';

export const events = new EE.EventEmitter();

let itemsArr = [];

export const addNote = (data) => {
  data.lastUpdate = new Date();
  if (!data.id) data.id = `note-${itemsArr.length + 1}`;
  return updateNote(data);
};

export const updateNote = (data) => {
  data.lastUpdate = new Date();
  return AsyncStorage.setItem(data.id, JSON.stringify(data)).then(() => {
    events.emit('newData');
    return data;
  });
};

export const removeNote = ({ id }) => {
  return AsyncStorage.removeItem(id).then(() => {
    events.emit('newData');
  });
};

export const getNotes = () => {
  return AsyncStorage.getAllKeys().then((keys) => {
    const notesKeys = keys.filter((key) => key.indexOf('note') === 0);
    return AsyncStorage.multiGet(notesKeys).then((items) => {
      return itemsArr = items.map((item) => JSON.parse(item[1]));
    }).catch((err) => {
      console.log(err);
    });
  });
};