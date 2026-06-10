#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket
import report
import os
import time
import sys
import http.server
import threading
import json

# ─────────────────────────────────────────────
# Nombres de impresoras (configurables via variables de entorno)
# PRINTER_1: Impresora de etiquetas rollo 1
# PRINTER_2: Impresora de etiquetas rollo 2
# PRINTER_TICKET: Impresora de tickets
# ─────────────────────────────────────────────
PRINTER_1 = os.environ.get('PRINTER_1', 'Brother_4520_1')
PRINTER_2 = os.environ.get('PRINTER_2', 'Brother_4520_2')
PRINTER_TICKET = os.environ.get('PRINTER_TICKET', 'Brother_4420_T')


def imprimir():
    losprod = 0

    # etiqueta 1 _overflow
    if os.path.getsize('stamp_simple_1_a.pdf') > 2000:
        losprod += 1
        os.system("lp -d %s stamp_simple_1_a.pdf -o media=DC55x25 -o orientation-requested=6 -o Occurrence=Specified -o Interval=5" % PRINTER_1)
    if os.path.getsize('stamp_simple_1_a_overflow.pdf') > 2000:
        os.system("lp -d %s stamp_simple_1_a_overflow.pdf -o media=DC55x25 -o orientation-requested=6" % PRINTER_1)
    if os.path.getsize('stamp_simple_1_a2.pdf') > 2000:
        losprod += 1
        os.system("lp -d %s stamp_simple_1_a2.pdf -o media=DC55x25 -o orientation-requested=6 -o Occurrence=Specified -o Interval=5" % PRINTER_1)
    if os.path.getsize('stamp_simple_1_a2_overflow.pdf') > 2000:
        os.system("lp -d %s stamp_simple_1_a2_overflow.pdf -o media=DC55x25 -o orientation-requested=6" % PRINTER_1)
    if os.path.getsize('stamp_simple_1_b.pdf') > 2000:
        losprod += 1
        os.system("lp -d %s stamp_simple_1_b.pdf -o media=DC55x25 -o orientation-requested=6 -o Occurrence=Specified -o Interval=5" % PRINTER_1)
    if os.path.getsize('stamp_simple_1_b_overflow.pdf') > 2000:
        os.system("lp -d %s stamp_simple_1_b_overflow.pdf -o media=DC55x25 -o orientation-requested=6" % PRINTER_1)
    if os.path.getsize('stamp_simple_1_c.pdf') > 2000:
        losprod += 1
        os.system("lp -d %s stamp_simple_1_c.pdf -o media=DC55x25 -o orientation-requested=6 -o Occurrence=Specified -o Interval=5" % PRINTER_1)
    if os.path.getsize('stamp_simple_1_c_overflow.pdf') > 2000:
        os.system("lp -d %s stamp_simple_1_c_overflow.pdf -o media=DC55x25 -o orientation-requested=6" % PRINTER_1)

    # etiqueta 2
    if os.path.getsize('stamp_simple_2_a.pdf') > 2000:
        losprod += 1
        os.system("lp -d %s stamp_simple_2_a.pdf -o media=DC55x25 -o orientation-requested=6 -o Occurrence=Specified -o Interval=5" % PRINTER_2)
    if os.path.getsize('stamp_simple_2_a_overflow.pdf') > 2000:
        os.system("lp -d %s stamp_simple_2_a_overflow.pdf -o media=DC55x25 -o orientation-requested=6" % PRINTER_2)
    if os.path.getsize('stamp_simple_2_a2.pdf') > 2000:
        losprod += 1
        os.system("lp -d %s stamp_simple_2_a2.pdf -o media=DC55x25 -o orientation-requested=6 -o Occurrence=Specified -o Interval=5" % PRINTER_2)
    if os.path.getsize('stamp_simple_2_a2_overflow.pdf') > 2000:
        os.system("lp -d %s stamp_simple_2_a2_overflow.pdf -o media=DC55x25 -o orientation-requested=6" % PRINTER_2)
    if os.path.getsize('stamp_simple_2_b.pdf') > 2000:
        losprod += 1
        os.system("lp -d %s stamp_simple_2_b.pdf -o media=DC55x25 -o orientation-requested=6 -o Occurrence=Specified -o Interval=5" % PRINTER_2)
    if os.path.getsize('stamp_simple_2_b_overflow.pdf') > 2000:
        os.system("lp -d %s stamp_simple_2_b_overflow.pdf -o media=DC55x25 -o orientation-requested=6" % PRINTER_2)
    if os.path.getsize('stamp_simple_2_c.pdf') > 2000:
        losprod += 1
        os.system("lp -d %s stamp_simple_2_c.pdf -o media=DC55x25 -o orientation-requested=6 -o Occurrence=Specified -o Interval=5" % PRINTER_2)
    if os.path.getsize('stamp_simple_2_c_overflow.pdf') > 2000:
        os.system("lp -d %s stamp_simple_2_c_overflow.pdf -o media=DC55x25 -o orientation-requested=6" % PRINTER_2)

    # TIRA ESPECIAL
    if os.path.getsize('stamp_tira_1_especial.pdf') > 2000:
        os.system("lp -d %s stamp_tira_1_especial.pdf -o media=DC55x25 -o orientation-requested=6 -o Occurrence=Specified -o Interval=4" % PRINTER_1)
    if os.path.getsize('stamp_tira_2_especial.pdf') > 2000:
        os.system("lp -d %s stamp_tira_2_especial.pdf -o media=DC55x25 -o orientation-requested=6 -o Occurrence=Specified -o Interval=4" % PRINTER_2)

    # TIRA NORMAL
    if os.path.getsize('stamp_tira_1.pdf') > 2000:
        losprod += 2
        os.system("lp -d %s stamp_tira_1.pdf -o media=DC55x25 -o orientation-requested=6 -o Occurrence=Specified -o Interval=4" % PRINTER_1)
    if os.path.getsize('stamp_tira_2.pdf') > 2000:
        losprod += 2
        os.system("lp -d %s stamp_tira_2.pdf -o media=DC55x25 -o orientation-requested=6 -o Occurrence=Specified -o Interval=4" % PRINTER_2)

    # TICKET
    if os.path.getsize('ticket.pdf') > 2000:
        media_sizes = {1: '117', 2: '120', 3: '123', 4: '126', 5: '129',
                       6: '132', 7: '135', 8: '138', 10: '142'}
        size = media_sizes.get(losprod, '148')
        os.system("lp -d %s ticket.pdf -o media=Custom.78x%smm" % (PRINTER_TICKET, size))

    if os.path.getsize('tickettira.pdf') > 2000:
        os.system("lp -d %s tickettira.pdf -o media=Custom.78x117mm" % PRINTER_TICKET)

    print(losprod)


def parseMessage(message):
    print("Parsing message")

    messageArray = message.split("*¿?*")

    print(messageArray)
    id_cliente = int(messageArray[0])
    id_producto = int(messageArray[1])
    fecha_sello = messageArray[2]
    evento_sello = messageArray[3]
    fecha_ticket = messageArray[4]
    modo_ticket = messageArray[5]
    modelo1_ticket = messageArray[6]
    modelo2_ticket = messageArray[7]
    modo_maquina = messageArray[8]
    nombre_maquina = messageArray[9]
    mes_maquina = messageArray[10]
    pais_maquina = messageArray[11]
    year_maquina = messageArray[12]
    print("Message parsed")

    items = []
    idsProducts = [
        "tarifaAS1", "tarifaA2S1", "tarifaBS1", "tarifaCS1", "tarifaAT1", "tarifa4T1",
        "tarifaAS2", "tarifaA2S2", "tarifaBS2", "tarifaCS2", "tarifaAT2", "tarifa4T2"
    ]
    quantities = messageArray[13].split(" ")
    prices = messageArray[14].split(" ")
    index = 0
    print("Printing")
    for item in quantities:
        items.append({"idProducto": idsProducts[index], "cantidad": int(item)})
        index += 1

    for index, val in enumerate(prices):
        prices[index] = float(prices[index])

    empresa = messageArray[15]
    cif = messageArray[16]
    cp = messageArray[17]
    l1 = messageArray[18]
    l2 = messageArray[19]
    l3 = messageArray[20]
    feria = messageArray[21]
    lugar = messageArray[22]

    T1especial = messageArray[23]
    T2especial = messageArray[24]
    T3especial = messageArray[25]
    TEmod1 = messageArray[26]
    TEmod2 = messageArray[27]
    ImprimeCopiaTicket = messageArray[28]
    ImprimeMasterTicket = messageArray[29]

    modo_ticket_copia = messageArray[30]

    report.afkarPrint(items, prices, id_cliente, id_producto, fecha_sello, evento_sello,
                      fecha_ticket, modo_ticket, modo_ticket_copia, modelo1_ticket,
                      modelo2_ticket, modo_maquina, nombre_maquina, mes_maquina,
                      pais_maquina, year_maquina, feria, lugar, empresa, cif, cp,
                      l1, l2, l3, T1especial, T2especial, T3especial, TEmod1, TEmod2,
                      ImprimeCopiaTicket, ImprimeMasterTicket)
    time.sleep(3)
    imprimir()


class SimpleEcho(WebSocket):

    def handleMessage(self):
        print("Handling Message")
        print(self.data)
        parseMessage(self.data)
        self.sendMessage(self.data)

    def handleConnected(self):
        print(self.address, "connected")

    def handleClose(self):
        print(self.address, "closed")


# ─────────────────────────────────────────────
# Servidor HTTP para comandos de impresora (pausar/reanudar)
# Puerto 8001 - accesible desde el contenedor meteor-app
# ─────────────────────────────────────────────
class PrinterCommandHandler(http.server.BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/pausar':
            result = os.system('cupsdisable -r "Pausada por el usuario" %s' % PRINTER_1)
            if result == 0:
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "ok", "message": "Impresora pausada"}).encode())
            else:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": "Error al pausar impresora"}).encode())
        elif self.path == '/reanudar':
            result = os.system('cupsenable %s' % PRINTER_1)
            if result == 0:
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "ok", "message": "Impresora reanudada"}).encode())
            else:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": "Error al reanudar impresora"}).encode())
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        print("HTTP: " + format % args)


def start_http_server():
    httpd = http.server.HTTPServer(('', 8001), PrinterCommandHandler)
    print("Servidor HTTP de comandos escuchando en puerto 8001")
    httpd.serve_forever()


http_thread = threading.Thread(target=start_http_server, daemon=True)
http_thread.start()

server = SimpleWebSocketServer('', 8000, SimpleEcho)
server.serveforever()
