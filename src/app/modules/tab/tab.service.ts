import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { Observable } from "rxjs/internal/Observable";
import { ITabMain, ITabBase } from "../../model/tabs";

@Injectable({
  providedIn: "root"
})
export class TabService {
  private tabMainSubject = new BehaviorSubject<ITabMain>(null);
  private tabSubject = new BehaviorSubject<ITabBase>(null);

  constructor() {}

  nextTab(listTab: ITabBase) {
    this.tabSubject.next(listTab);
  }

  isTabIn(): Observable<ITabBase> {
    if (!!this.tabSubject) {
      return this.tabSubject.asObservable();
    }
    return null;
  }

  nextTabMain(listTabMain: ITabMain) {
    this.tabMainSubject.next(listTabMain);
  }

  isTabMainIn(): Observable<ITabMain> {
    if (!!this.tabMainSubject) {
      return this.tabMainSubject.asObservable();
    }
    return null;
  }
}
