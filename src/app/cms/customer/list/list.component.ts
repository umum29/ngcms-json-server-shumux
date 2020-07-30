import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { DialogAlertComponent } from "../../../shared/dialog/alert/dialog-alert.component";
import { DialogCustomerDetailComponent, IDetailCustomer } from "./detail/dialog-detail.component";
import { DialogCustomerLevelComponent } from "../dialog-level/dialog-level.component";
import { DataService, IFilter } from "../../../service/data.service";
import { UserService } from "../../../service/user.service";
import { Search } from "../../../modules/search/search";
import { ICustomer, ILevel } from "../../../model/data";
import { ITabBase, ITabMain } from "../../../model/tabs";
import { IPage, IData } from "../../../model/base";
import { PAGESIZE, ACCOUNTSTATUS } from "../../../config";
import { TabService } from "../../../modules/tab/tab.service";

@Component({
  selector: "app-customer-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.css"]
})
export class CustomerListComponent implements OnInit {
  ACCOUNTSTATUS = ACCOUNTSTATUS;
  isLoadingToggle = true;
  tab: ITabBase;
  result: ICustomer[] = [];
  levels: ILevel[] = [];

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

  /*初始 */
  init() {
    if (!this.tab.pageObj) {
      this.tab.pageObj = <IPage>{
        pageIndex: 0,
        pageSize: PAGESIZE,
        length: 0
      };
    }
    if (!this.tab.searchObj) {
      this.tab.searchObj = new Search();
      this.tab.searchObj.expand = "level";
    } else {
      this.tab.searchObj = Object.assign(new Search(), this.tab.searchObj);
    }
    this.setDatas(true);
    this.setLevelDatas();
  }

  /*換分頁 */
  onSetPage(pageObj: IPage) {
    this.tab.pageObj.pageIndex = pageObj.pageIndex;
    this.tab.pageObj.pageSize = pageObj.pageSize;
    this.setDatas();
  }

  /*搜尋 */
  onSearch() {
    this.tab.pageObj.pageIndex = 0;
    this.setDatas();
  }

  /*裝載資料 */
  setDatas(isDataInit = false) {
    this.isLoadingToggle = true;
    this.dataService
      .getData("customers", null, this.setSearchFilters(), this.tab.pageObj)
      .subscribe((data: IData) => {
        this.isLoadingToggle = false;
        if (!!data.errorcode) {
          this.openStatusDialog(data.errorcode);
        } else {
          if (!!data.res) {
            this.result = <ICustomer[]>data.res;
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

  /*搜尋條件 */
  setSearchFilters(): IFilter[] {
    let f: IFilter[] = [];
    let s = this.tab.searchObj.getSearch();
    let keys = Object.keys(s);
    keys.forEach((item: string) => {
      f.push({
        key: item,
        val: s[item]
      });
    });
    return f;
  }

  setLevelDatas() {
    this.dataService.getData("levels").subscribe((data: IData) => {
      if (!!data.errorcode) {
        this.openStatusDialog(data.errorcode);
      } else {
        if (!!data.res) {
          this.levels = <ILevel[]>data.res;
        }
      }
    });
  }

  /*開Dialog */
  openDialog(action: string, select?: ICustomer) {
    switch (action) {
      case "insert":
        this.openDetailDialog();
        break;
      case "update":
        this.openDetailDialog(select);
        break;
      case "level":
        this.openLevelDialog();
        break;
    }
  }

  openDetailDialog(select?: ICustomer) {
    if (!!this.levels && !!this.levels.length) {
      let obj = <IDetailCustomer>{
        customer: null,
        levels: this.levels
      };
      if (!!select) {
        obj.customer = select;
      }
      let dialogRef = this.dialog.open(DialogCustomerDetailComponent, {
        width: "600px",
        data: obj
      });
      dialogRef.afterClosed().subscribe((o: ICustomer) => {
        if (!!o) {
          if (!select) {
            this.insertCustomer(o);
          } else {
            this.updateCustomer(o, select);
          }
        }
      });
    }
  }

  insertCustomer(o: ICustomer) {
    o = <ICustomer>this.dataService.checkData(o, this.userService.getUser().id);
    this.dataService.insertOne("customers", o).subscribe((data: IData) => {
      this.openStatusDialog(data.errorcode);
    });
  }

  updateCustomer(o: ICustomer, select: ICustomer) {
    o = <ICustomer>this.dataService.checkData(o, this.userService.getUser().id, false);
    this.dataService.updateOne("customers", o, select.id).subscribe((data: IData) => {
      this.openStatusDialog(data.errorcode);
    });
  }

  openLevelDialog() {
    if (!!this.levels && !!this.levels.length) {
      let obj = {
        levelNames: this.levels.map((level: ILevel) => {
          return level.name;
        })
      };
      let dialogRef = this.dialog.open(DialogCustomerLevelComponent, {
        width: "600px",
        data: obj
      });

      dialogRef.afterClosed().subscribe((levelNames: string[]) => {
        if (!!levelNames && !!levelNames.length) {
          this.runAction(0, levelNames);
        }
      });
    }
  }

  runAction(index: number, levelNames: string[]) {
    let leng = levelNames.length;
    let oldLeng = this.levels.length;
    if (index < oldLeng) {
      this.updateLevelNames(index, levelNames);
    } else {
      if (index < leng) {
        this.insertLevelNames(index, levelNames);
      } else {
        this.setLevelDatas();
        this.openStatusDialog(0);
      }
    }
  }

  updateLevelNames(index: number, levelNames: string[]) {
    this.dataService.updateOne("levels", { name: levelNames[index] }, index + 1).subscribe(() => {
      this.runAction(++index, levelNames);
    });
  }

  insertLevelNames(index: number, levelNames: string[]) {
    this.dataService.insertOne("levels", <ILevel>{ name: levelNames[index] }).subscribe(() => {
      this.runAction(++index, levelNames);
    });
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
