import { Injectable } from "@angular/core";
import { IUser } from "../model/data";

@Injectable({
  providedIn: "root"
})
export class UserService {
  private user = <IUser>{};

  constructor() {}

  setOne(user: IUser) {
    this.user = Object.assign(this.user, user);
  }

  setToken(token: string) {
    this.user = Object.assign(this.user, {
      Token: token
    });
  }

  getUser() {
    return this.user;
  }

  delUser() {
    this.user = null;
  }
}
