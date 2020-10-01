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

  constructor(public http: HttpClient,
    private storege: Storage,
    private fileTransfer: FileTransfer) { }

  async obtenerTickets(usuario: string, estadoFiltro: string){

    console.log(this.token)

    await this.cargarToken();

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

    fileTransfer.upload(img, URL + `Ticket/SalvarImagen?ticket=${ticket}&numeroImg=${numeroImagen}`, options)
    .then(data => {
      //console.log(data)
    }).catch(err => {
      MensajeAdvertencia('Ocurrio un error:' + err);
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
