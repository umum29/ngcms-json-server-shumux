import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs/internal/Observable";
import { map, take } from "rxjs/operators";
import { LoggerService } from "../service/logger.service";
import { TabService } from "../modules/tab/tab.service";
import { ITabBase } from "../model/tabs";

@Injectable()
export class CmsResolver implements Resolve<Observable<ITabBase>> {
  constructor(private service: TabService, private logger: LoggerService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!!this.service.isTabIn()) {
      return this.service.isTabIn().pipe(
        take(1),
        map(e => {
          if (!!e) {
            this.logger.print("ListTab", e);
            return e;
          }
        })
      );
    }
  }
}
