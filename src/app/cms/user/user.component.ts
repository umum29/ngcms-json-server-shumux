import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { take } from "rxjs/operators";
import { DialogAlertComponent } from "../../shared/dialog/alert/dialog-alert.component";
import { IUser } from "../../model/data";
import { IData } from "../../model/base";
import { DataService } from "../../service/data.service";
import { UserService } from "../../service/user.service";
import { DialogUserPasswordComponent, IPassword } from "./password/dialog-password.component";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"]
})
export class UserComponent implements OnInit {
  user: IUser;

  constructor(
    public dialog: MatDialog,
    private dataService: DataService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.setDatas();
  }

  /*裝載資料 */
  setDatas() {
    this.user = this.userService.getUser();
  }

  /*開Dialog */
  openDialog(action: string) {
    switch (action) {
      case "password":
        this.openPasswordDialog();
        break;
    }
  }

  /*Show Password Dialog */
  openPasswordDialog(): void {
    let dialogRef = this.dialog.open(DialogUserPasswordComponent, {
      width: "620px"
    });
    dialogRef
      .beforeClosed()
      .pipe(take(1))
      .subscribe((passwords: IPassword) => {
        if (!!passwords) {
          this.savePassword(passwords);
        }
      });
  }

  /*更新密碼 */
  savePassword(passwords: IPassword) {
    if (!!passwords.old && !!passwords.new) {
      let obj = this.dataService.checkData(
        <IUser>{ password: passwords.new },
        this.userService.getUser().id
      );
      this.dataService.updateOne("admins", obj,this.user.id).subscribe((data: IData) => {
        this.openStatusDialog(data.errorcode);
        if (!data.errorcode) {
          this.userService.setOne(<IUser>data.res);
        }
      });
    }
  }

  openStatusDialog(errorcode: number) {
    let dialogRef = this.dialog.open(DialogAlertComponent, {
      width: "250px",
      data: {
        errorcode: errorcode
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.setDatas();
    });
  }
}
