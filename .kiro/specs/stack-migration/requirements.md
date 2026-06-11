# Documento de Requisitos — Migración del Stack Tecnológico

## Introducción

Este documento define los requisitos para migrar el stack tecnológico de la aplicación "correos-webapp" (sistema de kiosko para impresión de sellos postales). La aplicación actualmente usa tecnologías obsoletas que requieren actualización o sustitución para garantizar mantenibilidad, seguridad y soporte a largo plazo.

### Estado actual del stack

| Tecnología | Versión actual | Estado |
|---|---|---|
| Meteor | 1.12.1 | Obsoleto (actual: 3.x) |
| Node.js | 12 | EOL (actual: 20 LTS) |
| MongoDB | 4.4 | EOL (actual: 7.x) |
| AngularJS | 1.5.8 | EOL desde 2022, sustituir |
| Angular Material | 1.1.1 | EOL (dependiente de AngularJS) |
| angular-ui-router | 0.3.1 | EOL (dependiente de AngularJS) |
| Python | 3.10 | Soportado (actual: 3.12) |
| SimpleWebSocketServer | última | Obsoleto/sin mantenimiento, sustituir |
| reportlab | última | Soportado, actualizar |

### Estrategia de migración

- **Actualizar**: Meteor, Node.js, MongoDB, Python, reportlab
- **Sustituir**: AngularJS → framework moderno (React/Vue/Svelte), Angular Material → librería CSS moderna, angular-ui-router → router del nuevo framework, SimpleWebSocketServer → websockets (biblioteca estándar de Python) o FastAPI WebSockets

## Glosario

- **Sistema_Web**: La aplicación web correos-webapp que ejecuta la interfaz de kiosko para selección y venta de sellos
- **Servidor_WebSocket**: El demonio Python que recibe órdenes de impresión vía WebSocket y genera PDFs
- **Generador_PDF**: El módulo report.py que utiliza reportlab para crear PDFs de sellos y tickets
- **Sistema_Impresión**: El subsistema completo (Servidor_WebSocket + Generador_PDF + CUPS) que procesa órdenes de impresión
- **Pipeline_CI**: El proceso automatizado de construcción, test y despliegue con Docker
- **Colecciones_MongoDB**: Las colecciones de datos (config, images, orders) almacenadas en MongoDB
- **Componentes_UI**: Los componentes de interfaz de usuario (afkar, home, kiosko, imprimir, maquina, nav, subirImagen, subirImagenCrop)

## Requisitos

### Requisito 1: Actualización de Meteor y Node.js

**Historia de usuario:** Como desarrollador, quiero actualizar Meteor a la versión estable más reciente (3.x) y Node.js a la versión LTS correspondiente, para que la aplicación tenga soporte activo y acceso a correcciones de seguridad.

#### Criterios de aceptación

1. WHEN el Sistema_Web se construye con Meteor 3.x, THE Sistema_Web SHALL arrancar correctamente y servir la aplicación en el puerto configurado
2. WHEN el Sistema_Web se ejecuta con la nueva versión de Node.js, THE Sistema_Web SHALL ejecutar todos los métodos del servidor (pausarImpresora, reanudarImpresora, insertOrder, downloadXLS) sin errores
3. WHEN el Sistema_Web se despliega con Docker, THE Pipeline_CI SHALL construir la imagen Docker con Meteor 3.x y Node.js 20 LTS en menos de 15 minutos
4. IF la actualización de Meteor produce incompatibilidades en paquetes atmosféricos (pbastowski:angular-babel, urigo:static-templates, joncursi:socket-io-client), THEN THE Sistema_Web SHALL sustituir dichos paquetes por alternativas compatibles con Meteor 3.x

### Requisito 2: Actualización de MongoDB

**Historia de usuario:** Como desarrollador, quiero actualizar MongoDB de la versión 4.4 a la versión 7.x, para que la base de datos tenga soporte activo y mejoras de rendimiento.

#### Criterios de aceptación

1. WHEN las Colecciones_MongoDB se migran a MongoDB 7.x, THE Sistema_Web SHALL leer y escribir datos en las colecciones config, images y orders sin modificar la lógica de aplicación
2. WHEN el Pipeline_CI despliega MongoDB 7.x, THE Colecciones_MongoDB SHALL preservar todos los documentos existentes tras la migración
3. WHEN el Sistema_Web ejecuta operaciones CRUD sobre MongoDB 7.x, THE Sistema_Web SHALL completar las operaciones con el mismo comportamiento funcional que en MongoDB 4.4
4. IF la migración de MongoDB produce errores de compatibilidad en el driver, THEN THE Sistema_Web SHALL actualizar el driver de MongoDB a una versión compatible con MongoDB 7.x

### Requisito 3: Sustitución de AngularJS por framework moderno

**Historia de usuario:** Como desarrollador, quiero sustituir AngularJS 1.5 (EOL) por un framework frontend moderno, para que la interfaz de usuario sea mantenible, tenga soporte activo y pueda evolucionar.

#### Criterios de aceptación

1. THE Sistema_Web SHALL renderizar todos los Componentes_UI (afkar, home, kiosko, imprimir, maquina, nav, subirImagen, subirImagenCrop) utilizando el nuevo framework frontend
2. WHEN el usuario navega entre vistas (home, kiosko, imprimir, maquina), THE Sistema_Web SHALL gestionar las rutas con el router nativo del nuevo framework sin recargar la página
3. WHEN el usuario interactúa con el kiosko para seleccionar sellos y cantidades, THE Sistema_Web SHALL enviar el mensaje de impresión al Servidor_WebSocket con el mismo formato de protocolo actual (campos separados por "*¿?*")
4. WHEN el componente kiosko muestra precios y tarifas, THE Sistema_Web SHALL obtener los datos reactivamente desde las Colecciones_MongoDB
5. THE Sistema_Web SHALL aplicar estilos de interfaz utilizando una librería CSS moderna (sustituyendo Angular Material) que proporcione componentes de botón, tarjeta, diálogo y navegación
6. WHEN el usuario sube una imagen de sello, THE Sistema_Web SHALL permitir recortar la imagen y almacenarla en la colección images

### Requisito 4: Sustitución de SimpleWebSocketServer

**Historia de usuario:** Como desarrollador, quiero sustituir SimpleWebSocketServer (sin mantenimiento) por una solución WebSocket moderna en Python, para que el servidor de impresión sea estable, seguro y mantenible.

#### Criterios de aceptación

1. WHEN el Sistema_Web envía un mensaje WebSocket al Servidor_WebSocket, THE Servidor_WebSocket SHALL recibir y parsear el mensaje con el mismo protocolo de campos separados por "*¿?*"
2. WHEN el Servidor_WebSocket recibe un mensaje válido, THE Servidor_WebSocket SHALL invocar al Generador_PDF y ejecutar la impresión de sellos, tickets y tiras
3. WHEN el Servidor_WebSocket recibe un mensaje válido, THE Servidor_WebSocket SHALL responder al cliente con el mismo mensaje recibido (echo)
4. WHILE el Servidor_WebSocket está activo, THE Servidor_WebSocket SHALL servir conexiones WebSocket en el puerto 8000 y comandos HTTP (pausar/reanudar) en el puerto 8001
5. IF el Servidor_WebSocket recibe un mensaje con formato inválido, THEN THE Servidor_WebSocket SHALL registrar el error en el log sin interrumpir el servicio
6. WHEN se ejecuta el parseado del mensaje, THE Servidor_WebSocket SHALL extraer correctamente todos los campos (id_cliente, id_producto, fecha_sello, evento_sello, cantidades, precios, datos empresa, modos de impresión)

### Requisito 5: Actualización de Python y reportlab

**Historia de usuario:** Como desarrollador, quiero actualizar Python a 3.12 y reportlab a la última versión estable, para aprovechar mejoras de rendimiento y mantener compatibilidad.

#### Criterios de aceptación

1. WHEN el Generador_PDF genera un PDF de sello con reportlab actualizado, THE Generador_PDF SHALL producir un PDF válido con las mismas dimensiones (55x25mm para sellos, 78xNmm para tickets)
2. WHEN el Servidor_WebSocket se ejecuta con Python 3.12, THE Servidor_WebSocket SHALL procesar mensajes WebSocket y generar PDFs sin errores de compatibilidad
3. WHEN el Pipeline_CI construye la imagen Docker del demonio, THE Pipeline_CI SHALL usar Python 3.12 como imagen base

### Requisito 6: Actualización del despliegue Docker

**Historia de usuario:** Como desarrollador, quiero actualizar los Dockerfiles y docker-compose.yml para reflejar las nuevas versiones del stack, para que el despliegue sea reproducible y consistente.

#### Criterios de aceptación

1. WHEN el Pipeline_CI ejecuta docker-compose up, THE Pipeline_CI SHALL arrancar los tres servicios (meteor-app, demonio-python, mongo) con las versiones actualizadas
2. WHEN los servicios están arrancados, THE Sistema_Web SHALL comunicarse con el Servidor_WebSocket a través de la red Docker (correos-net)
3. WHEN los servicios están arrancados, THE Sistema_Web SHALL conectarse a MongoDB 7.x mediante la variable de entorno MONGO_URL
4. THE Pipeline_CI SHALL mantener los volúmenes de datos (mongo-data) compatibles entre versiones para no perder datos en producción

### Requisito 7: Verificación y testing en cada fase de migración

**Historia de usuario:** Como desarrollador, quiero que cada paso de la migración tenga tests que verifiquen que la funcionalidad se mantiene, para detectar regresiones inmediatamente.

#### Criterios de aceptación

1. WHEN se actualiza MongoDB, THE Pipeline_CI SHALL ejecutar tests que verifiquen operaciones CRUD en las colecciones config, images y orders
2. WHEN se sustituye el Servidor_WebSocket, THE Pipeline_CI SHALL ejecutar tests que verifiquen el parseado del mensaje WebSocket y la generación de PDFs
3. WHEN se sustituye AngularJS, THE Pipeline_CI SHALL ejecutar tests que verifiquen la navegación entre vistas y la reactividad de datos
4. WHEN se actualiza el Generador_PDF, THE Pipeline_CI SHALL ejecutar tests que verifiquen que los PDFs generados tienen dimensiones y contenido correcto
5. FOR ALL mensajes válidos del protocolo WebSocket, el parseo seguido de serialización SHALL producir un objeto equivalente al original (propiedad round-trip)
6. FOR ALL documentos válidos de configuración, escribir y leer de MongoDB SHALL devolver un documento equivalente al original (propiedad round-trip)

### Requisito 8: Migración incremental con compatibilidad hacia atrás

**Historia de usuario:** Como desarrollador, quiero que la migración se realice de forma incremental y reversible, para minimizar el riesgo de interrupciones en producción.

#### Criterios de aceptación

1. THE Pipeline_CI SHALL permitir ejecutar la versión anterior y la nueva versión en paralelo durante la fase de transición
2. WHEN se completa una fase de migración, THE Pipeline_CI SHALL generar un tag de Git que marque el estado funcional verificado
3. IF una fase de migración produce errores irrecuperables, THEN THE Pipeline_CI SHALL permitir revertir al tag anterior sin pérdida de datos
4. THE Sistema_Web SHALL mantener el mismo protocolo de comunicación WebSocket (formato "*¿?*") durante toda la migración para garantizar compatibilidad entre componentes migrados y no migrados
