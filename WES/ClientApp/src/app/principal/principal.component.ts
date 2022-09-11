import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  public esPropetaria: boolean = false

  constructor(private jwtHelper: JwtHelperService) {
    const token = localStorage.getItem("jwt");
    if (token) {
      var loggedUser = this.jwtHelper.decodeToken(token);
      this.esPropetaria = loggedUser['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/gender'] == 0;
    }
  }

  ngOnInit(): void {
  }

}
