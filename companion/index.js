import * as cbor from 'cbor';
import { outbox } from 'file-transfer';
import { settingsStorage } from 'settings';
import { geolocation } from 'geolocation';
import { apiKey } from './keys';

/* Settings */
function sendSettings() {
  console.log(settingsStorage.getItem('letter'));
  console.log(settingsStorage.getItem('toggle'));
  const settings = {
    letter: settingsStorage.getItem('letter')
      ? JSON.parse(settingsStorage.getItem('letter')).values[0].value
      : '',
    toggle: settingsStorage.getItem('toggle')
      ? JSON.parse(settingsStorage.getItem('toggle'))
      : false,
    // add other settings here
  };

  outbox
    .enqueue('settings.cbor', cbor.encode(settings))
    .then(() => console.log('settings sent'))
    .catch((error) => console.log(`send error: ${error}`));
}

settingsStorage.addEventListener('change', sendSettings);

/* MapBox */
geolocation.getCurrentPosition(locationSuccess, locationError, {
  timeout: 60 * 1000,
});

async function locationSuccess(position) {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${position.coords.longitude},${position.coords.latitude}.json?access_token=${apiKey}`;

  const response = await fetch(url);
  const json = await response.json();

  let location = '';
  json.features.forEach((feature) => {
    if (
      !location &&
      (feature.place_type[0] === 'locality' ||
        feature.place_type[0] === 'place')
    ) {
      location = feature.text;
    }
  });

  outbox
    .enqueue('location.cbor', cbor.encode({ location }))
    .then(() => console.log(location + ' as location sent'))
    .catch((error) => console.log(`send error: ${error}`));
}

function locationError(error) {
  console.log('Error: ' + error.code, 'Message: ' + error.message);
}
