import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task } from 'src/app/shared/models/task';
import { Workday } from 'src/app/shared/models/workday';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkdaysService {

  constructor(private http: HttpClient) { }

  save(workday: Workday) {
    const url = `${environment.firebase.firestore.baseURL}/workdays?key=${environment.firebase.apiKey}`;
    const data = this.getWorkdayForFirestore(workday);
    const jwt: string = localStorage.getItem('token')!;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      })
    };
    return this.http.post(url, data, httpOptions);

  }
  private getWorkdayForFirestore( workday: Workday ): any {
    if (typeof workday.dueDate === 'string') {
      workday.dueDate = +workday.dueDate;
    }
    const date: number = new Date(workday.dueDate).getTime();
    const tasks: Object = this.getTaskListForFirestore(workday.tasks);

    return {
      fields: {
        dueDate: { integerValue: date },
        tasks: tasks,
        notes: { stringValue: workday.notes },
        userId: { stringValue: workday.userId }

      }
    }
  }
  private getTaskListForFirestore( tasks: Task[]): any {
    const taskList: any = {
      arrayValue: {
        values: []
      }
    };
    tasks.forEach(task => taskList.arrayValue.values.push(this.getTaskForFirestore(task)));
    return taskList;

  }
  private getTaskForFirestore( task: Task ): any {
    return {
      mapValue: {
        fields: {
          title: { stringValue: task.title },
          todo: { integerValue: task.todo },
          done: { integerValue: task.done },
          completed: { booleanValue: false }
        }
      }
    }
  }
}
