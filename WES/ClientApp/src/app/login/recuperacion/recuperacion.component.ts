import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from '../../principal/usuarios/service/usuario-service';

@Component({
  selector: 'app-recuperacion',
  templateUrl: './recuperacion.component.html',
  styleUrls: ['./recuperacion.component.css']
})
export class RecuperacionComponent implements OnInit {

  public emailNoExiste: boolean = false;
  public submitted: boolean = false;
  public submittedPassword: boolean = false;
  public mostrarCambioPassword: boolean = false;
  public tokenVerification: any;
  public email: any;

  public recuperacionForm: FormGroup = this.formBuilder.group(
    {
      Email: ["", [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
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

  constructor(private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(params => {
      this.tokenVerification = params['id'];
      this.email = params['email'];
      if (this.tokenVerification != null && this.tokenVerification != undefined && this.email != null && this.email != undefined) {
        this.mostrarCambioPassword = true;
      }
    });

  }

  onSubmit() {

    this.submitted = true;
    if (this.recuperacionForm.invalid)
      return false;

    this.usuarioService.recoveryEmailUsuario(this.recuperacionForm.controls.Email.value).subscribe(item => {
      this.toastr.success("Operación exitosa. Se le enviará un correo con los pasos a seguir", "Creación de cuenta")
    });

    return true;
  }

  actualizarPassword() {

    this.submittedPassword = true;
    if (this.passwordForm.invalid)
      return false;

    this.usuarioService.updatePasswordUsuario(this.passwordForm.controls.Password.value, this.tokenVerification, this.email).subscribe(
      item => {
        this.toastr.success("Se ha actualizado correctamente la contraseña", "Actualización");
        setTimeout(() => { this.router.navigate(["/login"]); }, 5000);
      },
      error => { console.log('oops', error) }
    );

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

}
