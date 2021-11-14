import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'al-login-form',
  templateUrl: './login-form.component.html',
  styles: [
  ]
})
export class LoginFormComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private fb:FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
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

 
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  // this.name.value; // avec le getter.
  // this.registerForm.get(‘name’).value // sans le getter.

  submit() {
   
    console.info(this.email?.value);
    console.info(this.password?.value);
    console.log(this.loginForm.value);
    
    this.router.navigate(['/app/dashboard']);
  }
    

}
