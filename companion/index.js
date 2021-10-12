import * as cbor from 'cbor';
import { outbox } from 'file-transfer';
import { settingsStorage } from 'settings';
import { geolocation } from 'geolocation';
import { apiKey } from './keys';
import { device } from 'peer';
import { Image } from 'image';

settingsStorage.setItem('screenWidth', device.screen.width);
settingsStorage.setItem('screenHeight', device.screen.height);

/* Settings */
function sendSettings(evt) {
  if (evt.key === 'background-image') {
    compressAndTransferImage(evt.newValue);
    // We now have our image data in: imageData.imageUri

    return;
  }

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

function compressAndTransferImage(settingsValue) {
  const imageData = JSON.parse(settingsValue);
  Image.from(imageData.imageUri)
    .then((image) =>
      image.export('image/jpeg', {
        background: '#000000',
        quality: 40,
      }),
    )
    .then((buffer) => outbox.enqueue(`${Date.now()}.jpg`, buffer))
    .then((fileTransfer) => {
      console.log(`Enqueued ${fileTransfer.name}`);
    });
}

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
