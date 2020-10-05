import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { Camera } from '@ionic-native/camera/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { SignaturePadModule } from 'angular2-signaturepad';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { GeneralClienteComponent } from './components/general-cliente/general-cliente.component';
import { FotosComponent } from './components/fotos/fotos.component';
import { ImageSanitizerPipe } from './pipes/image-sanitizer.pipe';
import { FechasPersonalizadasPipe } from './pipes/fechas-personalizadas.pipe';
import { HistoricoComponent } from './components/historico/historico.component';
import { PipesTicketsModule } from './pipes-tickets/pipes-tickets.module';
import { TicketDetalleComponent } from './components/ticket-detalle/ticket-detalle.component';
import { AceptacionComponent } from './components/aceptacion/aceptacion.component';
import { ObtenerAceptacionComponent } from './components/obtener-aceptacion/obtener-aceptacion.component';

@NgModule({
  declarations: [AppComponent, GeneralClienteComponent, FotosComponent, HistoricoComponent, TicketDetalleComponent, AceptacionComponent, ObtenerAceptacionComponent, ImageSanitizerPipe, FechasPersonalizadasPipe],
  entryComponents: [GeneralClienteComponent, FotosComponent, HistoricoComponent, TicketDetalleComponent, AceptacionComponent, ObtenerAceptacionComponent],
  imports: [
    PipesTicketsModule,
    BrowserModule, 
    FormsModule,
    HttpClientModule,
    SignaturePadModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(), 
    AppRoutingModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    Camera,
    FileTransfer,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
