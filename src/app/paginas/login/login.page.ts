import { Component, OnInit } from '@angular/core';
import { ValidarUsuario, ValidarContrasena } from 'src/app/clasesComunes/validaciones';
import { NavController } from '@ionic/angular';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private navCtrl: NavController,
    private route: Router,
    private usuarioService: UsuarioService,) { }

  ngOnInit() {
  }

  async onLogin(usuario, password){

    try{

      if(ValidarUsuario(usuario.value) &&
       ValidarContrasena(password.value)){

        const valido = await this.usuarioService.login(usuario.value, password.value);
  
        if(valido){
    
          console.log('entra aqui despues q vence el token.(login page)')
          //this.navCtrl.navigateRoot('/home', { animated: true });
         // this.navCtrl.navigateRoot(['/home', { usuarioTicket: JSON.stringify(usuario.value) }]);

        // this.route.navigateByUrl('home');

        // const navigationExtras: NavigationExtras = {
        //   queryParams: {
        //     special: JSON.stringify(usuario.value)
        //   }
        // };
    
         //this.route.navigateByUrl('home', navigationExtras);

         this.route.navigate(['home', usuario.value]);
          //this.route.navigate(['home']);
    
          usuario.value = '';
          password.value = '';
        }
      }
    }
    catch(error){ 
      console.log('Error', error) 
    }
  }

}
