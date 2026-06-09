import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { Meteor } from 'meteor/meteor';
import ngFileUpload from 'ng-file-upload';

import template from './subirImagenCrop.html';
import './subirImagenCrop.css';
import { upload } from '/imports/api/archivos';
import { Miniaturas } from '/imports/api/archivos';

class SubirImagenCrop {
	constructor($scope, $reactive) {
		'ngInject';
		$reactive(this).attach($scope);
		this.uploaded = [];
		this.$scope = $scope;

		this.helpers({
			imagen(){
				var imagen = Miniaturas.findOne({originalId : this.getReactively('files', true)});
				if (imagen) {
					console.log("Hay imagen!");
					this.url = imagen.url;
					$scope.$apply();
				};
				
				return Miniaturas.findOne({originalId : this.getReactively('files', true)});
			}
		});
	}
	addImages(archivos) {
		if (archivos.length) {
			this.currentFile = archivos[0];
			
			const reader = new FileReader;
			
			reader.onload = this.$bindToContext((e) => {
				this.cropImgSrc = e.target.result;
				this.myCroppedImage = '';
			});
			
			reader.readAsDataURL(archivos[0]);
		} 
		else {
			this.cropImgSrc = undefined;
		}
	}
	save() {
		upload(this.myCroppedImage, this.currentFile.name)
		.then((result) => {
			this.uploading = false;
			console.log(result);
			if (!this.files || !this.files.length) {
				this.files = [];
			}
			this.files = result._id;
			this.reset();

		})
		.catch((error) => {
			this.uploading = false;
			console.log(`Something went wrong!`, error);
		});
	}

	reset() {
		this.cropImgSrc = undefined;
		this.myCroppedImage = '';
		this.$scope.$apply();

	}
}	
const name = 'subirImagenCrop';

export default angular.module(name, [
	angularMeteor,
	ngFileUpload
	]).component(name, {
		template,
		bindings: {
			files: '=?',
			url: '=?'
		},
		controllerAs: name,
		controller: ['$scope', '$reactive', SubirImagenCrop]
	});