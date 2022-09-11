import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResumenService {

  private url = environment.url + "/api/proyecto";

  constructor(private httpClient: HttpClient) { }

  public getProyectos(): Observable<any> {
    return this.httpClient.get(`${this.url}/GetProyectos`);
  }

}
