import { Meteor } from 'meteor/meteor';

import { Config } from './collection';


if (Meteor.isServer) {
	Meteor.publish("config", function (query) {
		// console.log(query)
		if (query) {
			return Config.find(query.selector, query.options)
		}
		else{
			return Config.find();
		}
	});
}