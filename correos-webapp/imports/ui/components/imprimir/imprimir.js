import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './imprimir.html';
import './imprimir.less';

import { name as SubirImagen } from '../subirImagen/subirImagen';

import { Config } from '../../../api/config/collection';
import { Images } from '../../../api/images/collection';

class Imprimir {
	constructor($reactive, $scope, $state) {
		$reactive(this).attach($scope);

		this.$state = $state;

		this.helpers({
			readConfig(){
				let config = Config.findOne();
				if (config) {

// PERFIL
					this.modo = config.sello.modo;
// EL EVENTO (en imprimir.js va fuera de los if)
// EL EVENTO (en maquina.js no va en ningun lugar)
// EL EVENTO (en kiosko.js si va dentro de los if, ACIVARLO)
	
		  //this.elnevento = config.sello.nevento;

		  this.nperfil1 = "Filatelia";
		  this.nperfil2 = "Esporádicos";
		  //this.nperfil3 = config.sello.nperfil3;
		  this.nperfil3 = "SPDE";
		  this.nperfil4 = config.sello.nperfil4;
		  //this.nperfil5 = config.sello.nperfil5;
		  this.nperfil5 = "Abono/Envío";
		  this.nperfil6 = "FERIA";

			this.nevento0 = config.sello.nevento0;
				this.nferia0 = config.sello.nferia0;
				this.nlugar0 = config.sello.nlugar0;
				this.motivoi0 = config.sello.motivoi0;
				this.motivod0 = config.sello.motivod0;
				this.fecha0 = config.sello.fecha0;
				this.localidad0 = config.sello.localidad0;

			this.nevento1 = config.sello.nevento1;
				this.nferia1 = config.sello.nferia1;
				this.nlugar1 = config.sello.nlugar1;
				this.motivoi1= config.sello.motivoi1;
				this.motivod1 = config.sello.motivod1;
				this.fecha1 = config.sello.fecha1;
				this.localidad1 = config.sello.localidad1;

			this.nevento2 = config.sello.nevento2;
				this.nferia2 = config.sello.nferia2;
				this.nlugar2 = config.sello.nlugar2;
				this.motivoi2 = config.sello.motivoi2;
				this.motivod2 = config.sello.motivod2;
				this.fecha2 = config.sello.fecha2;
				this.localidad2 = config.sello.localidad2;

			this.nevento3 = config.sello.nevento3;
				this.nferia3 = config.sello.nferia3;
				this.nlugar3 = config.sello.nlugar3;
				this.motivoi3 = config.sello.motivoi3;
				this.motivod3 = config.sello.motivod3;
				this.fecha3 = config.sello.fecha3;
				this.localidad3 = config.sello.localidad3;

			this.nevento4 = config.sello.nevento4;
				this.nferia4 = config.sello.nferia4;
				this.nlugar4 = config.sello.nlugar4;
				this.motivoi4 = config.sello.motivoi4;
				this.motivod4 = config.sello.motivod4;
				this.fecha4 = config.sello.fecha4;
				this.localidad4 = config.sello.localidad4;	

			this.nevento5 = config.sello.nevento5;
				this.nferia5 = config.sello.nferia5;
				this.nlugar5 = config.sello.nlugar5;
				this.motivoi5 = config.sello.motivoi5;
				this.motivod5 = config.sello.motivod5;
				this.fecha5 = config.sello.fecha5;
				this.localidad5 = config.sello.localidad5;
				
			this.nevento6 = config.sello.nevento6;
				this.nferia6 = config.sello.nferia6;
				this.nlugar6 = config.sello.nlugar6;
				this.motivoi6 = config.sello.motivoi6;
				this.motivod6 = config.sello.motivod6;
				this.fecha6 = config.sello.fecha6;
				this.localidad6 = config.sello.localidad6;
				
			this.nevento7 = config.sello.nevento7;
				this.nferia7 = config.sello.nferia7;
				this.nlugar7 = config.sello.nlugar7;
				this.motivoi7 = config.sello.motivoi7;
				this.motivod7 = config.sello.motivod7;
				this.fecha7 = config.sello.fecha7;
				this.localidad7 = config.sello.localidad7;			
			
// grupo segun EL EVENTO 
	this.elevento = config.sello.elevento;
	this.elperfil = config.sello.elperfil;


 
			//	this.elnevento = config.sello.nevento[config.sello.elevento];
			//	this.feria = config.sello.nferia[config.sello.elevento];
			//	this.lugar = config.sello.nlugar[config.sello.elevento];
			//	this.nombreModelo1 = config.sello.motivoi[config.sello.elevento];
			//	this.nombreModelo2 = config.sello.motivod[config.sello.elevento];
			//	this.fechaInstalacion = config.sello.fecha[config.sello.elevento];
			//	this.evento = config.sello.localidad[config.sello.elevento];
			if (config.sello.elperfil == 1) {
				this.elnperfil = config.sello.nperfil1;
				this.PERFILlimiteImporte = config.ticket.NUEVOlimiteImporte;
			}	
			if (config.sello.elperfil == 2) {
				this.elnperfil = config.sello.nperfil2;
				this.PERFILlimiteImporte = config.ticket.NUEVOlimiteImporte;
			}
			if (config.sello.elperfil == 3) {
				this.elnperfil = config.sello.nperfil3;
				this.PERFILlimiteImporte = config.ticket.NUEVOlimiteImporte;

			}
			if (config.sello.elperfil == 4) {
				this.elnperfil = config.sello.nperfil4;
				this.PERFILlimiteImporte = config.ticket.NUEVOlimiteImporte;
			}
			if (config.sello.elperfil == 5) {
				this.elnperfil = config.sello.nperfil5;
				this.PERFILlimiteImporte = config.ticket.NUEVOlimiteImporte;
			}
			if (config.sello.elperfil == 6) {
				this.elnperfil = config.sello.nperfil6;
				this.PERFILlimiteImporte = config.ticket.limiteImporte;
			}

			if (config.sello.elevento == 0) {
				//this.elnevento = "CHAMARTIN"; 
				this.elnevento = config.sello.nevento0;
				this.feria = config.sello.nferia0;
				this.lugar = config.sello.nlugar0;
				this.nombreModelo1 = config.sello.motivoi0;
				this.nombreModelo2 = config.sello.motivod0;
				this.fechaInstalacion = config.sello.fecha0;
				this.evento = config.sello.localidad0;
			}
			if (config.sello.elevento == 1) {
				//this.elnevento = "Plaza Mayor";
				this.elnevento = config.sello.nevento1;
				this.feria = config.sello.nferia1;
				this.lugar = config.sello.nlugar1;
				this.nombreModelo1 = config.sello.motivoi1;
				this.nombreModelo2 = config.sello.motivod1;
				this.fechaInstalacion = config.sello.fecha1;
				this.evento = config.sello.localidad1;	
			}
			 if (config.sello.elevento == 2) {
				//this.elevento = "Juvenia";
				this.elnevento = config.sello.nevento2;
				this.feria = config.sello.nferia2;
				this.lugar = config.sello.nlugar2;
				this.nombreModelo1 = config.sello.motivoi2;
				this.nombreModelo2 = config.sello.motivod2;
				this.fechaInstalacion = config.sello.fecha2;
				this.evento = config.sello.localidad2;	
			}			
			 	if (config.sello.elevento == 3) {
				//this.elevento = "Exfilna";
				this.elnevento = config.sello.nevento3;
				this.feria = config.sello.nferia3;
				this.lugar = config.sello.nlugar3;
				this.nombreModelo1 = config.sello.motivoi3;
				this.nombreModelo2 = config.sello.motivod3;
				this.fechaInstalacion = config.sello.fecha3;
				this.evento = config.sello.localidad3;	
			}
				 if (config.sello.elevento == 4) {
				//this.elevento = "VOID;
				this.elnevento = config.sello.nevento4;
				this.feria = config.sello.nferia4;
				this.lugar = config.sello.nlugar4;
				this.nombreModelo1 = config.sello.motivoi4;
				this.nombreModelo2 = config.sello.motivod4;
				this.fechaInstalacion = config.sello.fecha4;
				this.evento = config.sello.localidad4;
			}
			 if (config.sello.elevento == 5) {
				//this.elevento = "VOID;
				this.elnevento = config.sello.nevento5;
				this.feria = config.sello.nferia5;
				this.lugar = config.sello.nlugar5;
				this.nombreModelo1 = config.sello.motivoi5;
				this.nombreModelo2 = config.sello.motivod5;
				this.fechaInstalacion = config.sello.fecha5;
				this.evento = config.sello.localidad5;
			}
			 if (config.sello.elevento == 6) {
				//this.elevento = "VOID;
				this.elnevento = config.sello.nevento6;
				this.feria = config.sello.nferia6;
				this.lugar = config.sello.nlugar6;
				this.nombreModelo1 = config.sello.motivoi6;
				this.nombreModelo2 = config.sello.motivod6;
				this.fechaInstalacion = config.sello.fecha6;
				this.evento = config.sello.localidad6;
			}
			 if (config.sello.elevento == 7) {
				//this.elevento = "VOID;
				this.elnevento = config.sello.nevento7;
				this.feria = config.sello.nferia7;
				this.lugar = config.sello.nlugar7;
				this.nombreModelo1 = config.sello.motivoi7;
				this.nombreModelo2 = config.sello.motivod7;
				this.fechaInstalacion = config.sello.fecha7;
				this.evento = config.sello.localidad7;
			}

					this.tarifaAPrecio = config.precios.tarifaA;
					this.tarifaA2Precio = config.precios.tarifaA2;
					this.tarifaBPrecio = config.precios.tarifaB;
					this.tarifaCPrecio = config.precios.tarifaC;
					this.tarifaTAPrecio = config.precios.tarifaTA;
					this.tarifaT4Precio = config.precios.tarifaT4;
					this.bloqueado = config.ticket.bloqueado;

				}
			},
			modelo1(){
				if(Images.findOne({name: "Modelo1"}))
					return Images.findOne({name: "Modelo1"}).url;
			},
			modelo2(){
				if(Images.findOne({name: "Modelo2"}))
					return Images.findOne({name: "Modelo2"}).url;
			}
		});
	}

	update(){
		let updatedConfig = {
			sello:{
				PERFILlimiteImporte: this.PERFILlimiteImporte,
				nombreModelo1: this.nombreModelo1,
				nombreModelo2: this.nombreModelo2,
				evento: this.evento,
				fecha: this.fechaInstalacion,
				modelo1: this.nombreModelo1,
				modelo2: this.nombreModelo2,
				modo: this.modo,
				elevento: this.elevento,
				elnevento: this.elnevento,
				feria: this.feria,
				lugar: this.lugar,
				elperfil: this.elperfil,
				elnperfil: this.elnperfil,
				nperfil1:this.nperfil1,
				nperfil2:this.nperfil2,
				nperfil3:this.nperfil3,
				nperfil4:this.nperfil4,
				nperfil5:this.nperfil5,
				nperfil6:this.nperfil6,
				elnmodelo1: this.nombreModelo1,
				elnmodelo2: this.nombreModelo2,
					nevento0: this.nevento0,
				nferia0: this.nferia0,
				nlugar0: this.nlugar0,
				motivoi0: this.motivoi0,
				motivod0: this.motivod0,
				fecha0: this.fecha0,
				localidad0: this.localidad0,
					nevento1: this.nevento1,
				nferia1: this.nferia1,
				nlugar1: this.nlugar1,
				motivoi1: this.motivoi1,
				motivod1: this.motivod1,
				fecha1: this.fecha1,
				localidad1: this.localidad1,
					nevento2: this.nevento2,
				nferia2: this.nferia2,
				nlugar2: this.nlugar2,
				motivoi2: this.motivoi2,
				motivod2: this.motivod2,
				fecha2: this.fecha2,
				localidad2: this.localidad2,
					nevento3: this.nevento3,
				nferia3: this.nferia3,
				nlugar3: this.nlugar3,
				motivoi3: this.motivoi3,
				motivod3: this.motivod3,
				fecha3: this.fecha3,
				localidad3: this.localidad3,
					nevento4: this.nevento4,
				nferia4: this.nferia4,
				nlugar4: this.nlugar4,
				motivoi4: this.motivoi4,
				motivod4: this.motivod4,
				fecha4: this.fecha4,
				localidad4: this.localidad4,
					nevento5: this.nevento5,
				nferia5: this.nferia5,
				nlugar5: this.nlugar5,
				motivoi5: this.motivoi5,
				motivod5: this.motivod5,
				fecha5: this.fecha5,
				localidad5: this.localidad5,
					nevento6: this.nevento6,
				nferia6: this.nferia6,
				nlugar6: this.nlugar6,
				motivoi6: this.motivoi6,
				motivod6: this.motivod6,
				fecha6: this.fecha6,
				localidad6: this.localidad6,	
					nevento7: this.nevento7,
				nferia7: this.nferia7,
				nlugar7: this.nlugar7,
				motivoi7: this.motivoi7,
				motivod7: this.motivod7,
				fecha7: this.fecha7,
				localidad7: this.localidad7	
			},

			precios:{
				tarifaA: this.tarifaAPrecio,
				tarifaA2: this.tarifaA2Precio,
				tarifaB: this.tarifaBPrecio,
				tarifaC: this.tarifaCPrecio,
				tarifaTA: this.tarifaTAPrecio,
				tarifaT4: this.tarifaT4Precio
			}
		}
		Meteor.call("updateImprimirConfig", updatedConfig)
		this.$state.go('imprimir')
	}

}

const name = 'imprimir';

export default angular.module(name, [
	angularMeteor,
	uiRouter,
	SubirImagen
	])
.component(name, {
	template,
	controller: [ '$reactive', '$scope', '$state', Imprimir],
	controllerAs: "Imprimir"
})
.config(config);

function config($stateProvider) {
	'ngInject';
	$stateProvider
	.state(name, {
		url: '/imprimir',
		template: '<imprimir></imprimir>'
	});
}