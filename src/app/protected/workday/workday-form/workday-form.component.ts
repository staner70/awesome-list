import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'al-workday-form',
  templateUrl: './workday-form.component.html',
  styles: [
  ]
})
export class WorkdayFormComponent implements OnInit {

  workdayForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.workdayForm = this.createWorddayForm();
  }

  get dueDate() { return this.workdayForm.get('dueDate') as FormControl; }
  get notes() { return this.workdayForm.get('notes') as FormControl; }
  get tasks() { return this.workdayForm.get('tasks') as FormArray; }

  createWorddayForm(): FormGroup {
    const workdayForm: FormGroup = this.fb.group({
      dueDate: [''],
      notes: [''],
      tasks: this.fb.array([])
    });
    return workdayForm;
  }

  submit(): void {
    console.log(this.workdayForm.value);
  }

}
