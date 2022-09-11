import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ListaItem } from '../../../shared/listas-model';
import { Usuario } from '../models/usuario-model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private url = environment.url + "/api/usuario";
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  public getTipoSexo(): Observable<ListaItem[]> {
    return this.http.get<ListaItem[]>(`${this.url}/GetTipoSexo`);
  }

  public getUsuario(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.url}/GetUsuario`);
  }

  public crearUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.url}/CrearUsuario`, usuario, this.httpOptions)
  }

  public updateUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.url}/UpdateUsuario`, usuario, this.httpOptions)
  }

  public updatePasswordUsuario(password: string, token: string, email: string): Observable<Usuario> {

    var data = {
      password: password,
      token: token,
      email: email
    };

    return this.http.post<Usuario>(`${this.url}/UpdatePasswordUsuario`, JSON.stringify(data), this.httpOptions)
  }

  public deleteUsuario(): Observable<any> {
    const url = `${this.url}/DeleteUsuario`;
    return this.http.delete(url, this.httpOptions);
  }

  public getVerificacion(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/Verificacion/${id}`, this.httpOptions);
  }

  public recoveryEmailUsuario(email: string): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.url}/RecoveryEmailUsuario`, JSON.stringify(email), this.httpOptions)
  }

}
