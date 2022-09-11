import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AuthenticatedResponse } from './models/authenticated-response.model';
import { LoginModel } from './models/login.model';
import { NgForm } from '@angular/forms';
import { environment } from '../../environments/environment';
import { UsuarioService } from '../principal/usuarios/service/usuario-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private url = environment.url + "/api/auth";
  public invalidLogin!: boolean;
  public credentials: LoginModel = {
      email: '',
      password: ''
  };

  tokenVerification: any;
  mostrarMensajeVerificacion: boolean = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private usuarioService: UsuarioService  ) { }

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(params => {
      this.tokenVerification = params['id'];
        if (this.tokenVerification != null && this.tokenVerification != undefined) {
          this.usuarioService.getVerificacion(this.tokenVerification)
            .subscribe(
              data => {
                this.mostrarMensajeVerificacion = true;
              },
              error => { console.log('oops', error) }
          )
        }
    });

  }

  login = ( form: NgForm) => {
    if (form.valid) {
      this.http.post<AuthenticatedResponse>(`${this.url}/login`, this.credentials, {
        headers: new HttpHeaders({ "Content-Type": "application/json"})
      })
      .subscribe({
        next: (response: AuthenticatedResponse) => {
          const token = response.token;
          localStorage.setItem("jwt", token); 
          this.invalidLogin = false; 
          this.router.navigate(["/principal/resumen"]);
        },
        error: (err: HttpErrorResponse) => this.invalidLogin = true
      })
    }
  }
}
