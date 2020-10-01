import { Component, OnInit } from '@angular/core';
import { MaeTickets, RequestTicket } from 'src/app/modelos/MaeTickets.models';
import { ActivatedRoute } from '@angular/router';
import { GeneralClienteComponent } from 'src/app/components/general-cliente/general-cliente.component';
import { ModalController, ActionSheetController, AlertController, LoadingController } from '@ionic/angular';
import { MaeClientes } from 'src/app/modelos/MaeClientes.models';
import { FotosComponent } from 'src/app/components/fotos/fotos.component';
import { Estados } from 'src/app/modelos/estado.models';
import { UbicacionService } from 'src/app/servicios/ubicacion.service';
import { MensajeAdvertencia } from 'src/app/clasesComunes/validaciones';
import { TicketsService } from 'src/app/servicios/tickets.service';

@Component({
  selector: 'app-detalle-ticket',
  templateUrl: './detalle-ticket.page.html',
  styleUrls: ['./detalle-ticket.page.scss'],
})
export class DetalleTicketPage implements OnInit {

  tk: MaeTickets;
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

    this.tk = JSON.parse(this.state.snapshot.params.ticketT);

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

  let ticket = this.tk.ticket;
  let img1 = this.imagen24;

  const modal = await this.modalCtrl.create({
    component: FotosComponent,
    componentProps: { ticket, img1 },
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

    await this.ubicacionService.iniciarGeoLacalizacion();

    let lat = this.ubicacionService.ubicacionUsuario.latitud;
    let lon = this.ubicacionService.ubicacionUsuario.longitud;

    this.requestTick.ticket = this.tk.ticket;
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
}
