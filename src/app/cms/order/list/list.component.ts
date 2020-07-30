import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { UserService } from "../../../service/user.service";
import { DataService, IFilter } from "../../../service/data.service";
import { IOrder, IOrderCar, ICustomer } from "../../../model/data";
import { ITabBase, ITabMain } from "../../../model/tabs";
import { IPage, IData } from "../../../model/base";
import { PAGESIZE, ORDERSTATUS } from "../../../config";
import { DialogAlertComponent } from "../../../shared/dialog/alert/dialog-alert.component";
import { DialogOrderDetailComponent, IDetailOrder } from "./detail/dialog-detail.component";
import { ChildToggle } from "../../child-toggle";
import { Search } from "../../../modules/search/search";
import * as _moment from "moment";
import { TabService } from "../../../modules/tab/tab.service";
const moment = (_moment as any).default ? (_moment as any).default : _moment;

@Component({
  selector: "app-order-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.css"]
})
export class OrderListComponent implements OnInit {
  ORDERSTATUS = ORDERSTATUS;
  isLoadingToggle = true;
  tab: ITabBase;
  childToggle = new ChildToggle("id", "", 0);
  result: IOrder[] = [];
  cars: IOrderCar[] = [];

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
      this.tab.searchObj.setSearchDate("month");
      this.tab.searchObj.expand = "customer";
    } else {
      this.tab.searchObj = Object.assign(new Search(), this.tab.searchObj);
      this.tab.searchObj.start = new moment(this.tab.searchObj.start);
      this.tab.searchObj.end = new moment(this.tab.searchObj.end);
    }
    this.setDatas(true);
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

  setDatas(isDataInit = false) {
    this.isLoadingToggle = true;
    this.dataService
      .getData("orders", null, this.setFilters(), this.tab.pageObj)
      .subscribe((data: IData) => {
        this.isLoadingToggle = false;
        if (!!data.errorcode) {
          this.openStatusDialog(data.errorcode);
        } else {
          if (!!data.res) {
            this.result = <IOrder[]>data.res;
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

  setFilters(): IFilter[] {
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

  /*開Dialog */
  openDialog(action: string, select?: IOrder) {
    this.childToggle.reset();
    switch (action) {
      case "insert":
        this.openDetailDialog();
        break;
      case "update":
        this.openDetailDialog(select);
        break;
    }
  }

  openDetailDialog(select?: IOrder) {
    let obj = <IDetailOrder>{
      order: null,
      oldCars: [],
      cars: []
    };
    if (!!select) {
      obj.order = select;
    }
    let dialogRef = this.dialog.open(DialogOrderDetailComponent, {
      width: "800px",
      data: obj
    });
    dialogRef.afterClosed().subscribe((o: IDetailOrder) => {
      if (!!o && !!o.order) {
        if (!select) {
          this.insertOrder(o);
        } else {
          this.updateOrder(o, select);
        }
      }
    });
  }

  insertOrder(o: IDetailOrder) {
    o.order = <IOrder>this.dataService.checkData(o.order, this.userService.getUser().id);
    this.dataService.insertOne("orders", o.order).subscribe((data: IData) => {
      if (!!data.errorcode) {
        this.openStatusDialog(data.errorcode);
      } else {
        let order = <IOrder>data.res;
        this.runInsertCars(0, o.cars, order.id);
      }
    });
  }

  updateOrder(o: IDetailOrder, select: IOrder) {
    o.order = <IOrder>this.dataService.checkData(o.order, this.userService.getUser().id, false);
    this.dataService.updateOne("orders", o.order, select.id).subscribe((data: IData) => {
      if (!!data.errorcode) {
        this.openStatusDialog(data.errorcode);
      } else {
        if (!!o.oldCars.length) {
          this.runDelCars(0, o.oldCars, select.id, o.cars);
        } else {
          this.runInsertCars(0, o.cars, select.id);
        }
      }
    });
  }

  runDelCars(index: number, oldCars: IOrderCar[], orderId: number, cars: IOrderCar[]) {
    let leng = oldCars.length;
    if (index < leng) {
      this.delCars(index, oldCars, orderId, cars);
    } else {
      this.runInsertCars(0, cars, orderId);
    }
  }

  delCars(index: number, oldCars: IOrderCar[], orderId: number, cars: IOrderCar[]) {
    this.dataService.deleteOne("cars", oldCars[index].id).subscribe(() => {
      this.runDelCars(++index, oldCars, orderId, cars);
    });
  }

  runInsertCars(index: number, cars: IOrderCar[], orderId: number) {
    let leng = cars.length;
    if (index < leng) {
      this.insertCars(index, cars, orderId);
    } else {
      this.openStatusDialog(0);
    }
  }

  insertCars(index: number, cars: IOrderCar[], orderId: number) {
    let obj = <IOrderCar>{
      orderId: orderId,
      productId: cars[index].productId,
      amount: cars[index].amount
    };
    this.dataService.insertOne("cars", obj).subscribe(() => {
      this.runInsertCars(++index, cars, orderId);
    });
  }

  /*開子組件 */
  onOpenChild(action: string, select: IOrder) {
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
