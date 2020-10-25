import * as appClusterStorage from 'app-cluster-storage';
import * as cbor from 'cbor';
import { outbox } from 'file-transfer';

const cluster = appClusterStorage.get('my.alphabet.cluster');
if (cluster !== null) {
  const data = {
    letter: cluster.getItem('letter'),
  };

  outbox.enqueue('cluster.cbor', cbor.encode(data))
    .then(() => console.log('cluster sent'))
    .catch((error) => console.log(`send error: ${error}`));
} else {
  console.error('App Cluster Storage is unavailable.');
}
