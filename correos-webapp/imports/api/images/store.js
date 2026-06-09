import { UploadFS } from 'meteor/jalik:ufs';
import { Images } from './collection';
 
export const ImagesStore = new UploadFS.store.GridFS({
  collection: Images,
  name: 'images',
  permissions: new UploadFS.StorePermissions({
        insert: function () {
            return true;
        },
        update: function () {
            return true;
        },
        remove: function () {
            return true;
        }
    })
});