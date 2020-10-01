import {  AlertController } from '@ionic/angular';

export function ValidarUsuario(usuario){

    if(usuario === undefined || usuario === ""){
  
      MensajeAdvertencia('Tiene que ingresar un usuario!');
      return false;
      
    }
    else{

      return true;
    }
  }
  
  export function ValidarContrasena(contrasena){
  
    if(contrasena === undefined || contrasena === ""){
  
      MensajeAdvertencia('Tiene que ingresar una contraseña!');
      return false; 
    }
    else{
  
      return true;
    }
  }

  export async function MensajeAdvertencia(mensaje: string) {

    let alertController = new AlertController();
  
    const alert = await alertController.create({
      header: 'Validación',
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