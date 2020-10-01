import { Component, OnInit, Input, ɵConsole } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MaeClientes } from 'src/app/modelos/MaeClientes.models';
import { TicketsService } from 'src/app/servicios/tickets.service';
import { MaeTickets } from 'src/app/modelos/MaeTickets.models';

@Component({
  selector: 'app-general-cliente',
  templateUrl: './general-cliente.component.html',
  styleUrls: ['./general-cliente.component.scss'],
})
export class GeneralClienteComponent implements OnInit {

  @Input() cliente: number;

  clienteTicket: MaeClientes = {};
  
  constructor(private modalCtr: ModalController,
    private ticketsService: TicketsService) { }

  async ngOnInit() {

    (await this.ticketsService.obtenerCliente(this.cliente)).subscribe((tick)=> {
      
      this.clienteTicket = tick['data']

    }, (errorObtenido) => {
      console.log(errorObtenido);
    });
  }

  regresar(){

    this.modalCtr.dismiss();
  }

}
