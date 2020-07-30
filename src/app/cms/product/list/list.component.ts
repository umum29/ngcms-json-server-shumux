import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { DialogAlertComponent } from "../../../shared/dialog/alert/dialog-alert.component";
import { IType, IProduct } from "../../../model/data";
import { ITabBase, ITabMain } from "../../../model/tabs";
import { IPage, IData } from "../../../model/base";
import { PAGESIZE, PRODUCTSTATUS } from "../../../config";
import { DialogProductTypeComponent } from "../dialog-type/dialog-type.component";
import { DialogProductDetailComponent, IDetailProduct } from "./detail/dialog-detail.component";
import { DataService, IFilter } from "../../../service/data.service";
import { UserService } from "../../../service/user.service";
import { Search } from "../../../modules/search/search";
import { TabService } from "../../../modules/tab/tab.service";

@Component({
  selector: "app-product-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.css"]
})
export class ProductListComponent implements OnInit {
  PRODUCTSTATUS = PRODUCTSTATUS;
  isLoadingToggle = true;
  tab: ITabBase;
  result: IProduct[] = [];
  types: IType[] = [];

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
      this.tab.searchObj.expand = "type";
    } else {
      this.tab.searchObj = Object.assign(new Search(), this.tab.searchObj);
    }
    this.setDatas(true);
    this.setTypes();
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
      .getData("products", null, this.setFilters(), this.tab.pageObj)
      .subscribe((data: IData) => {
        this.isLoadingToggle = false;
        if (!!data.errorcode) {
          this.openStatusDialog(data.errorcode);
        } else {
          if (!!data.res) {
            this.result = <IProduct[]>data.res;
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

  setTypes() {
    this.dataService.getData("types").subscribe((data: IData) => {
      if (!!data.errorcode) {
        this.openStatusDialog(data.errorcode);
      } else {
        if (!!data.res) {
          this.types = <IType[]>data.res;
        }
      }
    });
  }

  /*開Dialog */
  openDialog(action: string, select?: IProduct) {
    switch (action) {
      case "insert":
        this.openDetailDialog();
        break;
      case "update":
        this.openDetailDialog(select);
        break;
      case "type":
        this.openTypeDialog();
        break;
    }
  }

  openDetailDialog(select?: IProduct) {
    if (!!this.types && !!this.types.length) {
      let obj = <IDetailProduct>{
        product: null,
        types: this.types
      };
      if (!!select) {
        obj.product = select;
      }
      let dialogRef = this.dialog.open(DialogProductDetailComponent, {
        width: "600px",
        data: obj
      });
      dialogRef.afterClosed().subscribe((o: IProduct) => {
        if (!!o) {
          if (!select) {
            this.insertProduct(o);
          } else {
            this.updateProduct(o, select);
          }
        }
      });
    }
  }

  insertProduct(o: IProduct) {
    o = <IProduct>this.dataService.checkData(o, this.userService.getUser().id);
    this.dataService.insertOne("products", o).subscribe((data: IData) => {
      this.openStatusDialog(data.errorcode);
    });
  }

  updateProduct(o: IProduct, select: IProduct) {
    o = <IProduct>this.dataService.checkData(o, this.userService.getUser().id, false);
    this.dataService.updateOne("products", o, select.id).subscribe((data: IData) => {
      this.openStatusDialog(data.errorcode);
    });
  }

  openTypeDialog() {
    if (!!this.types && !!this.types.length) {
      let obj = {
        typeNames: this.types.map((type: IType) => {
          return type.name;
        })
      };
      let dialogRef = this.dialog.open(DialogProductTypeComponent, {
        width: "600px",
        data: obj
      });

      dialogRef.afterClosed().subscribe((typeNames: string[]) => {
        if (!!typeNames && !!typeNames.length) {
          this.runAction(0, typeNames);
        }
      });
    }
  }

  runAction(index: number, typeNames: string[]) {
    let leng = typeNames.length;
    let oldLeng = this.types.length;
    if (index < oldLeng) {
      this.updateTypeNames(index, typeNames);
    } else {
      if (index < leng) {
        this.insertTypeNames(index, typeNames);
      } else {
        this.setTypes();
        this.openStatusDialog(0);
      }
    }
  }

  updateTypeNames(index: number, typeNames: string[]) {
    this.dataService.updateOne("types", { name: typeNames[index] }, index + 1).subscribe(() => {
      this.runAction(++index, typeNames);
    });
  }

  insertTypeNames(index: number, typeNames: string[]) {
    this.dataService.insertOne("types", <IType>{ name: typeNames[index] }).subscribe(() => {
      this.runAction(++index, typeNames);
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
