import { Component, OnInit } from '@angular/core';
import { ProyectoSimpleModel } from './models/proyecto-simple-model';
import { ResumenService } from './services/resumen-services';
import { TipoRolProyecto } from './models/proyecto-simple-model';

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.css']
})
export class ResumenComponent implements OnInit {

  listaProyectosInscritos: ProyectoSimpleModel[] = [];
  listaProyectosCreados: ProyectoSimpleModel[] = [];
  listaProyectosGanados: ProyectoSimpleModel[] = [];

  constructor(private resumenService: ResumenService) { }

  ngOnInit(): void {

    this.resumenService.getProyectos().subscribe((data: ProyectoSimpleModel[]) => {
      console.log(data);

      this.listaProyectosInscritos = data.filter(c => c.IdRolProyecto == TipoRolProyecto.Inscrito);
      this.listaProyectosCreados = data.filter(c => c.IdRolProyecto == TipoRolProyecto.Creador);
      this.listaProyectosGanados = data.filter(c => c.IdRolProyecto == TipoRolProyecto.Ganado);
    })  
  }

}
