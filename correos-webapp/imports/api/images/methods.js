import { Meteor } from 'meteor/meteor';
import { UploadFS } from 'meteor/jalik:ufs';
import { ImagesStore } from './store';
import { Images } from './collection';
import { dataURItoBlob } from './helpers';

async function removeImagesWithName(name) {
  await Images.removeAsync({ name: name });
}

export function upload(data, name) {
  // convert to Blob
  var data = dataURItoBlob(data);
  console.log(data);
  console.log(name);
  console.log(ImagesStore);
  data.name = name;

  Meteor.call("removeImagesWithName", name);

  return new Promise(function (resolve, reject) {
    const file = {
      name: data.name,
      type: data.type,
      size: data.size,
    };
    const upload = new UploadFS.Uploader({
      data: data,
      file: file,
      store: ImagesStore,
      onError: reject,
      onComplete: resolve
    });
    upload.start();
  });
}

Meteor.methods({
  removeImagesWithName
});
