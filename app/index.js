// via de imports halen we vanalles binnen.
import document from 'document';
import clock from 'clock';
import { preferences } from 'user-settings';
import { HeartRateSensor } from 'heart-rate';
import { today } from 'user-activity';
import { init as initState, getStateItem, setStateCallback } from './state';
import zeroPad from './utils/zero-pad';

// init state
initState();

// elementen vastnemen. $ = een variabele van een element
const $letter = document.getElementById('letter'); // dit is een element
const $time = document.getElementById('time');
const $hr = document.getElementById('hr');
const $steps = document.getElementById('steps');
const $calories = document.getElementById('calories');

// define vars for later use;
let time = ''; // de v airbale waarin je uiteindelijk de tekst gaat steken //dit is effectief de tijd
let hr = '--';

// get heart rate
if (HeartRateSensor) {
  const hrm = new HeartRateSensor({ frequency: 1 });
  hrm.addEventListener('reading', () => {
    hr = hrm.heartRate;
  });
  hrm.start();
}

// draw
function draw() {
  //alles wat getekent word komt apaprt in deze draw funcite te staan
  $time.text = time;
  $letter.text = getStateItem('letter');
  $hr.text = hr;
  $steps.text = today.adjusted.steps;
  $calories.text = today.adjusted.calories;
}

// time
clock.granularity = 'seconds'; // seconden zorgt ervoor dat de klok elke seconde geupdate word, dit kan ook minutes og
function updateTime(datetime) {
  const minute = datetime.getMinutes(); //halen de minuten op
  const hour = datetime.getHours(); //halen het uur op
  let hours = hour;
  if (preferences.clockDisplay === '12h') {
    //hier word er 12 of 24hs model bepaald //de prefereces komen van de user settings op de gsm applicatie van fitbit
    // 12h format
    hours = zeroPad(hours % 12 || 12); //zeropad zorgt ervoor dat er altijd 0 staat als het getal kleiner is al 10 vb, 10h en 5min is toont het 10:05 ips 10:5
  } else {
    // 24h format
    hours = zeroPad(hours); //zeropad importeren we bovenaan de pagina, vanuit utils
  }
  const mins = zeroPad(minute);
  time = `${hours}:${mins}`;

  // draw every second to show time changes
  draw();
}

clock.ontick = (evt) => updateTime(evt.date); //elke seconde komt de klok in deze functie terecht //date object word automtisch gegenereerd en terug gegeven

updateTime(new Date()); //dit gaat de tijd al oproepen vanaf de start

// draw whenever a change in state happens
setStateCallback(draw);

// draw when code loaded
draw();
