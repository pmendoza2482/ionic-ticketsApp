import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, ActionSheetController, AlertController, LoadingController } from '@ionic/angular';
import { TicketsService } from 'src/app/servicios/tickets.service';
import { UbicacionService } from 'src/app/servicios/ubicacion.service';
import { Estados } from 'src/app/modelos/estado.models';
import { RequestTicket, MaeTickets } from 'src/app/modelos/MaeTickets.models';
import { MensajeAdvertencia } from 'src/app/clasesComunes/validaciones';
import { FotosComponent } from '../fotos/fotos.component';
import { GeneralClienteComponent } from '../general-cliente/general-cliente.component';

@Component({
  selector: 'app-ticket-detalle',
  templateUrl: './ticket-detalle.component.html',
  styleUrls: ['./ticket-detalle.component.scss'],
})
export class TicketDetalleComponent implements OnInit {

  //@Input() ticket: string;

  @Input() ticketRecibido: MaeTickets;
  // ticketDet: MaeTickets = {};
  requestTick: RequestTicket = {};

  imagen24: string;

  customAlertOptions: any = {
    header: 'Cambiar Estado',
    subHeader: 'Al seleccionar una opción cambiara el estado del ticket.',
    translucent: true
  };

  estados: Estados[] = [
    {
      estado: 'EN ESPERA'
    },
    {
      estado: 'ABIERTO'
    },
    {
      estado: 'SIN ASIGNAR'
    },
    {
      estado: 'CERRADO'
  }];
  
  constructor(private state: ActivatedRoute,
    private modalCtrl: ModalController,
    public actionSheetController: ActionSheetController,
    private ticketsService: TicketsService,
    private ubicacionService: UbicacionService,
    public alertController: AlertController,
    public loadingController: LoadingController) { }

  async ngOnInit() {

  }

  async IraInfoCliente(cliente: number){

    const modal = await this.modalCtrl.create({
      component: GeneralClienteComponent,
      componentProps: { cliente },
      cssClass: 'mi-componente-css'
   });

   modal.onDidDismiss().then(() => {

    // this.GenerarTotales();
   });

   return await modal.present();
  }

  async IrFotos(){

  let tkt = this.ticketRecibido.ticket;
  
  const modal = await this.modalCtrl.create({
    component: FotosComponent,
    componentProps: { tkt },
    cssClass: 'mi-componente-css'
 });

 modal.onDidDismiss().then(() => {

  // this.GenerarTotales();
 });

 return await modal.present();

  }

  async SeleccionoOpcion(event){

    let nuevoEstado = event.target.value;

   // console.log(event.target.value);
    this.GuardarInformacion(nuevoEstado);

  }

  async GuardarInformacion(nuevoEstado: string){

    console.log('entra aqui!!')

    await this.ubicacionService.iniciarGeoLacalizacion();

    let lat = this.ubicacionService.ubicacionUsuario.latitud;
    let lon = this.ubicacionService.ubicacionUsuario.longitud;

    this.requestTick.ticket = this.ticketRecibido.ticket;
    this.requestTick.estado = nuevoEstado;
    this.requestTick.latitud = lat.toString();
    this.requestTick.longitud = lon.toString();

    const alert = await this.alertController.create({
      header: 'Confirmar!',
      message: 'El estado del ticket va a ser modificado, desea continuar?' ,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
           
          // this.listaReserva.closeSlidingItems();

          }
        }, {
          text: 'Confirmar',
          handler: () => {

            this.ConfirmarGuardar();
            //console.log(this.requestTick)
          }
        }
      ]
    });

    await alert.present();

  }

  async ConfirmarGuardar(){

    let loading = await this.loadingController.create({
      message: 'Guardando ...'
    });
  
    await loading.present();

    const valido = await this.ticketsService.guardarEstadoCoordenadas(this.requestTick);
  
    if(valido){

      loading.dismiss();
      MensajeAdvertencia('Estado modificado!!');

    }else{

      loading.dismiss();
      MensajeAdvertencia('Ocurrio un error : ');
    }
  }

  regresar(){

    this.modalCtrl.dismiss();
  }

}
