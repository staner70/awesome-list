import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'al-workday-form-tasks-item',
  templateUrl: './workday-form-tasks-item.component.html',
  styles: [
  ]
})
export class WorkdayFormTasksItemComponent implements OnInit {

  @Input() task: FormGroup;

  constructor() { }

  ngOnInit(): void {
  }

}
