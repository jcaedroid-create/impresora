# Guía Docker — Correos Webapp

## Índice

1. [Resumen del proyecto](#resumen-del-proyecto)
2. [Arquitectura Docker](#arquitectura-docker)
3. [Requisitos](#requisitos)
4. [Comandos principales](#comandos-principales)
5. [Primer uso (build inicial)](#primer-uso-build-inicial)
6. [Uso diario](#uso-diario)
7. [Actualizar tras cambios en el código](#actualizar-tras-cambios-en-el-código)
8. [Problemas resueltos durante el setup](#problemas-resueltos-durante-el-setup)
9. [Compatibilidad con Windows](#compatibilidad-con-windows)
10. [Características de la aplicación](#características-de-la-aplicación)

---

## Resumen del proyecto

La aplicación está compuesta por 3 servicios que corren en contenedores Docker:

| Servicio | Tecnología | Puerto | Función |
|----------|-----------|--------|---------|
| `meteor-app` | Meteor 1.12.1 + Node 12 + Angular 1.x | 3000 | Aplicación web principal |
| `mongo` | MongoDB 4.4 | 27017 | Base de datos |
| `demonio-python` | Python 2.7 + WebSocket | 8000 | Servidor WebSocket para impresora (CUPS) |

---

## Arquitectura Docker

```
┌─────────────────────────────────────────────────────┐
│                  docker-compose.yml                   │
├─────────────────┬──────────────┬────────────────────┤
│   meteor-app    │    mongo     │  demonio-python    │
│   :3000         │   :27017     │    :8000           │
│                 │              │                     │
│  Dockerfile.    │  mongo:4.4   │  Dockerfile.       │
│  meteor         │  (imagen     │  demonio           │
│                 │   oficial)   │                     │
├─────────────────┴──────────────┴────────────────────┤
│                  red: correos-net                     │
└─────────────────────────────────────────────────────┘
```

### Dockerfile.meteor (single-stage)

Usa la imagen `geoffreybooth/meteor-base:1.12.1` que ya incluye:
- Meteor 1.12.1
- Node 12 (compatible con fibers)
- Herramientas de compilación (make, g++, python)

Pasos del build:
1. Instala dependencias npm del proyecto
2. Ejecuta `meteor build` para generar un bundle de producción
3. Instala dependencias del bundle (incluyendo `@babel/runtime`)
4. Copia el bundle a `/app` y arranca con `node main.js`

### Dockerfile.demonio

Imagen Python 2.7 slim con:
- CUPS client (para enviar a impresora)
- SimpleWebSocketServer + reportlab
- Repositorios apuntados a archive.debian.org (Buster archivado)

---

## Requisitos

- **Docker Desktop** (incluye Docker Engine + Docker Compose)
- **Espacio en disco**: ~3 GB para las imágenes
- **RAM**: mínimo 4 GB recomendados
- **Puertos libres**: 3000, 8000, 27017

---

## Comandos principales

| Acción | Comando |
|--------|---------|
| Construir imágenes | `docker-compose build` |
| Arrancar todo | `docker-compose up -d` |
| Ver logs de Meteor | `docker-compose logs -f meteor-app` |
| Ver logs de todo | `docker-compose logs -f` |
| Estado de servicios | `docker-compose ps` |
| Parar todo | `docker-compose down` |
| Parar sin eliminar | `docker-compose stop` |
| Reanudar | `docker-compose start` |
| Rebuild tras cambios | `docker-compose up -d --build meteor-app` |
| Rebuild sin caché | `docker-compose build --no-cache meteor-app` |
| Borrar todo + datos | `docker-compose down -v` |

---

## Primer uso (build inicial)

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd impresora

# 2. Construir todas las imágenes (primera vez: 10-15 min)
docker-compose build

# 3. Arrancar servicios
docker-compose up -d

# 4. Verificar que arranca
docker-compose logs -f meteor-app
# Esperar a ver mensajes de "autopublish" y "ufs: temp directory created"

# 5. Abrir en navegador
# http://localhost:3000
```

La primera build tarda porque descarga la imagen base de Meteor (~1.5 GB) y compila el bundle. Las builds siguientes son mucho más rápidas gracias a la caché de Docker.

---

## Uso diario

```bash
# Arrancar (si los contenedores están parados)
docker-compose up -d

# Trabajar en http://localhost:3000

# Al terminar
docker-compose down
```

---

## Actualizar tras cambios en el código

### Cambios en el código de la webapp (client/server/imports):

```bash
docker-compose up -d --build meteor-app
```

Esto reconstruye la imagen y reinicia el servicio. Si solo cambió código (no `package.json`), el paso 1 (npm install) sale de caché.

### Cambios en package.json:

```bash
docker-compose build --no-cache meteor-app
docker-compose up -d meteor-app
```

### Cambios en el demonio Python:

No necesita rebuild porque usa un volumen (`./demonio:/app`). Solo reinicia:

```bash
docker-compose restart demonio-python
```

---

## Problemas resueltos durante el setup

| Problema | Causa | Solución |
|----------|-------|----------|
| `ecmascript` vs `angular-babel` conflicto | Ambos manejan `*.js` | Eliminado `ecmascript` de `.meteor/packages` |
| `npm: not found` en build | PATH no incluye npm en la imagen de Meteor | Usar `meteor npm` en vez de `npm` |
| `fibers` ABI incompatible | Build multi-stage usaba Node diferente al runtime | Single-stage con la misma imagen base |
| Repos Debian archivados | Stretch/Buster fuera de soporte | Apuntar a `archive.debian.org` |
| `@babel/runtime` not found | No estaba en dependencias del proyecto | Añadido a `package.json` y al install del bundle |
| `node:14.21.4-slim` not found | Tag inexistente en Docker Hub | Eliminado multi-stage, usar single-stage |

---

## Compatibilidad con Windows

**Sí, funciona en Windows** con Docker Desktop instalado. Los pasos son idénticos:

### Requisitos en Windows:
1. **Docker Desktop para Windows** — https://www.docker.com/products/docker-desktop
2. **WSL2** habilitado (Docker Desktop lo pide durante la instalación)
3. Los mismos puertos libres (3000, 8000, 27017)

### Para ejecutar en Windows:

```powershell
# En PowerShell o CMD, desde la carpeta del proyecto
docker-compose build
docker-compose up -d

# Abrir http://localhost:3000
```

### Notas para Windows:
- Los comandos son exactamente los mismos (`docker-compose build`, `up`, `down`, etc.)
- Docker Desktop en Windows usa WSL2 por debajo, que ejecuta Linux — las imágenes Linux funcionan sin problemas
- El volumen del demonio (`./demonio:/app`) funciona igual, Docker traduce las rutas automáticamente
- Si hay problemas de permisos con volúmenes, asegurarse de que la carpeta del proyecto esté dentro del filesystem de WSL2 (mejor rendimiento)
- El rendimiento de build puede ser ligeramente más lento que en Linux nativo, pero el resultado final es idéntico

### Posible problema en Windows:
- **Line endings (CRLF vs LF)**: si Git convierte los archivos a CRLF en Windows, algunos scripts pueden fallar. Solución: configurar Git para mantener LF:
  ```bash
  git config core.autocrlf input
  ```
  O añadir un `.gitattributes` en la raíz:
  ```
  * text=auto eol=lf
  ```

---

## Características de la aplicación

### Stack tecnológico:
- **Frontend**: Angular 1.x + Angular Material
- **Backend**: Meteor 1.12.1 (Node 12)
- **Base de datos**: MongoDB 4.4
- **Servicio auxiliar**: Python 2.7 WebSocket (comunicación con impresora CUPS)

### Módulos principales:
- **Home** — pantalla principal
- **Kiosko** — interfaz de kiosko (punto de venta/atención)
- **Imprimir** — generación e impresión de etiquetas (tarifas América, Andorra, etc.)
- **Afkar** — módulo contenedor de la app Angular

### APIs/Colecciones:
- **Orders** — gestión de pedidos
- **Images** — gestión de imágenes (con GridFS/Local storage)
- **Config** — configuración de la aplicación

### Puertos:
- `3000` — Aplicación web (Meteor)
- `8000` — WebSocket del demonio Python (comunicación con impresora)
- `27017` — MongoDB (accesible para herramientas como Compass)

### Datos persistentes:
- MongoDB almacena datos en el volumen Docker `mongo-data`
- Los datos sobreviven a `docker-compose down` (se pierden solo con `docker-compose down -v`)
