import { Meteor } from 'meteor/meteor';

const { exec } = require('child_process');
const Future = Npm.require('fibers/future');

// Nombre de la impresora - ajustar según tu configuración
const PRINTER_NAME = 'Brother_4520_1';

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