// ============================================================
// SNIPPET: Añadir estos métodos al controlador de Kiosko
// (donde están imprimirProtocolo, imprimirFilatelia, etc.)
// ============================================================

// Pausar la impresora
this.pausarImpresora = () => {
  Meteor.call('pausarImpresora', (err, res) => {
    if (err) {
      console.error('Error al pausar impresora:', err);
      // Puedes usar $mdToast o $mdDialog en vez de alert para mejor UX
      alert('Error al pausar la impresora: ' + err.reason);
    } else {
      alert(res);
    }
  });
};

// Reanudar la impresora
this.reanudarImpresora = () => {
  Meteor.call('reanudarImpresora', (err, res) => {
    if (err) {
      console.error('Error al reanudar impresora:', err);
      alert('Error al reanudar la impresora: ' + err.reason);
    } else {
      alert(res);
    }
  });
};
