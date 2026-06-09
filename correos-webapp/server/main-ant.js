import '../imports/api/config';
import '../imports/api/images';
import '../imports/api/orders';

import { Config } from '../imports/api/config/collection';

if (Config.find().count() == 0){
	Meteor.call("initConfig");	
	
}
import { Meteor } from 'meteor/meteor';
import { exec } from 'child_process';

Meteor.methods({
  activarSpool() {
    return new Promise((resolve, reject) => {
      exec("../../demonio/activar_spool.py", (err, stdout, stderr) => {
        if (err) reject(stderr);
        else resolve(stdout);
      });
    });
  },

  desactivarSpool() {
    return new Promise((resolve, reject) => {
      exec("../../demonio/desactivar_spool.py", (err, stdout, stderr) => {
        if (err) reject(stderr);
        else resolve(stdout);
      });
    });
  }
});