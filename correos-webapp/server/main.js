import '../imports/api/config';
import '../imports/api/images';
import '../imports/api/orders';

import { Config } from '../imports/api/config/collection';

if (Config.find().count() == 0){
	Meteor.call("initConfig");	
}

import { exec } from 'child_process';
import { Meteor } from 'meteor/meteor';

const { exec } = require('child_process');
const path = require('path');

// Nombre de la impresora - ajustar según tu configuración
const PRINTER_NAME = 'HP_LaserJet_Pro';

Meteor.methods({
  pausarImpresora() {
    const future = new Future();

    exec(`cupsdisable -r "Pausada por el usuario" ${PRINTER_NAME}`, (error, stdout, stderr) => {
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

    exec(`cupsenable ${PRINTER_NAME}`, (error, stdout, stderr) => {
      if (error) {
        future.throw(new Meteor.Error('printer-error', `Error al reanudar: ${stderr || error.message}`));
      } else {
        future.return('Impresora reanudada correctamente');
      }
    });

    return future.wait();
  }
});

// Fibers/Future para operaciones async en Meteor
const Future = Npm.require('fibers/future');