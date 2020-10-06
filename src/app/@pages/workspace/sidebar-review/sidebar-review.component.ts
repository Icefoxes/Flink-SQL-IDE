import { Component, OnInit } from '@angular/core';
import { select } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, map, mergeMap, toArray } from 'rxjs/operators';
import { StreamNode, StreamNodeType } from 'src/app/@core/model';
import { Store, State } from '../../../@core/state';
@Component({
  selector: 'app-sidebar-review',
  templateUrl: './sidebar-review.component.html',
  styleUrls: ['./sidebar-review.component.scss']
})
export class SidebarReviewComponent implements OnInit {
  ShowReview = true;

  REVIEW_ROOT: StreamNode[] = [
    {
      name: 'Promoted',
      nodeType: StreamNodeType.ReviewRoot,
      children: []
    }];

  review$: Observable<StreamNode[]>;

  constructor(private readonly store: Store<State>) { }

  selectReviewStreamNodes = (jobs: string[]) => {
    const nodes: StreamNode[] = [];
    jobs.forEach(t => {
      nodes.push({
        name: t,
        nodeType: StreamNodeType.Review,
        children: []
      });
    });
    return nodes;
  }

  ngOnInit(): void {
    this.review$ = combineLatest([this.store.pipe(
      select(root => root.jobs.jobs.filter(j => !j.approved && j.promoted).map(j => j.name)),
      distinctUntilChanged(),
      map(this.selectReviewStreamNodes))])
      .pipe(map(nodes => {
        this.REVIEW_ROOT[0].children = [...nodes[0]];
        return this.REVIEW_ROOT;
      }));
  }

  toggleReview(): void {
    this.ShowReview = !this.ShowReview;
  }
}
