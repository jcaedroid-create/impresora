# Plan de Implementación: Migración del Stack Tecnológico

## Visión General

Migración incremental de correos-webapp desde un stack obsoleto (Meteor 1.12, AngularJS, SimpleWebSocketServer, MongoDB 4.4) hacia tecnologías modernas (Meteor 3.x, Vue 3, websockets asyncio, MongoDB 7.x). Cada fase se valida con tests antes de avanzar a la siguiente.

## Tareas

- [ ] 1. Fase 1 — Backend: MongoDB y Python/WebSocket
  - [x] 1.1 Actualizar MongoDB de 4.4 a 7.x en Docker
    - Modificar `docker-compose.yml`: cambiar imagen `mongo:4.4` a `mongo:7`
    - Crear script de migración `scripts/migrate-mongo.sh` con `mongodump`/`mongorestore`
    - Actualizar variable `MONGO_URL` si es necesario
    - Verificar que el volumen `mongo-data` se recrea correctamente
    - _Requisitos: 2.1, 2.2, 2.3, 2.4, 6.3_

  - [x] 1.2 Tests de round-trip MongoDB (Property 2)
    - **Property 2: Round-trip de documentos MongoDB**
    - Crear `tests/test_mongodb_roundtrip.js` con fast-check
    - Generar documentos arbitrarios de `config`, `orders`, `images`
    - Verificar: `read(write(doc))` devuelve documento equivalente al original
    - Mínimo 100 iteraciones
    - **Valida: Requisitos 2.1, 2.3, 7.6**

  - [x] 1.3 Tests unitarios CRUD MongoDB
    - Crear `tests/test_mongodb_crud.js` con Vitest
    - Verificar `initConfig` crea documento inicial correcto
    - Verificar `insertOrder` inserta múltiples líneas
    - Verificar `updateRollos` decrementa correctamente
    - Verificar operaciones CRUD en colecciones config, images, orders
    - _Requisitos: 2.1, 2.3, 7.1_

  - [x] 1.4 Modernizar servidor WebSocket con `websockets` (asyncio)
    - Crear `demonio/servidor_ws_nuevo.py` usando la librería `websockets`
    - Implementar clase `ServidorWebSocket` con `async def iniciar()`, `manejar_conexion()`, `procesar_mensaje()`
    - Implementar `ParseadorMensaje` con métodos `parsear()` y `serializar()` para el protocolo `*¿?*`
    - Mantener lógica de echo (responder con el mismo mensaje)
    - Ejecutar impresión con `asyncio.to_thread()` para no bloquear el event loop
    - _Requisitos: 4.1, 4.2, 4.3, 4.5, 4.6_

  - [x] 1.5 Modernizar servidor HTTP con `aiohttp` (puerto 8001)
    - Crear endpoints `/pausar` y `/reanudar` usando `aiohttp`
    - Integrar con el event loop de asyncio del servidor WebSocket
    - Ejecutar comandos CUPS (`cupsdisable`, `cupsenable`) con `asyncio.create_subprocess_exec()`
    - Manejar errores y devolver JSON con status apropiado
    - _Requisitos: 4.4, 4.5_

  - [x] 1.6 Actualizar Dockerfile.demonio a Python 3.12
    - Cambiar imagen base a `python:3.12-slim-bookworm`
    - Actualizar `requirements.txt`: `websockets`, `aiohttp`, `reportlab` (versión fija)
    - Eliminar dependencia de `SimpleWebSocketServer`
    - Verificar que `report.py` funciona con Python 3.12 y reportlab actualizado
    - _Requisitos: 5.2, 5.3, 6.1_

  - [x] 1.7 Test de round-trip del mensaje WebSocket (Property 1)
    - **Property 1: Round-trip del mensaje WebSocket (parseo ↔ serialización)**
    - Crear `tests/test_ws_roundtrip.py` con Hypothesis
    - Generar mensajes válidos de 31 campos con tipos correctos
    - Verificar: `serializar(parsear(msg)) == msg`
    - Mínimo 100 iteraciones
    - **Valida: Requisitos 3.3, 4.1, 4.6, 7.5, 8.4**

  - [x] 1.8 Test de integridad del echo WebSocket (Property 3)
    - **Property 3: Integridad del echo WebSocket**
    - Crear `tests/test_ws_echo.py` con Hypothesis
    - Generar mensajes válidos del protocolo
    - Conectar al servidor, enviar mensaje, verificar que la respuesta es idéntica
    - Mínimo 100 iteraciones
    - **Valida: Requisitos 4.3**

  - [x] 1.9 Test de resiliencia ante mensajes inválidos (Property 4)
    - **Property 4: Resiliencia ante mensajes inválidos**
    - Crear `tests/test_ws_resilience.py` con Hypothesis
    - Generar strings arbitrarios, mensajes con campos faltantes/extra
    - Verificar: servidor sigue aceptando conexiones después del mensaje inválido
    - Mínimo 100 iteraciones
    - **Valida: Requisitos 4.5**

  - [x] 1.10 Test de dimensiones de PDFs (Property 5)
    - **Property 5: Dimensiones correctas de PDFs generados**
    - Crear `tests/test_pdf_dimensions.py` con Hypothesis
    - Generar `OrdenImpresion` válidas con cantidades > 0
    - Verificar: PDFs de sellos tienen 55x25mm, tickets tienen ancho 78mm
    - Mínimo 100 iteraciones
    - **Valida: Requisitos 5.1**

- [x] 2. Checkpoint Fase 1 — Verificar backend modernizado
  - Asegurar que todos los tests pasan, preguntar al usuario si surgen dudas.
  - Crear tag de Git: `git tag v0.1-backend-modernizado`
  - Verificar que `docker-compose up` arranca MongoDB 7.x y demonio Python 3.12

- [ ] 3. Fase 2 — Actualización de Meteor 1.12 → 3.x
  - [x] 3.1 Preparar la migración de Meteor
    - Actualizar `correos-webapp/.meteor/release` a `METEOR@3.0`
    - Actualizar `correos-webapp/package.json`: eliminar dependencias de AngularJS (`angular`, `angular-animate`, `angular-aria`, `angular-material`, `angular-meteor`, `angular-ui-router`, `ng-file-upload`, `ng-img-crop`)
    - Añadir dependencias de Vue 3: `vue`, `@vitejs/plugin-vue`, `vue-router`, `vue-meteor-tracker`
    - Actualizar `@babel/runtime` y `meteor-node-stubs` a versiones compatibles con Meteor 3.x
    - _Requisitos: 1.1, 1.2_

  - [x] 3.2 Eliminar paquetes atmosféricos incompatibles
    - Eliminar de `.meteor/packages`: `pbastowski:angular-babel`, `urigo:static-templates`, `joncursi:socket-io-client`
    - Eliminar `insecure` y `autopublish` (preparar para producción)
    - Mantener: `mongo`, `tracker`, `reactive-var`, `jalik:ufs`, `jalik:ufs-gridfs`, `jalik:ufs-local`
    - Verificar compatibilidad de `lfergon:exportcsv` con Meteor 3.x o buscar alternativa
    - _Requisitos: 1.4_

  - [x] 3.3 Migrar métodos del servidor a async/await
    - Actualizar `correos-webapp/server/server_methods.js`: convertir `Meteor.methods` con `Promise.await` a `async/await` nativo
    - Actualizar `callDemonio()` para usar `fetch` nativo (Node 20) en lugar de `http.request`
    - Actualizar publicaciones en `imports/api/*/publish.js` a sintaxis async de Meteor 3.x
    - Actualizar métodos en `imports/api/*/methods.js` a sintaxis async
    - _Requisitos: 1.1, 1.2_

  - [x] 3.4 Actualizar Dockerfile.meteor para Meteor 3.x y Node 20
    - Cambiar imagen base de `geoffreybooth/meteor-base:1.12.1` a imagen compatible con Meteor 3.x
    - Asegurar que Node.js 20 LTS está disponible en la imagen
    - Actualizar comandos de build si la API de `meteor build` cambió
    - _Requisitos: 1.3, 6.1_

  - [x] 3.5 Tests de smoke para métodos del servidor
    - Crear `tests/test_meteor_methods.js` con Vitest
    - Verificar que `pausarImpresora` y `reanudarImpresora` ejecutan sin errores (con mock del demonio)
    - Verificar que `insertOrder`, `downloadXLS`, `initConfig`, `updateRollos` responden correctamente
    - _Requisitos: 1.2, 7.1_

- [-] 4. Checkpoint Fase 2 — Verificar Meteor actualizado
  - Asegurar que todos los tests pasan, preguntar al usuario si surgen dudas.
  - Crear tag de Git: `git tag v0.2-meteor-actualizado`
  - Verificar que Meteor 3.x arranca y sirve la aplicación

- [ ] 5. Fase 3 — Frontend: Vue 3 + Router + Tailwind
  - [ ] 5.1 Configurar proyecto Vue 3 dentro de Meteor
    - Instalar `vue`, `vue-router`, `vue-meteor-tracker`, `tailwindcss`, `postcss`, `autoprefixer`
    - Crear `tailwind.config.js` y `postcss.config.js`
    - Crear `correos-webapp/imports/ui/App.vue` como componente raíz
    - Crear `correos-webapp/imports/ui/router.ts` con las rutas definidas en el diseño
    - Actualizar `correos-webapp/client/main.js` para montar Vue 3 en lugar de AngularJS
    - Crear `correos-webapp/client/main.css` con directivas `@tailwind`
    - _Requisitos: 3.1, 3.2, 3.5_

  - [ ] 5.2 Implementar composables (lógica compartida)
    - Crear `imports/ui/composables/useWebSocket.ts`: conexión WebSocket, envío, recepción, reconexión con backoff
    - Crear `imports/ui/composables/useConfig.ts`: integración con `vue-meteor-tracker` y `useTracker()` para colección `config`
    - Crear `imports/ui/composables/useOrders.ts`: inserción de órdenes y descarga XLS
    - Crear `imports/ui/composables/useImages.ts`: gestión de imágenes modelo1/modelo2
    - _Requisitos: 3.3, 3.4, 3.6_

  - [ ] 5.3 Migrar componente HomeView
    - Crear `imports/ui/views/HomeView.vue`
    - Replicar funcionalidad de `imports/ui/components/home/home.html` + `home.js`
    - Usar Tailwind CSS para estilos (reemplazando Angular Material)
    - Integrar navegación con `vue-router`
    - _Requisitos: 3.1, 3.2_

  - [ ] 5.4 Migrar componente KioskoView
    - Crear `imports/ui/views/KioskoView.vue`
    - Replicar selección de sellos y cantidades desde `imports/ui/components/kiosko/kiosko.js`
    - Usar `useConfig` para datos reactivos de precios y tarifas
    - Usar `useWebSocket` para enviar mensaje de impresión con formato `*¿?*`
    - Implementar la construcción del mensaje con los 31 campos del protocolo
    - _Requisitos: 3.1, 3.3, 3.4_

  - [ ] 5.5 Migrar componente ImprimirView
    - Crear `imports/ui/views/ImprimirView.vue`
    - Replicar funcionalidad de `imports/ui/components/imprimir/imprimir.js`
    - Manejar las variaciones de plantilla de impresión (2026, América, Andorra)
    - _Requisitos: 3.1_

  - [ ] 5.6 Migrar componente MaquinaView
    - Crear `imports/ui/views/MaquinaView.vue`
    - Replicar configuración de máquina desde `imports/ui/components/maquina/maquina.js`
    - Usar `useConfig` para leer/escribir configuración de la máquina
    - _Requisitos: 3.1, 3.4_

  - [ ] 5.7 Migrar componente NavComponent
    - Crear `imports/ui/components/NavComponent.vue`
    - Replicar navegación desde `imports/ui/components/nav/nav.js`
    - Usar `<router-link>` para navegación entre vistas
    - _Requisitos: 3.1, 3.2_

  - [ ] 5.8 Migrar componente SubirImagenView e ImageCropDialog
    - Crear `imports/ui/views/SubirImagenView.vue`
    - Crear `imports/ui/components/ImageCropDialog.vue`
    - Reemplazar `ng-file-upload` con HTML5 FileReader API
    - Reemplazar `ng-img-crop` con `vue-advanced-cropper`
    - Usar `useImages` para subir imagen recortada a la colección `images`
    - _Requisitos: 3.1, 3.6_

  - [ ]* 5.9 Tests unitarios de componentes Vue 3
    - Crear tests con Vitest + `@vue/test-utils`
    - Verificar que cada componente renderiza sin errores
    - Verificar navegación entre rutas
    - Verificar que `useWebSocket` se conecta y envía mensajes
    - Verificar que `useConfig` refleja cambios reactivos
    - Verificar construcción del mensaje WebSocket con formato correcto
    - _Requisitos: 7.3_

  - [ ]* 5.10 Test PBT del protocolo WebSocket desde el frontend (Property 1 — JS)
    - **Property 1: Round-trip del mensaje WebSocket (lado frontend)**
    - Crear `tests/test_ws_protocol_frontend.ts` con fast-check
    - Generar mensajes de 31 campos con datos arbitrarios válidos
    - Verificar: `buildMessage(parseMessage(msg)) === msg`
    - Mínimo 100 iteraciones
    - **Valida: Requisitos 3.3, 7.5, 8.4**

- [ ] 6. Checkpoint Fase 3 — Verificar frontend migrado
  - Asegurar que todos los tests pasan, preguntar al usuario si surgen dudas.
  - Crear tag de Git: `git tag v0.3-frontend-vue3`
  - Verificar que la aplicación Vue 3 navega correctamente y se comunica con el WebSocket

- [ ] 7. Fase 4 — Despliegue Docker y Tests E2E
  - [ ] 7.1 Actualizar docker-compose.yml completo
    - Verificar que los tres servicios (meteor-app, demonio-python, mongo) usan imágenes actualizadas
    - Asegurar que la red `correos-net` permite comunicación entre servicios
    - Verificar que volúmenes y puertos están correctamente mapeados
    - Añadir healthcheck al servicio demonio-python
    - _Requisitos: 6.1, 6.2, 6.3, 6.4_

  - [ ] 7.2 Configurar framework de tests E2E con Playwright
    - Instalar Playwright y configurar `playwright.config.ts`
    - Crear fixtures para arrancar servicios Docker antes de los tests
    - Crear helpers para interacción WebSocket en los tests
    - _Requisitos: 7.2, 7.3_

  - [ ]* 7.3 Tests E2E del flujo completo
    - Crear `tests/e2e/flujo-completo.spec.ts`
    - Test: navegar a kiosko → seleccionar sellos → enviar orden WebSocket → verificar echo
    - Test: pausar/reanudar impresora desde la UI
    - Test: subir imagen de sello y verificar almacenamiento
    - Test: verificar que la configuración se refleja reactivamente en la UI
    - _Requisitos: 7.1, 7.2, 7.3, 7.4_

  - [ ] 7.4 Limpiar código legacy
    - Eliminar archivos de AngularJS: `imports/ui/components/afkar/`, `home/`, `kiosko/`, `imprimir/`, `maquina/`, `nav/`, `subirImagen/`, `subirImagenCrop/`
    - Eliminar `demonio/servidor-ws.py` (reemplazado por `servidor_ws_nuevo.py`)
    - Eliminar dependencias npm de AngularJS del `package.json`
    - Eliminar archivos `.less` (reemplazados por Tailwind)
    - _Requisitos: 8.2_

- [ ] 8. Checkpoint Final — Migración completa
  - Asegurar que todos los tests pasan, preguntar al usuario si surgen dudas.
  - Crear tag de Git: `git tag v1.0-migracion-completa`
  - Verificar que `docker-compose up` arranca el sistema completo con el nuevo stack
  - Documentar en README.md las nuevas versiones y cómo ejecutar el proyecto

## Notas

- Las tareas marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido
- Cada tarea referencia requisitos específicos para trazabilidad
- Los checkpoints aseguran validación incremental entre fases
- Los property-based tests validan propiedades universales de corrección
- Los tests unitarios validan ejemplos específicos y edge cases
- Git tags permiten revertir a un estado funcional previo si una fase falla (Requisito 8.3)
