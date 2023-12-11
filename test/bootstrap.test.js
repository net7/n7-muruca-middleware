/* eslint-disable no-undef */
const { spawn } = require('child_process');
const slsOfflineTestConfig = require('./support/slsOfflineTestConfig');

let slsOfflineProcess;

before(function (done) {
  // increase mocha timeout for this hook to allow sls offline to start
  this.timeout(30000);

  console.log('[Tests Bootstrap] Start');

  startSlsOffline(function (err) {
    if (err) {
      return done(err);
    }

    console.log('[Tests Bootstrap] Done');
    done();
  });
});

after(function () {
  console.log('[Tests Teardown] Start');

  stopSlsOffline();

  console.log('[Tests Teardown] Done');
});

// Helper functions

function startSlsOffline(done) {
  slsOfflineProcess = spawn('sls', [
    'offline',
    'start',
    '--noAuth',
    '--httpPort',
    slsOfflineTestConfig.getSlsOfflinePort(),
  ]);

  console.log(
    `Serverless: Offline started with PID : ${slsOfflineProcess.pid}`,
  );

  /* slsOfflineProcess.stdout.on('data', data => {
        if (data.includes('server ready')) {
            console.log(data.toString().trim());
            done();
        }
    });

    slsOfflineProcess.stderr.on('data', errData => {
        console.log(`Error starting Serverless Offline:\n${errData}`);
        done(errData);
    });*/
  done();
}

function stopSlsOffline() {
  slsOfflineProcess.kill();
  console.log('Serverless Offline stopped');
}
