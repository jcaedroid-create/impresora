import '../imports/api/config';
import '../imports/api/images';
import '../imports/api/orders';

import { Config } from '../imports/api/config/collection';

if (Config.find().count() == 0){
	Meteor.call("initConfig");	
	
}