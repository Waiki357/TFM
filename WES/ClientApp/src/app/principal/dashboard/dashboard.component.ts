import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { ProyectoService } from '../proyectos/service/proyecto-service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public barChartType: ChartType = 'bar';
  public pieChartType: ChartType = 'pie';
  
  //1
  public proyectosOptions: ChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Información sobre proyectos',
      },
    },
  };

  public proyectosData: ChartData<'bar'> = {
    labels: ['Proyectos'],
    datasets: [
      { label: 'Proyectos creados', data: [0] },
      { label: 'Proyectos finalizados', data: [0] },
    ],
  };

  //2
  public usuariosEdadOptions: ChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Rangos de edad usuarios',
      },
    },
  };

  public usuariosEdadData: ChartData<'bar'> = {
    labels: ['Edad'],
    datasets: [
      { label: '18-30', data: [0] },
      { label: '30-40', data: [0] },
      { label: '40-50', data: [0] },
      { label: '>60', data: [0] },
    ],
  };

  //3
  public usuariosSinProyectoOptions: ChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Usuarios en proyectos',
      },
    },
  };

  public usuariosSinProyectoData: ChartData<'bar'> = {
    labels: ['Usuarios con proyecto', 'Usuarios sin proyecto'],
    datasets: [{ label: 'Usuarios con proyecto', data: [0, 0] },],
  };

  constructor(proyectoService: ProyectoService) {

    proyectoService.getProyectosCreadosFinalizados()
      .subscribe(
        item => {
          this.proyectosData = {
            labels: ['Proyectos'],
              datasets: [
                { label: 'Proyectos creados', data: [item[0]] },
                { label: 'Proyectos finalizados', data: [item[1]] },
            ]
          };
        },
        error => { console.log('oops', error) }
    );

    proyectoService.getUsuariosEdad()
      .subscribe(
        item => {
          this.usuariosEdadData = {
            labels: ['Edad'],
            datasets: [
              { label: '18-30', data: [item[0]] },
              { label: '30-40', data: [item[1]] },
              { label: '40-50', data: [item[2]] },
              { label: '50-60', data: [item[3]] },
              { label: '>60', data: [item[4]] },
            ]
          };
        },
        error => { console.log('oops', error) }
    );

    proyectoService.getUsuariosSinProyecto()
      .subscribe(
        item => {
          this.usuariosSinProyectoData = {
            labels: ['Usuarios con proyecto', 'Usuarios sin proyecto'],
            datasets: [{ label: 'Usuarios con proyecto', data: [item[0], item[1]] },],
          };
        },
        error => { console.log('oops', error) }
      );
  }

  ngOnInit(): void {
  }

}
