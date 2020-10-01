import { NgModule } from '@angular/core';
import { FechaTicketPipe } from './fecha-ticket.pipe';

@NgModule({
  declarations: [FechaTicketPipe],
  exports: [FechaTicketPipe]
})
export class PipesTicketsModule { }
