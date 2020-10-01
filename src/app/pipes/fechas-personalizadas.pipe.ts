import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechasPersonalizadas'
})
export class FechasPersonalizadasPipe implements PipeTransform {

  transform(value: Date): any {
    
    let ano = value.getFullYear();
    let mes = value.getMonth() + 1;
    let dia = value.getDate();

    let diaTexto;

    if(mes === 0){ return dia + ' de Enero del ' + ano }
    if(mes === 1){ return dia + ' de Febrero del ' + ano }
    if(mes === 2){ return dia + ' de Marzo del ' + ano }
    if(mes === 3){ return dia + ' de Abril del ' + ano }
    if(mes === 4){ return dia + ' de Mayo del ' + ano }
    if(mes === 5){ return dia + ' de Junio del ' + ano }
    if(mes === 6){ return dia + ' de Julio del ' + ano }
    if(mes === 7){ return dia + ' de Agosto del ' + ano }
    if(mes === 8){ return dia + ' de Septiembre del ' + ano }
    if(mes === 9){ return dia + ' de Octubre del ' + ano }
    if(mes === 10){ return dia + ' de Noviembre del ' + ano }
    if(mes === 11){ return dia + ' de Diciembre del ' + ano }

    return '';
  }

}
