import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'al-register-form',
  templateUrl: './register-form.component.html',
  styles: [
  ]
})
export class RegisterFormComponent implements OnInit {

  registerForm: FormGroup;
  constructor( private fb: FormBuilder, private router: Router ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20),
        Validators.pattern('^[a-zA-Z0-9_-]*$')

      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20)
      ]]
    });
  }

  get name() { return this.registerForm.get('name'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }

  // this.name.value; // avec le getter.
  // this.registerForm.get(‘name’).value // sans le getter.

  submit() {
    console.info(this.name?.value);
    console.info(this.email?.value);
    console.info(this.password?.value);
    console.log(this.registerForm.value);
    
    this.router.navigate(['/app/dashboard']);
  }
    

}
