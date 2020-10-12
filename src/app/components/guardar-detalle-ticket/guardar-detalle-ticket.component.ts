import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { UbicacionService } from 'src/app/servicios/ubicacion.service';
import { RequestTicket } from 'src/app/modelos/MaeTickets.models';
import { TicketsService } from 'src/app/servicios/tickets.service';
import { MensajeAdvertencia, ValidarMotivo } from 'src/app/clasesComunes/validaciones';

@Component({
  selector: 'app-guardar-detalle-ticket',
  templateUrl: './guardar-detalle-ticket.component.html',
  styleUrls: ['./guardar-detalle-ticket.component.scss'],
})
export class GuardarDetalleTicketComponent implements OnInit {

  @Input() supervisor: boolean;
  @Input() ticketSeleccionado: string;
  @Input() estadoActual: string;
  @Input() usuarioSistema: string;

  requestTick: RequestTicket = {};

  radEstado: string;
  motivoCambio: string;

  mostrarOpcionSi: boolean = false;

  constructor(private modalCtrl: ModalController,
    private ubicacionService: UbicacionService,
    public alertController: AlertController,
    public loadingController: LoadingController,
    private ticketsService: TicketsService) { }

  ngOnInit() {

    this.radEstado = this.estadoActual;

    this.mostrarOpcionSi = this.supervisor ? true 
                        : this.estadoActual === "ABIERTO" 
                        ? true : false;
  }

  Cancelar(){

    this.modalCtrl.dismiss();
  }

  async GuardarInformacion(){

    if(this.estadoActual === this.radEstado)
    {
      MensajeAdvertencia(`El estado del ticket ya está : ${this.radEstado} no se guardaran cambios.`, 'Advertencia');
      return;
    }

    if(ValidarMotivo(this.motivoCambio)){

      console.log('entra aqui!!')

      await this.ubicacionService.iniciarGeoLacalizacion();

      let lat = this.ubicacionService.ubicacionUsuario.latitud;
      let lon = this.ubicacionService.ubicacionUsuario.longitud;

      this.requestTick.ticket = this.ticketSeleccionado;
      this.requestTick.estado = this.radEstado;
      this.requestTick.latitud = lat.toString();
      this.requestTick.longitud = lon.toString();
      this.requestTick.motivo = this.motivoCambio;
      this.requestTick.usuario = this.usuarioSistema;

      const alert = await this.alertController.create({
        header: 'Confirmar!',
        message: 'El estado del ticket va a ser modificado, desea continuar?' ,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              
              this.Cancelar();

            }
          }, {
            text: 'Confirmar',
            handler: () => {


              console.log(this.requestTick)
              this.ConfirmarGuardar();
              
            }
          }
        ]
      });

      await alert.present();

    }
  }

  async ConfirmarGuardar(){

    let loading = await this.loadingController.create({
      message: 'Guardando ...'
    });

    await loading.present();

    const valido = await this.ticketsService.guardarEstadoCoordenadas(this.requestTick);

    if(valido){

      loading.dismiss();
      MensajeAdvertencia('Estado modificado!!', 'Información');

    }else{

      loading.dismiss();
      MensajeAdvertencia('Ocurrio un error : ', 'Error');
    }
  }

}
