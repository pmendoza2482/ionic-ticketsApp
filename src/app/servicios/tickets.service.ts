import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { ResponseTickets, RequestTicket, ResponseImagenes, ResponseTicket } from '../modelos/MaeTickets.models';
import { ResponseCliente } from '../modelos/MaeClientes.models';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { MensajeAdvertencia } from '../clasesComunes/validaciones';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  token: string = null;
  ticketPagina = 0;

  estadoActual = '';
 // estadoPagina = 0;

  constructor(public http: HttpClient,
    private storege: Storage,
    private fileTransfer: FileTransfer) { }

  async obtenerTicketsPaginado(usuario: string, estadoFiltro: string, pull: boolean = false){

    console.log('entra aqui despues q vence el token. obtener data servicio')

    if(pull){
      this.ticketPagina = 0;
    }

    console.log(this.estadoActual)

    if(this.estadoActual === estadoFiltro){

      this.ticketPagina ++;
    }else{

      this.ticketPagina = 1;
      this.estadoActual = estadoFiltro;
    }

    console.log(this.ticketPagina)

    await this.cargarToken();

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.token
    });

    return this.http.get<ResponseTickets>(URL + `Ticket/MostrarTicketsPaginadoPorUsuario?usuario=${usuario}&estado=${estadoFiltro}&pageNumber=${this.ticketPagina}&pageSize=10`, { headers });
    //return this.http.get<ResponseTickets>(URL + `Ticket/MostrarTicketsPorUsuario?usuario=${usuario}&estado=${estadoFiltro}`, { headers });
  }

  async obtenerTickets(usuario: string, estadoFiltro: string){

    console.log(this.token)

    await this.cargarToken();

    console.log(this.token)

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.token
    });

    return this.http.get<ResponseTickets>(URL + `Ticket/MostrarTicketsPorUsuario?usuario=${usuario}&estado=${estadoFiltro}`, { headers });
  }

  async obtenerDetalleTicketPorTicket(ticket: string,){

    await this.cargarToken();

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.token
    });

    return this.http.get<ResponseTicket>(URL + `Ticket/MostrarTicketDetallePorTicket?ticket=${ticket}`, { headers });
  }

  async obtenerCliente(cliente: number){

    await this.cargarToken();

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.token
    });
 
    return this.http.get<ResponseCliente>(URL + `Ticket/MostrarClientesPorCodigo?codigo=${cliente}`, { headers });
  }

  async cargarToken(){

    this.token = await this.storege.get('token') || null;
  }

  async guardarEstadoCoordenadas(ticket: RequestTicket){

    return new Promise (resolve => {

      this.http.put<boolean>(URL + 'Ticket/EditarEstadoTicket', ticket)
      .subscribe(resp => {

        if(resp['data']){
          resolve(true);
        } else{
          resolve(false);
        }
      });

    });
  }

  async subirImagen(img: string, ticket: string, numeroImagen: number){

    const options: FileUploadOptions = {
      fileKey: 'files'
      // , headers: {
      //   'Authorization': 'Bearer ' + this.token
      // }
    };

    const fileTransfer: FileTransferObject = this.fileTransfer.create();

    return new Promise (resolve => {

      fileTransfer.upload(img, URL + `Ticket/SalvarImagen?ticket=${ticket}&numeroImg=${numeroImagen}`, options)
      .then(data => {

        resolve(true);
        //console.log(data)
      }).catch(err => {

        resolve(false);
        MensajeAdvertencia('Ocurrio un error:' + err, 'Error');
      });

    });
  }

  async obtenerImagenes(ticket: string){

    // await this.cargarToken();

    // const headers = new HttpHeaders({
    //   'Authorization': 'Bearer ' + this.token
    // });
 
    return this.http.get<ResponseImagenes>(URL + `Ticket/MostrarImagenesPorTicket?ticket=${ticket}`);
  }

}
