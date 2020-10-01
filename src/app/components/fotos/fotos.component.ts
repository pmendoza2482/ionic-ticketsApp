import { Component, OnInit, Input } from '@angular/core';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { TicketsService } from 'src/app/servicios/tickets.service';
import { MaeTickets } from 'src/app/modelos/MaeTickets.models';
import { MensajeAdvertencia } from 'src/app/clasesComunes/validaciones';

declare var window: any;

@Component({
  selector: 'app-fotos',
  templateUrl: './fotos.component.html',
  styleUrls: ['./fotos.component.scss'],
})
export class FotosComponent implements OnInit {

  @Input() tkt: string;

 // tempImagen: string[] = [];

   tickets: MaeTickets = {};

  imagen24: string;
  
  constructor(private modalCtr: ModalController,
    public actionSheetController: ActionSheetController,
    private camera: Camera,
    private ticketsService: TicketsService) { }

  async ngOnInit() {

    this.ObtenerImagenes();

  }

  async ObtenerImagenes(){

    (await this.ticketsService.obtenerImagenes(this.tkt)).subscribe((tick)=> {
      
      console.log(tick['data'])
      this.tickets = tick['data']

      //this.imagen24 = this.tickets.ImagenDRW1;
      // this.tempImagen.push(tick['data']);

    }, (errorObtenido) => {
      console.log(errorObtenido);
    })

  }

  regresar(){

    this.modalCtr.dismiss();
  }

  camara(numeroFoto: number){

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA
    };

    this.procesarImagen(options, numeroFoto); 
  }

  libreria(numeroFoto: number){

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };

    this.procesarImagen(options, numeroFoto);
  }

  procesarImagen(options: CameraOptions, numeroFoto: number){

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      // let base64Image = 'data:image/jpeg;base64,' + imageData;
 
      //const img = window.Ionic.WebView.convertFileSrc(imageData);
 
      this.ticketsService.subirImagen(imageData, this.tkt, numeroFoto);

      this.ObtenerImagenes();
     // this.tempImagen.push(img);

     }, (err) => {
      
      MensajeAdvertencia('Ocurrio un error al cargar la foto.' + err);
     });

  }

  async IrFotos(numeroFoto: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      buttons: [{
        text: 'Camara',      
        icon: 'camera',
        cssClass : 'mi-accionAzul',
        handler: () => {
          this.camara(numeroFoto);
        }
      }, {
        text: 'Galeria',
        icon: 'images',
        cssClass : 'mi-accionAzul',
        handler: () => {
          //console.log(numeroFoto);
          this.libreria(numeroFoto);
        }
      }, {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel', 
        cssClass : 'mi-accionCerrar',    
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }
}
