import { Component, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Router, RoutesRecognized } from "@angular/router";
import { MatIconRegistry, MatDialog } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { filter, take } from "rxjs/operators";
import { AppService } from "./app.service";
import { SpinnerService } from "./spinner/spinner.service";
import { UserService } from "./service/user.service";
import { DataService } from "./service/data.service";
import { StorageService } from "./service/storage.service";
import { LoginService } from "./service/login.service";
import { DialogAlertComponent } from "./shared/dialog/alert/dialog-alert.component";
import { IData } from "./model/base";
import { ICONS, LANG } from "./config/";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private service: AppService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private spinnerService: SpinnerService,
    private dataService: DataService,
    private translate: TranslateService,
    private storageService: StorageService,
    private loginService: LoginService,
    private dialog: MatDialog,
    private userService: UserService
  ) {
    ICONS.forEach(val => {
      this.matIconRegistry.addSvgIcon(
        val.tab,
        this.domSanitizer.bypassSecurityTrustResourceUrl(val.path)
      );
    });
    let arr = LANG.map(item => {
      return item.short;
    });
    translate.addLangs(arr);
    let lang = this.storageService.getLangStorage();
    translate.setDefaultLang(lang);
    translate.use(lang);
  }

  ngOnInit() {
    if (!this.userService.getUser().token) {
      this.router.events
        .pipe(
          filter(event => event instanceof RoutesRecognized),
          take(1)
        )
        .subscribe((e: any) => {
          if (!!e.state.root.queryParams["token"]) {
            this.setToken(e.state.root.queryParams["token"]);
          } else {
            this.dialogOpen(1); //reconnect
          }
        });
    }
  }

  setToken(token: string) {
    if (!!token) {
      this.userService.setToken(token);
      this.spinnerService.load();
      this.dataService.connect(token).subscribe((data: IData) => {
        this.spinnerService.hide();
        if (!!data.errorcode) {
          this.dialogOpen(data.errorcode);
        } else {
          let user = data.res[0];
          this.setLogin(user.account);
          this.userService.setOne(user);
        }
      });
    }
  }

  dialogOpen(errorcode) {
    let dialogRef = this.dialog.open(DialogAlertComponent, {
      width: "550px",
      data: {
        errorcode: errorcode
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.service.backLogin();
    });
  }

  setLogin(account: string) {
    this.storageService.setKey(account);
    this.loginService.login();
  }
}
