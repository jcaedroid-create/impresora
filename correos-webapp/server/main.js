import '../imports/api/config';
import '../imports/api/images';
import '../imports/api/orders';

import { Meteor } from 'meteor/meteor';
import { Config } from '../imports/api/config/collection';

const { exec } = require('child_process');
const Future = Npm.require('fibers/future');

if (Config.find().count() == 0){
	Meteor.call("initConfig");	
}

// TODO: Cambiar por el nombre real de la impresora USB.
// Para obtener el nombre correcto, ejecutar en terminal: lpstat -p
const PRINTER_NAME = 'HP_LaserJet_Pro';

Meteor.methods({
  pausarImpresora() {
    const future = new Future();

    exec(`cupsdisable "${PRINTER_NAME}"`, (error, _stdout, stderr) => {
      if (error) {
        future.throw(new Meteor.Error('printer-error', `Error al pausar: ${stderr || error.message}`));
      } else {
        future.return('Impresora pausada correctamente');
      }
    });

    return future.wait();
  },

  reanudarImpresora() {
    const future = new Future();

    exec(`cupsenable "${PRINTER_NAME}"`, (error, _stdout, stderr) => {
      if (error) {
        future.throw(new Meteor.Error('printer-error', `Error al reanudar: ${stderr || error.message}`));
      } else {
        future.return('Impresora reanudada correctamente');
      }
    });

    return future.wait();
  }
});