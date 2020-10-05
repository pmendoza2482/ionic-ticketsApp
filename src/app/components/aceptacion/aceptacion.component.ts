import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TicketsService } from 'src/app/servicios/tickets.service';
import { MaeTickets } from 'src/app/modelos/MaeTickets.models';
import { ObtenerAceptacionComponent } from '../obtener-aceptacion/obtener-aceptacion.component';

@Component({
  selector: 'app-aceptacion',
  templateUrl: './aceptacion.component.html',
  styleUrls: ['./aceptacion.component.scss'],
})
export class AceptacionComponent implements OnInit {

  @Input() tkt: string;

  tickets: MaeTickets = {};

  constructor(private modalCtr: ModalController,
    private ticketsService: TicketsService,
    ) { }

  ngOnInit() {

    this.ObtenerAceptacion();
  }

  async ObtenerAceptacion(){

    (await this.ticketsService.obtenerImagenes(this.tkt)).subscribe((tick)=> {
      
      console.log(tick['data'])
      this.tickets = tick['data']

    }, (errorObtenido) => {
      console.log(errorObtenido);
    })

  }

  async ObtenerAceptacionCliente(){

    let tkt = this.tkt;

      const modal = await this.modalCtr.create({
        component: ObtenerAceptacionComponent,
        componentProps: { tkt },
        cssClass: 'mi-componente-css'
    });

    modal.onDidDismiss().then(async () => {

     // await this.ObtenerTickets(this.usuarioTickets, this.estadoFiltro);
    });

    return await modal.present();

  }

  regresar(){

    this.modalCtr.dismiss();
  }

}
