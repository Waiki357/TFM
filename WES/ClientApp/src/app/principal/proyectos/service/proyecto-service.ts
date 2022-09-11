import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Proyecto } from '../models/proyecto-model';
import { environment } from '../../../../environments/environment';
import { Usuario } from '../../usuarios/models/usuario-model';


@Injectable({ providedIn: 'root' })
export class ProyectoService {

  private url = environment.url + "/api/proyecto";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  //Buscador
  searchProyectos(term: string): Observable<Proyecto[]> {
    if (!term.trim()) {
      // if not search term, return empty proyecto array.
      return of([]);
    }
    return this.http.get<Proyecto[]>(`${this.url}/Busqueda?name=${term}`, this.httpOptions);
  }

  //Metodos GET
  getProyectos(): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(this.url, this.httpOptions);
  }

  getUsuariosProyectos(id: number): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.url}/GetUsuariosProyectos/${id}`, this.httpOptions);
  }

  getProyectosCreadosFinalizados(): Observable<number[]> {
    return this.http.get<number[]>(`${this.url}/GetProyectosCreadosFinalizados`, this.httpOptions);
  }

  getUsuariosSinProyecto(): Observable<number[]> {
    return this.http.get<number[]>(`${this.url}/GetUsuariosSinProyecto`, this.httpOptions);
  }

  getUsuariosEdad(): Observable<number[]> {
    return this.http.get<number[]>(`${this.url}/GetUsuariosEdad`, this.httpOptions);
  }

  //CRUD Proyectos
  addProyecto(proyecto: Proyecto): Observable<any> {
    proyecto.FechaCreacion = new Date();
    return this.http.post<Proyecto>(`${this.url}/addProyecto`, proyecto, this.httpOptions);
  }

  updateProyecto(proyecto: Proyecto): Observable<any> {
    const url = `${this.url}/UpdateProyecto`;
    return this.http.put(url, proyecto, this.httpOptions);
  }

  deleteProyecto(id: number): Observable<any> {
    const url = `${this.url}/DeleteProyecto/${id}`;
    return this.http.delete<Proyecto>(url, this.httpOptions);
  }

  //CRUD usuarios Proyectos
  addUsuarioProyecto(id: number): Observable<any> {
    return this.http.post(`${this.url}/AddUsuarioProyecto/${id}`, {});
  }

  deleteUsuarioProyecto(id: number, idUsuario: number): Observable<any> {
    return this.http.post(`${this.url}/DeleteUsuarioProyecto/${id}/${idUsuario}`, {});
  }
}
