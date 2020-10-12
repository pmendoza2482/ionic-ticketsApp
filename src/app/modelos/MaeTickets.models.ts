import { MaeClientes } from './MaeClientes.models';
import { DetTickets } from './DetTickets.models';

export interface MaeTickets{
    ticket?: string;
    cliente?: number;
    fechaIni?: Date;
    nombre?: string;
    telefono1?: string;
    telefono2?: string;
    descripcion?: string;
    estado?: string;
    fechaFin?: Date;
    tipoReclamo?: string;
    longitud?: string;
    latitud?: string;
    imagen1?: BinaryType;
    imagen2?: BinaryType;
    imagen3?: BinaryType;
    aceptacion?: BinaryType;
    gusuario?: string;
    nombreUsuario?: string;
  //  MaeCliente?: MaeClientes;
    ImagenDRW1?: string;
    ImagenDRW2?: string;
    ImagenDRW3?: string;
    AceptacionDRW?: string;
}

export interface ResponseTickets {
    message: string;
    data: MaeTickets[];
}

export interface ResponseValidacion {
  esValido: boolean;
}

export interface ResponseTicket {
  message: string;
  data: MaeTickets;
  nombreUsuario?: string;  
}

export interface RequestTicket {
    ticket?: string;
    estado?: string;
    longitud?: string;
    latitud?: string;
    motivo?: string;
    usuario?: string;
    gusuario?: string;
}


  export interface ResponseImagenes {
    message: string;
    data: MaeTickets;
}

export interface ResponseUsuario {
  message: string;
  data: string;
  error?: string;  
}