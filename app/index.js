import document from 'document';
import clock from 'clock';
import { preferences } from 'user-settings';
import { init as initState, getStateItem, setStateCallback } from './state';
import zeroPad from './utils/zero-pad';

// init state
initState();

// elements
const $letter = document.getElementById('letter');
const $time = document.getElementById('time');

// time
clock.granularity = 'minutes'; // seconds if you like to show seconds or update stats every second
function updateTime(datetime) {
  const minute = datetime.getMinutes();
  const hour = datetime.getHours();
  let hours = hour;
  if (preferences.clockDisplay === '12h') {
    // 12h format
    hours = zeroPad(hours % 12 || 12);
  } else {
    // 24h format
    hours = zeroPad(hours);
  }
  const mins = zeroPad(minute);

  $time.text = `${hours}:${mins}`;
}
clock.ontick = (evt) => updateTime(evt.date);
updateTime(new Date());

// draw
function draw() {
  $letter.text = getStateItem('letter');
}

setStateCallback(draw);
draw();
