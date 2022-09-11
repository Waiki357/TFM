import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UsuarioChatResumen } from '../models/usuarioChatResumen';

@Injectable({ providedIn: 'root' })

export class DataService {

  private url = environment.url + "/api/usuario";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private _http: HttpClient,
    @Inject(DOCUMENT) private document: any) { }

  //Get
  get(_getUrl: string): Observable<any[]> {

    var getUrl = environment.url + _getUrl;
    return this._http.get<any[]>(getUrl, this.httpOptions);
  }

  getListaUsuarios(): Observable<UsuarioChatResumen[]> {
    var getUrl = this.url + "/GetUsersChat";
    return this._http.get<any[]>(getUrl, this.httpOptions);
  }
}
