import { Config } from './collection';

function initConfig(){
  let initialConfiguration = {
    ticket : {
    //  elevento: "Plaza Mayor"
      feria: "XLIX Feria Nacional Sello",
      lugar: "Plaza Mayor - Madrid",
      fecha: "auto",
      hora: "auto",
      titulo: "Factura Simplificada",
      tituloCopia: "COPIA Factura Simplificada",
      rollo1: 1500,
      rollo2: 1500,
      tickets: 450,
      limiteTickets: 450,
      limiteImporte: 399.99,
      empresa: "S.E. Correos y Telégrafos S.A., S.M.E.",
      cif: "A83052407",
      cp: "28042 Madrid",
      l1: "Exento de impuestos",
      l2: "Objeto de coleccionismo",
      l3: "No se admiten devoluciones"
    },
    codigo: {
      modo: "P",
      mes: 0,
      annio: "auto",
      pais: "ES",
      maquina: "CH17",
      cliente: 1,
      producto: 1,
    },

    sello: {
      fecha: "21-24 abril 2016",
      evento: "Madrid",
      modelo1: "Telegrafo",
      modelo2: "Buzon",
      modo: 0
    },

    precios: {
      tarifaA: 0.50,
      tarifaA2: 0.60,
      tarifaB: 1.25,
      tarifaC: 1.35
      
    }
  }

  Config.remove({});
  Config.insert(initialConfiguration);
}




function updateMaquinaConfig(config){
  let updatedTicket = config.ticket;
  let updatedCodigo = config.codigo;

  Config.update({_id : Config.findOne()._id}, {$set : {ticket: updatedTicket, codigo: updatedCodigo}});
}

function updateImprimirConfig(config){
  let updatedSello = config.sello;
  let updatedPrecios = config.precios;



  Config.update({_id : Config.findOne()._id}, {$set : {sello: updatedSello, precios: updatedPrecios}});
}
function updateSesion(){
  Config.update({_id : Config.findOne()._id}, {$inc : {"codigo.cliente": 1}});
}
function updateSesionerror(){
  Config.update({_id : Config.findOne()._id}, {$inc : {"codigo.cliente": -1}});
}
function updateRollos(sellos1, sellos2, tickets) {
  Config.update({_id : Config.findOne()._id}, {$inc : {"ticket.rollo1": sellos1*-1}});
  Config.update({_id : Config.findOne()._id}, {$inc : {"ticket.rollo2": sellos2*-1}});
  Config.update({_id : Config.findOne()._id}, {$inc : {"ticket.tickets": tickets*-1}});
}

function updateRollosAnterror(rollo1ant1, rollo2ant2, ticketsant){
  Config.update({_id : Config.findOne()._id}, {$inc : {"ticket.rollo1": rollo1ant1*+1}});
  Config.update({_id : Config.findOne()._id}, {$inc : {"ticket.rollo2": rollo2ant2*+1}});
  Config.update({_id : Config.findOne()._id}, {$inc : {"ticket.tickets": ticketsant*+1}});
  }

Meteor.methods({
  initConfig,
  updateMaquinaConfig,
  updateImprimirConfig,
 updateSesionerror,
  updateSesion,
  updateRollos,
  updateRollosAnterror
});