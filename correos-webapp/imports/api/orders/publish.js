import { Meteor } from 'meteor/meteor';

import { Orders } from './collection';


if (Meteor.isServer) {
	Meteor.publish("orders", function (query) {
		// console.log(query)
		if (query) {
			return Orders.find(query.selector, query.options)
		}
		else{
			return Orders.find();
		}
	});
}