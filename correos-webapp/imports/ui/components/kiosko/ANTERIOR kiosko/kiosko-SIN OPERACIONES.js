import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './kiosko.html';
import './kiosko.less';

import { Config } from '../../../api/config/collection';
import { Images } from '../../../api/images/collection';
import { Orders } from '../../../api/orders/collection';

class Kiosko {
	constructor($reactive, $scope) {
		$reactive(this).attach($scope);
		this.Math = Math;

		this.tarifaAS1Cantidad = 0;
		this.tarifaA2S1Cantidad = 0;
		this.tarifaBS1Cantidad = 0;
		this.tarifaCS1Cantidad = 0;
		this.tarifaAT1Cantidad = 0;
		this.tarifa4T1Cantidad = 0;
		this.tarifaAS2Cantidad = 0;
		this.tarifaA2S2Cantidad = 0;
		this.tarifaBS2Cantidad = 0;
		this.tarifaCS2Cantidad = 0;
		this.tarifaAT2Cantidad = 0;
		this.tarifa4T2Cantidad = 0;


		this.math = window.Math;
		this.autorun(() => {
			this.total = this.getReactively("tarifaAPrecioSimple") * (this.getReactively("tarifaAS1Cantidad") + this.getReactively("tarifaAS2Cantidad")) +
			this.getReactively("tarifaA2PrecioSimple") * (this.getReactively("tarifaA2S1Cantidad") + this.getReactively("tarifaA2S2Cantidad")) +
			this.getReactively("tarifaBPrecioSimple") * (this.getReactively("tarifaBS1Cantidad") + this.getReactively("tarifaBS2Cantidad")) +
			this.getReactively("tarifaCPrecioSimple") * (this.getReactively("tarifaCS1Cantidad") + this.getReactively("tarifaCS2Cantidad")) +
			this.getReactively("tarifaAPrecioTira") * (this.getReactively("tarifaAT1Cantidad") + this.getReactively("tarifaAT2Cantidad")) +
			this.getReactively("tarifaPrecioTira4") * (this.getReactively("tarifa4T1Cantidad") + this.getReactively("tarifa4T2Cantidad"));
		})
		function onOpen(evt)
		{
			console.log("connected\n");
			// document.myform.connectButton.disabled = true;
			// document.myform.disconnectButton.disabled = false;
		}

		function onClose(evt)
		{
			console.log("disconnected\n");
			// document.myform.connectButton.disabled = false;
			// document.myform.disconnectButton.disabled = true;
		}

		function onMessage(evt)
		{
			console.log("response: " + evt.data + '\n');
		}

		function onError(evt)
		{
			console.log('error: ' + evt.data + '\n');

			websocket.close();

			// document.myform.connectButton.disabled = false;
			// document.myform.disconnectButton.disabled = true;

		}

		var websocket = new WebSocket("ws://169.254.128.40:8000/");
		// var websocket = new WebSocket("ws://127.0.0.1:8000/");


		websocket.onopen = function(evt) { onOpen(evt) };
		websocket.onclose = function(evt) { onClose(evt) };
		websocket.onmessage = function(evt) { onMessage(evt) };
		websocket.onerror = function(evt) { onError(evt) };
		this.websocket = websocket;

		this.helpers({
			readConfig(){
				let config = Config.findOne();
				if (config) {
					// console.log(config);
					this.config = config;
//
		if (this.config.codigo.annio == "auto") {
			let fecha = new Date();
			this.elanniocom = fecha.getFullYear();
			this.elannio = (this.elanniocom-2000).toString();
		}
		else{
			this.elannio = this.config.codigo.annio;
		}
//
		if (this.config.codigo.mes == 0) {
			let fecha = new Date();
			//var mes_maquina = "A";
			if (fecha.getMonth()<9) {
				//var mes_maquina = "B";
				this.elmes = (fecha.getMonth()+1).toString();
			}
			else{
				if (fecha.getMonth() == 9) {
					this.elmes = "O";
				}
				else if (fecha.getMonth() == 10) {
					this.elmes = "N";
				}
				else if (fecha.getMonth() == 11) {
					this.elmes = "D";
				}
			}
		}
		else{
			var elmes_maquina = this.config.codigo.mes;
				this.elmes = elmes_maquina;
				if (elmes_maquina == 10) {
					this.elmes = "O";
				}
				else if (elmes_maquina == 11) {
					this.elmes = "N";
				}
				else if (elmes_maquina == 12) {
					this.elmes = "D";
				}
		};
		//	this.elevento = config.sello.elevento;
			this.nombre = config.codigo.maquina;
// PERFIL - PANTALLA
			if (config.sello.elperfil ==1) {
				this.elnperfil= config.sello.nperfil1;
				this.elmodo= config.sello.nperfil1;
			}
			 if (config.sello.elperfil ==2) {
				this.elnperfil= config.sello.nperfil2;
				this.elmodo= config.sello.nperfil2;
			}
			 if (config.sello.elperfil ==3) {
				this.elnperfil= config.sello.nperfil3;
				this.elmodo= config.sello.nperfil3;
			}			
			 if (config.sello.elperfil ==4) {
				this.elnperfil= config.sello.nperfil4;
				this.elmodo= config.sello.nperfil4;
			}
			 if (config.sello.elperfil ==5) {
				this.elnperfil= config.sello.nperfil5;
				this.elmodo= config.sello.nperfil5;
			}
			 if (config.sello.elperfil ==6) {
				this.elnperfil= config.sello.nperfil6;
				this.elmodo= "";
			}
			//
			this.clientecod = config.codigo.cliente;
				if (config.codigo.cliente < 10) {
					this.clientecod = "000"+config.codigo.cliente;
				}
				else if (config.codigo.cliente < 100) {
					this.clientecod = "00"+config.codigo.cliente;
				}
				else if (config.codigo.cliente < 1000) {
					this.clientecod = "0"+config.codigo.cliente;
				}
				else if (config.codigo.cliente < 10000) {
					this.clientecod = config.codigo.cliente;
				}
				else if (config.codigo.cliente >9999) {
					//this.config.codigo.cliente=1;
					this.clientecod = "HACER RESET";
				}

// EL EVENTO - PANTALLA
				this.modocod = config.codigo.modo;
				this.pais = config.codigo.pais;
				this.elnevento = config.sello.elnevento;
				this.nombreModelo1 = config.sello.nombreModelo1;
				this.nombreModelo2 = config.sello.nombreModelo2;

					// TICKET ¿?/PANTALLA/IMPRESORA: MOTIVO 1
					this.tarifaAPrecioSimple = config.precios.tarifaA;
					this.tarifaA2PrecioSimple = config.precios.tarifaA2;
					this.tarifaBPrecioSimple = config.precios.tarifaB;
					this.tarifaCPrecioSimple = config.precios.tarifaC;
					this.tarifaAPrecioTira = config.precios.tarifaTA;
					this.tarifaPrecioTira4 = config.precios.tarifaT4;
					//this.tarifaAPrecioTira = 4 * this.tarifaAPrecioSimple;
	// OJO    SIGUIENTE CALCULO GENERA 4.199999999999999 DE: 0.60+0.70+1.40+1.50
					//this.tarifaPrecioTira4 = this.tarifaAPrecioSimple*1 + this.tarifaA2PrecioSimple*1 + this.tarifaBPrecioSimple*1 + this.tarifaCPrecioSimple*1	;
					this.rollo1 = config.ticket.rollo1;
					this.rollo2 = config.ticket.rollo2;

				if (config.sello.elevento == 0) {
				//this.elnevento = "CHAMARTIN"; 
				this.fechaInstalacion = config.sello.fecha0;
				this.evento = config.sello.localidad0;
			}
			if (config.sello.elevento == 1) {
				this.fechaInstalacion = config.sello.fecha1;
				this.evento = config.sello.localidad1;	
			}
			 if (config.sello.elevento == 2) {
				this.fechaInstalacion = config.sello.fecha2;
				this.evento = config.sello.localidad2;	
			}			
			 	if (config.sello.elevento == 3) {
				this.fechaInstalacion = config.sello.fecha3;
				this.evento = config.sello.localidad3;	
			}
				 if (config.sello.elevento == 4) {
				this.fechaInstalacion = config.sello.fecha4;
				this.evento = config.sello.localidad4;
			}
			 if (config.sello.elevento == 5) {
				this.fechaInstalacion = config.sello.fecha5;
				this.evento = config.sello.localidad5;
			}
			 if (config.sello.elevento == 6) {
				this.fechaInstalacion = config.sello.fecha6;
				this.evento = config.sello.localidad6;
			}
			 if (config.sello.elevento == 7) {
				this.fechaInstalacion = config.sello.fecha7;
				this.evento = config.sello.localidad7;
			}
				//	this.rollo1ant = config.ticket.rollo1ant;
				//	this.rollo2ant = config.ticket.rollo2ant;

					this.tickets = config.ticket.tickets;
					this.limite = config.ticket.limiteImporte;
					
				}
			},
			modelo1(){
				if(Images.findOne({name: "Modelo1"}))
					return Images.findOne({name: "Modelo1"}).path;
			},
			modelo2(){
				if(Images.findOne({name: "Modelo2"}))
					return Images.findOne({name: "Modelo2"}).path;
			}
		});
	};

// RESTAR 1 a la IDsesión con error de impresión (SIN IMPRIMIR volver al id anterior)


	imprimirerror(){

		var mensaje = confirm("¿Error de IMPRESIÓN? ¡Se procederá a ANULAR la VENTA ANTERIOR!");
		if (mensaje) {
 				//alert("¡Se procederá a ANULAR la VENTA ANTERIOR!");
			
		let rollo1ant1 = this.rollo1ant
		let rollo2ant2 = this.rollo2ant
		let ticketsant = this.ticketsventa

		if (rollo1ant1 > 0 || rollo2ant2 > 0){
			
		//alert("ERROR DE IMPRESIÓN - ID y Rollos anterior");

		Meteor.call("updateSesionerror");
		Meteor.call("updateRollosAnterror", rollo1ant1, rollo2ant2, ticketsant);
		let newOrderArray = [];
		let orderProps = {
				cliente : this.config.codigo.cliente,
				feria: this.config.sello.feria,
			lugar: this.config.sello.lugar,
			}
		let newLine = {
						//event: orderProps.fechaSello,
						event: "ELIMINAR ANTERIOR",
						venue: " ",
						machine: "error de impresión",
						vendType: " ",
						productName: " ",
						transactionDate: "",
						quantity: " ",
						quantitySet: " ",
						totalStamps: " ",
						currency: " ",
						value: " ",
						paymentStatus: "Error",
						sesionId: "ELIMINAR ANTERIOR" ,
						etiquetasRollo1: "actualizado",
						etiquetasRollo2: "actualizado",
						etiquetaMes: " ",
						titutoEvento: "Error",
						feria: orderProps.feria,
								Lugar: orderProps.lugar,
						fecha: "Error",
						mes: "Error",
						annio: "Error",
						documento: "Error",
					}
			newOrderArray.push(newLine);	
			
			console.log(newOrderArray)

			Meteor.call("insertOrder", newOrderArray);	

		this.tarifaAS1Cantidad = 0;
		this.tarifaA2S1Cantidad = 0;
		this.tarifaBS1Cantidad = 0;
		this.tarifaCS1Cantidad = 0;
		this.tarifaAT1Cantidad = 0;
		this.tarifa4T1Cantidad = 0;
		this.tarifaAS2Cantidad = 0;
		this.tarifaA2S2Cantidad = 0;
		this.tarifaBS2Cantidad = 0;
		this.tarifaCS2Cantidad = 0;
		this.tarifaAT2Cantidad = 0;
		this.tarifa4T2Cantidad = 0;

		this.rollo1ant = 0;
		this.rollo2ant = 0;
		this.ticketsventa = 0;
			//// AQUI EN MAC
			this.websocket.send(message);
				this.reset();			
 	}
 	else {
 	alert("¡¡NINGUNA venta encontrada!!");
 	}

 	}
 	else {
 	alert("¡Operación cancelada!");
 	}
	}
// IMPRIMIR NORMAL ----------------------	
imprimirFilatelia(){
	this.perfilpros = "filatelia";
	this.imprimir();
}
imprimirNormal(){
	this.perfilpros = "normal";
	this.imprimir();
}
imprimirProtocolo(){
	this.perfilpros = "protocolo";
	this.imprimir();
}

	imprimir(){
		function format2digits(int){
			if (int<10) {
				return "0" + int.toString();
			}
			else{
				return int.toString();
			}
		}
		// NINGÚN CAMPO CON VALOR "NADA" pues no imprime el pedido
		if (this.tarifaAS1Cantidad <1) {
			//alert("tarifa A modelo1 en blanco y puesto a O");
				this.tarifaAS1Cantidad = 0
			}
		if (this.tarifaA2S1Cantidad <1) {
				this.tarifaA2S1Cantidad = 0
			}
		if (this.tarifaBS1Cantidad <1) {
				this.tarifaBS1Cantidad = 0
			}
		if (this.tarifaCS1Cantidad <1) {
				this.tarifaCS1Cantidad = 0
			}
		if (this.tarifaAT1Cantidad <1) {
				this.tarifaAT1Cantidad = 0
			}
		if (this.tarifa4T1Cantidad  <1) {
				this.tarifa4T1Cantidad  = 0
			}
		if (this.tarifaAS2Cantidad <1) {
			//alert("tarifa A modelo1 en blanco y puesto a O");
				this.tarifaAS2Cantidad = 0
			}
		if (this.tarifaA2S2Cantidad <1) {
				this.tarifaA2S2Cantidad = 0
			}
		if (this.tarifaBS2Cantidad <1) {
				this.tarifaBS2Cantidad = 0
			}
		if (this.tarifaCS2Cantidad <1) {
				this.tarifaCS2Cantidad = 0
			}
		if (this.tarifaAT2Cantidad <1) {
				this.tarifaAT2Cantidad = 0
			}
		if (this.tarifa4T2Cantidad <1) {
				this.tarifa4T2Cantidad  = 0
			}

		// fin VALOR "NADA"	

		if (this.config.ticket.fecha == "auto") {
			let fecha = new Date();
			var fecha_ticket = format2digits(fecha.getDate()) + "/" + format2digits(fecha.getMonth()+1) + "/" + fecha.getFullYear() +  " " + format2digits(fecha.getHours()) + ":" + format2digits(fecha.getMinutes()) + ":" + format2digits(fecha.getSeconds());
			var fechaMaquina = format2digits(fecha.getDate()) + "/" + format2digits(fecha.getMonth()+1) + "/" + fecha.getFullYear() 
		}
		else{
			var fecha_ticket = this.config.ticket.fecha;
			var fechaMaquina = this.config.ticket.fecha;
		};
		if (this.config.codigo.mes == 0) {
			let fecha = new Date();
			//var mes_maquina = "A";
			if (fecha.getMonth()<9) {
				//var mes_maquina = "B";
				var mes_maquina = (fecha.getMonth()+1).toString();
				var mesMaquina = (fecha.getMonth()+1).toString();
			}
			else{
				if (fecha.getMonth() == 9) {
					var mes_maquina = "O"
					var mesMaquina = 10
				}
				else if (fecha.getMonth() == 10) {
					var mes_maquina = "N"
					var mesMaquina = 11
				}
				else if (fecha.getMonth() == 11) {
					var mes_maquina = "D"
					var mesMaquina = 12
				}
			}
		}
		else{
			var mes_maquina = this.config.codigo.mes;
			var mesMaquina = this.config.codigo.mes;
				if (mes_maquina == 10) {
					var mes_maquina = "O"
					var mesMaquina = 10
				}
				else if (mes_maquina == 11) {
					var mes_maquina = "N"
					var mesMaquina = 11
				}
				else if (mes_maquina == 12) {
					var mes_maquina = "D"
					var mesMaquina = 12
				}
		};
		if (this.config.codigo.annio == "auto") {
			let fecha = new Date();
			var year_maquina = fecha.getFullYear().toString();
		}
		else{
			var year_maquina = this.config.codigo.annio;
		};
		var eltitulo = this.config.ticket.titulo;
		var eltituloCopia = this.config.ticket.tituloCopia;

		if (this.perfilpros == "filatelia") {
				var eltitulo = "Filatelia";
				var eltituloCopia = "COPIA Filatelia";
			}
		if (this.perfilpros == "protocolo") {
				var eltitulo = "Protocolo";
				var eltituloCopia = "COPIA Protocolo";
			};

// CAMPOS PARA REPORT.PY... IMPRIMIR... ARRAY NUMERADO
		let items = this.tarifaAS1Cantidad + " " + this.tarifaA2S1Cantidad + " " + this.tarifaBS1Cantidad + " " + this.tarifaCS1Cantidad + " " + this.tarifaAT1Cantidad + " " + this.tarifa4T1Cantidad + " " + this.tarifaAS2Cantidad + " " + this.tarifaA2S2Cantidad + " " + this.tarifaBS2Cantidad + " " + this.tarifaCS2Cantidad + " " + this.tarifaAT2Cantidad + " " + this.tarifa4T2Cantidad;
		let precios = this.tarifaAPrecioSimple + " " + this.tarifaA2PrecioSimple + " " + this.tarifaBPrecioSimple + " " + this.tarifaCPrecioSimple;


		var message = this.config.codigo.cliente + "*¿?*" 
		+ this.config.codigo.producto + "*¿?*" 
		+ this.config.sello.fecha + "*¿?*" 
		+ this.config.sello.evento + "*¿?*" 
		+ fecha_ticket + "*¿?*" 
		//+ this.config.ticket.titulo + "*¿?*" 
		+ eltitulo + "*¿?*" 
		+ this.config.sello.modelo1 + "*¿?*" 
		+ this.config.sello.modelo2 + "*¿?*" 
		+ this.config.codigo.modo + "*¿?*" 
		+ this.config.codigo.maquina + "*¿?*" 
		+ mes_maquina + "*¿?*" 
		+ this.config.codigo.pais + "*¿?*" 
		+ year_maquina + "*¿?*" 
		+ items + "*¿?*" 
		+ precios + "*¿?*" 
		+ this.config.ticket.empresa + "*¿?*" 
		+ this.config.ticket.cif + "*¿?*" 
		+ this.config.ticket.cp + "*¿?*" 
		+ this.config.ticket.l1 + "*¿?*" 
		+ this.config.ticket.l2 + "*¿?*" 
		+ this.config.ticket.l3 + "*¿?*"
		+ this.config.sello.feria + "*¿?*" 
		+ this.config.sello.lugar + "*¿?*"
		//+ this.config.ticket.tituloCopia;
		+ eltituloCopia;
		
		//Meteor.call("updateRollosAnt", rollo1ant1, rollo2ant2)
		let sellos1 = this.tarifaAS1Cantidad + this.tarifaA2S1Cantidad + this.tarifaBS1Cantidad + this.tarifaCS1Cantidad + 4*this.tarifaAT1Cantidad + 4*this.tarifa4T1Cantidad;
		let sellos2 = this.tarifaAS2Cantidad + this.tarifaA2S2Cantidad + this.tarifaBS2Cantidad + this.tarifaCS2Cantidad + 4*this.tarifaAT2Cantidad + 4*this.tarifa4T2Cantidad;
		//if (this.tarifaAS1Cantidad =""){
	//		alert("CANTIDAD en BLANCO (Tarifa AAA)");
	//	}
	//	else if (this.tarifaAS2Cantidad=""){
	//		alert("CANTIDAD en BLANCO (Tarifa A)");
	//	}
	//	else if (this.tarifaA2S1Cantidad=""){
	//		alert("CANTIDAD en BLANCO (Tarifa A2)");
	//	}
	//	else if (this.tarifaA2S2Cantidad=""){
	//		alert("CANTIDAD en BLANCO (Tarifa A2)");
	//	}
	//	else if (this.tarifaBS1Cantidad=""){
	//		alert("CANTIDAD en BLANCO (Tarifa B)");
	//	}
	//	else if (this.tarifaBS2Cantidad=""){
	//		alert("CANTIDAD en BLANCO (Tarifa B");
	//	}
	//	else if (this.tarifaCS1Cantidad=""){
	//		alert("CANTIDAD en BLANCO (Tarifa C");
	//	}
	//	else if (this.tarifaCS2Cantidad=""){
	//		alert("CANTIDAD en BLANCO (Tarifa C)");
	//	}
		 if (sellos1 > this.rollo1 && sellos2 > this.rollo2){
			alert("No hay suficientes sellos del primer motivo ni del segundo");
		}
		else if (sellos1 > this.rollo1) {
			alert("No hay suficientes sellos del primer motivo");
		}
		else if (sellos2 > this.rollo2) {
			alert("No hay suficientes sellos del segundo motivo");
		}
		else if (this.total > this.config.ticket.limiteImporte) {
			alert("Ha excedido el límite de compra de " + this.config.ticket.limiteImporte + "€");
		}
		else if ((2+this.tarifaAT1Cantidad + this.tarifa4T1Cantidad+this.tarifaAT2Cantidad + this.tarifa4T2Cantidad) > this.config.ticket.tickets) {
			alert("No hay suficientes tickets");
		}
		else if (this.total == 0) {
			//alert("Cesta VACÍA");
		}
		else if (this.clientecod == "HACER RESET") {
		alert("Límite de ID Cliente, haga reset en menú MÁQUINA");
		}

		else{
		
		this.rollo1ant = this.tarifaAS1Cantidad + this.tarifaA2S1Cantidad + this.tarifaBS1Cantidad + this.tarifaCS1Cantidad + 4*this.tarifaAT1Cantidad + 4*this.tarifa4T1Cantidad;
		this.rollo2ant = this.tarifaAS2Cantidad + this.tarifaA2S2Cantidad + this.tarifaBS2Cantidad + this.tarifaCS2Cantidad + 4*this.tarifaAT2Cantidad + 4*this.tarifa4T2Cantidad;
		this.ticketsventa = 2 + this.tarifaAT1Cantidad + this.tarifa4T1Cantidad + this.tarifaAT2Cantidad + this.tarifa4T2Cantidad;

			let tickets = 2 + this.tarifaAT1Cantidad + this.tarifa4T1Cantidad + this.tarifaAT2Cantidad + this.tarifa4T2Cantidad;

			Meteor.call("updateSesion");
			Meteor.call("updateRollos", sellos1, sellos2, tickets);
			

			let newOrderArray = [];
// DEFINIR campos para informe:
			let orderProps = {
				mes: mes_maquina,
				cliente : this.config.codigo.cliente,
			fechaSello: this.config.sello.fecha,
			evento: this.config.sello.evento,
				fechaTicket: fecha_ticket,
			modelo1: this.config.sello.modelo1,
			modelo2: this.config.sello.modelo2,
				modo: this.config.codigo.modo,
				codigoMaquina: this.config.codigo.maquina,
				pais: this.config.codigo.pais,
				yearMaquina: year_maquina,
			items: items,
			precios: precios,
				rollo1: this.config.ticket.rollo1,
				rollo2: this.config.ticket.rollo2,
				rollo1ant: this.config.ticket.rollo1ant,
				rollo2ant: this.config.ticket.rollo2ant,
		modoImpresion: this.config.sello.elnperfil,	
			elevento: this.config.sello.elevento,
			elnevento: this.config.sello.elnevento,
			feria: this.config.sello.feria,
			lugar: this.config.sello.lugar,

			//elevento: this.config.ticket.elevento,
			//titulo: this.config.ticket.titulo,
			titulo: eltitulo
				
			}
			var annioMaquina = year_maquina
// para: imprimirprueba(){
//orderProps.modoImpresion = "Filatelia";

			//var mesMaquina = mes_maquina
// INFORME: PERFIL *FILTRO*
			if (this.perfilpros == "filatelia") {
				orderProps.modoImpresion = "Filatelia";
			}
			if (this.perfilpros == "protocolo") {
				orderProps.modoImpresion = "Protocolo";
			}

			let ordersQtys = items.split(" ");
			for (var i = 0; i < ordersQtys.length; i++) {
				if(ordersQtys[i]>0){
					if(i==4 || i==10){
						var type = "Tarifa A Tira 4";
						var qtySet = 4;
						var precio = this.tarifaAPrecioTira;
					}
					else if(i==5 || i==11){
							var type = "Tira de 4 Tarifas";
						var qtySet = 4;
						var precio = this.tarifaPrecioTira4;
					}
					else{
						var type = "Etiqueta individual";
						var qtySet = 1;
						if (i==0 || i==6) {
							var precio = this.tarifaAPrecioSimple;
						}
						else if (i==1 || i==7) {
							var precio = this.tarifaA2PrecioSimple;
						}
						else if (i==2 || i==8) {
							var precio = this.tarifaBPrecioSimple;
						}
						else if (i==3 || i==9) {
							var precio = this.tarifaCPrecioSimple;
						}
					};

								// TICKET/INFORME: MOTIVO 1 2

					if (i<=5) {
						var modelo = orderProps.modelo1;
					}
					else{
						var modelo = orderProps.modelo2;
					}
// columnas INFORME - Título y Campos defenidos: .meteor/local/db
					let newLine = {
						//event: orderProps.fechaSello,
						event: orderProps.fechaSello,
								venue: orderProps.evento,
						machine: orderProps.codigoMaquina,
							vendType: type,
							productName: modelo,
						transactionDate: fecha_ticket,
						quantity: parseInt(ordersQtys[i]),
							quantitySet: qtySet,
						totalStamps: ordersQtys[i]*qtySet,
						currency: "EUR",
		// VALUE: "precio" error en tira 4T= 4.199999999999
							value: precio,
						paymentStatus: orderProps.modoImpresion,
						sesionId: orderProps.cliente,
						etiquetasRollo1: orderProps.rollo1,
						etiquetasRollo2: orderProps.rollo2,
						etiquetaMes: orderProps.mes,
								titutoEvento: orderProps.elnevento,
								feria: orderProps.feria,
								Lugar: orderProps.lugar,
						fecha: fechaMaquina,
						mes: mesMaquina,
						annio: annioMaquina,
						documento: orderProps.titulo,
					}
					newOrderArray.push(newLine);
				}
			}
			console.log(newOrderArray)

			Meteor.call("insertOrder", newOrderArray);

		this.tarifaAS1Cantidad = 0;
		this.tarifaA2S1Cantidad = 0;
		this.tarifaBS1Cantidad = 0;
		this.tarifaCS1Cantidad = 0;
		this.tarifaAT1Cantidad = 0;
		this.tarifa4T1Cantidad = 0;
		this.tarifaAS2Cantidad = 0;
		this.tarifaA2S2Cantidad = 0;
		this.tarifaBS2Cantidad = 0;
		this.tarifaCS2Cantidad = 0;
		this.tarifaAT2Cantidad = 0;
		this.tarifa4T2Cantidad = 0;
			//// AQUI EN MAC
			this.websocket.send(message);
				this.reset();

		}
	}


	enviarMensaje(mensaje){
		console.log("Enviando mensaje...")
		// this.websocket.send(mensaje);
	}
	reset(){
		this.tarifaAS1Cantidad = 0;
		this.tarifaA2S1Cantidad = 0;
		this.tarifaBS1Cantidad = 0;
		this.tarifaCS1Cantidad = 0;
		this.tarifaAT1Cantidad = 0;
		this.tarifa4T1Cantidad = 0;
		this.tarifaAS2Cantidad = 0;
		this.tarifaA2S2Cantidad = 0;
		this.tarifaBS2Cantidad = 0;
		this.tarifaCS2Cantidad = 0;
		this.tarifaAT2Cantidad = 0;
		this.tarifa4T2Cantidad = 0;
	}

}

const name = 'kiosko';

export default angular.module(name, [
	angularMeteor,
	uiRouter
	])
.component(name, {
	template,
	controller: [ '$reactive', '$scope', Kiosko ],
	controllerAs: "Kiosko"
})
.config(config);

function config($stateProvider) {
	'ngInject';
	$stateProvider
	.state(name, {
		url: '/kiosko',
		template: '<kiosko></kiosko>'
	});
}
