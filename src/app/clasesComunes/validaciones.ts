import {  AlertController } from '@ionic/angular';

export function ValidarUsuario(usuario){

    if(usuario === undefined || usuario === ""){
  
      MensajeAdvertencia('Tiene que ingresar un usuario!', 'Advertencia');
      return false;
      
    }
    else{

      return true;
    }
  }
  
  export function ValidarContrasena(contrasena){
  
    if(contrasena === undefined || contrasena === ""){
  
      MensajeAdvertencia('Tiene que ingresar una contraseña!', 'Advertencia');
      return false; 
    }
    else{
  
      return true;
    }
  }

  export function ValidarMotivo(motivo){
  
    if(motivo === undefined || motivo === ""){
  
      MensajeAdvertencia('Tiene que ingresar un motivo de cambio del estado del ticket!', 'Advertencia');
      return false; 
    }
    else{
  
      return true;
    }
  }

  export async function MensajeAdvertencia(mensaje: string, tipo: string) {

    let alertController = new AlertController();
  
    const alert = await alertController.create({
      header: tipo,
      message: mensaje ,
      buttons: [
      {
          text: 'Aceptar',
          handler: () => {
          //
          }
        }
      ]
    });
  
    await alert.present();
  }