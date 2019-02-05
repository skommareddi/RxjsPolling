

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { concatMap, map, merge, delay, tap, skip,  concat} from 'rxjs/operators';

import {BehaviorSubject, Observable, Subject, timer, of, fromEvent} from 'rxjs';
import { GeneralService } from './general.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ],
  providers: [GeneralService]
})
export class AppComponent {
  bitcoin: string;
  polledBitcoin$: Observable<number>;

  manualRefresh = new Subject();
  load$ = new BehaviorSubject('');


  constructor(private generalService: GeneralService) {
    console.log('Constuctor');
    const whenToRefresh$ = of('').pipe(
      delay(5000),
      tap(_ => this.load$.next(''),
      skip(1)) );

    this.generalService.getdata()
    .subscribe(
      (data) => {
        this.bitcoin = data['USD']['last'];
      });
    console.log(this.bitcoin);
    const bitcoin$ = this.generalService.getdata();
    const poll$ = concat(bitcoin$, whenToRefresh$);
    this.polledBitcoin$ = timer(0, 10000).pipe(
      merge(this.manualRefresh),
        concatMap(_ => bitcoin$),
        map((response: {USD: {last: number}}) => response.USD.last),
      );
}
  clickhandler(event) {
    console.log('Refresh button clicked');
    this.manualRefresh.next('');
  }
}



