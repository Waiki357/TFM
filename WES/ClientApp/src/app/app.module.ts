import { BrowserModule } from '@angular/platform-browser';
import { AuthGuard } from './guards/auth.guard';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';


import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ResumenComponent } from './principal/resumen/resumen.component';
import { JwtModule } from '@auth0/angular-jwt';
import { PrincipalComponent } from './principal/principal.component';
import { ProyectosComponent } from './principal/proyectos/proyectos.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { RegisterComponent } from './login/register/register.component';
import { UsuariosComponent } from './principal/usuarios/usuarios.component';
import { ChatComponent } from './chat/chat.component';
import { DashboardComponent } from './principal/dashboard/dashboard.component';
import { RecuperacionComponent } from './login/recuperacion/recuperacion.component';

export function tokenGetter() {
  return localStorage.getItem("jwt");
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    ResumenComponent,
    PrincipalComponent,
    ProyectosComponent,
    RegisterComponent,
    UsuariosComponent,
    ChatComponent,
    DashboardComponent,
    RecuperacionComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgChartsModule,
    ToastrModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:44427"],
        disallowedRoutes: []
      }
    }),
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'verificacion', component: LoginComponent },
      { path: 'recuperacion', component: RecuperacionComponent },
      { path: 'register', component: RegisterComponent },
      {
        path: 'principal', component: PrincipalComponent, canActivate: [AuthGuard],
        children: [
          {
            path: '', redirectTo: 'resumen', pathMatch: 'full',
          },
          {            
            path: 'resumen', component: ResumenComponent, canActivate: [AuthGuard]
          },
          {
            path: 'proyectos', component: ProyectosComponent, canActivate: [AuthGuard]
          },
          {
            path: 'usuarios', component: UsuariosComponent, canActivate: [AuthGuard]
          },
          {
            path: 'chat', component: ChatComponent, canActivate: [AuthGuard]
          },
          {
            path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]
          }
        ]
      },
    ])
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
