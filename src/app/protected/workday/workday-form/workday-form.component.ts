import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { WorkdaysService } from 'src/app/core/services/workdays.service';
import { User } from 'src/app/shared/models/user';
import { Workday } from 'src/app/shared/models/workday';

@Component({
  selector: 'al-workday-form',
  templateUrl: './workday-form.component.html',
  styles: [
  ]
})
export class WorkdayFormComponent implements OnInit {

  workdayForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private workdaysService: WorkdaysService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.workdayForm = this.createWorddayForm();
  }

  get dueDate() { return this.workdayForm.get('dueDate') as FormControl; }
  get notes() { return this.workdayForm.get('notes') as FormControl; }
  get tasks() { return this.workdayForm.get('tasks') as FormArray; }

  createWorddayForm(): FormGroup {
    const workdayForm: FormGroup = this.fb.group({
      dueDate: ['', [
        Validators.required,
      ]],
      tasks: this.fb.array([], [
        Validators.required,
        Validators.maxLength(6)
      ]),
      notes: ['', [
        Validators.maxLength(1000)
      ]]      
    });
    return workdayForm;
  }

  submit(): void {
    console.log(this.workdayForm.value);
    const user: User|null = this.authService.currentUser;

    if (user) {
      const workday: Workday = new Workday({...{ userId: user.id }, ...this.workdayForm.value});
      this.workdaysService.save(workday).subscribe(
        _ => this.router.navigate(['/app/planning']),
        _ => this.workdayForm.reset()
      );
    }      
  }

}
