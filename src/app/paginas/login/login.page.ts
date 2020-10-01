import { Component, OnInit } from '@angular/core';
import { ValidarUsuario, ValidarContrasena } from 'src/app/clasesComunes/validaciones';
import { NavController } from '@ionic/angular';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private navCtrl: NavController,
    private usuarioService: UsuarioService,) { }

  ngOnInit() {
  }

  async onLogin(usuario, password){

    try{

      if(ValidarUsuario(usuario.value) &&
       ValidarContrasena(password.value)){

        const valido = await this.usuarioService.login(usuario.value, password.value);
  
        if(valido){
    
          //this.navCtrl.navigateRoot('/home', { animated: true });
          this.navCtrl.navigateRoot(['/home', { usuarioTicket: JSON.stringify(usuario.value) }]);
    
        }

      }
    }
    catch(error){ 
      console.log('Error', error) 
    }
  }

}
