

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { concatMap, map, merge, delay, tap, skip,  concat, switchMap} from 'rxjs/operators';

import {BehaviorSubject, Observable, Subject, timer, of, fromEvent} from 'rxjs';
import { GeneralService } from './general.service';
import { debug } from 'util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ],
  providers: [GeneralService]
})
export class AppComponent {

  polledBitcoin$: Observable<number>;

  manualRefresh = new Subject();
  load$ = new BehaviorSubject('');


  constructor(private generalService: GeneralService) {

    const bitcoin$ = this.generalService.getdata();
    const whenToRefresh$ = of('').pipe(
      delay(5000),
      tap(_ => this.load$.next('')),
      skip(1),
    );


    const poll$ = bitcoin$.pipe(concat(whenToRefresh$));
    this.polledBitcoin$ = this.load$.pipe(
      merge(this.manualRefresh),
       concatMap(_ => poll$),
       map((response: {EUR: {last: number}}) => response.EUR.last),
    );
}
  clickhandler(event) {
    console.log('Refresh button clicked');
    this.manualRefresh.next('');
  }
}



