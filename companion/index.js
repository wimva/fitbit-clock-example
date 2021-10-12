import * as cbor from 'cbor';
import { outbox } from 'file-transfer';
import { settingsStorage } from 'settings';

/* Settings */
function sendSettings() {
  const settings = {
    letter: settingsStorage.getItem('letter')
      ? JSON.parse(settingsStorage.getItem('letter')).values[0].value
      : '',
    // add other settings here
  };

  outbox
    .enqueue('settings.cbor', cbor.encode(settings))
    .then(() => console.log('settings sent'))
    .catch((error) => console.log(`send error: ${error}`));
}

settingsStorage.addEventListener('change', sendSettings);
