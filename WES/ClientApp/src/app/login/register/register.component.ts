import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from '../../principal/usuarios/service/usuario-service';
import { ListaItem } from '../../shared/listas-model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  //Formulario
  public registerForm: FormGroup = this.formBuilder.group(
    {
      Id: [0],
      Email: ["", [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      Password: ["", Validators.required],
      PasswordRepetir: ["", Validators.required],
      Nombre: ["", Validators.required],
      Apellidos: ["", Validators.required],
      Sexo: [-1, Validators.pattern("[01]")],
      Telefono: ["", Validators.required],
      FechaNacimiento: ["", [Validators.required, Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/), this.ageValidator]],
    },
    {
      validator: this.confirmPasswordValidator("Password", "PasswordRepetir")
    }
  );

  public listaSexo: ListaItem[] = []
  public submitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private toastr: ToastrService) { }

  ngOnInit(): void {

    this.usuarioService.getTipoSexo().subscribe(data => {
      this.listaSexo = data;
    });
  }

  onSubmit() {

    this.submitted = true;
    if (this.registerForm.invalid)
      return false;

    this.usuarioService.crearUsuario(this.registerForm.value).subscribe(item => {
      this.toastr.success("Operación exitosa. Se le enviará un correo de confirmación", "Creación de cuenta")
    });

    return true;
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
