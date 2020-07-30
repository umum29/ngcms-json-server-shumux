import { Injectable } from "@angular/core";
import { Subject } from "rxjs/internal/Subject";

@Injectable({
  providedIn: "root"
})
export class LoginService {
  private loginSubject = new Subject<boolean>();
  loginState = this.loginSubject.asObservable();

  constructor() {}

  login() {
    this.loginSubject.next(true);
  }

  logout() {
    this.loginSubject.next(false);
  }
}
