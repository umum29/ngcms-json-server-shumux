import { Component, OnInit, AfterViewInit, OnDestroy } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { merge } from "rxjs/internal/observable/merge";
import { Subscription } from "rxjs/internal/Subscription";
import { fromEvent as observableFromEvent } from "rxjs/internal/observable/fromEvent";
import { DataService } from "../../../service/data.service";
import { UserService } from "../../../service/user.service";
import { DialogAlertComponent } from "../../../shared/dialog/alert/dialog-alert.component";
import { DialogAdminInsertComponent, IDetailAdmin } from "./insert/dialog-insert.component";
import { ITabBase, ITabMain } from "../../../model/tabs";
import { IAdmin, IPower, IHold } from "../../../model/data";
import { IPage, IData } from "../../../model/base";
import { PAGESIZE, ACCOUNTSTATUS } from "../../../config";
import { ClickToggle } from "../../click-toggle";
import { ChildToggle } from "../../child-toggle";
import { TabService } from "../../../modules/tab/tab.service";

@Component({
  selector: "app-admin-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.css"]
})
export class AdminListComponent implements OnInit, AfterViewInit, OnDestroy {
  ACCOUNTSTATUS = ACCOUNTSTATUS;
  isLoadingToggle = true;
  tab: ITabBase;
  result: IAdmin[];
  subscriptionClick: Subscription;
  childToggle = new ChildToggle("id", "", 0);
  clickToggle = new ClickToggle(0, "", ["change-status", "change-name"]);
  inputVal = new FormControl("", [Validators.required]);

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private dataService: DataService,
    private userService: UserService,
    private tabService: TabService
  ) {}

  ngOnInit() {
    this.route.data.subscribe(resolversData => {
      this.tab = resolversData.listTab;
      if (!!this.tab) {
        this.init();
      }
    });
  }

  ngOnDestroy() {
    if (!!this.subscriptionClick) {
      this.subscriptionClick.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.subscriptionClick = merge(
      observableFromEvent(document, "click"),
      observableFromEvent(document, "touchstart")
    ).subscribe((e: any) => {
      let isClick = this.clickToggle.atrTag.find(item => {
        if (!!e.srcElement.attributes.getNamedItem(item)) {
          let v = e.srcElement.attributes.getNamedItem(item);
          this.clickToggle.atrId = parseInt(v.nodeValue);
          this.clickToggle.atrTagSel = item;
          return true;
        }
      });
      if (!isClick) {
        if (!this.inputVal || !this.inputVal.valid) {
          this.clickReset();
          return;
        }
        //inputName exist
        if (!!this.inputVal && this.inputVal.valid) {
          this.saveClick(this.inputVal.value);
          this.clickReset();
        }
      }
    });
  }

  clickReset() {
    this.clickToggle.reset();
    this.inputVal.patchValue("");
  }

  saveClick(val: string) {
    switch (this.clickToggle.atrTagSel) {
      case "change-status":
        this.saveStatus(this.clickToggle.atrId, val);
        break;
      case "change-name":
        this.saveName(this.clickToggle.atrId, val);
        break;
    }
  }

  saveStatus(id: number, val: string) {
    this.dataService.updateOne("admins", <IAdmin>{ status: +val }, id).subscribe((data: IData) => {
      if (!!data.errorcode) {
        this.openStatusDialog(data.errorcode);
      } else {
        this.setDatas();
      }
    });
  }

  saveName(id: number, val: string) {
    this.dataService.updateOne("admins", { name: val }, id).subscribe((data: IData) => {
      if (!!data.errorcode) {
        this.openStatusDialog(data.errorcode);
      } else {
        this.setDatas();
      }
    });
  }

  /*初始 */
  init() {
    if (!this.tab.pageObj) {
      this.tab.pageObj = <IPage>{
        pageIndex: 0,
        pageSize: PAGESIZE,
        length: 0
      };
    }
    this.setDatas(true);
  }

  /*換分頁 */
  onSetPage(pageObj: IPage) {
    this.tab.pageObj.pageIndex = pageObj.pageIndex;
    this.tab.pageObj.pageSize = pageObj.pageSize;
    this.setDatas();
  }

  setDatas(isDataInit = false) {
    this.isLoadingToggle = true;
    this.dataService.getData("admins", null, null, this.tab.pageObj).subscribe((data: IData) => {
      this.isLoadingToggle = false;
      if (!!data.errorcode) {
        this.openStatusDialog(data.errorcode);
      } else {
        if (!!data.res) {
          this.result = <IAdmin[]>data.res;
          this.setLoadingDatas(isDataInit);
        }
      }
    });
  }

  setLoadingDatas(isDataInit = false) {
    if (!isDataInit) {
      this.tabService.nextTabMain(<ITabMain>{
        request: "update",
        content: this.tab
      });
    }
  }

  /*開Dialog */
  openInsertDialog() {
    this.childToggle.reset();
    let dialogRef = this.dialog.open(DialogAdminInsertComponent, {
      width: "600px"
    });

    dialogRef.afterClosed().subscribe((o: IDetailAdmin) => {
      if (!!o && !!o.admin) {
        o.admin.token = this.dataService.makeToken(o.admin.account);
        o.admin = <IAdmin>this.dataService.checkData(o.admin, this.userService.getUser().id);
        this.dataService.insertOne("admins", o.admin).subscribe((data: IData) => {
          if (!!data.errorcode) {
            this.openStatusDialog(data.errorcode);
          } else {
            let admin = <IAdmin>data.res;
            this.runHolds(0, o.powers, admin);
          }
        });
      }
    });
  }

  runHolds(index: number, powers: IPower[], admin: IAdmin) {
    let leng = powers.length;
    if (index < leng) {
      this.insertHolds(index, powers, admin);
    } else {
      this.openStatusDialog(0);
      this.setDatas();
    }
  }

  insertHolds(index: number, powers: IPower[], admin: IAdmin) {
    let obj = <IHold>{
      adminId: admin.id,
      powerId: powers[index].id
    };
    this.dataService.insertOne("holds", obj).subscribe(() => {
      this.runHolds(++index, powers, admin);
    });
  }

  /*開子組件 */
  onOpenChild(action: string, select: IAdmin) {
    if (!!this.childToggle && !!select) {
      if (
        select[this.childToggle.selectMarkID] == this.childToggle.selectId &&
        action == this.childToggle.selectTag
      ) {
        this.childToggle.reset();
        return;
      }
      this.childToggle.setData(action, select[this.childToggle.selectMarkID]);
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
