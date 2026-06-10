import { Meteor } from 'meteor/meteor';

const { execSync } = require('child_process');

// Nombre de la impresora - configurable via variable de entorno PRINTER_NAME
const PRINTER_NAME = process.env.PRINTER_NAME || 'Brother_4520_1';

Meteor.methods({
  pausarImpresora() {
    try {
      execSync(`cupsdisable -r "Pausada por el usuario" ${PRINTER_NAME}`);
      return 'Impresora pausada correctamente';
    } catch (e) {
      throw new Meteor.Error('printer-error', `Error al pausar: ${e.message}`);
    }
  },

  reanudarImpresora() {
    try {
      execSync(`cupsenable ${PRINTER_NAME}`);
      return 'Impresora reanudada correctamente';
    } catch (e) {
      throw new Meteor.Error('printer-error', `Error al reanudar: ${e.message}`);
    }
  }
});
