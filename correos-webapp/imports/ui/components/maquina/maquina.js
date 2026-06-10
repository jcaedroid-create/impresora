import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './maquina.html';
import './maquina.less';

import { name as SubirImagen } from '../subirImagen/subirImagen';
import { Config } from '../../../api/config/collection';
import { Images } from '../../../api/images/collection';

class Maquina {
	constructor($reactive, $scope, $state) {
		$reactive(this).attach($scope);
		// INICIO nuevo para informe
		function onOpen(evt)
		{
			console.log("connected\n");
		}
		function onClose(evt)
		{
			console.log("disconnected\n");
		}
		function onMessage(evt)
		{
			console.log("response: " + evt.data + '\n');
		}
		function onError(evt)
		{
			console.log('error: ' + evt.data + '\n');
			websocket.close();
		}
		var wsHost = window.location.hostname || 'localhost';
		var websocket = new WebSocket("ws://" + wsHost + ":8000/");
		// var websocket = new WebSocket("ws://169.254.128.40:8000/");
		websocket.onopen = function(evt) { onOpen(evt) };
		websocket.onclose = function(evt) { onClose(evt) };
		websocket.onmessage = function(evt) { onMessage(evt) };
		websocket.onerror = function(evt) { onError(evt) };
		this.websocket = websocket;
		// FIN nuevo para informe

		this.$state = $state;

		this.helpers({
			readConfig(){
				let config = Config.findOne()
				if (config) {

// añadido modelo ORIGEN IMPRIMIR.JS				
				this.feria = config.sello.feria;
				this.lugar = config.sello.lugar;
				this.nombreModelo1 = config.sello.elnmodelo1;
				this.nombreModelo2 = config.sello.elnmodelo2;	
				this.elnperfil = config.sello.elnperfil;

// -------------
					if (config.ticket.fecha == "auto") {
						this.modoFecha = 1;
					}
					else{
						this.modoFecha = 2;
						this.fechaManual = config.ticket.fecha;
					}
					if (config.ticket.hora == "auto") {
						this.modoHora = 1;
					}
					else{
						this.modoHora = 2;
						this.horaManual = config.ticket.hora;
					}

					this.eltitulo = config.ticket.eltitulo;

					if (config.sello.elnperfil == "FERIA") {
						this.titulo = config.ticket.eltitulo;
						this.tituloCopia = "COPIA " + config.ticket.eltitulo;
					}
					else{
						this.titulo = config.sello.elnperfil;
						this.tituloCopia = "COPIA " + config.sello.elnperfil;
					}
					if (config.codigo.mes == 0) {
					this.elmes = "Automático";
					} else{
						this.elmes = config.codigo.mes;
					}

					//this.tituloCopia = config.ticket.tituloCopia;
					this.limiteImporte = config.ticket.limiteImporte;
					this.NUEVOlimiteImporte = config.ticket.NUEVOlimiteImporte;	

					this.rollo1 = config.ticket.rollo1;
					this.rollo2 = config.ticket.rollo2;
					this.tickets = config.ticket.tickets;
					this.limiteTickets = config.ticket.limiteTickets;
					
					this.empresa = config.ticket.empresa;
					this.cif = config.ticket.cif;
					this.cp = config.ticket.cp;
					this.l1 = config.ticket.l1;
					this.l2 = config.ticket.l2;
					this.l3 = config.ticket.l3;

					this.T1especial = config.ticket.T1especial;
					this.T2especial = config.ticket.T2especial;	
					this.T3especial = config.ticket.T3especial;
					this.TEmod1 = config.ticket.TEmod1;
					this.TEmod2 = config.ticket.TEmod2;

					this.ImprimeCopiaTicket = config.ticket.ImprimeCopiaTicket;
					this.ImprimeMasterTicket = config.ticket.ImprimeMasterTicket;

					this.modo = config.codigo.modo;
					this.pais = config.codigo.pais;
					this.mes = config.codigo.mes;

					
					this.rollo1ant = config.ticket.rollo1ant;
					this.rollo2ant = config.ticket.rollo2ant;

					if (config.codigo.annio == "auto") {
						this.modoAnnio = 1;
					}
					else{
						this.modoAnnio = 2;
						this.annioManual = config.codigo.annio;
					}
					this.nombre = config.codigo.maquina;
					this.idCliente = config.codigo.cliente;
					this.idProducto = config.codigo.producto;
					this.bloqueado = config.ticket.bloqueado;


				}
			}
		})


	}
//INICIO INFORME
Colocar1(){

		//var mensaje = confirm("¿colocar rollo 1?");
		//if (mensaje) {

		let newOrderArray = [];
		let orderProps1 = {
			


			}
		let newLine = {
						//event: orderProps.fechaSello,
						event: "COLOCAR ROLLO 1",
						venue: " ",
						machine: " ",
						vendType: " ",
						productName: " ",
						transactionDate: "",
						quantity: " ",
						quantitySet: " ",
						totalStamps: " ",
						currency: " ",
						value: " ",
						paymentStatus: " ",
						sesionId: " " ,
						etiquetasRollo1: "COLOCADO",
						etiquetasRollo2: "",
						etiquetaMes: " ",
						titutoEvento: " ",
						feria: " ",
						Lugar: " ",
						fecha: " ",
						mes: " ",
						annio: " ",
						documento: " ",
					}
			newOrderArray.push(newLine);	
			
			console.log(newOrderArray)

			Meteor.call("insertOrder", newOrderArray);	
			//// AQUI EN MAC
							
 	//}
 	//else {
 	//alert("¡¡cancelado colocar 1!!");
 	//}
	}

	Colocar2(){

		//var mensaje = confirm("¿colocar rollo 2?");
		//if (mensaje) {

		let newOrderArray = [];
		let orderProps1 = {
			


			}
		let newLine = {
						//event: orderProps.fechaSello,
						event: "COLOCAR ROLLO 2",
						venue: " ",
						machine: " ",
						vendType: " ",
						productName: " ",
						transactionDate: "",
						quantity: " ",
						quantitySet: " ",
						totalStamps: " ",
						currency: " ",
						value: " ",
						paymentStatus: " ",
						sesionId: " " ,
						etiquetasRollo1: " ",
						etiquetasRollo2: "COLOCADO",
						etiquetaMes: " ",
						titutoEvento: " ",
						feria: " ",
						Lugar: " ",
						fecha: " ",
						mes: " ",
						annio: " ",
						documento: " ",
					}
			newOrderArray.push(newLine);	
			
			console.log(newOrderArray)

			Meteor.call("insertOrder", newOrderArray);	
			//// AQUI EN MAC
							
 	//}
 	//else {
 	//alert("¡¡cancelado colocar 2!!");
 	//}
	}

	Quitar1(){

		//var mensaje = confirm("¿QUITAR rollo 1?");
		//if (mensaje) {

		let newOrderArray = [];
		let orderProps1 = {
			


			}
		let newLine = {
						//event: orderProps.fechaSello,
						event: "QUITAR ROLLO 1",
						venue: " ",
						machine: " ",
						vendType: " ",
						productName: " ",
						transactionDate: "",
						quantity: " ",
						quantitySet: " ",
						totalStamps: " ",
						currency: " ",
						value: " ",
						paymentStatus: " ",
						sesionId: " " ,
						etiquetasRollo1: "QUITADO",
						etiquetasRollo2: "",
						etiquetaMes: " ",
						titutoEvento: " ",
						feria: " ",
						Lugar: " ",
						fecha: " ",
						mes: " ",
						annio: " ",
						documento: " ",
					}
			newOrderArray.push(newLine);	
			
			console.log(newOrderArray)

			Meteor.call("insertOrder", newOrderArray);	
			//// AQUI EN MAC
							
 	//}
 	//else {
 	//alert("¡¡cancelado QUITAR 1!!");
 	//}
	}

	Quitar2(){

		//var mensaje = confirm("¿QUITAR rollo 2?");
		//if (mensaje) {

		let newOrderArray = [];
		let orderProps1 = {
			


			}
		let newLine = {
						//event: orderProps.fechaSello,
						event: "QUITAR ROLLO 2",
						venue: " ",
						machine: " ",
						vendType: " ",
						productName: " ",
						transactionDate: "",
						quantity: " ",
						quantitySet: " ",
						totalStamps: " ",
						currency: " ",
						value: " ",
						paymentStatus: " ",
						sesionId: " " ,
						etiquetasRollo1: " ",
						etiquetasRollo2: "QUITADO",
						etiquetaMes: " ",
						titutoEvento: " ",
						feria: " ",
						Lugar: " ",
						fecha: " ",
						mes: " ",
						annio: " ",
						documento: " ",
					}
			newOrderArray.push(newLine);	
			
			console.log(newOrderArray)

			Meteor.call("insertOrder", newOrderArray);	
			//// AQUI EN MAC
							
 	//}
 	//else {
 	//alert("¡¡cancelado QUITAR 2!!");
 	//}
	}
	// FIN INFORME


	update(){
		let updatedConfig = {
			ticket: {
				//elevento: this.elevento,

				// fecha: "auto",
				// hora: "auto",
				bloqueado: this.bloqueado,
				eltitulo: this.eltitulo,
				titulo: this.titulo,
				tituloCopia: this.tituloCopia,
				rollo1: parseInt(this.rollo1),
				rollo2: parseInt(this.rollo2),
				rollo1ant: parseInt(this.rollo1ant),
				rollo2ant: parseInt(this.rollo2ant),
				tickets: parseInt(this.tickets),
				limiteTickets: parseInt(this.limiteTickets),
				empresa: this.empresa,
				cif: this.cif,
				cp: this.cp,
				l1: this.l1,
				l2: this.l2,
				l3: this.l3,
				T1especial: parseInt(this.T1especial),
				T2especial: parseInt(this.T2especial),
				T3especial: parseInt(this.T3especial),
				TEmod1: this.TEmod1,
				TEmod2: this.TEmod2,
				ImprimeCopiaTicket: this.ImprimeCopiaTicket,
				ImprimeMasterTicket: this.ImprimeMasterTicket,
				NUEVOlimiteImporte: this.NUEVOlimiteImporte,
				limiteImporte: this.limiteImporte
			},

			codigo: {
				modo: this.modo,
				elmes: this.elmes,
				mes: this.mes,
				// annio: "auto",
				pais: this.pais,
				maquina: this.nombre,
				cliente: parseInt(this.idCliente),
				producto: parseInt(this.idProducto)
			}
		}

		if (this.modoFecha == "1") {
			updatedConfig.ticket.fecha = "auto";
		} else {
			updatedConfig.ticket.fecha = this.fechaManual;
		}
		if (this.modoHora == "1") {
			updatedConfig.ticket.hora = "auto";
		} else {
			updatedConfig.ticket.hora = this.horaManual;
		}

		if (this.modoAnnio == "1") {
			updatedConfig.codigo.annio = "auto";
		} else {
			updatedConfig.codigo.annio = this.annioManual;
		}

		Meteor.call("updateMaquinaConfig", updatedConfig)
		this.$state.go('maquina')
	}
	exportarXLS() {
		Meteor.call('downloadXLS', function(err, fileContent) {
			if(err) {
				console.log(err)
			}
			if(fileContent){
				var nameFile = 'reporte-ATM.csv';
				var blob = new Blob([fileContent], {type: "text/plain;charset=utf-8"});
				saveAs(blob, nameFile);
			}
		});
	}
}

const name = 'maquina';

export default angular.module(name, [
	angularMeteor,
	uiRouter
	])
.component(name, {
	template,
	controller: [ '$reactive', '$scope', '$state', Maquina ],
	controllerAs: "Maquina"
})
.config(config);

function config($stateProvider) {
	'ngInject';
	$stateProvider
	.state(name, {
		url: '/maquina',
		template: '<maquina></maquina>'
	});
}
