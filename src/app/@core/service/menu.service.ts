import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Job, MenuItem } from '../model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private menuEvent = new Subject<MenuItem>();

  private ShowDifferEvent = new Subject<Job>();

  private HideShowDiffer = new Subject<void>();

  menu$ = this.menuEvent.asObservable();

  ShowDifferEvent$ = this.ShowDifferEvent.asObservable();

  HideShowDiffer$ = this.HideShowDiffer.asObservable();

  constructor() { }

  onMenuItem(item: MenuItem): void {
    this.menuEvent.next(item);
  }

  onShowDifferEvent(job: Job): void {
    this.ShowDifferEvent.next(job);
  }

  onHideShowDiffer(): void {
    this.ShowDifferEvent.next();
  }
}
