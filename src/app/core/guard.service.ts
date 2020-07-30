import { Observable } from "rxjs/internal/Observable";
import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { map, catchError } from "rxjs/operators";
import { AppService } from "../app.service";
import { LoginService } from "../service/login.service";

@Injectable()
export class GuardService implements CanActivate {
  constructor(
    private router: Router,
    private service: AppService,
    private loginService: LoginService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.loginService.loginState.pipe(
      map(e => {
        if (e) return true;
      }),
      catchError(e => {
        this.service.backLogin();
        return Observable.throw(e);
      })
    );
  }
}
