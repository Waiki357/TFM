export interface Usuario {
  Id: number
  Email: string;
  Password: string;
  Nombre: string;
  Apellidos: string;
  Telefono: number;
  FechaNacimiento: Date;
  Sexo: TipoSexo;
  SexoTexto: number;
  Rol: number;
  RolTexto: string;
}

enum TipoSexo {
  Mujer = 0,
  Hombre = 1,
}
