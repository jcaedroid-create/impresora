# Tests

## Ejecutar los tests

```bash
# Desde la carpeta correos-webapp
npm test
```

## Descripción

- `server/printer.test.js` — Tests de los métodos de pausar/reanudar impresora con mocks (no requiere impresora física conectada).

## Requisitos

```bash
npm install --save-dev chai sinon
```

Los tests mockean el módulo `child_process.exec` para simular las respuestas de CUPS sin necesidad de tener una impresora real.
