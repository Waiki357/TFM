import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { debounceTime, distinctUntilChanged, Observable, Subject, switchMap } from 'rxjs';
import { Proyecto } from './models/proyecto-model';
import { ProyectoService } from './service/proyecto-service';
import { Usuario } from '../usuarios/models/usuario-model';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css']
})
export class ProyectosComponent implements OnInit {

  //Buscador
  proyectos$: Observable<Proyecto[]> | undefined;
  private searchTerms = new Subject<string>();
  @ViewChild('searchBox') searchInput!: ElementRef;

  //Formulario
  public registerForm: FormGroup = this.formBuilder.group(
    {
      Id: [0],
      Titulo: [{ value: "", disabled: true }, Validators.required],
      Descripcion: [{ value: "", disabled: true }, Validators.required],
      Creador: [{ value: "", disabled: true }],
      FechaCreacion: [{ value: "", disabled: true }],
      FechaFinalizacion: [{ value: "", disabled: true }, [Validators.required, Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)]],
    }
  );

  public submitted: boolean = false;
  public tipoFormulario: TipoFormulario = TipoFormulario.Inscribir;
  mostrarUsuariosInscritos: boolean = false;
  esInscrito: boolean = false;
  bloquearBotones: boolean = true;
  mostrarProyectos: boolean = false;
  mostrarCrearProyecto: boolean = false;

  listaProyectos: Proyecto[] = [];
  listaUsuarios: Usuario[] = [];

  constructor(
    private proyectoService: ProyectoService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private jwtHelper: JwtHelperService,
    private activeRoute: ActivatedRoute  ) { }

  ngOnInit(): void {
    //Buscador
    this.proyectos$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.proyectoService.searchProyectos(term)),
    );

    this.bloquearBotones = true;

    const token = localStorage.getItem("jwt");

    if (token) {
      var loggedUser = this.jwtHelper.decodeToken(token);
      var sexo = loggedUser['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/gender'];
      this.mostrarCrearProyecto = sexo == 0;
    }
  }

  getProyectos(): void {
    this.proyectoService.getProyectos()
      .subscribe(proyectos => this.listaProyectos = proyectos);
  }

  //Buscador
  search(term: string): void {
    this.searchTerms.next(term);
  }

  onSelectProyecto(proyecto: Proyecto): void {

    if (proyecto.EsCreador) {
      this.tipoFormulario = TipoFormulario.Eliminar;
      this.registerForm.controls.Titulo.enable();
      this.registerForm.controls.Descripcion.enable();
      this.registerForm.controls.Creador.enable();
      this.registerForm.controls.FechaCreacion.enable();
      this.registerForm.controls.FechaFinalizacion.enable();
      this.mostrarUsuariosInscritos = true;      

      this.proyectoService.getUsuariosProyectos(proyecto.Id)
        .subscribe(usuarios => {
          this.listaUsuarios = usuarios;
        });
    }
    else {
      this.tipoFormulario = TipoFormulario.Inscribir;
      this.registerForm.controls.Titulo.disable();
      this.registerForm.controls.Descripcion.disable();
      this.registerForm.controls.Creador.disable();
      this.registerForm.controls.FechaCreacion.disable();
      this.registerForm.controls.FechaFinalizacion.disable();
      this.mostrarUsuariosInscritos = false;
    }

    this.registerForm.controls.Id.setValue(proyecto.Id);
    this.registerForm.controls.Titulo.setValue(proyecto.Titulo);
    this.registerForm.controls.Descripcion.setValue(proyecto.Descripcion);
    this.registerForm.controls.Creador.setValue(proyecto.Creador);
    this.registerForm.controls.FechaCreacion.setValue(formatDate(proyecto.FechaCreacion, 'yyyy-MM-dd', 'en') );
    this.registerForm.controls.FechaFinalizacion.setValue(formatDate(proyecto.FechaFinalizacion, 'yyyy-MM-dd', 'en'));
    this.esInscrito = !proyecto.EsInscrito;
    this.bloquearBotones = false;
    this.mostrarProyectos = true;
  }

  //Crear Proyecto
  crearProyecto() {

    this.tipoFormulario = TipoFormulario.Crear;
    this.registerForm.reset();
    this.registerForm.controls.Id.setValue(0);
    this.registerForm.enable();
    this.mostrarUsuariosInscritos = false;
    this.mostrarProyectos = true;
  }

  //Inscribir
  addUsuarioProyecto() {
    var id = this.registerForm.controls['Id'].value;
    this.proyectoService.addUsuarioProyecto(id)
      .subscribe(item => {
        this.toastr.success("Operación exitosa", "Inscripción");
        this.esInscrito = false;
        this.searchInput.nativeElement.value = '';
        this.search('');
      },
        error => { console.log('oops', error) });
  }

  deleteUsuarioProyecto(idUsuario: any) {
    var id = this.registerForm.controls['Id'].value;
    this.proyectoService.deleteUsuarioProyecto(id, idUsuario)
      .subscribe(item => {
        this.toastr.success("Operación exitosa", "Modificación");
        this.esInscrito = true;
        this.searchInput.nativeElement.value = '';
        this.search('');

        if (idUsuario != 0) {
          this.proyectoService.getUsuariosProyectos(id)
            .subscribe(usuarios => {
              this.listaUsuarios = usuarios;
            });
        }

      },
        error => { console.log('oops', error) });
  }

  //Crear
  addProyecto() {
    var id = this.registerForm.controls['Id'].value;
    this.proyectoService.addProyecto(this.registerForm.value)
      .subscribe(item => {
        this.toastr.success("Operación exitosa", "Creación");
        this.searchInput.nativeElement.value = '';
        this.search('');
      },
        error => { console.log('oops', error) });
  }

  updateProyecto() {
    this.proyectoService.updateProyecto(this.registerForm.value)
      .subscribe(item => {
        this.toastr.success("Operación exitosa", "Modificación");
        this.searchInput.nativeElement.value = '';
        this.search('');
      },
        error => { console.log('oops', error) });
  }

  deleteProyecto() {
    var id = this.registerForm.controls['Id'].value;
    this.proyectoService.deleteProyecto(id).subscribe(item => {

      this.tipoFormulario = TipoFormulario.Inscribir;
      this.registerForm.reset();
      this.registerForm.controls.Id.setValue(0);
      this.listaUsuarios = [];
      this.searchInput.nativeElement.value = '';
      this.search('');
      this.toastr.success("Operación exitosa", "Eliminación");
    },
        error => { console.log('oops', error) });
  }

  getChat(userEmail: string) {
    this.router.navigate(['/principal/chat'], {
      queryParams: {
        userEmail: userEmail,
      }
    });
  }

}

enum TipoFormulario {
  Inscribir = 1,
  Crear = 2,
  Eliminar = 3
}

