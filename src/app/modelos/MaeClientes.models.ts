export interface MaeClientes{
    codigo?: number;
    nombre?: string;
    iP?: string;
    fecha?: string;
    router?: number;
    usuario?: string;	
    download?: string;	
    upload?: string;
    tecnico?: number;	
    longitud?: string;	
    latitud?: string;
    iPPublica?: string;	
    status?: string;
    direccion?: string;	
    telefono1?: string;	
    telefono2?: string;	
    telefono3?: string;	
    observaciones?: string;	
    departamento?: string;	
    ciudad?: string;
    mAC?: string;
}

export class MaeClientes{
    codigo?: number;
    nombre?: string;
    iP?: string;
    fecha?: string;
    router?: number;
    usuario?: string;	
    download?: string;	
    upload?: string;
    tecnico?: number;	
    longitud?: string;	
    latitud?: string;
    iPPublica?: string;	
    status?: string;
    direccion?: string;	
    telefono1?: string;	
    telefono2?: string;	
    telefono3?: string;	
    observaciones?: string;	
    departamento?: string;	
    ciudad?: string;
    mAC?: string;

    constructor(datos?: MaeClientes) {
        if(datos != null){

            this.codigo = datos.codigo;
            this.nombre = datos.nombre;
            this.iP = datos.iP;
            this.fecha = datos.fecha;
            this.router = datos.router;
            this.usuario = datos.usuario;
            return;
        }
        this.codigo = this.codigo;
        this.nombre = this.nombre;
        this.iP = this.iP;
        this.fecha = this.fecha;
        this.router = this.router;
        this.usuario = this.usuario;
    }
}

export interface ResponseCliente {
    message: string;
    data: MaeClientes;
}