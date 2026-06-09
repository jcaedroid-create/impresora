import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './home.html';
import './home.less';

class Home {
	constructor($state) {
		this.$state = $state;
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

		var websocket = new WebSocket("ws://169.254.145.162:8000/");
		websocket.onopen = function(evt) { onOpen(evt) };
		websocket.onclose = function(evt) { onClose(evt) };
		websocket.onmessage = function(evt) { onMessage(evt) };
		websocket.onerror = function(evt) { onError(evt) };
		this.websocket = websocket;
		
	}
	enviarMensaje(mensaje){
		console.log("Enviando mensaje...")
		this.websocket.send(mensaje);
	}
	goTo(dest){
		this.$state.go(dest);
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

const name = 'home';

export default angular.module('home', [
	angularMeteor,
	uiRouter
	])
.component(name, {
	template,
	controller: ['$state', Home],
	controllerAs: "Home"
})
.config(config);

function config($stateProvider) {
	'ngInject';
	$stateProvider
	.state(name, {
		url: '/afkar',
		template: '<home></home>'
	});
}
