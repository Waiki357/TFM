import { TipoEstado, TipoRolProyecto } from "../../resumen/models/proyecto-simple-model";

export interface Proyecto {
  Id: number
  Titulo: string;
  Descripcion: string;
  Creador: string;
  EsCreador: boolean;
  EsInscrito: boolean;
  IdRolProyecto: TipoRolProyecto;
  IdEstadoProyecto: TipoEstado;
  FechaCreacion: Date;
  FechaFinalizacion: Date;
}
