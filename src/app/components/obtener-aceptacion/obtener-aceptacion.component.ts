import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';

import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { TicketsService } from 'src/app/servicios/tickets.service';
import { MensajeAdvertencia } from 'src/app/clasesComunes/validaciones';

@Component({
  selector: 'app-obtener-aceptacion',
  templateUrl: './obtener-aceptacion.component.html',
  styleUrls: ['./obtener-aceptacion.component.scss'],
})
export class ObtenerAceptacionComponent implements OnInit {

  @Input() tkt: string;
  // @ViewChild(SignaturePad) signaturePad: SignaturePad;
  @ViewChild('signatureCanvas', {static: true}) signaturePad: SignaturePad;

  firmaCliente: any;

  private signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 1,
    'backgroundColor': '#ffffff',
    'canvasWidth': 500,
    'canvasHeight': 300
  };

  constructor(private modalCtr: ModalController,
    private ticketsService: TicketsService,
    public loadingController: LoadingController,
    public alertController: AlertController) { }

  ngOnInit() {}

  async GuardarAceptacion(){

   // console.log(this.firmaCliente)

   const alert = await this.alertController.create({
    header: 'Confirmar!',
    message: 'Se va a guardar la aceptación del cliente, desea continuar?' ,
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {

        }
      }, {
        text: 'Confirmar',
        handler: () => {

          this.GuardarImagen();
        }
      }
    ]
  });

  await alert.present();
   

    
  }

  async GuardarImagen(){

    let loading = await this.loadingController.create({
      message: 'Guardando ...'
    });
  
    await loading.present();

    const valido = await this.ticketsService.subirImagen(this.firmaCliente, this.tkt, 4);

    if(valido){

      loading.dismiss();
      MensajeAdvertencia('Aceptación guardada.');
      this.regresar();

    }else{

      loading.dismiss();
     // MensajeAdvertencia('Ocurrio un error : ');
    }
  }

  drawStart() {
    // will be notified of szimek/signature_pad's onBegin event
    console.log('begin drawing');
  }

  drawComplete() {
    // will be notified of szimek/signature_pad's onEnd event
    //console.log(this.signaturePad.toDataURL());

    this.firmaCliente = this.signaturePad.toDataURL();

  }

  LimpiarPad(){

    this.signaturePad.clear();
  }

  regresar(){

    this.modalCtr.dismiss();
  }

}
