import { Component, OnInit, ViewChild } from '@angular/core';
import { MaeTickets } from 'src/app/modelos/MaeTickets.models';
import { Router, ActivatedRoute } from '@angular/router';
import { TicketsService } from 'src/app/servicios/tickets.service';
import { ModalController } from '@ionic/angular';
import { TicketDetalleComponent } from 'src/app/components/ticket-detalle/ticket-detalle.component';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { MensajeAdvertencia } from 'src/app/clasesComunes/validaciones';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

 @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

 habilitado = true;
 tickets: MaeTickets[] = [];
 ticketDet: MaeTickets = {};
 fechaHoy: Date = new Date('2020-08-25 00:10:15.423');
// usuarioTickets: string;
 usuarioTickets: string;
 //tipoUsuario: string = 'Usuario';
 tipoUsuario: string;

 estadoFiltro: string = 'ABIERTO';
 colorEstado = "warning";

 supervisor: boolean = true; 

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
    private usuarioService: UsuarioService,
    private modalCtrl: ModalController) {

      console.log('entra aqui despues q vence el token. CONSTRUCTOR')
    }

    async ngOnInit() {

      console.log('entra aqui despues q vence el token. ngInit')

      // this.state.queryParams.subscribe(async params => {
      //   if (params && params.special) {
      //     //store the temp in data
      //     this.usuarioTickets = JSON.parse(params.special);  
      //   }
      // })

      this.state.params.subscribe(params => {

       // console.log(params)
        this.usuarioTickets = params['usuario']; 
        //console.log(this.usuarioTickets)
       });

      //console.log(this.usuarioTickets)
      // LLAMAR METODO QUE ME DICE QUE TIPO DE USUARIO ES
      await this.ObtenerTipoUsuario(this.usuarioTickets);
  
  }

  async ObtenerTipoUsuario(usuario: string){

    (await this.usuarioService.obtenerTipoUsuario(usuario))
    .subscribe(async tick => {

        this.tipoUsuario = tick['data'];

        this.supervisor = this.tipoUsuario === 'Supervisor' ? true : false;

        await this.ObtenerTickets(this.usuarioTickets, this.estadoFiltro, true);

        }, (errorObtenido) => {

          console.log(errorObtenido);

          if(errorObtenido.statusText === "Unauthorized"){

          MensajeAdvertencia('La sesión finalizo, tienes que ingresar de nuevo.', 'Información');
          this.route.navigate(['login']);

          return;

          }
        })
  }

  async ObtenerTickets(usuario: string, estadoFiltro: string, pull: boolean = false, event?){

    (await this.ticketsService.obtenerTicketsPaginado(usuario, estadoFiltro, pull))
            .subscribe(tick => {
      
     console.log('registros data : ', tick['data'].length)
    // console.log(tick['data'])

          if(tick['data'].length === 0){

           console.log('data lengt = 0')
           this.habilitado = false;
           event.target.complete();
           return;
         }  

         this.tickets.push(...tick['data']);

         if(event){

          event.target.complete();
         }

    }, (errorObtenido) => {

      console.log(errorObtenido);

      if(errorObtenido.statusText === "Unauthorized"){

        MensajeAdvertencia('La sesión finalizo, tienes que ingresar de nuevo.', 'Información');
        this.route.navigate(['login']);

        return;

      }
    })

  }

  async siguientes(event){

    //console.log('entra en siguientes ...')

    await this.ObtenerTickets(this.usuarioTickets, this.estadoFiltro, false, event);
  }

  async recargar(event){

    //console.log('recargando')
    
    await this.ObtenerTickets(this.usuarioTickets, this.estadoFiltro, true, event);

    this.habilitado = true;
    this.tickets = [];
  }

  async SeleccionarOpcion(event){

    this.habilitado = true;
    this.tickets = [];

    this.estadoFiltro = event.detail.value;

    await this.ObtenerTickets(this.usuarioTickets, this.estadoFiltro);
   // await this.siguientes(this.usuarioTickets, this.estadoFiltro);
  }

  async IrDetalleTicket(t: MaeTickets){

    (await this.ticketsService.obtenerDetalleTicketPorTicket(t.ticket)).subscribe(async tick=> {
    
      this.ticketDet = tick['data']

      console.log('llama al detalle de los tickets');
    
      await this.LlamarModalDetalle(this.ticketDet);

    }, (errorObtenido) => {

      console.log(errorObtenido.statusText);

        if(errorObtenido.statusText === "Unauthorized"){

          MensajeAdvertencia('La sesión finalizo, tienes que ingresar de nuevo.', 'Información');
          this.route.navigate(['login']);
          //this.route.navigateByUrl('login');
  
        }
      });
  }

  async LlamarModalDetalle(ticketRecibido: MaeTickets){

    let supervisor = this.supervisor;
    let usuarioSistema = this.usuarioTickets;

      const modal = await this.modalCtrl.create({
        component: TicketDetalleComponent,
        componentProps: { ticketRecibido, supervisor, usuarioSistema },
        cssClass: 'mi-componente-css'
    });

    modal.onDidDismiss().then(async () => {

      //console.log('entra modal desmise', this.habilitado)
      this.tickets = [];
      this.habilitado = true;

      await this.ObtenerTickets(this.usuarioTickets, this.estadoFiltro, true);
    });

    return await modal.present();
  }

  
}
