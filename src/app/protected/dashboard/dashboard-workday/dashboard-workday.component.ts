import { Component, Input, OnInit } from '@angular/core';
import { interval, Observable, of, Subject } from 'rxjs';
import { delay, map, takeUntil, takeWhile } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { WorkdaysService } from 'src/app/core/services/workdays.service';
import { Task } from 'src/app/shared/models/task';
import { User } from 'src/app/shared/models/user';
import { Workday } from 'src/app/shared/models/workday';

@Component({
  selector: 'al-dashboard-workday',
  templateUrl: './dashboard-workday.component.html',
  styleUrls: ['./dashboard-workday.component.scss']
})
export class DashboardWorkdayComponent implements OnInit {
  
  @Input() workday: Workday;
  isWorkdayComplete: boolean;
  isPomodoroActive: boolean;

  startPomodoro$: Subject<string>;
  cancelPomodoro$: Subject<string>;
  completePomodoro$: Subject<string>;
  currentProgress: number;
  maxProgress: number;
  pomodoro$: Observable<number>;
  currentTask: Task|undefined;

  constructor(
    private workdaysService: WorkdaysService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.isWorkdayComplete = (this.getCurrentTask() === undefined)
    this.isPomodoroActive = false;
    this.startPomodoro$ = new Subject();
    this.cancelPomodoro$ = new Subject();
    this.completePomodoro$ = new Subject();
    this.currentProgress = 0;
    // this.maxProgress = 5;
    const user: User|null = this.authService.currentUser;
    if(user) {
      this.maxProgress = user.pomodoroDuration;
    }
    this.pomodoro$ = interval(1000).pipe(
      takeUntil(this.cancelPomodoro$),
      takeUntil(this.completePomodoro$),
      takeWhile(progress => progress <= this.maxProgress),
      map(x => x + 1)
    );
  }

  startPomodoro() {
    this.isPomodoroActive = true;
    this.startPomodoro$.next('start');

    this.pomodoro$.subscribe(currentProgress => {
      this.currentProgress = currentProgress;
      if (currentProgress === this.maxProgress) {
        of(0).pipe(delay(500)).subscribe(_ => this.completePomodoro());
      }      
    });
  }

  cancelPomodoro() {
    this.isPomodoroActive = false;
    this.cancelPomodoro$.next('cancel');
  }

  completePomodoro() {
    this.isPomodoroActive = false;
    this.completePomodoro$.next('complete');

    // Étape n°1 : Récupérer la tâche courante.
    this.currentTask = this.getCurrentTask();
    
    // Étape n°2 : Incrémenter la tâche courante.
    if(this.currentTask) {
      this.currentTask.done++;
    }

    // Étape n°3 : Vérifier si la tâche courante est terminée.
    this.isWorkdayComplete = (this.getCurrentTask() === undefined);

    this.workdaysService.update(this.workday).subscribe();
  }
    
  getCurrentTask(): Task|undefined {
  return this.workday.tasks.find(task => task.todo > task.done)
  }
  
}
