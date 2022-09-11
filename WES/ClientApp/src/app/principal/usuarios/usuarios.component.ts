import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from '../../principal/usuarios/service/usuario-service';
import { ListaItem } from '../../shared/listas-model';
import { Usuario } from './models/usuario-model';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  //Formulario
  public registerForm: FormGroup = this.formBuilder.group(
    {
      Id: [0],
      Email: [""],
      Password: ["", Validators.required],
      Nombre: ["", Validators.required],
      Apellidos: ["", Validators.required],
      Sexo: [-1],
      Telefono: ["", Validators.required],
      FechaNacimiento: ["", [Validators.required, this.ageValidator]],
    }
  );
  public passwordForm: FormGroup = this.formBuilder.group(
    {
      Password: ["", Validators.required],
      PasswordRepetir: [""],
    },
    {
      validator: this.confirmPasswordValidator("Password", "PasswordRepetir")
    }
  );

  public listaSexo: ListaItem[] = []
  public submitted: boolean = false;
  public submittedPassword: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private toastr: ToastrService) {

    this.usuarioService.getTipoSexo().subscribe(data => {
      this.listaSexo = data;
    });

    this.usuarioService.getUsuario().subscribe(
      data => {
        this.registerForm.controls.Id.setValue(data.Id);
        this.registerForm.controls.Email.setValue(data.Email);
        this.registerForm.controls.Email.disable();
        this.registerForm.controls.Password.setValue(data.Password);
        this.registerForm.controls.Password.disable();
        this.registerForm.controls.Nombre.setValue(data.Nombre);
        this.registerForm.controls.Apellidos.setValue(data.Apellidos);
        this.registerForm.controls.Sexo.setValue(data.Sexo);
        this.registerForm.controls.Sexo.disable();
        this.registerForm.controls.Telefono.setValue(data.Telefono);
        this.registerForm.controls.FechaNacimiento.setValue(formatDate(data.FechaNacimiento, 'yyyy-MM-dd', 'en'));
      },
      error => { }
    );

  }

  ngOnInit(): void { }

  onSubmit() {

    this.submitted = true;
    if (this.registerForm.invalid)
      return false;

    this.usuarioService.updateUsuario(this.registerForm.value).subscribe(item => {
      this.toastr.success("Operación exitosa", "Actualización cuenta")
    });

    return true;
  }

  inicializarCambioPassword() {
    this.passwordForm.controls.Password.setValue("");
    this.passwordForm.controls.PasswordRepetir.setValue("");
  }

  actualizarPassword() {

    this.submittedPassword = true;
    if (this.passwordForm.invalid)
      return false;

    this.usuarioService.updatePasswordUsuario(this.passwordForm.controls.Password.value, "", "").subscribe(
      item => { this.toastr.success("Se ha actualizado correctamente la contraseña", "Actualización"); },
      error => { console.log('oops', error) }
    );

    return true;
  }

  darBajaUsuario() {
    if (confirm("¿Esta seguro de dar de baja la cuenta?")) {
      this.usuarioService.deleteUsuario().subscribe(
        item => { this.toastr.success("Se ha dado de baja su cuenta", "Baja"); this.router.navigate(["/"]); },
        error => { console.log('oops', error) }
      );
    }
  }

  confirmPasswordValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      let control = formGroup.controls[controlName];

      if (control == undefined)
        return;
      let matchingControl = formGroup.controls[matchingControlName]
      if (matchingControl.errors && !matchingControl.errors.confirmPasswordValidator) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmPasswordValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  ageValidator(control: AbstractControl): { [key: string]: boolean } | null {

      let fecha = new Date(control.value);
      let hoy = new Date();
      let limite = new Date(hoy.getFullYear() - 18, hoy.getMonth(), hoy.getDate());

      if (fecha < limite)
        return { 'age': true };
      else
        return { 'age': false };
  }

}
