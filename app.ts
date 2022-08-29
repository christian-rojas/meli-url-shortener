/* eslint-disable @typescript-eslint/no-floating-promises */

import { bootstrap } from './bootstrap';
import { cpus } from 'os';
import cluster from 'cluster';

export async function App() {
  require('newrelic');
  const numWorkers = cpus().length;
  if (cluster.isPrimary && numWorkers === 1) {
    console.log(`primary ${process.pid} is running, numWorkers = ${numWorkers}`);
    for (let i = 0; i < numWorkers; i++) {
      cluster.fork();
    }

    cluster.on('exit', function (worker: any) {
      console.log(`worker ${worker.process.pid} died`);
    });
  } else {
    console.log(`worker ${process.pid} started`);
    await bootstrap();
  }
}

App();
