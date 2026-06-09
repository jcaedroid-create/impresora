# IMPRESORA CORREOS

Aplicación web para gestión de impresión de sellos con impresora USB, desarrollada con Meteor 1.4 y AngularJS.

## Archivos cambiados
- kiosko.js - import/ui/component/kiosko
- main.js - server/
- server_methods.js - server

## LOGS
** You've set up some data subscriptions with Meteor.publish(), but
** you still have autopublish turned on. Because autopublish is still
** on, your Meteor.publish() calls won't have much effect. All data
** will still be sent to all clients.
**
** Turn off autopublish by removing the autopublish package:
**
**   $ meteor remove autopublish
**
** .. and make sure you have Meteor.publish() and Meteor.subscribe() calls
** for each collection that you want clients to see.

/Users/afkar/.meteor/packages/meteor-tool/.1.4.3_2.1nlov6q++os.osx.x86_64+web.browser+web.cordova/mt-os.osx.x86_64/dev_bundle/server-lib/node_modules/fibers/future.js:280
						throw(ex);
						^

Error: A method named 'pausarImpresora' is already defined
    at packages/ddp-server/livedata_server.js:1581:15
    at Function._.each._.forEach (packages/underscore.js:147:22)
    at [object Object]._.extend.methods (packages/ddp-server/livedata_server.js:1577:7)
    at meteorInstall.server.server_methods.js (server/server_methods.js:9:8)
    at fileEvaluate (packages/modules-runtime.js:197:9)
    at require (packages/modules-runtime.js:120:16)
    at /Users/afkar/afkar/correos/correos-webapp/.meteor/local/build/programs/server/app/app.js:702:1
    at /Users/afkar/afkar/correos/correos-webapp/.meteor/local/build/programs/server/boot.js:303:34
    at Array.forEach (native)
    at Function._.each._.forEach (/Users/afkar/.meteor/packages/meteor-tool/.1.4.3_2.1nlov6q++os.osx.x86_64+web.browser+web.cordova/mt-os.osx.x86_64/dev_bundle/server-lib/node_modules/underscore/underscore.js:79:11)
Exited with code: 1
Your application is crashing. Waiting for file change.

---

## Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/TU_REPOSITORIO.git
cd TU_REPOSITORIO
```

---

## Requisitos previos

- **Node.js** (v4 o v6, compatible con Meteor 1.4)
- **Meteor 1.4.3.2**
- **Python 3** (para ejecutar los tests sin Meteor)

### Instalar Meteor

```bash
curl https://install.meteor.com/ | sh
```

Verificar instalación:

```bash
meteor --version
```

---

## Instalar dependencias

```bash
cd correos-webapp
npm install
```

---

## Ejecutar la aplicación en local

```bash
cd correos-webapp
meteor run
```

---

## Configurar la impresora

La impresora USB se configura en `correos-webapp/server/main.js`.

Para obtener el nombre de tu impresora:

```bash
lpstat -p
```

Luego edita la constante `PRINTER_NAME` en `server/main.js` con el nombre que aparezca.

---

## Ejecutar tests (sin impresora ni Meteor)

Los tests usan Python con pytest y mockean las llamadas a CUPS. No necesitas impresora conectada ni Meteor instalado.

```bash
cd correos-webapp
./tests/run-tests.sh
```

El script crea automáticamente un entorno virtual `.venv`, instala las dependencias y ejecuta los tests.

---

## Guardar y subir cambios

### 1. Ver qué archivos has modificado

```bash
git status
```

### 2. Añadir los cambios

```bash
# Añadir todos los archivos modificados
git add .

```

### 3. Crear un commit con mensaje descriptivo

```bash
git commit -m "Descripción breve del cambio"
```

### 4. Subir los cambios a GitHub

```bash
git push origin main
```

> Si trabajas en una rama:
> ```bash
> git checkout -b mi-rama
> git push -u origin mi-rama
> ```

---

## Obtener cambios del compañero

```bash
git pull origin main
```

Si hay conflictos, resuélvelos manualmente, luego:

```bash
git add .
git commit -m "Resolver conflictos"
git push origin main
```

---

## Estructura del proyecto

```
├── correos-webapp/                # Aplicación web (Meteor + AngularJS)
│   ├── client/                    # Código del cliente
│   │   ├── index.html             # Página principal
│   │   ├── main.js                # Punto de entrada del cliente
│   │   └── main.less              # Estilos globales
│   ├── server/
│   │   └── main.js                # Métodos del servidor (pausar/reanudar impresora)
│   ├── imports/
│   │   ├── api/                   # Lógica de datos (colecciones MongoDB)
│   │   │   ├── config/            # Configuración de la máquina (precios, rollos, eventos)
│   │   │   ├── images/            # Gestión de imágenes de sellos
│   │   │   └── orders/            # Registro de pedidos/ventas
│   │   └── ui/components/         # Componentes de la interfaz
│   │       ├── kiosko/            # Pantalla principal del kiosko (selección y venta de sellos)
│   │       ├── imprimir/          # Vista de impresión de sellos
│   │       ├── home/              # Página de inicio
│   │       └── afkar/             # Configuración/administración
│   ├── tests/                     # Tests (Python/pytest, no requiere Meteor)
│   │   ├── run-tests.sh           # Script para ejecutar tests
│   │   ├── requirements.txt       # Dependencias Python
│   │   └── test_printer.py        # Tests de pausa/reanudación con mocks
│   ├── .meteor/                   # Configuración de Meteor
│   └── package.json               # Dependencias npm
│
├── demonio/                       # Demonio Python (servidor WebSocket + impresión)
│   ├── servidor-ws.py             # Servidor WebSocket que recibe órdenes de la webapp
│   │                              #   y envía los PDFs a la impresora Brother vía CUPS
│   ├── report.py                  # Genera los PDFs de sellos/tickets a partir de los datos
│   ├── pausar_impresora.py        # Script para pausar la impresora (cupsdisable)
│   ├── reanudar_impresora.py      # Script para reanudar la impresora (cupsenable)
│   ├── activar_spool.py           # Activa la cola de impresión
│   ├── desactivar_spool.py        # Desactiva la cola de impresión
│   ├── *.png                      # Imágenes de diseños de sellos (fondos, motivos)
│   ├── *.ttf                      # Fuentes tipográficas (Franklin Gothic)
│   ├── *.pdf                      # PDFs generados (sellos, tickets, tiras)
│   ├── ANTERIOR/                  # Versiones anteriores de scripts (histórico)
│   └── docs/                      # Documentación y archivos de prueba
│
└── README.md                      # Este archivo
```

### Flujo de funcionamiento

1. La **webapp** (Meteor) se ejecuta en el navegador y muestra el kiosko.
2. Cuando el usuario pulsa imprimir, la webapp envía un mensaje por **WebSocket** (`ws://169.254.128.40:8000/`).
3. El **demonio** (`servidor-ws.py`) recibe el mensaje, genera los PDFs con `report.py` y los envía a la impresora Brother a través de **CUPS** (`lp`).
4. Los botones de pausar/reanudar ejecutan `cupsdisable`/`cupsenable` para controlar la cola de impresión.

---

## Notas importantes

- La constante `PRINTER_NAME` en `server/main.js` debe coincidir con el nombre real de la impresora (usar `lpstat -p`).
- Los botones de Pausar/Reanudar están en la vista del kiosko (`imports/ui/components/kiosko/kiosko.html`).
- La comunicación con la impresora de sellos se hace vía WebSocket a `ws://169.254.128.40:8000/`.
