#!/usr/bin/env python
# -*- coding: utf-8 -*-

from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket
import report
import os
import time
import sys  

reload(sys)  
sys.setdefaultencoding('utf8')

# ─────────────────────────────────────────────
# Nombres de impresoras (configurables via variables de entorno)
# PRINTER_1: Impresora de etiquetas rollo 1
# PRINTER_2: Impresora de etiquetas rollo 2
# PRINTER_TICKET: Impresora de tickets
# ─────────────────────────────────────────────
PRINTER_1 = os.environ.get('PRINTER_1', 'Brother_4520_1')
PRINTER_2 = os.environ.get('PRINTER_2', 'Brother_2')
PRINTER_TICKET = os.environ.get('PRINTER_TICKET', 'Brother_T')

def imprimir():
	
	losprod=0

	# etiqueta 1 -o orientation-requested=6   -o number -up=6 
	if os.path.getsize('stamp_simple_1_a.pdf')>2000:
		losprod=losprod+1
		os.system("lp -d %s stamp_simple_1_a.pdf -o orientation-requested=6  -o media=Custom.55x25mm -o BrCutLabel=6 -o BrBiDiPrint=OFF" % PRINTER_1)
	if os.path.getsize('stamp_simple_1_a2.pdf')>2000:
		losprod=losprod+1
		os.system("lp -d %s stamp_simple_1_a2.pdf -o orientation-requested=6 -o media=DC55x25 -o BrCutLabel=6 -o BrBiDiPrint=OFF" % PRINTER_1)
	if os.path.getsize('stamp_simple_1_b.pdf')>2000:
		losprod=losprod+1
		os.system("lp -d %s stamp_simple_1_b.pdf -o orientation-requested=6 -o media=DC55x25 -o BrCutLabel=6  -o BrBiDiPrint=OFF" % PRINTER_1)
	if os.path.getsize('stamp_simple_1_c.pdf')>2000:
		losprod=losprod+1
		os.system("lp -d %s stamp_simple_1_c.pdf -o orientation-requested=6 -o media=DC55x25 -o BrCutLabel=6  -o BrBiDiPrint=OFF" % PRINTER_1)
	
	# etiqueta 2

	if os.path.getsize('stamp_simple_2_a.pdf')>2000:
		losprod=losprod+1
		os.system("lp -d %s stamp_simple_2_a.pdf -o media=DC55x25  -o BrCutLabel=6 -o BrBiDiPrint=OFF" % PRINTER_2)
	if os.path.getsize('stamp_simple_2_a2.pdf')>2000:
		losprod=losprod+1
		os.system("lp -d %s stamp_simple_2_a2.pdf -o media=DC55x25  -o BrCutLabel=6 -o BrBiDiPrint=OFF" % PRINTER_2)
	if os.path.getsize('stamp_simple_2_b.pdf')>2000:
		losprod=losprod+1
		os.system("lp -d %s stamp_simple_2_b.pdf -o media=DC55x25 -o BrCutLabel=6 -o BrBiDiPrint=OFF" % PRINTER_2)
	if os.path.getsize('stamp_simple_2_c.pdf')>2000:
		losprod=losprod+1
		os.system("lp -d %s stamp_simple_2_c.pdf -o media=DC55x25  -o BrCutLabel=6 -o BrBiDiPrint=OFF" % PRINTER_2)
	
	# TIRA ESPECIAL

	if os.path.getsize('stamp_tira_1_especial.pdf')>2000:
		os.system("lp -d %s stamp_tira_1_especial.pdf -o media=DC55x25 -o orientation-requested=6 -o BrCutLabel=4 -o BrBiDiPrint=OFF" % PRINTER_1)
	
	if os.path.getsize('stamp_tira_2_especial.pdf')>2000:
		os.system("lp -d %s stamp_tira_2_especial.pdf -o media=DC55x25 -o orientation-requested=6 -o BrCutLabel=4 -o BrBiDiPrint=OFF" % PRINTER_2)

	# TIRA NORMAL

	if os.path.getsize('stamp_tira_1.pdf')>2000:
		losprod=losprod+2 #2
		os.system("lp -d %s stamp_tira_1.pdf -o media=DC55x25 -o orientation-requested=6 -o BrCutLabel=4 -o BrBiDiPrint=OFF" % PRINTER_1)
	
	if os.path.getsize('stamp_tira_2.pdf')>2000:
		losprod=losprod+2 #2
		os.system("lp -d %s stamp_tira_2.pdf -o media=DC55x25 -o orientation-requested=6 -o BrCutLabel=4 -o BrBiDiPrint=OFF" % PRINTER_2)
	#if os.path.getsize('ticket.pdf')>2000:
	#	os.system("lp -d Brother_TD_4100N_T ticket.pdf -o media=Custom.78x165mm")

		# SIGUIENTE LINEA  -12 Y -5 (longitud -17) = 148mm de largo
		# medida=165
		# txtmedida=str(medida)


	if os.path.getsize('ticket.pdf')>2000:
		if losprod == 1:
			os.system("lp -d %s ticket.pdf -o media=Custom.78x117mm" % PRINTER_TICKET)
		#NO: os.system("lp -d Brother_TD_4100N_T ticket.pdf -o media=Custom.78x" + txtmedida + "mm")
		#NO: os.system("lp -d Brother_TD_4100N_T ticket.pdf -o media=Custom.78x", txtmedida ,"mm")	
		elif losprod == 2:
			os.system("lp -d %s ticket.pdf -o media=Custom.78x120mm" % PRINTER_TICKET)
		elif losprod == 3:
			os.system("lp -d %s ticket.pdf -o media=Custom.78x123mm" % PRINTER_TICKET)	
		elif losprod == 4:
			os.system("lp -d %s ticket.pdf -o media=Custom.78x126mm" % PRINTER_TICKET)
		elif losprod == 5:
			os.system("lp -d %s ticket.pdf -o media=Custom.78x129mm" % PRINTER_TICKET)
		elif losprod == 6:
			os.system("lp -d %s ticket.pdf -o media=Custom.78x132mm" % PRINTER_TICKET)
		elif losprod == 7:
			os.system("lp -d %s ticket.pdf -o media=Custom.78x135mm" % PRINTER_TICKET)
		elif losprod == 8:
			os.system("lp -d %s ticket.pdf -o media=Custom.78x138mm" % PRINTER_TICKET)
		elif losprod == 10:
			os.system("lp -d %s ticket.pdf -o media=Custom.78x142mm" % PRINTER_TICKET)
		else: 
			os.system("lp -d %s ticket.pdf -o media=Custom.78x148mm" % PRINTER_TICKET)			
			
	if os.path.getsize('tickettira.pdf')>2000:		
		 os.system("lp -d %s tickettira.pdf -o media=Custom.78x117mm" % PRINTER_TICKET)

	print losprod	

def parseMessage(message):
	print "Parsing message"
	
	messageArray = message.split(("*¿?*"))
	
	print messageArray
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
	print "Message parsed"
	items = []
	idsProducts = [
	"tarifaAS1",
	"tarifaA2S1",
	"tarifaBS1",
	"tarifaCS1",
	"tarifaAT1",
	"tarifa4T1",
	"tarifaAS2",
	"tarifaA2S2",
	"tarifaBS2",
	"tarifaCS2",
	"tarifaAT2",
	"tarifa4T2"
	]
	quantities = messageArray[13].split(" ")
	prices = messageArray[14].split(" ")
	index = 0
	print "Printing"
	for item in quantities:
		items.append({ "idProducto" : idsProducts[index], "cantidad" : int(item) })
		index = index + 1

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

	modo_ticket_copia = messageArray[29]



	report.afkarPrint(items, prices, id_cliente, id_producto, fecha_sello, evento_sello, fecha_ticket, modo_ticket, modo_ticket_copia, modelo1_ticket, modelo2_ticket, modo_maquina, nombre_maquina, mes_maquina, pais_maquina, year_maquina, feria, lugar, empresa, cif, cp, l1, l2, l3, T1especial, T2especial, T3especial, TEmod1, TEmod2, ImprimeCopiaTicket)
	time.sleep(3)
	imprimir()


# parseMessage("0*¿?*0*¿?*21-24 Abril 2016*¿?*Evento Plaza Mayor*¿?*21/03/2017 13:33:13*¿?*Factura Simplificada*¿?*Caballo*¿?*Cibeles*¿?*B*¿?*ES02*¿?*3*¿?*ES*¿?*2017*¿?*3 3 3 3 3 3 3 3 3 3 3 3*¿?*0.38 0.47 0.94 1.06")

class SimpleEcho(WebSocket):

	def handleMessage(self):
		# echo message back to client
		print "Handling Message"
		print self.data
		parseMessage(self.data)
		# os.system(self.data)
		self.sendMessage(self.data)

	def handleConnected(self):
		print self.address, "connected"

	def handleClose(self):
		print self.address, "closed"




server = SimpleWebSocketServer('', 8000, SimpleEcho)
server.serveforever()


