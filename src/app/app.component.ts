import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { forkJoin } from "rxjs/observable/forkJoin";
import { concat, flatMap, mergeAll, mapTo, combineAll, merge, reduce } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private http: HttpClient) {
    const s = this.getSubscriber();
    s.subscribe(c => console.log(c));
  }

  getSubscriber() {
    const data = new Object();
    const d1$ = this.http.get('./assets/framework.json');
    const d2$ = this.http.get('./assets/application.json');
    return d1$.pipe(concat(d2$))
    .pipe(reduce((arr, item, idx) => {
      if (arr.length <= 0) {
        arr[0] = {};
      }
      for (const prop in item) {
        if (item.hasOwnProperty(prop)) {
          arr[0][prop] = item[prop];
        }
      }
      return arr;
    }, [])).pipe(mergeAll());
    /*d1$.subscribe(d1 => {
      for (const pName in d1) {
        if (d1.hasOwnProperty(pName)) {
          data[pName] = d1[pName];
        }
      }
      d2$.subscribe(d2 => {
        for (const pName in d2) {
          if (d2.hasOwnProperty(pName)) {
            data[pName] = d2[pName];
          }
        }
      });
    });
    return of(data);
    */
  }
}
