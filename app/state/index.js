import { inbox } from 'file-transfer';
import * as filesystem from 'fs';
import * as jpeg from 'jpeg';

const state = {
  letter: '',
  location: '',
  toggle: false,
  photo: null,
  // add other state-items here
};

// set callback so you can interact with this in your views
// could be optimised though, as it calls for every updated value, so not specific
let callback = null;

export function setStateCallback(cb) {
  callback = cb;
}

export function removeStateCallback() {
  callback = null;
}

// save state to local storage on watch so it's always avaialble at start of app
function updateState() {
  filesystem.writeFileSync('state.txt', state, 'json');
}

// load state on start of app
function loadState() {
  try {
    const loadedState = filesystem.readFileSync('state.txt', 'json');
    Object.keys(state).forEach((key) => {
      if (typeof loadedState[key] != 'undefined') state[key] = loadedState[key];
    });
  } catch (err) {
    console.error(`Failed loading state: ${err}`);
  }
}

// get and set items from within app
export function getStateItem(key) {
  return state[key];
}

export function setStateItem(key, value) {
  state[key] = value;
  updateState();
}

// process file transfer files
function processFiles() {
  let fileName;
  while ((fileName = inbox.nextFile())) {
    if (fileName === 'settings.cbor') {
      const data = filesystem.readFileSync(fileName, 'cbor');

      Object.keys(state).forEach((key) => {
        if (typeof data[key] !== 'undefined') state[key] = data[key];
      });

      updateState();
      if (callback) callback();
    } else if (fileName === 'location.cbor') {
      const data = filesystem.readFileSync(fileName, 'cbor');

      state.location = data.location;

      updateState();
      if (callback) callback();
    } else {
      if (state.photo) {
        filesystem.unlinkSync(state.photo);
      }
      const outFileName = `${fileName}.txi`;
      jpeg.decodeSync(fileName, outFileName);
      filesystem.unlinkSync(fileName);
      state.photo = `/private/data/${outFileName}`;

      console.log(state.photo);

      updateState();
      if (callback) callback();
    }
  }
}

// set up
export function init() {
  loadState();
  processFiles();
  inbox.addEventListener('newfile', processFiles);
}
