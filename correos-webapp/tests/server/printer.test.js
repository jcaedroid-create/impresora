import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';
import sinon from 'sinon';

// Mock de child_process
const childProcess = require('child_process');

if (Meteor.isServer) {
  describe('Métodos de impresora', function () {
    let execStub;

    beforeEach(function () {
      // Stub de exec para simular respuestas del sistema
      execStub = sinon.stub(childProcess, 'exec');
    });

    afterEach(function () {
      execStub.restore();
    });

    describe('pausarImpresora', function () {
      it('debería pausar la impresora correctamente', function () {
        // Simular ejecución exitosa de cupsdisable
        execStub.callsFake((cmd, callback) => {
          assert.include(cmd, 'cupsdisable');
          callback(null, 'OK', '');
        });

        const result = Meteor.call('pausarImpresora');
        assert.equal(result, 'Impresora pausada correctamente');
        assert.isTrue(execStub.calledOnce);
      });

      it('debería lanzar error si cupsdisable falla', function () {
        // Simular error en la ejecución
        execStub.callsFake((cmd, callback) => {
          callback(new Error('cupsdisable: impresora no encontrada'), '', 'cupsdisable: impresora no encontrada');
        });

        assert.throws(() => {
          Meteor.call('pausarImpresora');
        }, Meteor.Error);
      });

      it('debería usar el nombre de impresora correcto en el comando', function () {
        execStub.callsFake((cmd, callback) => {
          // Verificar que el comando contiene el nombre de la impresora entre comillas
          assert.match(cmd, /cupsdisable ".*"/);
          callback(null, '', '');
        });

        Meteor.call('pausarImpresora');
        assert.isTrue(execStub.calledOnce);
      });
    });

    describe('reanudarImpresora', function () {
      it('debería reanudar la impresora correctamente', function () {
        // Simular ejecución exitosa de cupsenable
        execStub.callsFake((cmd, callback) => {
          assert.include(cmd, 'cupsenable');
          callback(null, 'OK', '');
        });

        const result = Meteor.call('reanudarImpresora');
        assert.equal(result, 'Impresora reanudada correctamente');
        assert.isTrue(execStub.calledOnce);
      });

      it('debería lanzar error si cupsenable falla', function () {
        // Simular error en la ejecución
        execStub.callsFake((cmd, callback) => {
          callback(new Error('cupsenable: impresora no encontrada'), '', 'cupsenable: impresora no encontrada');
        });

        assert.throws(() => {
          Meteor.call('reanudarImpresora');
        }, Meteor.Error);
      });

      it('debería usar el nombre de impresora correcto en el comando', function () {
        execStub.callsFake((cmd, callback) => {
          // Verificar que el comando contiene el nombre de la impresora entre comillas
          assert.match(cmd, /cupsenable ".*"/);
          callback(null, '', '');
        });

        Meteor.call('reanudarImpresora');
        assert.isTrue(execStub.calledOnce);
      });
    });

    describe('Integración pausar y reanudar', function () {
      it('debería poder pausar y luego reanudar', function () {
        let printerState = 'running';

        execStub.callsFake((cmd, callback) => {
          if (cmd.includes('cupsdisable')) {
            printerState = 'paused';
            callback(null, '', '');
          } else if (cmd.includes('cupsenable')) {
            printerState = 'running';
            callback(null, '', '');
          }
        });

        Meteor.call('pausarImpresora');
        assert.equal(printerState, 'paused');

        Meteor.call('reanudarImpresora');
        assert.equal(printerState, 'running');
      });
    });
  });
}
