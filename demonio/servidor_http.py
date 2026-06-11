#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Servidor HTTP modernizado usando aiohttp (asyncio).

Proporciona endpoints para controlar la impresora:
  - POST /pausar  → Ejecuta cupsdisable para pausar la impresora
  - POST /reanudar → Ejecuta cupsenable para reanudar la impresora

Se integra con el event loop de asyncio del servidor WebSocket principal.
Puerto por defecto: 8001

Requisitos: 4.4, 4.5
"""

import asyncio
import logging
import os

from aiohttp import web

logger = logging.getLogger(__name__)

# Nombre de la impresora (configurable via variable de entorno)
PRINTER_1 = os.environ.get("PRINTER_1", "Brother_4520_1")


class ServidorHTTP:
    """
    Servidor HTTP asyncio para comandos de control de impresora.

    Ejecuta comandos CUPS (cupsdisable, cupsenable) usando
    asyncio.create_subprocess_exec() para no bloquear el event loop.
    """

    def __init__(self, host: str = "", port: int = 8001):
        self.host = host
        self.port = port
        self._app = web.Application()
        self._app.router.add_post("/pausar", self._handle_pausar)
        self._app.router.add_post("/reanudar", self._handle_reanudar)
        self._runner: web.AppRunner | None = None

    async def iniciar(self) -> None:
        """Inicia el servidor HTTP en el puerto configurado."""
        self._runner = web.AppRunner(self._app)
        await self._runner.setup()
        site = web.TCPSite(self._runner, self.host or "0.0.0.0", self.port)
        await site.start()
        logger.info(
            "Servidor HTTP de comandos escuchando en %s:%d",
            self.host or "0.0.0.0",
            self.port,
        )

    async def detener(self) -> None:
        """Detiene el servidor HTTP y libera recursos."""
        if self._runner:
            await self._runner.cleanup()
            logger.info("Servidor HTTP detenido")

    async def pausar(self) -> dict:
        """
        Pausa la impresora ejecutando cupsdisable.

        Returns:
            dict con "status" ("ok" o "error") y "message".
        """
        return await self._ejecutar_comando_cups(
            ["cupsdisable", "-r", "Pausada por el usuario", PRINTER_1],
            mensaje_ok="Impresora pausada",
            mensaje_error="Error al pausar impresora",
        )

    async def reanudar(self) -> dict:
        """
        Reanuda la impresora ejecutando cupsenable.

        Returns:
            dict con "status" ("ok" o "error") y "message".
        """
        return await self._ejecutar_comando_cups(
            ["cupsenable", PRINTER_1],
            mensaje_ok="Impresora reanudada",
            mensaje_error="Error al reanudar impresora",
        )

    async def _ejecutar_comando_cups(
        self,
        comando: list[str],
        mensaje_ok: str,
        mensaje_error: str,
    ) -> dict:
        """
        Ejecuta un comando CUPS usando asyncio.create_subprocess_exec().

        Args:
            comando: Lista con el comando y argumentos.
            mensaje_ok: Mensaje a devolver si el comando tiene éxito.
            mensaje_error: Mensaje a devolver si el comando falla.

        Returns:
            dict con "status" y "message".
        """
        try:
            process = await asyncio.create_subprocess_exec(
                *comando,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
            )
            stdout, stderr = await asyncio.wait_for(
                process.communicate(), timeout=10.0
            )

            if process.returncode == 0:
                logger.info("%s (comando: %s)", mensaje_ok, " ".join(comando))
                return {"status": "ok", "message": mensaje_ok}
            else:
                error_detail = stderr.decode().strip() if stderr else "código de retorno no-cero"
                logger.error(
                    "%s: %s (comando: %s)",
                    mensaje_error,
                    error_detail,
                    " ".join(comando),
                )
                return {"status": "error", "message": f"{mensaje_error}: {error_detail}"}

        except asyncio.TimeoutError:
            logger.error("Timeout ejecutando comando: %s", " ".join(comando))
            return {"status": "error", "message": f"{mensaje_error}: timeout"}
        except FileNotFoundError:
            logger.error("Comando no encontrado: %s", comando[0])
            return {"status": "error", "message": f"{mensaje_error}: comando '{comando[0]}' no encontrado"}
        except Exception as e:
            logger.error("Error inesperado ejecutando %s: %s", " ".join(comando), e)
            return {"status": "error", "message": f"{mensaje_error}: {e}"}

    async def _handle_pausar(self, request: web.Request) -> web.Response:
        """Handler HTTP para POST /pausar."""
        result = await self.pausar()
        status_code = 200 if result["status"] == "ok" else 500
        return web.json_response(result, status=status_code)

    async def _handle_reanudar(self, request: web.Request) -> web.Response:
        """Handler HTTP para POST /reanudar."""
        result = await self.reanudar()
        status_code = 200 if result["status"] == "ok" else 500
        return web.json_response(result, status=status_code)
