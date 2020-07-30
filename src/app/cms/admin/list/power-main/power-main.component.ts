import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { DataService } from "../../../../service/data.service";
import { IData } from "../../../../model/base";
import { IPower, IAdmin, IHold } from "../../../../model/data";
import { AdminPowerComponent } from "../power/power.component";
import { MatDialog } from "@angular/material";
import { DialogAlertComponent } from "../../../../shared/dialog/alert/dialog-alert.component";

@Component({
  selector: "app-admin-power-main",
  templateUrl: "./power-main.component.html",
  styleUrls: ["./power-main.component.css"]
})
export class AdminPowerMainComponent implements OnInit {
  @ViewChild(AdminPowerComponent, { static: false }) powerComp: AdminPowerComponent;
  @Input() adminId: number = 0;
  toggleUpdate: string = "close-update";
  admin: IAdmin = null;

  constructor(public dialog: MatDialog, private dataService: DataService) {}

  ngOnInit() {
    if (!!this.adminId) {
      this.init();
    }
  }

  init() {
    this.dataService
      .getData("admins", this.adminId, [{ key: "_embed", val: "holds" }])
      .subscribe((data: IData) => {
        if (!data.errorcode && !!data.res) {
          this.admin = <IAdmin>data.res;
        }
      });
  }

  onSave() {
    this.resetHold();
  }

  resetHold() {
    if (!!this.admin.holds && !!this.admin.holds.length) {
      this.runDelHold(0,this.admin.holds,[])
    } else {
      this.runInsertHolds(0, this.powerComp.getPowers(), []);
    }
  }

  runDelHold(index: number, holds: IHold[], errHolds: IHold[]) {
    let errHoldArr = errHolds;
    let leng = holds.length;
    if (index < leng) {
      this.delHold(index, holds, errHolds);
    } else {
      if (!!errHoldArr.length) {
        this.openStatusDialog(5);
      } else {
        this.runInsertHolds(0, this.powerComp.getPowers(), []);
      }
    }
  }

  delHold(index: number, holds: IHold[], errHolds: IHold[]) {
    this.dataService.deleteOne("holds", holds[index].id).subscribe((data: IData) => {
      if (!!data.errorcode) {
        errHolds.push(holds[index]);
      } else {
        this.runDelHold(++index, holds, errHolds);
      }
    });
  }


  runInsertHolds(index: number, powers: IPower[], errHolds: IPower[]) {
    let errHoldArr = errHolds;
    let leng = powers.length;
    if (index < leng) {
      this.insertHolds(index, powers, errHolds);
    } else {
      if (!!errHoldArr.length) {
        this.openStatusDialog(5);
      } else {
        this.toggleUpdate = "close-update";
        this.init();
      }
    }
  }

  insertHolds(index: number, powers: IPower[], errHolds: IPower[]) {
    if (powers[index].check) {
      let obj: IHold = {
        adminId: this.adminId,
        powerId: powers[index].id
      };
      this.dataService.insertOne("holds", obj).subscribe((data: IData) => {
        if (!!data.errorcode) {
          errHolds.push(powers[index]);
        } else {
          this.runInsertHolds(++index, powers, errHolds);
        }
      });
    }else{
      this.runInsertHolds(++index, powers, errHolds);
    }
  }

  openStatusDialog(errorcode: number) {
    this.dialog.open(DialogAlertComponent, {
      width: "250px",
      data: {
        errorcode: errorcode
      }
    });
  }
}
