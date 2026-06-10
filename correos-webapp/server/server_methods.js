import { Meteor } from 'meteor/meteor';

const http = require('http');

// URL del demonio Python (dentro de Docker, se comunican por el nombre del servicio)
const DEMONIO_HOST = process.env.DEMONIO_HOST || 'demonio-python';
const DEMONIO_PORT = process.env.DEMONIO_PORT || 8001;

function callDemonio(path) {
  return new Promise(function(resolve, reject) {
    const options = {
      hostname: DEMONIO_HOST,
      port: DEMONIO_PORT,
      path: path,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    };

    const req = http.request(options, function(res) {
      let data = '';
      res.on('data', function(chunk) { data += chunk; });
      res.on('end', function() {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(data));
        }
      });
    });

    req.on('error', function(e) {
      reject(e);
    });

    req.on('timeout', function() {
      req.abort();
      reject(new Error('Timeout al conectar con el demonio'));
    });

    req.end();
  });
}

Meteor.methods({
  pausarImpresora() {
    try {
      const result = Promise.await(callDemonio('/pausar'));
      return result.message;
    } catch (e) {
      throw new Meteor.Error('printer-error', 'Error al pausar: ' + e.message);
    }
  },

  reanudarImpresora() {
    try {
      const result = Promise.await(callDemonio('/reanudar'));
      return result.message;
    } catch (e) {
      throw new Meteor.Error('printer-error', 'Error al reanudar: ' + e.message);
    }
  }
});
