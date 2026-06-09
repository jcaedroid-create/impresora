import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './subirImagen.html';
import './subirImagen.less';

import ngFileUpload from 'ng-file-upload';
import 'ng-img-crop/compile/minified/ng-img-crop';
import 'ng-img-crop/compile/minified/ng-img-crop.css';

import { upload } from '/imports/api/images';

class SubirImagen {
  constructor($reactive, $scope) {
    $reactive(this).attach($scope);

    this.uploaded = [];

    this.helpers({
      afkar(){
      }

    })
  }
  addImages(files) {
    if (files.length) {
      this.currentFile = files[0];
      
      const reader = new FileReader;
      
      reader.onload = this.$bindToContext((e) => {
        this.cropImgSrc = e.target.result;
      });
      
      reader.readAsDataURL(files[0]);
    } else {
      this.cropImgSrc = undefined;
    }
  }

  save() {
    upload(this.cropImgSrc, this.name)
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
  }
}

const name = 'subirImagen';

export default angular.module(name, [
  angularMeteor,
  ngFileUpload,
  'ngImgCrop'
  ])
.component(name, {
  bindings:{
    name: '@'
  },
  template,
  controller: ['$reactive', '$scope', SubirImagen],
  controllerAs: "SubirImagen"
});
