import { Component, OnInit } from '@angular/core';
import { MaeTickets } from 'src/app/modelos/MaeTickets.models';
import { Router, ActivatedRoute } from '@angular/router';
import { TicketsService } from 'src/app/servicios/tickets.service';
import { ModalController } from '@ionic/angular';
import { TicketDetalleComponent } from 'src/app/components/ticket-detalle/ticket-detalle.component';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { MensajeAdvertencia } from 'src/app/clasesComunes/validaciones';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

 tickets: MaeTickets[] = [];
 ticketDet: MaeTickets = {};
 fechaHoy: Date = new Date('2020-08-25 00:10:15.423');
 usuarioTickets: string;
 tipoUsuario: string = 'Usuario   ';

 estadoFiltro: string = 'Abierto';
 colorEstado = "warning";

  // tickets: MaeTickets[] = [
  //   {
  //     ticket: 'I-200825-003',
  //     descripcion: 'NO PUEDE VER VIDEO EN NETFLIX',
  //     estado: 'SIN ASIGNAR',
  //     fechaIni: this.fechaHoy,
  //     tipoReclamo: 'PROBLEMA ANCHO DE BANDA',
  //     telefono1: '25440188  ',
  //     telefono2: '',
  //     MaeCliente: 
  //     {
  //       codigo: 13,
  //       nombre: 'OSCAR RENE DIAZ',
  //       iP: '30.20.10.0/30',
  //       fecha: '2020-06-15 20:48:51.000',
  //       router: 6,
  //       download: '66M       ',
  //       upload: '66M       ',
  //       iPPublica: '179.63.254.0/30',
  //       status: 'Activo    ',
  //       direccion: '12 calle 33 -78 zona 7 Tikal II. De la garita cruza a la derecha luego hasta el fondo que es la 12 calle y cruza a la izquierda, casa de dos pisos portones negros ALTOS, EN LA CUADRA QUE DA PARA LA ENTRADA DE LA COLONIA BRISAS DEL VALLE',
  //       telefono1: '31807763  ',
  //       telefono2: '4412123   ',
  //       telefono3: '32398074  ',
  //       observaciones: 'ESTA ES UNA PRUEBA, DE QUE TODO LO ACORDADO EN ESTE PROGRAMA ESTA FUNCIONANDO COMO DEBE DE SER, PROBADO DESDE CEIBA',
  //       departamento: 'CORTES',
  //       ciudad: 'SAN PEDRO SULA'
  //     }
  //   },
  //   {
  //     ticket: 'I-200825-006',
  //     descripcion: 'EL CLIENTE REPORTA QUE SE QUEDO SIN SEÑAL DESDE LAS 4:00PM',
  //     estado: 'ABIERTO',
  //     fechaIni: this.fechaHoy,
  //     tipoReclamo: 'SIN SERVICIO',
  //     telefono1: '25440188  ',
  //     telefono2: '',
  //     MaeCliente: 
  //     {
  //       codigo: 235,
  //       nombre: 'ABED MORAZAN RAMIREZ',
  //       iP: '10.0.204.124/30',
  //       fecha: '2020-07-30 12:13:53.770',
  //       router: 2,
  //       download: '17M       ',
  //       upload: '17M       ',
  //       iPPublica: '0.0.0.0',
  //       status: 'Activo    '
  //     }
  //   }
  // ];

  constructor(private state: ActivatedRoute,
    private route: Router,
    private ticketsService: TicketsService,
    private modalCtrl: ModalController,
    private usuarioService: UsuarioService) {}

    async ngOnInit() {

    this.usuarioTickets = JSON.parse(this.state.snapshot.params.usuarioTicket);

    console.log(this.usuarioTickets)
    console.log('Llama metodo al iniciar los tickets')

    await this.ObtenerTickets(this.usuarioTickets, this.estadoFiltro);

  }

  async ObtenerTickets(usuario: string, estadoFiltro: string){

    (await this.ticketsService.obtenerTickets(usuario, estadoFiltro)).subscribe((tick)=> {
      
      this.tickets = tick['data']

      console.log('Llama todos los tickets')

    }, (errorObtenido) => {

      console.log(errorObtenido);

      if(errorObtenido.statusText === "Unauthorized"){

        MensajeAdvertencia('La sesión finalizo, tienes que ingresar de nuevo.');
        this.route.navigate(['login']);

      }
      
    })
  }

  async recargar(event){

    await this.ObtenerTickets(this.usuarioTickets, this.estadoFiltro);

    event.target.complete();

  }

  async SeleccionarOpcion(event){

    console.log(event.detail.value);

    this.estadoFiltro = event.detail.value;

    await this.ObtenerTickets(this.usuarioTickets, this.estadoFiltro);
  }

  async IrDetalleTicket(t: MaeTickets){

    (await this.ticketsService.obtenerDetalleTicketPorTicket(t.ticket)).subscribe(async tick=> {
    
      this.ticketDet = tick['data']

      console.log('llama al detalle de los tickets');
    
      await this.LlamarModalDetalle(this.ticketDet);

    }, (errorObtenido) => {

      console.log(errorObtenido.statusText);

        if(errorObtenido.statusText === "Unauthorized"){

          MensajeAdvertencia('La sesión finalizo, tienes que ingresar de nuevo.');
          this.route.navigate(['login']);
  
        }
      });
  }

  async LlamarModalDetalle(ticketRecibido: MaeTickets){

      const modal = await this.modalCtrl.create({
        component: TicketDetalleComponent,
        componentProps: { ticketRecibido },
        cssClass: 'mi-componente-css'
    });

    modal.onDidDismiss().then(async () => {

      await this.ObtenerTickets(this.usuarioTickets, this.estadoFiltro);
    });

    return await modal.present();
  }

}
