export interface ProyectoSimpleModel {
  Titulo: string;  
  Descripcion: string;
  Creador: string;
  IdRolProyecto: TipoRolProyecto;
  IdEstadoProyecto: TipoEstado;
  FechaCreacion: Date;
  FechaFinalizacion: Date;
}

export enum TipoEstado {
  Nuevo = 0,
  Finalizado = 1
}

 export enum TipoRolProyecto {
  Inscrito = 0,
  Ganado = 1,
  Eliminado= 2,
  Creador = 3,
}
