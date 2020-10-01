import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { UbicacionUsuario } from '../clasesComunes/ubicacionUsuario';

@Injectable({
  providedIn: 'root'
})
export class UbicacionService {

  public ubicacionUsuario: UbicacionUsuario;
  
  constructor(private geolocation: Geolocation) { }

  async iniciarGeoLacalizacion(){

    await this.geolocation.getCurrentPosition().then((resp) => {

      this.ubicacionUsuario = ({ 
        latitud: resp.coords.latitude,
        longitud: resp.coords.longitude
      });

     }).catch((error) => {
       console.log('Error getting location', error);
     });

  }

}
