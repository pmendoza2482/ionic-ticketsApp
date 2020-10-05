import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment';
import { NavController } from '@ionic/angular';
import { MensajeAdvertencia } from '../clasesComunes/validaciones';
import { ResponseValidacion } from '../modelos/MaeTickets.models';


const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  token: string = null;

  constructor(private http: HttpClient,
    private storege: Storage,
    private navCtrl: NavController) { }

    async login(usuario: string, password: string){

      const data = { Login: usuario, Password: password };

      return new Promise(resolve => {

        this.http.post(`${ URL }Ticket/Autenticar`, data)
          .subscribe(async resp => {

            console.log(resp);
              
            if(resp['data'] == null && resp['message'] != ""){

            this.token = null;
            this.storege.clear();
            resolve(false);
            MensajeAdvertencia(resp['message']);

            }
            if(resp['data']){
  
              await this.guardarToken(resp['token']);
              resolve(true);

            }
            else{
  
              this.token = null;
              this.storege.clear();
              resolve(false);
            }
          });
      });

    }

    async guardarToken(token: string){

      this.token = token;
      await this.storege.set('token', token);
    }

    async cargarToken(){

      this.token = await this.storege.get('token') || null;
    }

    async validarToken(): Promise<boolean>{

      await this.cargarToken();

      if(!this.token){

        this.navCtrl.navigateRoot('/login');
        return Promise.resolve(false);
      }

      return new Promise<boolean>(resolve => {

        const headers = new HttpHeaders({
          'Authorization': 'Bearer ' + this.token
        });

        this.http.get(URL + 'Ticket/ValidarTokenPorUsuario', { headers })
          .subscribe(resp => {

            console.log(resp)

           // if(resp['data']){
              if(resp['esValido']){

               // this.usuario = resp['usuario']
              resolve(true);
            } else {

              this.navCtrl.navigateRoot('/login');
              resolve(false);
            }
        });

      });
    }

    async validarX(){

      await this.cargarToken();

      if(!this.token){

        return false;
      }

      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      });

      this.http.get<ResponseValidacion>(URL + 'Ticket/ValidarTokenPorUsuario', { headers });
    }
  

}
