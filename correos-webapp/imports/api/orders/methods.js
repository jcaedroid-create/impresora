import { Orders } from './collection';


function insertOrder(orders){
	for (var i = 0; i < orders.length; i++) {
		Orders.insert(orders[i]);
	}
}

function downloadXLS() {
	var collection = Orders.find().fetch();
	var heading = true; // Optional, defaults to true
	var delimiter = ";" // Optional, defaults to ",";
	return exportcsv.exportToCSV(collection, heading, delimiter);
}

Meteor.methods({
	insertOrder,
	downloadXLS
});