import { Injectable } from "@angular/core";
import { LoginService } from "./service/login.service";
import { UserService } from "./service/user.service";
import { LoginUrl } from "./config/config";

@Injectable()
export class AppService {
  constructor(private loginService: LoginService, private userService: UserService) {}

  backLogin() {
    this.userService.delUser();
    this.loginService.logout();
    //  window.location.href = LoginUrl;
  }
}
